import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

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
}
