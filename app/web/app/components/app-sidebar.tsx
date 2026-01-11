import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Logo from "@/assets/logo.svg?react";
import type React from "react";

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

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader className="w-75 ml-auto px-8 py-0">
        <SidebarMenu>
          <SidebarMenuItem>
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
      <SidebarContent className="w-75 ml-auto px-7 py-0">
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                className="p-7 rounded-full text-xl font-semi-bold w-fit"
              >
                <a href={item.url}>
                  <span>{item.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}

          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground p-7 rounded-full justify-center text-xl font-semi-bold"
            >
              <a href="#">Post</a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
