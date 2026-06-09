import { Module } from '@nestjs/common';
import { UserPostsController } from './user-posts.controller';
import { PostsModule } from './posts.module';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PostsModule, UsersModule, AuthModule],
  controllers: [UserPostsController],
})
export class UserPostsModule {}
