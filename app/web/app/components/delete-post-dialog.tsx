import { useLocation, useNavigate } from "react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { apiClient } from "~/lib/axios";

interface DeletePostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  postid: number;
  title: string;
  username: string;
}

export function DeletePostDialog({
  open,
  onOpenChange,
  postid,
  title,
  username,
}: DeletePostDialogProps) {
  const queryClient = useQueryClient();
  const location = useLocation();
  const navigate = useNavigate();

  const deleteMutation = useMutation({
    mutationFn: () => apiClient.delete(`/api/${username}/posts/${postid}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["userPosts", username] });
      queryClient.removeQueries({
        queryKey: ["post", username, String(postid)],
      });
      onOpenChange(false);
      if (location.pathname === `/${username}/posts/${postid}`) {
        navigate("/", { replace: true });
      }
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="flex flex-col top-0 left-0 translate-x-0 translate-y-0 max-w-none w-full h-dvh rounded-none border-0 p-0 gap-0 sm:top-[50%] sm:left-[50%] sm:translate-x-[-50%] sm:translate-y-[-50%] sm:max-w-sm sm:h-auto sm:rounded-lg sm:border"
      >
        <div className="flex items-center gap-2 px-3 h-14 shrink-0 border-b">
          <DialogClose asChild>
            <Button variant="ghost" size="icon" className="rounded-full shrink-0">
              <X className="size-4" />
            </Button>
          </DialogClose>
          <DialogTitle className="flex-1 text-base font-semibold">
            Delete post
          </DialogTitle>
        </div>

        <div className="flex flex-1 flex-col gap-6 px-6 py-4">
          <div className="flex flex-1 flex-col items-center justify-center gap-3">
            <DialogDescription className="text-center text-base text-foreground">
              Are you sure you want to delete the post titled{" "}
              <span className="font-bold">&ldquo;{title}&rdquo;</span>?
            </DialogDescription>
            {deleteMutation.isError && (
              <p className="text-center text-xs text-destructive">
                Failed to delete post. Please try again.
              </p>
            )}
          </div>
          <div className="grid w-full gap-2 sm:grid-cols-2">
            <Button
              variant="destructive"
              className="w-full rounded-full sm:order-2"
              onClick={() => deleteMutation.mutate()}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting…" : "Delete"}
            </Button>
            <Button
              variant="outline"
              className="w-full rounded-full"
              onClick={() => onOpenChange(false)}
              disabled={deleteMutation.isPending}
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
