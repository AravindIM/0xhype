import { Sidebar } from "@/components/ui/sidebar";
import type React from "react";

export function TrendingPanel({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return <Sidebar side="right" {...props}></Sidebar>;
}
