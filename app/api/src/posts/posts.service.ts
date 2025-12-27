import { Injectable } from '@nestjs/common';
import { Post } from './interface/post.interface';

@Injectable()
export class PostsService {
    private readonly posts: Post[] = [];

    find(id: number): Post | undefined {
        return this.posts.find(post => post.id === id);
    }
    findAll(): Post[] {
        return this.posts;
    }
}
