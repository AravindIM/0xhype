import { Injectable } from '@nestjs/common';
import { Post } from './interface/post.interface';

@Injectable()
export class PostsService {
    find(id: number): Post {
        const post: Post = {
            id,
            title: `Sample Post ${id}`,
            link: `https://example.com/posts/${id}`,
            date: new Date(),
        };
        return post;
    }
    findAll(): Post[] {
        const posts: Post[] = [
            {
                id: 1,
                title: "Sample Post 1",
                link: "https://example.com/posts/1",
                date: new Date(),
            },
            {
                id: 2,
                title: "Sample Post 2",
                link: "https://example.com/posts/2",
                date: new Date(),
            }
        ];
        return posts;
    }
}
