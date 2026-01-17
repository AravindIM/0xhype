import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './post.entity';
import { Repository } from 'typeorm';
import scrapePreview from 'open-graph-scraper';
import { LinkPreviewDto } from './dto/link-preview.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
  ) {}

  async find(id: number): Promise<Post | null> {
    return this.postRepository.findOneBy({ id });
  }

  async findAll(): Promise<Post[]> {
    return this.postRepository.find();
  }

  async create(createPostDto: CreatePostDto): Promise<Post> {
    const post = this.postRepository.create(createPostDto);
    return this.postRepository.save(post);
  }

  async genLinkPreview(link: string): Promise<LinkPreviewDto | undefined> {
    const response = await scrapePreview({ url: link, timeout: 5000 });
    if (!response || response.error || !response.result.success) {
      return undefined;
    }
    const { result } = response;
    return {
      title: result.ogTitle,
      description: result.ogDescription,
      image: result.ogImage?.[0]?.url,
      url: result.ogUrl,
      siteName: result.ogSiteName,
    };
  }
}
