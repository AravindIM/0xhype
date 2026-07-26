import { EllipsisVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "~/context/auth-context";
import type { PostAuthor, PreviewProps } from "../post-item";
import { PostCardSurface } from "./post-card-surface";

interface PostPreviewCardProps {
  link: string;
  title: string;
  preview?: PreviewProps | null;
  previewLoading?: boolean;
}

export function PostPreviewCard({
  link,
  title,
  preview,
  previewLoading,
}: PostPreviewCardProps) {
  const { user } = useAuth();

  const author: PostAuthor = {
    username: user?.username ?? "",
    displayName: user?.displayName ?? "",
    avatarUrl: user?.avatarUrl ?? null,
  };

  return (
    <PostCardSurface
      interactive={false}
      link={link}
      title={title}
      author={author}
      date={new Date().toISOString()}
      preview={preview ?? undefined}
      previewLoading={previewLoading}
      menu={
        <span className="pointer-events-none -my-1.5 -mr-2 shrink-0">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            disabled
            className="size-8 rounded-full text-white/70"
          >
            <EllipsisVertical className="size-4" />
          </Button>
        </span>
      }
    />
  );
}
