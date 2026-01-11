import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
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
      <SidebarHeader className="w-70 ml-auto px-8">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-6! rounded-full text-xl text-bold w-fit"
            >
              <a href="#">
                <span>Hype0</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="w-70 ml-auto px-8">
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                className="p-6 rounded-full text-xl font-semi-bold w-fit"
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
              className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground p-6 rounded-full justify-center text-xl font-semi-bold"
            >
              <a href="#">Post</a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
