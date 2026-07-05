import { Injectable, Inject } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './post.entity';
import { User } from '../users/user.entity';
import { LessThan, Repository } from 'typeorm';
import scrapePreview from 'open-graph-scraper';
import { LinkPreviewDto } from './dto/link-preview.dto';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';

// Only the first (cursorless) page at the default limit is cached — that page
// takes nearly all the traffic, and a single key keeps invalidation trivial.
const DEFAULT_LIMIT = 20;
const POSTS_FIRST_PAGE_KEY = 'posts_first_page';
const postKey = (id: number) => `post_${id}`;
const previewKey = (link: string) => `preview_${encodeURIComponent(link)}`;

const TTL_POSTS_LIST = 60_000; // 60 s — safety net; event-driven del handles the normal case
const TTL_ONE_HOUR = 3_600_000; // 1 hr

export interface PaginationParams {
  limit: number;
  cursor?: number;
}

export interface PaginatedPosts {
  items: Post[];
  nextCursor: number | null;
}

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) {}

  async findWithUser(postid: number): Promise<Post | null> {
    return this.postRepository.findOne({
      where: { postid },
      relations: ['user'],
    });
  }

  async find(postid: number): Promise<Post | null> {
    const key = postKey(postid);
    try {
      const cached = await this.cacheManager.get<Post>(key);
      if (cached) return cached;
    } catch {
      /* Redis unavailable — fall through to DB */
    }

    const post = await this.postRepository.findOneBy({ postid });
    if (post) {
      try {
        await this.cacheManager.set(key, post, TTL_ONE_HOUR);
      } catch {}
    }
    return post;
  }

  /**
   * Keyset pagination on `postid` DESC (newest first). `postid` is a stable,
   * unique, monotonic PK, so this is immune to inserts and never dupes/skips —
   * unlike ordering on `date`, whose column default makes it non-unique.
   * Fetches `limit + 1` rows to detect a next page without a trailing empty request.
   */
  private async keysetPage(
    where: Record<string, unknown>,
    { limit, cursor }: PaginationParams,
  ): Promise<PaginatedPosts> {
    const rows = await this.postRepository.find({
      where: {
        ...where,
        ...(cursor ? { postid: LessThan(cursor) } : {}),
      },
      relations: ['user'],
      order: { postid: 'DESC' },
      take: limit + 1,
    });
    const hasMore = rows.length > limit;
    const items = hasMore ? rows.slice(0, limit) : rows;
    const nextCursor = hasMore ? items[items.length - 1].postid : null;
    return { items, nextCursor };
  }

  async findAll(params: PaginationParams): Promise<PaginatedPosts> {
    const isFirstDefaultPage =
      !params.cursor && params.limit === DEFAULT_LIMIT;

    if (isFirstDefaultPage) {
      try {
        const cached =
          await this.cacheManager.get<PaginatedPosts>(POSTS_FIRST_PAGE_KEY);
        if (cached) return cached;
      } catch {}
    }

    const page = await this.keysetPage({}, params);

    if (isFirstDefaultPage) {
      try {
        await this.cacheManager.set(
          POSTS_FIRST_PAGE_KEY,
          page,
          TTL_POSTS_LIST,
        );
      } catch {}
    }
    return page;
  }

  async findByUserId(
    userId: number,
    params: PaginationParams,
  ): Promise<PaginatedPosts> {
    return this.keysetPage({ user: { id: userId } }, params);
  }

  async create(createPostDto: CreatePostDto, userId: number): Promise<Post> {
    const post = this.postRepository.create({
      ...createPostDto,
      user: { id: userId } as User,
    });
    const saved = await this.postRepository.save(post);
    try {
      await this.cacheManager.del(POSTS_FIRST_PAGE_KEY);
    } catch {}
    return saved;
  }

  async genLinkPreview(link: string): Promise<LinkPreviewDto | undefined> {
    const key = previewKey(link);
    try {
      const cached = await this.cacheManager.get<LinkPreviewDto>(key);
      if (cached) return cached;
    } catch {}

    const response = await scrapePreview({ url: link, timeout: 5000 });
    if (!response || response.error || !response.result.success) {
      return undefined;
    }
    const { result } = response;
    const url = new URL(link);
    const domain = url.host;
    const preview: LinkPreviewDto = {
      title: result.ogTitle,
      description: result.ogDescription,
      image: result.ogImage?.[0]?.url,
      url: result.ogUrl,
      siteName: result.ogSiteName,
      siteUrl: domain,
      favicon: result.favicon?.startsWith('/')
        ? `https://${domain}${result.favicon}`
        : result.favicon,
    };
    try {
      await this.cacheManager.set(key, preview, TTL_ONE_HOUR);
    } catch {}
    return preview;
  }
}
