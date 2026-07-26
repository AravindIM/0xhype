import { useEffect, useState } from "react";

export type ImageStatus = "loading" | "loaded" | "error";

interface ImageState {
  src?: string;
  status: ImageStatus;
}

export function useImageStatus(src?: string): ImageStatus {
  const [state, setState] = useState<ImageState>({ src, status: "loading" });

  useEffect(() => {
    if (!src) {
      setState({ src, status: "error" });
      return;
    }
    let cancelled = false;
    setState({ src, status: "loading" });
    const img = new Image();
    img.onload = () => {
      if (!cancelled) setState({ src, status: "loaded" });
    };
    img.onerror = () => {
      if (!cancelled) setState({ src, status: "error" });
    };
    img.src = src;
    return () => {
      cancelled = true;
    };
  }, [src]);

  if (state.src !== src) return src ? "loading" : "error";
  return state.status;
}
