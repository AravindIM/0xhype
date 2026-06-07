import { cn } from "~/lib/utils";
import type React from "react";

export function TrendingPanel({
  className,
  ...props
}: React.ComponentProps<"aside">) {
  return (
    <aside
      className={cn(
        "hidden md:flex flex-col w-100 shrink-0 border-l bg-sidebar",
        className
      )}
      {...props}
    />
  );
}
