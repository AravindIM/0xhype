import { useEffect, useState } from "react";

export function useImagePreload(src?: string) {
  const [isPreloaded, setIsPreLoaded] = useState(false);

  useEffect(() => {
    if (!src) return;
    const image = new Image();
    image.src = src;

    if (image.complete) {
      setIsPreLoaded(true);
    } else {
      image.onload = () => setIsPreLoaded(true);
      image.onerror = () => setIsPreLoaded(true);
    }
  }, [src]);

  return isPreloaded;
}
