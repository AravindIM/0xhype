import {
  Controller,
  Get,
  Patch,
  Post,
  Delete,
  Param,
  Body,
  Request,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UsersService } from './users.service';
import { MinioService } from '../storage/minio.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { PublicProfileDto } from './dto/public-profile.dto';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly minioService: MinioService,
  ) {}

  @Patch('me')
  @UseGuards(JwtAuthGuard)
  async updateProfile(
    @Request() req: any,
    @Body() dto: UpdateProfileDto,
  ) {
    const user = await this.usersService.updateProfile(req.user.userId, dto);
    return {
      username: user.username,
      fullName: `${user.firstName} ${user.lastName}`,
      bio: user.bio,
      location: user.location,
      website: user.website,
      avatarUrl: user.avatarUrl,
      bannerUrl: user.bannerUrl,
    };
  }

  @Post('me/avatar')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('avatar', {
      limits: { fileSize: 5 * 1024 * 1024 },
      fileFilter: (_req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
          cb(new BadRequestException('Images only'), false);
        } else {
          cb(null, true);
        }
      },
    }),
  )
  async uploadAvatar(
    @Request() req: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) throw new BadRequestException('No file provided');
    const avatarUrl = await this.minioService.uploadFile(
      file.buffer,
      file.originalname,
      file.mimetype,
    );
    await this.usersService.setAvatarUrl(req.user.userId, avatarUrl);
    return { avatarUrl };
  }

  @Post('me/banner')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('banner', {
      limits: { fileSize: 10 * 1024 * 1024 },
      fileFilter: (_req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
          cb(new BadRequestException('Images only'), false);
        } else {
          cb(null, true);
        }
      },
    }),
  )
  async uploadBanner(
    @Request() req: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) throw new BadRequestException('No file provided');
    const bannerUrl = await this.minioService.uploadFile(
      file.buffer,
      file.originalname,
      file.mimetype,
    );
    await this.usersService.setBannerUrl(req.user.userId, bannerUrl);
    return { bannerUrl };
  }

  @Delete('me/banner')
  @UseGuards(JwtAuthGuard)
  async deleteBanner(@Request() req: any) {
    await this.usersService.clearBannerUrl(req.user.userId);
    return { bannerUrl: null };
  }

  @Get(':username')
  async getProfile(@Param('username') username: string): Promise<PublicProfileDto> {
    const result = await this.usersService.findByUsername(username);
    if (!result) throw new NotFoundException('User not found');
    const { user, postCount } = result;
    return {
      username: user.username,
      fullName: `${user.firstName} ${user.lastName}`,
      bio: user.bio,
      location: user.location,
      website: user.website,
      avatarUrl: user.avatarUrl,
      bannerUrl: user.bannerUrl,
      createdAt: user.createdAt,
      postCount,
    };
  }

  @Get(':username/posts')
  async getUserPosts(@Param('username') username: string) {
    const result = await this.usersService.findByUsername(username);
    if (!result) throw new NotFoundException('User not found');
    const posts = await this.usersService.getUserPosts(result.user.id);
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
