import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function CreatePost({ ...props }: React.ComponentProps<"div">) {
  return (
    <Card className="gap-0!" {...props}>
      <CardHeader>
        <CardTitle>
          <Input
            type="text"
            placeholder="Give the link a title"
            className="rounded-none! border-0! focus-visible:ring-0! focus-visible:ring-offset-0! shadow-none!"
          />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Input
          type="text"
          placeholder="Paste your link here"
          className="rounded-none! border-0! focus-visible:ring-0! focus-visible:ring-offset-0! shadow-none!"
        />
        <div className="flex justify-end pt-6">
          <Button className="rounded-full">Post</Button>
        </div>
      </CardContent>
    </Card>
  );
}
