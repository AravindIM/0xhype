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
  async fetchPosts(): Promise<PostEntity[]> {
    const posts: PostEntity[] = await this.postsService.findAll();
    return posts;
  }

  @Get(':postid')
  async fetchPost(
    @Param('postid', ParseIntPipe) id: number,
  ): Promise<PostEntity> {
    const post: PostEntity | null = await this.postsService.find(id);
    if (!post) {
      throw new NotFoundException('Post not found!');
    }
    return post;
  }

  @Get(':postid/preview')
  async fetchPreview(
    @Param('postid', ParseIntPipe) id: number,
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
