import { Injectable } from '@nestjs/common';
import { Post } from './interface/post.interface';
import { CreatePostDto } from './dto/create-post.dto';

@Injectable()
export class PostsService {
    private readonly posts: Post[] = [];

    find(id: number): Post | undefined {
        return this.posts.find(post => post.id === id);
    }

    findAll(): Post[] {
        return this.posts;
    }

    create(createPostDto: CreatePostDto) {
        const lastId = this.posts.length;
        const newPost: Post = {...createPostDto, id: lastId + 1, date: new Date()}
        this.posts.push(newPost);
        return true;
    }
}
