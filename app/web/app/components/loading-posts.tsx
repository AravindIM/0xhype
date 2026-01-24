import type React from "react";
import { Spinner } from "@/components/ui/spinner";

export function LoadingPosts({ ...props }: React.ComponentProps<"div">) {
  return (
    <div className="py-4 w-full flex justify-center items-center" {...props}>
      <Spinner className="size-8" />
    </div>
  );
}
