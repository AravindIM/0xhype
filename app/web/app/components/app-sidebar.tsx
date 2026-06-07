import { useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Logo from "@/assets/logo.svg?react";
import type React from "react";
import { useAuth } from "~/context/auth-context";
import { AuthModal } from "~/components/auth-modal";
import { Button } from "@/components/ui/button";

interface NavItem {
  title: string;
  url: string;
}

const navItems: NavItem[] = [
  {
    title: "Home",
    url: "/",
  },
];

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  onPostClick?: () => void;
}

export function AppSidebar({ onPostClick, ...props }: AppSidebarProps) {
  const { user, logout } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const handlePostClick = () => {
    if (user) {
      onPostClick?.();
    } else {
      setAuthModalOpen(true);
    }
  };

  const initials = user
    ? user.fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "";

  return (
    <>
      <Sidebar {...props}>
        <SidebarHeader className="px-8 py-0 md:w-75 md:ml-auto">
          <SidebarMenu>
            <SidebarMenuItem key="logo">
              <SidebarMenuButton
                asChild
                className="data-[slot=sidebar-menu-button]:p-3! rounded-full text-xl text-bold w-fit h-fit"
              >
                <a href="#">
                  <Logo className="size-10! text-primary" />
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarContent className="px-7 py-0 md:w-75 md:ml-auto">
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  className="p-7 rounded-full text-xl font-semi-bold w-full md:w-fit"
                >
                  <a href={item.url}>
                    <span>{item.title}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}

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

        {!user && (
          <SidebarFooter className="px-7 pb-6 md:w-75 md:ml-auto">
            <Button
              variant="outline"
              onClick={() => setAuthModalOpen(true)}
              className="w-full rounded-full py-7 text-xl"
            >
              Sign in
            </Button>
          </SidebarFooter>
        )}

        {user && (
          <SidebarFooter className="px-7 pb-6 md:w-75 md:ml-auto">
            <div className="flex items-center gap-3 py-5">
              <div className="flex items-center justify-center size-10 rounded-full bg-primary text-primary-foreground font-semibold text-sm shrink-0">
                {initials}
              </div>
              <div className="flex flex-col min-w-0 flex-1">
                <span className="text-sm font-semibold truncate">{user.fullName}</span>
                <span className="text-xs text-muted-foreground truncate">@{user.username}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => logout()}
                className="shrink-0 text-muted-foreground hover:text-foreground"
              >
                Sign out
              </Button>
            </div>
          </SidebarFooter>
        )}
      </Sidebar>

      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
    </>
  );
}
