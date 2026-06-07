import {
  Controller,
  Get,
  Post,
  InternalServerErrorException,
  NotFoundException,
  Param,
  ParseIntPipe,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { Post as PostEntity } from './post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { LinkPreviewDto } from './dto/link-preview.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @Get()
  async fetchPosts() {
    const posts = await this.postsService.findAll();
    return posts.map((p) => ({
      postid: p.postid,
      title: p.title,
      link: p.link,
      date: p.date,
      username: p.user.username,
      fullName: `${p.user.firstName} ${p.user.lastName}`,
    }));
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
  ): Promise<LinkPreviewDto | null> {
    const post: PostEntity | null = await this.postsService.find(id);
    if (!post) {
      throw new NotFoundException('Post not found!');
    }
    try {
      const preview = await this.postsService.genLinkPreview(post.link);
      return preview || null;
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() createPostDto: CreatePostDto,
    @Request() req: any,
  ): Promise<string> {
    const post: PostEntity | null = await this.postsService.create(
      createPostDto,
      req.user.userId,
    );
    if (!post) {
      throw new InternalServerErrorException();
    }
    return 'Post Created!';
  }
}
