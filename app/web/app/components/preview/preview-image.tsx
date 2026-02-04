import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import { Skeleton } from "../ui/skeleton";
import { Link } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useImagePreload } from "~/hooks/use-image-preload";

interface PreviewImageProps {
  src?: string;
  isLoading?: boolean;
}

export function PreviewImage({
  src = "",
  isLoading = false,
}: PreviewImageProps) {
  const aspectRatio = 1.91;
  const isImagePreloaded = useImagePreload(src);

  if (isLoading) {
    return (
      <AspectRatio ratio={aspectRatio} className="rounded-none!">
        <div className="h-full w-full flex items-center justify-center bg-primary">
          <Link className="h-1/2 w-1/2 text-primary-foreground animate-pulse" />
        </div>
      </AspectRatio>
    );
  }
  try {
    const url = new URL(src);
    if (!isImagePreloaded) {
      throw "No image preloaded";
    }
    return (
      <AnimatePresence>
        <AspectRatio ratio={1.91 / 1} className="bg-muted rounded-none!">
          <motion.img
            src={src}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeIn" }}
            className="h-full w-full object-cover"
            loading="eager"
            decoding="async"
            onError={(e) => {
              throw e;
            }}
          />
        </AspectRatio>
      </AnimatePresence>
    );
  } catch (_) {
    return (
      <AspectRatio ratio={1.91 / 1} className="rounded-none!">
        <div className="h-full w-full flex items-center justify-center bg-primary">
          <Link className="h-1/2 w-1/2 text-primary-foreground" />
        </div>
      </AspectRatio>
    );
  }
}
