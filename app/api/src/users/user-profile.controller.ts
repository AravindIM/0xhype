import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { PublicProfileDto } from './dto/public-profile.dto';

@Controller(':username')
export class UserProfileController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getProfile(
    @Param('username') username: string,
  ): Promise<PublicProfileDto> {
    const result = await this.usersService.findByUsername(username);
    if (!result) throw new NotFoundException('User not found');
    const { user, postCount } = result;
    return {
      username: user.username,
      displayName: user.displayName,
      bio: user.bio,
      location: user.location,
      website: user.website,
      avatarUrl: user.avatarUrl,
      bannerUrl: user.bannerUrl,
      createdAt: user.createdAt,
      postCount,
    };
  }
}
