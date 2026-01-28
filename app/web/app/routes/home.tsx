import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Route } from "./+types/home";
import { NavBar } from "@/components/navbar";
import { Post, type PostProps } from "~/components/post";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "~/components/ui/sidebar";
import { AppSidebar } from "~/components/app-sidebar";
import { CreatePost } from "~/components/create-post";
import { useForm, type SubmitHandler } from "react-hook-form";
import axios from "axios";
import { PostList } from "~/components/post-list";
import { TrendingPanel } from "~/components/trending-panel";
import { Toaster } from "@/components/ui/sonner";
import { LoadingPosts } from "@/components/loading-posts";
import { PostFetchError } from "@/components/post-fetch-error";
import type { PostItemProps } from "~/components/post-item";

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

  const { isFetching, isError, data } = useQuery<PostItemProps[], Error>({
    queryKey: ["posts"],
    queryFn: async () => {
      const { data } = await axios.get("/api/posts", {
        timeout: 3000,
      });
      return data as PostItemProps[];
    },
    retry: false,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreatePostInput>();

  const refetchPosts = () => {
    queryClient.invalidateQueries({ queryKey: ["posts"] });
  };

  const createPostMutation = useMutation({
    mutationFn: async (data: CreatePostInput) => {
      await axios.post("/api/posts", data);
    },
    onSuccess: () => {
      reset();
      refetchPosts();
    },
  });

  const onSubmit: SubmitHandler<CreatePostInput> = (data) => {
    createPostMutation.mutate(data);
  };

  return (
    <>
      <SidebarProvider>
        <AppSidebar variant="sidebar" />
        <SidebarInset>
          <div className="flex flex-col justify-center">
            <CreatePost
              titleInputProps={register("title")}
              linkInputProps={register("link", { required: true })}
              onSubmit={handleSubmit(onSubmit)}
            />
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
        <TrendingPanel variant="sidebar" />
      </SidebarProvider>
      <Toaster position="top-center" />
    </>
  );
}
