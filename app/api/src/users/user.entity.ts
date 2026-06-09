import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Post } from '../posts/post.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  username: string;

  @Column()
  passwordHash: string;

  @Column({ type: 'text', nullable: true, default: null })
  bio: string | null;

  @Column({ type: 'varchar', nullable: true, default: null })
  location: string | null;

  @Column({ type: 'varchar', nullable: true, default: null })
  website: string | null;

  @Column({ type: 'text', nullable: true, default: null })
  avatarUrl: string | null;

  @Column({ type: 'text', nullable: true, default: null })
  bannerUrl: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];
}
