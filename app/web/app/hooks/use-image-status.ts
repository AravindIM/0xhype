import { useEffect, useState } from "react";

export type ImageStatus = "loading" | "loaded" | "error";

export function useImageStatus(src?: string): ImageStatus {
  const [status, setStatus] = useState<ImageStatus>("loading");

  useEffect(() => {
    if (!src) {
      setStatus("error");
      return;
    }
    let cancelled = false;
    setStatus("loading");
    const img = new Image();
    img.onload = () => {
      if (!cancelled) setStatus("loaded");
    };
    img.onerror = () => {
      if (!cancelled) setStatus("error");
    };
    img.src = src;
    return () => {
      cancelled = true;
    };
  }, [src]);

  return status;
}
