import { useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Route } from "./+types/home";
import { NavBar } from "@/components/navbar";
import {
  SidebarInset,
  SidebarProvider,
} from "~/components/ui/sidebar";
import { AppSidebar } from "~/components/app-sidebar";
import { CreatePost } from "~/components/create-post";
import { useForm, type SubmitHandler } from "react-hook-form";
import { PostList } from "~/components/post-list";
import { TrendingPanel } from "~/components/trending-panel";
import { Toaster } from "@/components/ui/sonner";
import { LoadingPosts } from "@/components/loading-posts";
import { PostFetchError } from "@/components/post-fetch-error";
import type { PostItemProps } from "~/components/post-item";
import { useAuth } from "~/context/auth-context";
import { apiClient } from "~/lib/axios";
import { AuthModal } from "~/components/auth-modal";
import { Fab } from "~/components/fab";

interface CreatePostInput {
  title: string;
  link: string;
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
  const { user } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const createPostRef = useRef<HTMLDivElement>(null);

  const { isFetching, isError, data } = useQuery<PostItemProps[], Error>({
    queryKey: ["posts"],
    queryFn: async () => {
      const { data } = await apiClient.get("/api/posts");
      return data as PostItemProps[];
    },
    retry: false,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<CreatePostInput>();

  const refetchPosts = () => {
    queryClient.invalidateQueries({ queryKey: ["posts"] });
  };

  const createPostMutation = useMutation({
    mutationFn: async (data: CreatePostInput) => {
      await apiClient.post("/api/posts", data);
    },
    onSuccess: () => {
      reset();
      refetchPosts();
    },
  });

  const onSubmit: SubmitHandler<CreatePostInput> = async (data) => {
    await createPostMutation.mutateAsync(data);
  };

  const handleFabClick = () => {
    if (user) {
      createPostRef.current?.scrollIntoView({ behavior: "smooth" });
      createPostRef.current?.querySelector("input")?.focus();
    } else {
      setAuthModalOpen(true);
    }
  };

  return (
    <>
      <SidebarProvider>
        <AppSidebar
          variant="sidebar"
          onPostClick={() => {
            createPostRef.current?.scrollIntoView({ behavior: "smooth" });
            createPostRef.current?.querySelector("input")?.focus();
          }}
        />
        <SidebarInset>
          <NavBar />
          <div className="flex flex-col justify-center">
            {user && (
              <div ref={createPostRef}>
                <CreatePost
                  titleInputProps={register("title")}
                  linkInputProps={register("link", { required: true })}
                  onSubmit={handleSubmit(onSubmit)}
                  isSubmitting={isSubmitting}
                  isError={Boolean(createPostMutation.error)}
                />
              </div>
            )}
            <PostList posts={data} />
            {isError ? (
              <PostFetchError onRetry={refetchPosts} />
            ) : isFetching ? (
              <LoadingPosts />
            ) : (
              <></>
            )}
          </div>
        </SidebarInset>
        <TrendingPanel />
      </SidebarProvider>
      <Toaster position="top-center" />
      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
      <Fab onClick={handleFabClick} />
    </>
  );
}
