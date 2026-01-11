import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { Route } from "./+types/home";
import { NavBar } from "@/components/navbar";
import { Post } from "~/components/post";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "~/components/ui/sidebar";
import { AppSidebar } from "~/components/app-sidebar";

interface PostData {
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
  // Keep queryClient if we'll need it for mutations or cache updates later
  const queryClient = useQueryClient();

  // Properly type the query and use the correct status flags from React Query
  const { isLoading, isError, error, data } = useQuery<PostData[], Error>({
    queryKey: ["posts"],
    queryFn: async () => {
      const res = await fetch("/api/posts");
      if (!res.ok)
        throw new Error(
          `Failed to load posts: ${res.status} ${res.statusText}`
        );
      return (await res.json()) as PostData[];
    },
  });
  return (
    <>
      <SidebarProvider>
        <AppSidebar variant="sidebar" />
        <SidebarInset>
          <div className="flex justify-center">
            {isLoading
              ? "Loading"
              : isError
              ? `An error has occurred ${error?.message ?? ""}`
              : data && data.length > 0
              ? data.map((post) => (
                  <Post
                    key={post.link}
                    title={post.title}
                    link={post.link}
                    className="w-full"
                  />
                ))
              : "No posts found"}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}
