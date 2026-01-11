import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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
  return (
    <Card className="gap-0!">
      <form onSubmit={onSubmit}>
        <CardHeader>
          <CardTitle>
            <Input
              type="text"
              placeholder="Give the link a title"
              className="rounded-none! border-0! focus-visible:ring-0! focus-visible:ring-offset-0! shadow-none!"
              {...titleInputProps}
            />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            type="text"
            placeholder="Paste your link here"
            className="rounded-none! border-0! focus-visible:ring-0! focus-visible:ring-offset-0! shadow-none!"
            {...linkInputProps}
          />
          <div className="flex justify-end pt-6">
            <Button type="submit" className="rounded-full">
              Post
            </Button>
          </div>
        </CardContent>
      </form>
    </Card>
  );
}
