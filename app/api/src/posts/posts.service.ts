import { Injectable, Inject } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './post.entity';
import { User } from '../users/user.entity';
import { Repository } from 'typeorm';
import scrapePreview from 'open-graph-scraper';
import { LinkPreviewDto } from './dto/link-preview.dto';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';

const POSTS_ALL_KEY = 'posts_all';
const postKey = (id: number) => `post_${id}`;
const previewKey = (link: string) => `preview_${encodeURIComponent(link)}`;

const TTL_POSTS_LIST = 60_000;    // 60 s — safety net; event-driven del handles the normal case
const TTL_ONE_HOUR   = 3_600_000; // 1 hr

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
    } catch { /* Redis unavailable — fall through to DB */ }

    const post = await this.postRepository.findOneBy({ postid });
    if (post) {
      try { await this.cacheManager.set(key, post, TTL_ONE_HOUR); } catch {}
    }
    return post;
  }

  async findAll(): Promise<Post[]> {
    try {
      const cached = await this.cacheManager.get<Post[]>(POSTS_ALL_KEY);
      if (cached) return cached;
    } catch {}

    const posts = await this.postRepository.find({
      relations: ['user'],
      order: { date: 'DESC' },
    });
    try { await this.cacheManager.set(POSTS_ALL_KEY, posts, TTL_POSTS_LIST); } catch {}
    return posts;
  }

  async findByUserId(userId: number): Promise<Post[]> {
    return this.postRepository.find({
      where: { user: { id: userId } },
      relations: ['user'],
      order: { date: 'DESC' },
    });
  }

  async create(createPostDto: CreatePostDto, userId: number): Promise<Post> {
    const post = this.postRepository.create({
      ...createPostDto,
      user: { id: userId } as User,
    });
    const saved = await this.postRepository.save(post);
    try { await this.cacheManager.del(POSTS_ALL_KEY); } catch {}
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
    try { await this.cacheManager.set(key, preview, TTL_ONE_HOUR); } catch {}
    return preview;
  }
}
