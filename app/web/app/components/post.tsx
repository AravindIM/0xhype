import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type React from "react";
import { Link } from "react-router";
import { cn } from "~/lib/utils";
import { Preview, type PreviewProps } from "./preview";
import { PreviewSkeleton } from "./preview-skeleton";

export interface PostProps extends React.ComponentProps<"div"> {
  title: string;
  link: string;
  preview?: PreviewProps;
  isPreviewLoading: boolean;
  isPreviewError: boolean;
}

export function Post({
  title,
  link,
  preview,
  isPreviewLoading = false,
  isPreviewError = false,
  ...props
}: PostProps) {
  return (
    <Card {...props}>
      <CardHeader className="flex flex-row items-center">
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="px-0">
        {isPreviewLoading ? (
          <PreviewSkeleton />
        ) : isPreviewError || !preview ? (
          <Link to={link} className="text-blue-500 px-6">
            {link}
          </Link>
        ) : (
          <Link to={link} target="_blank" rel="noopener noreferrer">
            <Preview
              title={preview.title}
              description={preview.description}
              image={preview.image}
              siteName={preview.siteName}
              siteUrl={preview.siteUrl}
              favicon={preview.favicon}
            />
          </Link>
        )}
      </CardContent>
    </Card>
  );
}
