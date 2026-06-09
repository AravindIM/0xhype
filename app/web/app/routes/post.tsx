import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import type { Route } from "./+types/post";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "~/components/ui/sidebar";
import { AppSidebar } from "~/components/app-sidebar";
import { Post } from "~/components/post";
import { Toaster } from "~/components/ui/sonner";
import { Separator } from "~/components/ui/separator";
import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";
import { apiClient } from "~/lib/axios";
import type { PreviewProps } from "~/components/preview/preview";
import type { PostItemProps } from "~/components/post-item";

export async function loader({ params, request }: Route.LoaderArgs) {
  try {
    const url = new URL(request.url);
    const res = await fetch(
      `${url.origin}/api/${params.username}/posts/${params.postid}`
    );
    if (!res.ok) return { post: null };
    const post = (await res.json()) as PostItemProps;
    return { post };
  } catch {
    return { post: null };
  }
}

export function meta({ data }: Route.MetaArgs) {
  if (data?.post?.title) {
    return [{ title: `${data.post.title} / 0xhype` }];
  }
  return [{ title: "Post / 0xhype" }];
}

export default function PostDetail() {
  const { username, postid } = useParams<{ username: string; postid: string }>();

  const { isLoading: postLoading, isError: postError, data: post } = useQuery<PostItemProps>({
    queryKey: ["post", username, postid],
    queryFn: async () => {
      const { data } = await apiClient.get(`/api/${username}/posts/${postid}`);
      return data;
    },
    retry: false,
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });

  const { isLoading: previewLoading, isError: previewError, data: preview } = useQuery<PreviewProps>({
    queryKey: ["preview", post?.link],
    queryFn: async () => {
      const { data } = await apiClient.get(`/api/${username}/posts/${postid}/preview`);
      return data;
    },
    enabled: !!post,
    retry: false,
    refetchOnWindowFocus: false,
  });

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Link
            to={`/${username}`}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            @{username}
          </Link>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4 pt-0 max-w-2xl">
          {postLoading && (
            <div className="h-48 rounded-xl bg-muted/50 animate-pulse" />
          )}
          {postError && (
            <p className="text-muted-foreground text-sm">Post not found.</p>
          )}
          {post && (
            <Post
              postid={post.postid}
              title={post.title}
              link={post.link}
              username={post.username}
              fullName={post.fullName}
              preview={preview}
              isPreviewLoading={previewLoading}
              isPreviewError={previewError}
            />
          )}
        </div>
        <Toaster />
      </SidebarInset>
    </SidebarProvider>
  );
}
