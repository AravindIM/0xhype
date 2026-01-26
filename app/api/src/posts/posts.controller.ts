import {
  Controller,
  Get,
  Post,
  InternalServerErrorException,
  NotFoundException,
  Param,
  ParseIntPipe,
  Body,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { Post as PostEntity } from './post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { PostDto } from './dto/post.dto';
import { LinkPreviewDto } from './dto/link-preview.dto';

@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}
  @Get()
  async fetchPosts(): Promise<PostDto[]> {
    const posts: PostEntity[] = await this.postsService.findAll();
    return posts;
  }

  @Get(':id')
  async fetchPost(@Param('id', ParseIntPipe) id: number): Promise<PostDto> {
    const post: PostEntity | null = await this.postsService.find(id);
    if (!post) {
      throw new NotFoundException('Post not found!');
    }
    return post;
  }

  @Get(':id/preview')
  async fetchPreview(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<LinkPreviewDto | undefined> {
    const post: PostEntity | null = await this.postsService.find(id);
    if (!post) {
      throw new NotFoundException('Post not found!');
    }
    return this.postsService.genLinkPreview(post.link);
  }

  @Post()
  async create(@Body() createPostDto: CreatePostDto): Promise<string> {
    const post: PostEntity | null =
      await this.postsService.create(createPostDto);
    if (!post) {
      throw new InternalServerErrorException();
    }
    return 'Post Created!';
  }
}
