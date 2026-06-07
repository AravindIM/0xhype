import { SidebarTrigger } from "@/components/ui/sidebar";
import Logo from "@/assets/logo.svg?react";

export function NavBar() {
  return (
    <nav className="flex md:hidden items-center p-3 bg-background border-b sticky top-0 z-10">
      <SidebarTrigger />
      <div className="absolute left-1/2 -translate-x-1/2">
        <Logo className="size-8 text-primary" />
      </div>
    </nav>
  );
}
