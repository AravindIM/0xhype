import { Controller, Get } from '@nestjs/common';
import { PostsService } from './posts.service';

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
}
