import { RotateCw, WifiOff } from "lucide-react";
import type React from "react";
import { Button } from "@/components/ui/button";

interface PostFetchErrorProps extends React.ComponentProps<"div"> {
  onRetry: React.MouseEventHandler<HTMLButtonElement>;
}

export function PostFetchError({ onRetry, ...props }: PostFetchErrorProps) {
  return (
    <div
      className="p-6 w-full flex flex-col justify-center items-center gap-3"
      {...props}
    >
      <WifiOff className="size-12" />
      <div>
        <p className="text-center cursor-default">
          Yeah, okay, something broke. Either the matrix glitched, or you're
          offline.
        </p>
        <p className="text-center cursor-default">
          Let's confirm it before we begin to blame the universe!
        </p>
      </div>
      <Button
        onClick={onRetry}
        className="rounded-full cursor-pointer gap-3 py-4! px-6! my-4"
      >
        <RotateCw /> Retry
      </Button>
    </div>
  );
}
