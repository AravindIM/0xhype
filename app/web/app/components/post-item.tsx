import type React from "react";
import { useQuery } from "@tanstack/react-query";
import type { PreviewProps } from "./preview/preview";
import { Post } from "./post";
import { apiClient } from "~/lib/axios";

export interface PostItemProps extends React.ComponentProps<"div"> {
  postid: number;
  title: string;
  link: string;
  username: string;
  displayName: string;
}

export function PostItem({ postid, title, link, username, displayName }: PostItemProps) {
  const { isLoading, isError, data } = useQuery<PreviewProps, Error>({
    queryKey: ["preview", link],
    queryFn: async () => {
      const { data } = await apiClient.get(`/api/${username}/posts/${postid}/preview`);
      return data;
    },
    refetchOnWindowFocus: false,
  });

  return (
    <Post
      postid={postid}
      title={title}
      link={link}
      username={username}
      displayName={displayName}
      preview={data}
      isPreviewLoading={isLoading}
      isPreviewError={isError}
    />
  );
}
