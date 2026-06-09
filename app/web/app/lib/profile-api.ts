import { apiClient } from './axios';
import type { PostItemProps } from '~/components/post-item';

export interface PublicProfile {
  username: string;
  fullName: string;
  bio: string | null;
  location: string | null;
  website: string | null;
  avatarUrl: string | null;
  bannerUrl: string | null;
  createdAt: string;
  postCount: number;
}

export const fetchProfile = (username: string): Promise<PublicProfile> =>
  apiClient.get(`/api/${username}`).then((r) => r.data);

export const fetchUserPosts = (username: string): Promise<PostItemProps[]> =>
  apiClient.get(`/api/${username}/posts`).then((r) => r.data);

export const uploadBanner = (file: File): Promise<{ bannerUrl: string }> => {
  const form = new FormData();
  form.append('banner', file);
  return apiClient
    .post('/api/users/me/banner', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    .then((r) => r.data);
};
