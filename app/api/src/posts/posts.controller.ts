import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';

@Controller('posts')
export class PostsController {
  @Get()
  fetchPosts(): string {
    return 'List of posts';
  }

  @Get(':id')
  fetchPost(@Param('id', ParseIntPipe) id: number): string{
    return `Viewing post with id ${id}`;
  }
}
