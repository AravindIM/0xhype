import { Module } from '@nestjs/common';
import { UserProfileController } from './user-profile.controller';
import { UsersModule } from './users.module';

@Module({
  imports: [UsersModule],
  controllers: [UserProfileController],
})
export class UserProfileModule {}
