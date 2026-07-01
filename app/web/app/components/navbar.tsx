import { SidebarTrigger } from "@/components/ui/sidebar";
import Logo from "@/assets/logo.svg?react";

export function NavBar() {
  return (
    <nav className="flex md:hidden items-center p-3 bg-background border-b sticky top-0 z-10">
      <SidebarTrigger>
        <Logo className="size-5 text-primary" />
      </SidebarTrigger>
      <div className="absolute left-1/2 -translate-x-1/2">
        <span className="font-bold text-lg">0xhype</span>
      </div>
    </nav>
  );
}
