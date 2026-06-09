import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from './user.entity';
import { Post } from '../posts/post.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { PublicProfileDto } from './dto/public-profile.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  async findByUsernameOrEmail(input: string): Promise<User | null> {
    return this.userRepository
      .createQueryBuilder('user')
      .where('user.username = :input OR user.email = :input', { input })
      .getOne();
  }

  async findById(id: number): Promise<User | null> {
    return this.userRepository.findOneBy({ id });
  }

  async findByUsername(username: string): Promise<{ user: User; postCount: number } | null> {
    const result = await this.userRepository
      .createQueryBuilder('user')
      .leftJoin('user.posts', 'post')
      .addSelect('COUNT(post.postid)', 'postCount')
      .where('user.username = :username', { username })
      .groupBy('user.id')
      .getRawAndEntities();

    if (!result.entities.length) return null;
    const postCount = parseInt(result.raw[0]?.postCount ?? '0', 10);
    return { user: result.entities[0], postCount };
  }

  async updateProfile(userId: number, dto: UpdateProfileDto): Promise<User> {
    const user = await this.findById(userId);
    if (!user) throw new Error('User not found');
    if (dto.firstName !== undefined) user.firstName = dto.firstName;
    if (dto.lastName !== undefined) user.lastName = dto.lastName;
    if (dto.bio !== undefined) user.bio = dto.bio;
    if (dto.location !== undefined) user.location = dto.location;
    if (dto.website !== undefined) user.website = dto.website;
    return this.userRepository.save(user);
  }

  async setAvatarUrl(userId: number, avatarUrl: string): Promise<void> {
    await this.userRepository.update(userId, { avatarUrl });
  }

  async setBannerUrl(userId: number, bannerUrl: string): Promise<void> {
    await this.userRepository.update(userId, { bannerUrl });
  }

  async clearBannerUrl(userId: number): Promise<void> {
    await this.userRepository.update(userId, { bannerUrl: null });
  }

  async getUserPosts(userId: number): Promise<Post[]> {
    return this.postRepository.find({
      where: { user: { id: userId } },
      relations: ['user'],
      order: { date: 'DESC' },
    });
  }

  async create(dto: CreateUserDto): Promise<User> {
    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = this.userRepository.create({
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email,
      username: dto.username,
      passwordHash,
    });
    try {
      return await this.userRepository.save(user);
    } catch (err: any) {
      if (err?.code === '23505') {
        const detail: string = err.detail ?? '';
        if (detail.includes('username')) {
          throw new ConflictException('Username already taken');
        }
        throw new ConflictException('Email already registered');
      }
      throw err;
    }
  }
}
