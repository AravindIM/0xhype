import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { Route } from "./+types/home";
import { NavBar } from "~/components/navbar";
import { Post } from "~/components/post";

interface PostData {
  title: string;
  link: string;
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Hype0" },
    { name: "description", content: "Welcome to Hype0!" },
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
      <NavBar />
      <main className="flex items-center justify-center pt-4 pb-4">
        <div className="flex-1 flex flex-col items-center gap-16 min-h-0">
          <div className="w-full space-y-6 px-4">
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
        </div>
      </main>
    </>
  );
}
