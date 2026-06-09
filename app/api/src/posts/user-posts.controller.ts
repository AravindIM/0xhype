import {
  Controller,
  Get,
  Post,
  NotFoundException,
  ForbiddenException,
  InternalServerErrorException,
  Param,
  ParseIntPipe,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { UsersService } from '../users/users.service';
import { CreatePostDto } from './dto/create-post.dto';
import { LinkPreviewDto } from './dto/link-preview.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller(':username/posts')
export class UserPostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly usersService: UsersService,
  ) {}

  @Get()
  async getUserPosts(@Param('username') username: string) {
    const result = await this.usersService.findByUsername(username);
    if (!result) throw new NotFoundException('User not found');
    const posts = await this.usersService.getUserPosts(result.user.id);
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
  async getPost(
    @Param('username') username: string,
    @Param('postid', ParseIntPipe) postid: number,
  ) {
    const post = await this.postsService.findWithUser(postid);
    if (!post || post.user.username !== username) throw new NotFoundException('Post not found');
    return {
      postid: post.postid,
      title: post.title,
      link: post.link,
      date: post.date,
      username: post.user.username,
      fullName: `${post.user.firstName} ${post.user.lastName}`,
    };
  }

  @Get(':postid/preview')
  async getPreview(
    @Param('username') username: string,
    @Param('postid', ParseIntPipe) postid: number,
  ): Promise<LinkPreviewDto | null> {
    const post = await this.postsService.findWithUser(postid);
    if (!post || post.user.username !== username) throw new NotFoundException('Post not found');
    try {
      const preview = await this.postsService.genLinkPreview(post.link);
      return preview ?? null;
    } catch {
      return null;
    }
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Param('username') username: string,
    @Body() createPostDto: CreatePostDto,
    @Request() req: any,
  ): Promise<string> {
    if (req.user.username !== username) throw new ForbiddenException();
    const post = await this.postsService.create(createPostDto, req.user.userId);
    if (!post) throw new InternalServerErrorException();
    return 'Post Created!';
  }
}
