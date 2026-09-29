import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { User } from '../users/user.entity';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  postid: number;

  @Column()
  title: string;

  @Column()
  link: string;

  @CreateDateColumn()
  date: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  @Column()
  userId: number;

  @ManyToOne(() => User, (user) => user.posts, {
    nullable: false,
    eager: false,
  })
  @JoinColumn({ name: 'userId' })
  user: User;
}
