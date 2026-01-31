import type React from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { PreviewProps } from "./preview";
import { Post } from "./post";
import axios from "axios";

export interface PostItemProps extends React.ComponentProps<"div"> {
  postid: number;
  title: string;
  link: string;
}
export function PostItem({ postid, title, link }: PostItemProps) {
  //   const queryClient = useQueryClient();

  const { isLoading, isError, data } = useQuery<PreviewProps, Error>({
    queryKey: ["preview", link],
    queryFn: async () => {
      const { data } = await axios.get(`/api/posts/${postid}/preview`, {
        timeout: 3000,
      });
      return data;
    },
    refetchOnWindowFocus: false,
  });

  return (
    <Post
      title={title}
      link={link}
      preview={data}
      isPreviewLoading={isLoading}
      isPreviewError={isError}
    />
  );
}
