import type React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Spinner } from "@/components/ui/spinner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CircleXIcon } from "lucide-react";
import { usePreviewByUrl } from "~/hooks/use-preview-by-url";
import { PostPreviewCard } from "@/components/post-card/post-preview-card";
import type { PreviewProps } from "~/components/post-item";

export interface CreatePostFormProps {
  titleInputProps: React.InputHTMLAttributes<HTMLInputElement>;
  linkInputProps: React.InputHTMLAttributes<HTMLInputElement>;
  onSubmit: React.FormEventHandler<HTMLFormElement>;
  isSubmitting: boolean;
  isError: boolean;
  formId?: string;
  onReadyChange?: (ready: boolean) => void;
  resetSignal?: number;
}

function isValidUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

const PREVIEW_DEBOUNCE_MS = 400;

export function CreatePostForm({
  titleInputProps,
  linkInputProps,
  onSubmit,
  isSubmitting,
  isError,
  formId,
  onReadyChange,
  resetSignal,
}: CreatePostFormProps) {
  const [isErrorDismissed, setIsErrorDismissed] = useState(false);
  const [linkValue, setLinkValue] = useState("");
  const [titleValue, setTitleValue] = useState("");
  const [isTitleRevealed, setIsTitleRevealed] = useState(false);
  const [debouncedLink, setDebouncedLink] = useState("");
  const [debouncedTitle, setDebouncedTitle] = useState("");

  const trimmedLink = linkValue.trim();
  const isLinkValid = isValidUrl(trimmedLink);
  const showLinkError = trimmedLink.length > 0 && !isLinkValid;
  const isReady = isLinkValid && isTitleRevealed;

  const isDebouncedLinkValid = isValidUrl(debouncedLink);
  const {
    data: previewData,
    isPending: isPreviewPending,
    isError: isPreviewError,
  } = usePreviewByUrl(debouncedLink, isDebouncedLinkValid);
  const previewFailed =
    isPreviewError || (!isPreviewPending && previewData == null);
  const showPreview = isDebouncedLinkValid && !previewFailed;

  const lastPreviewRef = useRef<{
    link: string;
    title: string;
    preview: PreviewProps | null;
    loading: boolean;
  } | null>(null);
  if (showPreview) {
    lastPreviewRef.current = {
      link: debouncedLink,
      title: debouncedTitle,
      preview: previewData ?? null,
      loading: isPreviewPending,
    };
  }
  const previewSnapshot = lastPreviewRef.current;

  useEffect(() => {
    if (isError) {
      setIsErrorDismissed(false);
    }
  }, [isError]);

  useEffect(() => {
    onReadyChange?.(isReady);
  }, [isReady, onReadyChange]);

  const scheduleTitleRevealed = () => {
    const delay = 500;
    setTimeout(() => setIsTitleRevealed(true), delay);
  };

  useEffect(() => {
    setIsTitleRevealed(false);
  }, [isLinkValid]);

  useEffect(() => {
    if (!isValidUrl(trimmedLink)) {
      setDebouncedLink(trimmedLink);
      return;
    }
    const t = setTimeout(() => setDebouncedLink(trimmedLink), PREVIEW_DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [trimmedLink]);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedTitle(titleValue), PREVIEW_DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [titleValue]);

  const prevResetSignal = useRef(resetSignal);
  useEffect(() => {
    if (resetSignal === prevResetSignal.current) return;
    prevResetSignal.current = resetSignal;
    setLinkValue("");
    setTitleValue("");
    setDebouncedLink("");
    setDebouncedTitle("");
    setIsTitleRevealed(false);
  }, [resetSignal]);

  return (
    <form
      id={formId}
      onSubmit={onSubmit}
      autoComplete="off"
      className="flex flex-col gap-2"
    >
      <AnimatePresence>
        {isLinkValid && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.2 }}
            onAnimationComplete={() => {
              if (isLinkValid) scheduleTitleRevealed();
            }}
          >
            <Input
              type="text"
              placeholder="Give it a title"
              className="rounded-none! border-0! focus-visible:ring-0! focus-visible:ring-offset-0! shadow-none! leading-none! p-0 font-semibold"
              {...titleInputProps}
              onChange={(e) => {
                titleInputProps.onChange?.(e);
                setTitleValue(e.target.value);
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {isError && !isErrorDismissed && (
        <Alert variant="destructive">
          <CircleXIcon />
          <AlertDescription>
            Ground Control didn't receive the transmission. Try again,
            Commander.
          </AlertDescription>
        </Alert>
      )}

      <Input
        type="text"
        placeholder="Drop your link here to share it with the world..."
        className="rounded-none! border-0! focus-visible:ring-0! focus-visible:ring-offset-0! shadow-none! leading-none! p-0 font-normal text-sm"
        {...linkInputProps}
        onChange={(e) => {
          linkInputProps.onChange?.(e);
          setLinkValue(e.target.value);
          setIsErrorDismissed(true);
        }}
        autoCorrect="off"
        spellCheck="false"
        autoCapitalize="false"
      />

      {showLinkError && (
        <p className="text-xs text-destructive">Enter a valid link</p>
      )}

      {!formId && (
        <div className="flex justify-end">
          <Button
            type="submit"
            className="flex w-28 items-center gap-2 rounded-full"
            disabled={!isReady || isSubmitting}
          >
            {isSubmitting && <Spinner data-icon="inline-start" />}
            {isSubmitting ? (
              <div className="w-full justify-center">Posting</div>
            ) : (
              <div className="w-full justify-center">Post</div>
            )}
          </Button>
        </div>
      )}

      <AnimatePresence initial={false}>
        {showPreview && previewSnapshot && (
          <motion.div
            key="preview"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div className="px-2 pt-2">
              <PostPreviewCard
                link={previewSnapshot.link}
                title={previewSnapshot.title}
                preview={previewSnapshot.preview}
                previewLoading={previewSnapshot.loading}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
}
