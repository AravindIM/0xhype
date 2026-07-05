import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
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

  @ManyToOne(() => User, (user) => user.posts, {
    nullable: false,
    eager: false,
  })
  user: User;
}
