import { Controller, Get, Post, InternalServerErrorException, NotFoundException, Param, ParseIntPipe, Body } from '@nestjs/common';
import { PostsService } from './posts.service';
import { Post as PostInterface } from './interface/post.interface';
import { CreatePostDto } from './dto/create-post.dto';

@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}
  @Get()
  async fetchPosts(): Promise<PostInterface[]> {
    return this.postsService.findAll();
  }

  @Get(':id')
  async fetchPost(@Param('id', ParseIntPipe) id: number): Promise<PostInterface> {
    const posts: PostInterface | undefined = this.postsService.find(id);
    if (!posts) {
      throw new NotFoundException('Post not found!');
    }
    return posts;
  }

  @Post()
  async create(@Body() createPostDto: CreatePostDto): Promise<string> {
    if (!this.postsService.create(createPostDto)) {
      throw new InternalServerErrorException();
    }
    return 'Post Created!';
  }
}
