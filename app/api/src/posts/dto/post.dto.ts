export class PostAuthorDto {
  username: string;
  displayName: string;
  avatarUrl: string | null;
}

export class PostDto {
  postid: number;
  title: string;
  link: string;
  date: Date;
  author: PostAuthorDto;
}
