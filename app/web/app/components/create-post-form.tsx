import type React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Spinner } from "@/components/ui/spinner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CircleXIcon } from "lucide-react";

export interface CreatePostFormProps {
  titleInputProps: React.InputHTMLAttributes<HTMLInputElement>;
  linkInputProps: React.InputHTMLAttributes<HTMLInputElement>;
  onSubmit: React.FormEventHandler<HTMLFormElement>;
  isSubmitting: boolean;
  isError: boolean;
  formId?: string;
  onReadyChange?: (ready: boolean) => void;
}

function isValidUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function CreatePostForm({
  titleInputProps,
  linkInputProps,
  onSubmit,
  isSubmitting,
  isError,
  formId,
  onReadyChange,
}: CreatePostFormProps) {
  const [isErrorDismissed, setIsErrorDismissed] = useState(false);
  const [linkValue, setLinkValue] = useState("");
  const [isTitleRevealed, setIsTitleRevealed] = useState(false);

  const trimmedLink = linkValue.trim();
  const isLinkValid = isValidUrl(trimmedLink);
  const showLinkError = trimmedLink.length > 0 && !isLinkValid;
  const isReady = isLinkValid && isTitleRevealed;

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
            onAnimationComplete={scheduleTitleRevealed}
          >
            <Input
              type="text"
              placeholder="Give it a title"
              className="rounded-none! border-0! focus-visible:ring-0! focus-visible:ring-offset-0! shadow-none! leading-none! p-0 font-semibold"
              {...titleInputProps}
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
    </form>
  );
}
