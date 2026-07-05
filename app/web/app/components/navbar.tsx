import { SidebarTrigger } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Menu, ArrowLeft } from "lucide-react";
import { Link } from "react-router";

export interface User {
  displayName: string;
  username: string;
  avatarUrl?: string | null;
}

type NavBarProps =
  | { variant?: "home"; user: User | null }
  | { variant: "post"; username: string; user: User | null };

export function NavBar(props: NavBarProps) {
  const { user } = props;

  const initials = user
    ? user.displayName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "";

  const trigger = (
    <SidebarTrigger
      className={user ? "size-9 rounded-full p-0 overflow-hidden" : undefined}
    >
      {user ? (
        <Avatar className="size-9">
          <AvatarImage src={user.avatarUrl ?? undefined} alt={user.displayName} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
      ) : (
        <Menu />
      )}
    </SidebarTrigger>
  );

  if (props.variant === "post") {
    return (
      <header className="flex h-16 shrink-0 items-center gap-2 px-4">
        {trigger}
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Link
          to={`/${props.username}`}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />@{props.username}
        </Link>
      </header>
    );
  }

  return (
    <nav className="flex md:hidden items-center p-3 bg-background border-b sticky top-0 z-10">
      {trigger}
      <div className="absolute left-1/2 -translate-x-1/2">
        <span className="font-bold text-lg">0xhype</span>
      </div>
    </nav>
  );
}
