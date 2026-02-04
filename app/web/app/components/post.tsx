import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type React from "react";
import { Link } from "react-router";
import { Preview, type PreviewProps } from "./preview";

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
    </Card>
  );
}
