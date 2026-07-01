import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import Logo from "@/assets/logo.svg?react";
import type React from "react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "~/context/auth-context";
import { fetchProfile } from "~/lib/profile-api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { NavUser } from "@/components/nav-user";
import { LogoutConfirmDialog } from "@/components/logout-confirm-dialog";
import { Link, useNavigate } from "react-router";
import { GoHomeFill, GoPersonFill } from "react-icons/go";

interface NavItem {
  title: string;
  url: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

const navItems: NavItem[] = [
  {
    title: "Home",
    url: "/",
    icon: GoHomeFill,
  },
];

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  onPostClick?: () => void;
}

export function AppSidebar({ onPostClick, ...props }: AppSidebarProps) {
  const { user, isLoading: isAuthLoading, logout } = useAuth();
  const { isMobile } = useSidebar();
  const navigate = useNavigate();
  const [logoutOpen, setLogoutOpen] = useState(false);

  const { data: profile } = useQuery({
    queryKey: ["profile", user?.username],
    queryFn: () => fetchProfile(user!.username),
    enabled: isMobile && !!user,
  });

  const initials = user
    ? user.displayName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "";

  const handlePostClick = () => {
    if (isAuthLoading) return;
    if (user) {
      onPostClick?.();
    } else {
      navigate("/login");
    }
  };

  return (
    <Sidebar {...props}>
      <SidebarHeader className="p-0 md:px-8 md:py-0 md:w-75 md:ml-auto">
        {isMobile ? (
          <div className="relative overflow-hidden">
            {/* Banner background (non-interactive) */}
            <div
              className="pointer-events-none absolute inset-0 scale-110 bg-linear-to-br from-primary/25 to-muted bg-cover bg-center blur-sm"
              style={
                user && profile?.bannerUrl
                  ? { backgroundImage: `url(${profile.bannerUrl})` }
                  : undefined
              }
            />
            {/* Primary color shade over the blurred banner */}
            <div className="pointer-events-none absolute inset-0 bg-primary/30 mix-blend-multiply" />
            {/* Scrim for legibility */}
            <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-sidebar/80 via-sidebar/40 to-transparent" />

            {/* Foreground */}
            <div className="relative flex flex-col gap-2 pl-8 pr-6 pb-8 pt-10">
              {user ? (
                <>
                  <Link to={`/${user.username}`} className="w-fit">
                    <Avatar className="size-14 ring-2 ring-background">
                      <AvatarImage
                        src={user.avatarUrl ?? undefined}
                        alt={user.displayName}
                      />
                      <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                  </Link>
                  <Link
                    to={`/${user.username}`}
                    className="grid w-fit leading-tight"
                  >
                    <span className="truncate text-lg font-bold">
                      {user.displayName}
                    </span>
                    <span className="truncate text-sm text-muted-foreground">
                      @{user.username}
                    </span>
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/" className="w-fit">
                    <div className="flex size-14 items-center justify-center rounded-full bg-primary ring-2 ring-background">
                      <Logo className="size-8 text-primary-foreground" />
                    </div>
                  </Link>
                  <div className="grid leading-tight">
                    <Link to="/" className="w-fit">
                      <span className="truncate text-lg font-bold">0xhype</span>
                    </Link>
                    <span className="text-sm">&nbsp;</span>
                  </div>
                </>
              )}
            </div>
          </div>
        ) : (
          <SidebarMenu>
            <SidebarMenuItem key="logo">
              <SidebarMenuButton
                asChild
                className="data-[slot=sidebar-menu-button]:p-3! rounded-full text-xl text-bold w-fit h-fit"
              >
                <Link to="/">
                  <Logo className="size-10! text-primary" />
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        )}
      </SidebarHeader>

      <SidebarContent className="px-7 py-0 md:w-75 md:ml-auto">
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                className="p-7 rounded-full text-xl font-semi-bold w-full md:w-fit gap-4"
              >
                <Link to={item.url}>
                  <item.icon className="!size-[1.5em] shrink-0" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}

          {!isAuthLoading && user && (
            <SidebarMenuItem key="profile">
              <SidebarMenuButton
                asChild
                className="p-7 rounded-full text-xl font-semi-bold w-full md:w-fit gap-4"
              >
                <Link to={`/${user.username}`}>
                  <GoPersonFill className="!size-[1.5em] shrink-0" />
                  <span>Profile</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}

          <SidebarMenuItem key="post-button" className="hidden md:flex">
            <SidebarMenuButton
              onClick={handlePostClick}
              className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground p-7 rounded-full justify-center text-xl font-semi-bold cursor-pointer"
            >
              Post
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>

      {!isAuthLoading && !user && (
        <SidebarFooter className="px-7 pb-6 md:w-75 md:ml-auto">
          <Button
            variant="outline"
            onClick={() => navigate("/login")}
            className="w-full rounded-full py-7 text-xl"
          >
            Sign in
          </Button>
        </SidebarFooter>
      )}

      {!isAuthLoading && user && (
        <SidebarFooter className="px-7 pb-6 md:w-75 md:ml-auto">
          <div className="hidden md:block">
            <NavUser />
          </div>
          <Button
            variant="outline"
            onClick={() => setLogoutOpen(true)}
            className="flex md:hidden w-full rounded-full py-7 text-xl"
          >
            Log out
          </Button>
          <LogoutConfirmDialog
            open={logoutOpen}
            onConfirm={logout}
            onCancel={() => setLogoutOpen(false)}
          />
        </SidebarFooter>
      )}
    </Sidebar>
  );
}
