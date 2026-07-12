import { Injectable, Inject, Logger } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './post.entity';
import { User } from '../users/user.entity';
import { LessThan, Repository } from 'typeorm';
import scrapePreview from 'open-graph-scraper';
import { LinkPreviewDto } from './dto/link-preview.dto';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';

const DEFAULT_LIMIT = 20;
const POSTS_FIRST_PAGE_KEY = 'posts_first_page';
const postKey = (id: number) => `post_${id}`;
const previewKey = (link: string) => `preview_${encodeURIComponent(link)}`;

const s2Favicon = (domain: string) =>
  `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=256`;

const TTL_POSTS_LIST = 60_000;
const TTL_ONE_HOUR = 3_600_000;

const CRAWLER_HEADERS = {
  'user-agent':
    'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)',
  'accept-language': 'en-US,en;q=0.9',
};

const BROWSER_HEADERS = {
  'user-agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36',
  'accept-language': 'en-US,en;q=0.9',
};

const BOT_DETECTED_TITLES = [
  'please wait for verification',
  'just a moment',
  'access denied',
  'attention required',
  'are you a human',
  'verify you are human',
  'security check',
];

const isFlaggedBot = (title?: string): boolean =>
  !!title && BOT_DETECTED_TITLES.some((t) => title.toLowerCase().includes(t));

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
  private readonly logger = new Logger(PostsService.name);

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
    } catch (err) {
      this.logger.warn(`Cache get failed for post ${postid}: ${err}`);
    }

    const post = await this.postRepository.findOneBy({ postid });
    if (post) {
      try {
        await this.cacheManager.set(key, post, TTL_ONE_HOUR);
      } catch (err) {
        this.logger.warn(`Cache set failed for post ${postid}: ${err}`);
      }
    }
    return post;
  }

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
    const isFirstDefaultPage = !params.cursor && params.limit === DEFAULT_LIMIT;

    if (isFirstDefaultPage) {
      try {
        const cached =
          await this.cacheManager.get<PaginatedPosts>(POSTS_FIRST_PAGE_KEY);
        if (cached) return cached;
      } catch (err) {
        this.logger.warn(`Cache get failed for posts first page: ${err}`);
      }
    }

    const page = await this.keysetPage({}, params);

    if (isFirstDefaultPage) {
      try {
        await this.cacheManager.set(POSTS_FIRST_PAGE_KEY, page, TTL_POSTS_LIST);
      } catch (err) {
        this.logger.warn(`Cache set failed for posts first page: ${err}`);
      }
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
    } catch (err) {
      this.logger.warn(
        `Cache invalidation failed for posts first page: ${err}`,
      );
    }
    return saved;
  }

  async genLinkPreview(link: string): Promise<LinkPreviewDto> {
    const key = previewKey(link);
    try {
      const cached = await this.cacheManager.get<LinkPreviewDto>(key);
      if (cached) return cached;
    } catch (err) {
      this.logger.warn(`Cache get failed for preview ${link}: ${err}`);
    }

    const url = new URL(link);
    const domain = url.host;
    const favicon = s2Favicon(domain);
    let preview: LinkPreviewDto = {
      url: link,
      siteName: domain,
      siteUrl: domain,
      favicon,
    };

    const result =
      (await this.tryScrape(link, CRAWLER_HEADERS)) ??
      (await this.tryScrape(link, BROWSER_HEADERS));
    if (result) {
      preview = {
        title: result.ogTitle,
        description: result.ogDescription,
        image: result.ogImage?.[0]?.url,
        url: result.ogUrl,
        siteName: result.ogSiteName,
        siteUrl: domain,
        favicon,
      };
    }

    try {
      await this.cacheManager.set(key, preview, TTL_ONE_HOUR);
    } catch (err) {
      this.logger.warn(`Cache set failed for preview ${link}: ${err}`);
    }
    return preview;
  }

  private async tryScrape(link: string, headers: Record<string, string>) {
    try {
      const response = await scrapePreview({
        url: link,
        timeout: 10,
        fetchOptions: { headers },
      });
      if (
        response &&
        !response.error &&
        response.result.success &&
        !isFlaggedBot(response.result.ogTitle)
      ) {
        return response.result;
      }
    } catch (err) {
      this.logger.warn(`Scrape failed for ${link}: ${err}`);
    }
    return null;
  }
}
