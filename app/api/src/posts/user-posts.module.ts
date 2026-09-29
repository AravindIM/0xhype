import { Module } from '@nestjs/common';
import { UserPostsController } from './user-posts.controller';
import { PostsModule } from './posts.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PostsModule, AuthModule],
  controllers: [UserPostsController],
})
export class UserPostsModule {}
