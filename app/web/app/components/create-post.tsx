import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

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
  return (
    <Card className="gap-0! pt-2 pb-3">
      <form onSubmit={onSubmit}>
        <CardHeader>
          <CardTitle>
            <Input
              type="text"
              placeholder="Give it a title"
              className="rounded-none! border-0! focus-visible:ring-0! focus-visible:ring-offset-0! shadow-none! leading-none! p-0 font-semibold"
              {...titleInputProps}
            />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            type="text"
            placeholder="Drop your link here to share it with the world..."
            className="rounded-none! border-0! focus-visible:ring-0! focus-visible:ring-offset-0! shadow-none! leading-none! p-0 font-normal text-sm"
            {...linkInputProps}
            onChange={(e) => setHasLink(Boolean(e.target.value.trim()))}
          />
          <div className="flex justify-end p-0">
            <Button type="submit" className="rounded-full px-12">
              Post
            </Button>
          </div>
        </CardContent>
      </form>
    </Card>
  );
}
