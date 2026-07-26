import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import type { Route } from "./+types/home";
import { NavBar } from "@/components/navbar";
import { SidebarInset, SidebarProvider } from "~/components/ui/sidebar";
import { AppSidebar } from "~/components/app-sidebar";
import { CreatePost } from "~/components/create-post";
import { PostFeed } from "~/components/post-feed";
import { TrendingPanel } from "~/components/trending-panel";
import { Toaster } from "@/components/ui/sonner";
import { LoadingPosts } from "@/components/loading-posts";
import { PostFetchError } from "@/components/post-fetch-error";
import type { PostItemProps } from "~/components/post-item";
import { useAuth } from "~/context/auth-context";
import { apiClient } from "~/lib/axios";
import { useCreatePostForm } from "~/hooks/use-create-post-form";

interface PostsPage {
  items: PostItemProps[];
  nextCursor: number | null;
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "0xhype" },
    {
      name: "description",
      content:
        "News aggregator social media for following the latest tech hypes!!",
    },
  ];
}

export default function Home() {
  const queryClient = useQueryClient();
  const { user, isLoading: isAuthLoading } = useAuth();

  const {
    isPending,
    isError,
    data,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ["posts"],
    queryFn: async ({ pageParam }) => {
      const { data } = await apiClient.get("/api/posts", {
        params: { cursor: pageParam, limit: 20 },
      });
      return data as PostsPage;
    },
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    retry: false,
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });

  const posts = data?.pages.flatMap((page) => page.items) ?? [];

  const {
    register,
    onSubmit,
    isSubmitting,
    isError: isCreateError,
    resetSignal,
  } = useCreatePostForm();

  const refetchPosts = () => {
    queryClient.invalidateQueries({ queryKey: ["posts"] });
  };

  return (
    <>
      <SidebarProvider>
        <AppSidebar variant="sidebar" />
        <SidebarInset>
          <NavBar user={!isAuthLoading && user ? user : null} />
          <div className="flex flex-col justify-center">
            {user && (
              <div className="hidden md:block">
                <CreatePost
                titleInputProps={register("title")}
                linkInputProps={register("link", { required: true })}
                onSubmit={onSubmit}
                isSubmitting={isSubmitting}
                isError={isCreateError}
                resetSignal={resetSignal}
              />
              </div>
            )}
            {isError ? (
              <PostFetchError onRetry={refetchPosts} />
            ) : isPending ? (
              <LoadingPosts />
            ) : posts.length === 0 ? (
              <div className="py-16 flex flex-col items-center gap-2 text-muted-foreground">
                <p className="text-lg font-medium">No posts yet</p>
                <p className="text-sm">Be the first to share something.</p>
              </div>
            ) : (
              <PostFeed
                posts={posts}
                hasNextPage={hasNextPage}
                isFetchingNextPage={isFetchingNextPage}
                fetchNextPage={fetchNextPage}
              />
            )}
          </div>
        </SidebarInset>
        <TrendingPanel />
      </SidebarProvider>
      <Toaster position="top-center" />
    </>
  );
}
