import type React from "react";
import { useQuery } from "@tanstack/react-query";
import { PostCard } from "./post-card/post-card";
import { apiClient } from "~/lib/axios";

export interface PostAuthor {
  username: string;
  displayName: string;
  avatarUrl: string | null;
}

export interface PreviewProps {
  link: string;
  title?: string;
  description?: string;
  image?: string;
  siteName?: string;
  siteUrl?: string;
  favicon?: string;
}

export interface PostItemProps extends React.ComponentProps<"div"> {
  postid: number;
  title: string;
  link: string;
  date: string;
  author: PostAuthor;
}

export function PostItem({
  postid,
  title,
  link,
  date,
  author,
  ...props
}: PostItemProps) {
  const { data } = useQuery<PreviewProps, Error>({
    queryKey: ["preview", link],
    queryFn: async () => {
      const { data } = await apiClient.get(
        `/api/${author.username}/posts/${postid}/preview`
      );
      return data;
    },
    staleTime: 3_600_000,
    gcTime: 3_600_000,
    retry: false,
    refetchOnWindowFocus: false,
  });

  return (
    <PostCard
      title={title}
      link={link}
      author={author}
      date={date}
      preview={data ?? undefined}
      {...props}
    />
  );
}
