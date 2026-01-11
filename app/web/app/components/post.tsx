import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type React from "react";

interface PostProps extends React.ComponentProps<"div"> {
  title: string;
  link: string;
}

export function Post({ title, link, ...props }: PostProps) {
  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{link}</p>
      </CardContent>
    </Card>
  );
}
