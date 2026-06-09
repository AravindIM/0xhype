export class PublicProfileDto {
  username: string;
  fullName: string;
  bio: string | null;
  location: string | null;
  website: string | null;
  avatarUrl: string | null;
  bannerUrl: string | null;
  createdAt: Date;
  postCount: number;
}
