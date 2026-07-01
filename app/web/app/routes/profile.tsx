import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import type { Route } from "./+types/profile";
import { SidebarInset, SidebarProvider } from "~/components/ui/sidebar";
import { AppSidebar } from "~/components/app-sidebar";
import { PostList } from "~/components/post-list";
import { LoadingPosts } from "~/components/loading-posts";
import { Skeleton } from "~/components/ui/skeleton";
import { Separator } from "~/components/ui/separator";
import { Button } from "~/components/ui/button";
import { EditProfileModal } from "~/components/edit-profile-modal";
import { Toaster } from "~/components/ui/sonner";
import { useAuth } from "~/context/auth-context";
import { fetchProfile, fetchUserPosts } from "~/lib/profile-api";
import { MapPin, Link2, Calendar, ArrowLeft } from "lucide-react";
import { TrendingPanel } from "~/components/trending-panel";

export async function loader({ params, request }: Route.LoaderArgs) {
  try {
    const url = new URL(request.url);
    const res = await fetch(`${url.origin}/api/${params.username}`);
    if (!res.ok) return { profile: null };
    return { profile: (await res.json()) as { displayName: string } };
  } catch {
    return { profile: null };
  }
}

export function meta({ data, params }: Route.MetaArgs) {
  if (data?.profile?.displayName) {
    return [{ title: `${data.profile.displayName} (@${params.username}) / 0xhype` }];
  }
  return [{ title: `@${params.username} / 0xhype` }];
}

export default function Profile() {
  const { username } = useParams<{ username: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [editOpen, setEditOpen] = useState(false);

  const {
    data: profile,
    isLoading: profileLoading,
    isError: profileError,
  } = useQuery({
    queryKey: ["profile", username],
    queryFn: () => fetchProfile(username!),
    enabled: !!username,
    retry: false,
  });

  const { data: posts, isLoading: postsLoading } = useQuery({
    queryKey: ["userPosts", username],
    queryFn: () => fetchUserPosts(username!),
    enabled: !!username && !!profile,
    retry: false,
  });

  const isOwnProfile = user?.username === username;

  const joinedDate = profile?.createdAt
    ? new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(
        new Date(profile.createdAt)
      )
    : null;

  const websiteHref = profile?.website
    ? profile.website.startsWith("http")
      ? profile.website
      : `https://${profile.website}`
    : null;

  const initials = profile?.displayName
    ? profile.displayName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "";

  if (profileError) {
    return (
      <SidebarProvider>
        <AppSidebar variant="sidebar" />
        <SidebarInset>
          <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-sm border-b">
            <div className="flex items-center gap-1 px-2 h-14">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full shrink-0"
                onClick={() => navigate(-1)}
              >
                <ArrowLeft className="size-5" />
              </Button>
            </div>
          </header>
          <div className="flex flex-col items-center justify-center py-32 gap-3 text-muted-foreground">
            <p className="text-2xl font-bold text-foreground">
              This account doesn't exist
            </p>
            <p className="text-sm">
              Try searching for another username.
            </p>
          </div>
        </SidebarInset>
        <TrendingPanel />
      </SidebarProvider>
    );
  }

  return (
    <>
      <SidebarProvider>
        <AppSidebar variant="sidebar" />
        <SidebarInset>
          {/* Sticky profile header */}
          <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-sm border-b">
            <div className="flex items-center gap-1 px-2 h-14">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full shrink-0"
                onClick={() => navigate(-1)}
              >
                <ArrowLeft className="size-5" />
              </Button>
              <div className="flex-1 min-w-0 ml-1">
                {profileLoading ? (
                  <Skeleton className="h-5 w-32" />
                ) : profile ? (
                  <>
                    <p className="font-bold text-base leading-tight truncate">{profile.displayName}</p>
                    <p className="text-xs text-muted-foreground">
                      {profile.postCount} {profile.postCount === 1 ? "Post" : "Posts"}
                    </p>
                  </>
                ) : null}
              </div>
            </div>
          </header>

          {/* Banner — full width of content column */}
          {profile?.bannerUrl ? (
            <div
              className="h-36 bg-cover bg-center"
              style={{ backgroundImage: `url(${profile.bannerUrl})` }}
            />
          ) : (
            <div className="h-36 bg-linear-to-br from-primary/25 to-muted" />
          )}

          <div>
            {/* Avatar overlaps banner; Edit button sits below the banner, right-aligned */}
            <div className="relative flex justify-end px-4 pt-3 min-h-12">
              <div className="absolute -top-10 left-4">
                {profileLoading ? (
                  <Skeleton className="size-20 rounded-full" />
                ) : profile?.avatarUrl ? (
                  <img
                    src={profile.avatarUrl}
                    alt={profile.displayName}
                    className="size-20 rounded-full object-cover ring-4 ring-background"
                  />
                ) : (
                  <div className="flex items-center justify-center size-20 rounded-full bg-primary text-primary-foreground font-semibold text-xl ring-4 ring-background">
                    {initials}
                  </div>
                )}
              </div>

              {isOwnProfile && profile && (
                <Button
                  variant="outline"
                  className="rounded-full px-5"
                  onClick={() => setEditOpen(true)}
                >
                  Edit profile
                </Button>
              )}
            </div>

            {/* Profile info */}
            <div className="px-4 mt-3 flex flex-col gap-2">
              {profileLoading ? (
                <>
                  <Skeleton className="h-6 w-40" />
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-4 w-full mt-1" />
                </>
              ) : profile ? (
                <>
                  <div>
                    <p className="text-xl font-bold leading-tight">{profile.displayName}</p>
                    <p className="text-sm text-muted-foreground">@{profile.username}</p>
                  </div>

                  {profile.bio && (
                    <p className="text-sm leading-relaxed">{profile.bio}</p>
                  )}

                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                    {profile.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="size-3.5 shrink-0" />
                        {profile.location}
                      </span>
                    )}
                    {websiteHref && (
                      <a
                        href={websiteHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-primary hover:underline"
                      >
                        <Link2 className="size-3.5 shrink-0" />
                        {profile.website}
                      </a>
                    )}
                    {joinedDate && (
                      <span className="flex items-center gap-1">
                        <Calendar className="size-3.5 shrink-0" />
                        Joined {joinedDate}
                      </span>
                    )}
                  </div>

                  <p className="text-sm">
                    <span className="font-bold">{profile.postCount}</span>{" "}
                    <span className="text-muted-foreground">
                      {profile.postCount === 1 ? "Post" : "Posts"}
                    </span>
                  </p>
                </>
              ) : null}
            </div>

            <Separator className="mt-4" />

            {/* Posts */}
            {postsLoading ? (
              <LoadingPosts />
            ) : posts && posts.length > 0 ? (
              <PostList posts={posts} />
            ) : (
              !postsLoading && (
                <div className="py-16 flex flex-col items-center gap-2 text-muted-foreground">
                  <p className="text-lg font-medium">No posts yet</p>
                  {isOwnProfile && (
                    <p className="text-sm">Share something with the world.</p>
                  )}
                </div>
              )
            )}
          </div>
        </SidebarInset>
        <TrendingPanel />
      </SidebarProvider>

      {profile && (
        <EditProfileModal
          open={editOpen}
          onOpenChange={setEditOpen}
          profile={profile}
        />
      )}
      <Toaster position="top-center" />
    </>
  );
}
