import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

interface CreatePostProps {
  titleInputProps: React.InputHTMLAttributes<HTMLInputElement>;
  linkInputProps: React.InputHTMLAttributes<HTMLInputElement>;
  onSubmit: React.FormEventHandler<HTMLFormElement>;
}

export function CreatePost({
  titleInputProps,
  linkInputProps,
  onSubmit,
}: CreatePostProps) {
  const [hasLink, setHasLink] = useState(false);
  const [isTitleRevealed, setIsTitleRevealed] = useState(false);

  const scheduleTitleRevealed = () => {
    const delay = 500;
    setTimeout(() => setIsTitleRevealed(true), delay);
  };

  useEffect(() => {
    setIsTitleRevealed(false);
  }, [hasLink]);

  useEffect(() => {});

  return (
    <Card className="gap-0! pt-2 pb-3">
      <form onSubmit={onSubmit}>
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
          <Input
            type="text"
            placeholder="Drop your link here to share it with the world..."
            className="rounded-none! border-0! focus-visible:ring-0! focus-visible:ring-offset-0! shadow-none! leading-none! p-0 font-normal text-sm"
            {...linkInputProps}
            onChange={(e) => setHasLink(Boolean(e.target.value.trim()))}
          />
          <div className="flex justify-end p-0">
            <Button
              type="submit"
              className="rounded-full px-12"
              disabled={!(hasLink && isTitleRevealed)}
            >
              Post
            </Button>
          </div>
        </CardContent>
      </form>
    </Card>
  );
}
