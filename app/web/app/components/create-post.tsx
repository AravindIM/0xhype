import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Spinner } from "@/components/ui/spinner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CircleXIcon } from "lucide-react";

interface CreatePostProps {
  titleInputProps: React.InputHTMLAttributes<HTMLInputElement>;
  linkInputProps: React.InputHTMLAttributes<HTMLInputElement>;
  onSubmit: React.FormEventHandler<HTMLFormElement>;
  isSubmitting: boolean;
  isError: boolean;
}

export function CreatePost({
  titleInputProps,
  linkInputProps,
  onSubmit,
  isSubmitting,
  isError,
}: CreatePostProps) {
  const [isErrorDismissed, setIsErrorDismissed] = useState(false);
  const [hasLink, setHasLink] = useState(false);
  const [isTitleRevealed, setIsTitleRevealed] = useState(false);

  useEffect(() => {
    if (isError) {
      setIsErrorDismissed(false);
    }
  }, [isError]);

  const scheduleTitleRevealed = () => {
    const delay = 500;
    setTimeout(() => setIsTitleRevealed(true), delay);
  };

  useEffect(() => {
    setIsTitleRevealed(false);
  }, [hasLink]);

  return (
    <Card className="gap-0! pt-2 pb-3">
      <form onSubmit={onSubmit} autoComplete="off">
        <AnimatePresence>
          {hasLink && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.2 }}
              onAnimationComplete={scheduleTitleRevealed}
            >
              <CardHeader className="gap-0!">
                <CardTitle>
                  <Input
                    type="text"
                    placeholder="Give it a title"
                    className="rounded-none! border-0! focus-visible:ring-0! focus-visible:ring-offset-0! shadow-none! leading-none! p-0 font-semibold"
                    {...titleInputProps}
                  />
                </CardTitle>
              </CardHeader>
            </motion.div>
          )}
        </AnimatePresence>
        <CardContent>
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
              setHasLink(Boolean(e.target.value.trim()));
              setIsErrorDismissed(true);
            }}
            autoCorrect="off"
            spellCheck="false"
            autoCapitalize="false"
          />
          <div className="flex justify-end p-0">
            <Button
              type="submit"
              className="flex w-28 items-center gap-2 rounded-full"
              disabled={!(hasLink && isTitleRevealed) || isSubmitting}
            >
              {isSubmitting && <Spinner data-icon="inline-start" />}
              {isSubmitting ? (
                <div className="w-full justify-center">Posting</div>
              ) : (
                <div className="w-full justify-center">Post</div>
              )}
            </Button>
          </div>
        </CardContent>
      </form>
    </Card>
  );
}
