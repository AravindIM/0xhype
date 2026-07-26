import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useNavigate } from "react-router";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { CreatePostForm } from "@/components/create-post-form";
import { Fab } from "@/components/fab";
import { useAuth } from "~/context/auth-context";
import { useCreatePostForm } from "~/hooks/use-create-post-form";

interface NewPostDialogValue {
  open: () => void;
}

const NewPostDialogContext = createContext<NewPostDialogValue | null>(null);

export function NewPostDialogProvider({ children }: { children: ReactNode }) {
  const { user, isLoading: isAuthLoading } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const { register, onSubmit, reset, isSubmitting, isError, resetSignal } =
    useCreatePostForm({ onSuccess: () => setIsOpen(false) });

  const open = useCallback(() => {
    if (isAuthLoading) return;
    if (!user) {
      navigate("/login");
      return;
    }
    setIsOpen(true);
  }, [isAuthLoading, user, navigate]);

  const close = useCallback(() => {
    reset();
    setIsOpen(false);
  }, [reset]);

  const value = useMemo<NewPostDialogValue>(() => ({ open }), [open]);

  return (
    <NewPostDialogContext.Provider value={value}>
      {children}
      {!isAuthLoading && user && <Fab onClick={open} />}
      <Dialog
        open={isOpen}
        onOpenChange={(o) => {
          if (!o) close();
        }}
      >
        <DialogContent
          showCloseButton={false}
          className="flex flex-col top-0 left-0 translate-x-0 translate-y-0 max-w-none w-full h-dvh rounded-none border-0 p-0 gap-0 sm:top-[50%] sm:left-[50%] sm:translate-x-[-50%] sm:translate-y-[-50%] sm:max-w-md sm:h-auto sm:rounded-lg sm:border"
        >
          <div className="flex items-center gap-2 px-3 h-14 shrink-0 border-b">
            <DialogClose asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full shrink-0"
              >
                <X className="size-4" />
              </Button>
            </DialogClose>
            <DialogTitle className="flex-1 text-base font-semibold">
              New post
            </DialogTitle>
            <Button
              type="submit"
              form="new-post-form"
              size="sm"
              className="rounded-full px-5 shrink-0"
              disabled={!isReady || isSubmitting}
            >
              {isSubmitting ? "Posting…" : "Post"}
            </Button>
          </div>

          <div className="px-6 pt-3 pb-3 min-h-[11.25rem]">
            <CreatePostForm
              formId="new-post-form"
              onReadyChange={setIsReady}
              titleInputProps={register("title")}
              linkInputProps={register("link", { required: true })}
              onSubmit={onSubmit}
              isSubmitting={isSubmitting}
              isError={isError}
              resetSignal={resetSignal}
            />
          </div>
        </DialogContent>
      </Dialog>
    </NewPostDialogContext.Provider>
  );
}

export function useNewPostDialog() {
  const ctx = useContext(NewPostDialogContext);
  if (!ctx)
    throw new Error(
      "useNewPostDialog must be used within NewPostDialogProvider",
    );
  return ctx;
}
