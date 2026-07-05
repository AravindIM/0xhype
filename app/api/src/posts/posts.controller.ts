import { Controller, Get, Query } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PaginationQueryDto } from './dto/pagination-query.dto';

@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @Get()
  async fetchPosts(@Query() query: PaginationQueryDto) {
    const { items, nextCursor } = await this.postsService.findAll(query);
    return {
      items: items.map((p) => ({
        postid: p.postid,
        title: p.title,
        link: p.link,
        date: p.date,
        username: p.user.username,
        displayName: p.user.displayName,
      })),
      nextCursor,
    };
  }
}
