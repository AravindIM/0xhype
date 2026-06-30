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
import { Button } from "@/components/ui/button";
import { NavUser } from "@/components/nav-user";
import { Link, useNavigate } from "react-router";

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
  const { user, isLoading: isAuthLoading } = useAuth();
  const navigate = useNavigate();

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
      <SidebarHeader className="px-8 py-0 md:w-75 md:ml-auto">
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
      </SidebarHeader>

      <SidebarContent className="px-7 py-0 md:w-75 md:ml-auto">
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                className="p-7 rounded-full text-xl font-semi-bold w-full md:w-fit"
              >
                <Link to={item.url}>
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}

          {!isAuthLoading && user && (
            <SidebarMenuItem key="profile">
              <SidebarMenuButton
                asChild
                className="p-7 rounded-full text-xl font-semi-bold w-full md:w-fit"
              >
                <Link to={`/${user.username}`}>
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
          <NavUser />
        </SidebarFooter>
      )}
    </Sidebar>
  );
}
