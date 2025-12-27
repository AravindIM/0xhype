import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { PostsService } from './posts.service';
import { Post } from './interface/post.interface';

@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}
  @Get()
  async fetchPosts(): Promise<Post[]> {
    return this.postsService.findAll();
  }

  @Get(':id')
  async fetchPost(@Param('id', ParseIntPipe) id: number): Promise<Post> {
    return this.postsService.find(id);
  }
}
