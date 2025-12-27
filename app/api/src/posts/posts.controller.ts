import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}
  @Get()
  fetchPosts(): string {
    return this.postsService.findAll();
  }

  @Get(':id')
  fetchPost(@Param('id', ParseIntPipe) id: number): string{
    return this.postsService.find(id);
  }
}
