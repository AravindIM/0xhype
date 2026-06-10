import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Post } from '../posts/post.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { StorageModule } from '../storage/storage.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, Post]), StorageModule],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
