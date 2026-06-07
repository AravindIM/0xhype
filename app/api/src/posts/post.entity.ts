import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../users/user.entity';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  postid: number;

  @Column()
  title: string;

  @Column()
  link: string;

  @Column({ default: new Date() })
  date: Date;

  @ManyToOne(() => User, (user) => user.posts, { nullable: false, eager: false })
  user: User;
}
