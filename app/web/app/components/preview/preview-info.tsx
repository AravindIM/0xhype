import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "lucide-react";
import { motion } from "motion/react";

interface PreviewInfoProps {
  link: string;
  title?: string;
  description?: string;
  siteName?: string;
  siteUrl?: string;
  favicon?: string;
  isLoading?: boolean;
}
export function PreviewInfo({
  link,
  title,
  description,
  siteName,
  siteUrl,
  favicon,
  isLoading = false,
}: PreviewInfoProps) {
  try {
    const url = new URL(link);
    if (!title) title = url.host;
    if (!description) description = link;
    if (!siteUrl && !siteName) siteUrl = url.host;
    const hasPreviewFooterSeparator = Boolean(siteName && siteUrl);
    const animation = isLoading ? "animate-pulse" : "";
    return (
      <Card className="gap-1 px-3">
        <CardHeader className="px-3">
          <CardTitle className={`line-clamp-1 ${animation}`}>{title}</CardTitle>
        </CardHeader>

        <CardContent
          className={`px-3 text-muted-foreground font-medium h-12 line-clamp-2 ${animation}`}
        >
          {description}
        </CardContent>

        <CardFooter className="px-3 pt-1 gap-3 flex flex-row items-center">
          {favicon && !isLoading ? (
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
          ) : (
            <div className={`h-4 w-4 shrink-0 object-contain ${animation}`}>
              <Link className="h-full w-full text-muted-foreground" />
            </div>
          )}

          <div
            className={`text-muted-foreground font-medium line-clamp-1 ${animation}`}
          >
            {siteName}
            {hasPreviewFooterSeparator && <span> &#8226; </span>}
            {siteUrl}
          </div>
        </CardFooter>
      </Card>
    );
  } catch (_) {
    return null;
  }
}
