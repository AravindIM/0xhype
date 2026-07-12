import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import type { Route } from "./+types/post";
import { SidebarInset, SidebarProvider } from "~/components/ui/sidebar";
import { AppSidebar } from "~/components/app-sidebar";
import { NavBar } from "@/components/navbar";
import { Toaster } from "~/components/ui/sonner";
import { useAuth } from "~/context/auth-context";
import { apiClient } from "~/lib/axios";
import { PostItem, type PostItemProps } from "~/components/post-item";

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
  const { user, isLoading } = useAuth();

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

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <NavBar
          variant="post"
          username={username!}
          user={!isLoading && user ? user : null}
        />

        <div className="flex flex-1 flex-col gap-4 p-4 pt-0 max-w-2xl">
          {postLoading && (
            <div className="h-48 rounded-xl bg-muted/50 animate-pulse" />
          )}
          {postError && (
            <p className="text-muted-foreground text-sm">Post not found.</p>
          )}
          {post && (
            <PostItem
              postid={post.postid}
              title={post.title}
              link={post.link}
              date={post.date}
              author={post.author}
            />
          )}
        </div>
        <Toaster />
      </SidebarInset>
    </SidebarProvider>
  );
}
