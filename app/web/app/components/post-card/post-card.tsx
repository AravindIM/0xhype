import { useState } from "react";
import type React from "react";
import { EllipsisVertical, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DeletePostDialog } from "@/components/delete-post-dialog";
import { useAuth } from "~/context/auth-context";
import { cn } from "~/lib/utils";
import { useLiveAuthor } from "~/hooks/use-live-author";
import type { PostAuthor, PreviewProps } from "../post-item";
import { PostCardSurface } from "./post-card-surface";

export interface PostCardProps extends React.ComponentProps<"div"> {
  postid: number;
  title: string;
  link: string;
  author: PostAuthor;
  date: string;
  preview?: PreviewProps;
  previewLoading?: boolean;
}

export function PostCard({
  postid,
  title,
  link,
  author,
  date,
  preview,
  previewLoading,
  className,
  ...props
}: PostCardProps) {
  const resolvedAuthor = useLiveAuthor(author);
  const { user } = useAuth();
  const isOwner = user?.username === author.username;
  const [deleteOpen, setDeleteOpen] = useState(false);

  const menu = isOwner ? (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="pointer-events-auto -my-1.5 -mr-2 size-8 shrink-0 rounded-full text-white/70 hover:bg-white/10 hover:text-white"
        >
          <EllipsisVertical className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          variant="destructive"
          onSelect={() => setDeleteOpen(true)}
        >
          <Trash2 />
          Delete post
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ) : (
    <span className="pointer-events-auto -my-1.5 -mr-2 shrink-0">
      <Button
        variant="ghost"
        size="icon"
        disabled
        className="size-8 rounded-full text-white/70"
      >
        <EllipsisVertical className="size-4" />
      </Button>
    </span>
  );

  return (
    <div className={cn("py-2", className)} {...props}>
      <PostCardSurface
        interactive
        showVideo
        link={link}
        title={title}
        author={resolvedAuthor}
        date={date}
        preview={preview}
        previewLoading={previewLoading}
        menu={menu}
      />
      {isOwner && (
        <DeletePostDialog
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
          postid={postid}
          title={title}
          username={author.username}
        />
      )}
    </div>
  );
}
