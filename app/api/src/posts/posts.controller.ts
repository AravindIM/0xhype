import { Controller, Get, NotFoundException, Param, ParseIntPipe } from '@nestjs/common';
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
    const posts: Post | undefined = this.postsService.find(id);
    if (!posts) {
      throw new NotFoundException('Post not found!');
    }
    return posts;
  }
}
