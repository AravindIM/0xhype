import {
  Controller,
  Delete,
  Get,
  Post,
  NotFoundException,
  ForbiddenException,
  UnauthorizedException,
  InternalServerErrorException,
  Param,
  ParseIntPipe,
  Body,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { UsersService } from '../users/users.service';
import { CreatePostDto } from './dto/create-post.dto';
import { LinkPreviewDto } from './dto/link-preview.dto';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller(':username/posts')
export class UserPostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly usersService: UsersService,
  ) {}

  @Get()
  async getUserPosts(
    @Param('username') username: string,
    @Query() query: PaginationQueryDto,
  ) {
    const result = await this.usersService.findByUsername(username);
    if (!result) throw new NotFoundException('User not found');
    const { items, nextCursor } = await this.postsService.findByUserId(
      result.user.id,
      query,
    );
    return {
      items: items.map((p) => ({
        postid: p.postid,
        title: p.title,
        link: p.link,
        date: p.date,
        author: {
          username: p.user.username,
          displayName: p.user.displayName,
          avatarUrl: p.user.avatarUrl,
        },
      })),
      nextCursor,
    };
  }

  @Get('preview')
  @UseGuards(JwtAuthGuard)
  async getUrlPreview(
    @Param('username') username: string,
    @Query('url') url: string,
    @Request() req: any,
  ): Promise<LinkPreviewDto | null> {
    if (req.user.username !== username) throw new ForbiddenException();
    if (!url) return null;
    try {
      return (await this.postsService.genLinkPreview(url)) ?? null;
    } catch {
      return null;
    }
  }

  @Get(':postid')
  async getPost(
    @Param('username') username: string,
    @Param('postid', ParseIntPipe) postid: number,
  ) {
    const post = await this.postsService.find(postid);
    if (!post || post.user.username !== username)
      throw new NotFoundException('Post not found');
    return {
      postid: post.postid,
      title: post.title,
      link: post.link,
      date: post.date,
      author: {
        username: post.user.username,
        displayName: post.user.displayName,
        avatarUrl: post.user.avatarUrl,
      },
    };
  }

  @Get(':postid/preview')
  async getPreview(
    @Param('username') username: string,
    @Param('postid', ParseIntPipe) postid: number,
  ): Promise<LinkPreviewDto | null> {
    const post = await this.postsService.find(postid);
    if (!post || post.user.username !== username)
      throw new NotFoundException('Post not found');
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

  @Delete(':postid')
  @UseGuards(JwtAuthGuard)
  async remove(
    @Param('postid', ParseIntPipe) postid: number,
    @Request() req: any,
  ): Promise<string> {
    const post = await this.postsService.find(postid);
    if (!post) throw new NotFoundException('Post not found');
    if (post.user.username !== req.user.username)
      throw new UnauthorizedException();
    await this.postsService.remove(postid);
    return 'Post Deleted!';
  }
}
