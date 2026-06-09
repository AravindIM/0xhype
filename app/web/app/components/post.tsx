import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import type React from "react";
import { Link } from "react-router";
import { Preview, type PreviewProps } from "./preview/preview";

export interface PostProps extends React.ComponentProps<"div"> {
  title: string;
  link: string;
  username: string;
  fullName: string;
  preview?: PreviewProps;
  isPreviewLoading: boolean;
  isPreviewError: boolean;
}

export function Post({
  title,
  link,
  username,
  fullName,
  preview,
  isPreviewLoading = false,
  isPreviewError = false,
  ...props
}: PostProps) {
  return (
    <Card {...props}>
      <CardHeader className="flex flex-row items-center">
        <div className="flex flex-col gap-0.5">
          <CardTitle>{title}</CardTitle>
        </div>
      </CardHeader>

      <CardContent className="px-0">
        <Link to={link} target="_blank" rel="noopener noreferrer">
          <Preview
            link={link}
            title={preview?.title}
            description={preview?.description}
            image={preview?.image}
            siteName={preview?.siteName}
            siteUrl={preview?.siteUrl}
            favicon={preview?.favicon}
            isLoading={isPreviewLoading}
          />
        </Link>
      </CardContent>
      <CardFooter className="flex flex-row items-center py-0">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-1.5 text-xs">
            <span className="font-medium">{fullName}</span>
            <Link
              to={`/profile/${username}`}
              className="text-muted-foreground hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              @{username}
            </Link>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
