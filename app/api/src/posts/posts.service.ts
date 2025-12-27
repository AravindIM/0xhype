import { Injectable } from '@nestjs/common';

@Injectable()
export class PostsService {
    find(id: number): string {
        return `Viewing post with id ${id}`;
    }
    findAll(): string {
        return 'Viewing all posts';
    }
}
