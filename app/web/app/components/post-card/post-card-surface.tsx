import { useState } from "react";
import type React from "react";
import { Globe } from "lucide-react";
import Logo from "@/assets/logo.svg?react";
import { Link } from "react-router";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "~/lib/utils";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import { useImageStatus } from "~/hooks/use-image-status";
import type { PostAuthor, PreviewProps } from "../post-item";
import { PostCardText } from "./post-card-text";
import { VideoPreview } from "./video-preview";
import { isVideoHost } from "~/lib/video";

TimeAgo.addLocale(en);
const timeAgo = new TimeAgo("en-US");

export interface PostCardSurfaceProps {
  link: string;
  title: string;
  author: PostAuthor;
  date: string;
  preview?: PreviewProps;
  previewLoading?: boolean;
  interactive?: boolean;
  showVideo?: boolean;
  menu?: React.ReactNode;
}

function safeHostname(link: string): string | null {
  try {
    return new URL(link).hostname;
  } catch {
    return null;
  }
}

export function PostCardSurface({
  link,
  title,
  author,
  date,
  preview,
  previewLoading,
  interactive = false,
  showVideo = false,
  menu,
}: PostCardSurfaceProps) {
  const { username, displayName, avatarUrl } = author;
  const hostname = safeHostname(link);
  const imageSrc = preview?.image;
  const imageStatus = useImageStatus(imageSrc);
  const faviconSrc = preview?.favicon;
  const faviconStatus = useImageStatus(faviconSrc);
  const [failedImage, setFailedImage] = useState<string | null>(null);
  const [failedFavicon, setFailedFavicon] = useState<string | null>(null);
  const hasImage =
    Boolean(imageSrc) && imageStatus === "loaded" && failedImage !== imageSrc;
  const hasFavicon =
    Boolean(faviconSrc) &&
    faviconStatus === "loaded" &&
    failedFavicon !== faviconSrc;
  const resolving =
    previewLoading ||
    imageStatus === "loading" ||
    (!hasImage && faviconStatus === "loading");

  const previewTitle = preview?.title ?? hostname ?? link;
  const previewDescription = preview?.description ?? link;

  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const mutedText = "text-white/70";
  const strongText = "text-white";

  const authorInner = (
    <>
      <Avatar>
        <AvatarImage src={avatarUrl ?? undefined} alt={displayName} />
        <AvatarFallback className="bg-neutral-800 text-xs text-white font-semibold">
          {initials}
        </AvatarFallback>
      </Avatar>
      <div className="flex min-w-0 flex-col">
        <span className={cn("truncate text-xs font-bold", strongText)}>
          {displayName}
        </span>
        <span className={cn("truncate text-[11px]", mutedText)}>
          @{username}
        </span>
      </div>
    </>
  );

  const pillInner = (
    <>
      {hasFavicon ? (
        <img
          src={faviconSrc}
          alt=""
          className="size-4 shrink-0 rounded-sm object-contain"
          onError={() => setFailedFavicon(faviconSrc ?? null)}
        />
      ) : (
        <Globe className="size-4 shrink-0" />
      )}
      <span className="truncate">{preview?.siteName ?? hostname}</span>
    </>
  );

  return (
    <div className="relative aspect-[5/4] w-full overflow-hidden rounded-xl bg-card">
      {hasImage ? (
        <img
          src={imageSrc}
          alt=""
          className="absolute inset-0 z-0 h-full w-full object-cover"
          loading="eager"
          decoding="async"
          draggable={false}
          onError={() => setFailedImage(imageSrc ?? null)}
        />
      ) : (
        <div className="absolute inset-0 z-0 bg-black">
          {resolving ? (
            <div className="flex h-full w-full items-center justify-center">
              <Logo className="h-auto w-3/5 animate-pulse text-white/60" />
            </div>
          ) : hasFavicon ? (
            <>
              <img
                src={faviconSrc}
                alt=""
                aria-hidden
                className="absolute inset-0 h-full w-full scale-125 object-cover opacity-60 blur-3xl"
                draggable={false}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <img
                  src={faviconSrc}
                  alt=""
                  className="h-full w-full object-cover [image-rendering:smooth] bg-white"
                  draggable={false}
                  onError={() => setFailedFavicon(faviconSrc ?? null)}
                />
              </div>
            </>
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <Logo className="h-auto w-3/5 text-white" />
            </div>
          )}
        </div>
      )}

      {hasImage && showVideo && isVideoHost(hostname) && (
        <VideoPreview link={link} />
      )}

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-[70%] bg-linear-to-t from-black/90 via-black/75 via-45% to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-24 bg-linear-to-b from-black/70 to-transparent" />

      {interactive && (
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          tabIndex={-1}
          aria-hidden="true"
          className="absolute inset-0 z-[15]"
        />
      )}

      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-start gap-3 p-4">
        {interactive ? (
          <Link
            to={`/${username}`}
            className="pointer-events-auto flex min-w-0 items-center gap-2"
          >
            {authorInner}
          </Link>
        ) : (
          <div className="flex min-w-0 items-center gap-2">{authorInner}</div>
        )}
        <time
          dateTime={date}
          suppressHydrationWarning
          className={cn("ml-auto shrink-0 text-xs", mutedText)}
        >
          {timeAgo.format(
            Math.min(new Date(date).getTime(), Date.now()),
            "twitter-minute-now"
          )}
        </time>
        {menu}
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex flex-col gap-3 p-4">
        <PostCardText
          interactive={interactive}
          link={link}
          postTitle={title}
          previewTitle={previewTitle}
          previewDescription={previewDescription}
        />

        {hostname &&
          (interactive ? (
            <a
              href={`https://${hostname}`}
              target="_blank"
              rel="noopener noreferrer"
              className="pointer-events-auto flex w-fit items-center gap-2 rounded-full bg-primary-foreground px-3 py-1.5 text-sm font-medium text-primary transition-colors hover:bg-primary-foreground/90"
            >
              {pillInner}
            </a>
          ) : (
            <span className="flex w-fit items-center gap-2 rounded-full bg-primary-foreground px-3 py-1.5 text-sm font-medium text-primary">
              {pillInner}
            </span>
          ))}
      </div>
    </div>
  );
}
