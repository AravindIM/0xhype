import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import { useImagePreload } from "@/hooks/use-image-preload";
import { AnimatePresence, motion } from "motion/react";
import { PreviewImage } from "./preview-image";

export interface PreviewProps {
  title?: string;
  description?: string;
  image?: string;
  siteName?: string;
  siteUrl?: string;
  favicon?: string;
}

export function Preview({
  title,
  description,
  image,
  siteName,
  siteUrl,
  favicon,
}: PreviewProps) {
  const hasPreviewHeader: boolean = Boolean(title);
  const hasPreviewBody: boolean = Boolean(description);
  const hasPreviewFooter = Boolean(favicon || siteName || siteUrl);
  const hasPreviewFooterText = Boolean(siteName || siteUrl);
  const hasPreviewFooterSeparator = Boolean(siteName && siteUrl);

  return (
    <>
      <PreviewImage src={image} />
      <Card className="gap-1 px-3">
        {hasPreviewHeader && (
          <CardHeader className="px-3">
            <CardTitle>{title}</CardTitle>
          </CardHeader>
        )}
        {hasPreviewBody && (
          <CardContent className="px-3 text-muted-foreground font-medium">
            {description}
          </CardContent>
        )}
        {hasPreviewFooter && (
          <CardFooter className="px-3 pt-1 gap-3 flex flex-row items-center">
            {favicon && (
              <motion.img
                src={favicon}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.1, ease: "easeIn" }}
                className="h-4 w-4 shrink-0 object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            )}
            {hasPreviewFooterText && (
              <div className="text-muted-foreground font-medium">
                {siteName}
                {hasPreviewFooterSeparator && <span> &#8226; </span>}
                {siteUrl}
              </div>
            )}
          </CardFooter>
        )}
      </Card>
    </>
  );
}
