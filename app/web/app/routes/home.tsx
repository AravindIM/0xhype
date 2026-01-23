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
import { toast } from "sonner";
import { useEffect } from "react";

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

  const { isLoading, isError, error, data } = useQuery<PostProps[], Error>({
    queryKey: ["posts"],
    queryFn: async () => {
      const res = await fetch("/api/posts");
      if (!res.ok)
        throw new Error(
          `Failed to load posts: ${res.status} ${res.statusText}`,
        );
      return (await res.json()) as PostProps[];
    },
  });

  const createPostMutation = useMutation({
    mutationFn: async (data: CreatePostInput) => {
      await axios.post("/api/posts", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CreatePostInput>();

  const onSubmit: SubmitHandler<CreatePostInput> = (data) => {
    createPostMutation.mutate(data);
  };
  useEffect(() => {
    if (isError) {
      toast.error("Error fetching posts!");
    }
  }, [isError]);

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
            {isLoading ? (
              "Loading"
            ) : isError ? (
              <></>
            ) : (
              <PostList posts={data} />
            )}
          </div>
        </SidebarInset>
        <TrendingPanel variant="sidebar" />
      </SidebarProvider>
      <Toaster position="top-center" />
    </>
  );
}
