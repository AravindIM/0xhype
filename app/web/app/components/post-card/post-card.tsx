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
import { useLiveAuthor } from "~/hooks/use-live-author";
import type { PostAuthor, PreviewProps } from "../post-item";
import { PostCardText } from "./post-card-text";

TimeAgo.addLocale(en);
const timeAgo = new TimeAgo("en-US");

export interface PostCardProps extends React.ComponentProps<"div"> {
  title: string;
  link: string;
  author: PostAuthor;
  date: string;
  preview?: PreviewProps;
  previewLoading?: boolean;
}

function safeHostname(link: string): string | null {
  try {
    return new URL(link).hostname;
  } catch {
    return null;
  }
}

export function PostCard({
  title,
  link,
  author,
  date,
  preview,
  previewLoading,
  className,
  ...props
}: PostCardProps) {
  const { username, displayName, avatarUrl } = useLiveAuthor(author);
  const hostname = safeHostname(link);
  const imageStatus = useImageStatus(preview?.image);
  const faviconSrc = preview?.favicon;
  const faviconStatus = useImageStatus(faviconSrc);
  const [renderError, setRenderError] = useState(false);
  const [faviconError, setFaviconError] = useState(false);
  const hasImage = imageStatus === "loaded" && !renderError;
  const hasFavicon = faviconStatus === "loaded" && !faviconError;
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

  return (
    <div className={cn("py-2", className)} {...props}>
      <div className="relative aspect-[5/4] w-full overflow-hidden rounded-xl bg-card">
        {hasImage ? (
          <img
            src={preview!.image}
            alt=""
            className="absolute inset-0 z-0 h-full w-full object-cover"
            loading="eager"
            decoding="async"
            draggable={false}
            onError={() => setRenderError(true)}
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
                    onError={() => setFaviconError(true)}
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

        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-[70%] bg-linear-to-t from-black/90 via-black/75 via-45% to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-24 bg-linear-to-b from-black/70 to-transparent" />

        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          tabIndex={-1}
          aria-hidden="true"
          className="absolute inset-0 z-[15]"
        />

        <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-start gap-3 p-4">
          <Link
            to={`/${username}`}
            className="pointer-events-auto flex min-w-0 items-center gap-2"
          >
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
          </Link>
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
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex flex-col gap-3 p-4">
          <PostCardText
            link={link}
            postTitle={title}
            previewTitle={previewTitle}
            previewDescription={previewDescription}
          />

          {hostname && (
            <a
              href={`https://${hostname}`}
              target="_blank"
              rel="noopener noreferrer"
              className="pointer-events-auto flex w-fit items-center gap-2 rounded-full bg-primary-foreground px-3 py-1.5 text-sm font-medium text-primary transition-colors hover:bg-primary-foreground/90"
            >
              {faviconStatus === "loaded" && faviconSrc && !faviconError ? (
                <img
                  src={faviconSrc}
                  alt=""
                  className="size-4 shrink-0 rounded-sm object-contain"
                  onError={() => setFaviconError(true)}
                />
              ) : (
                <Globe className="size-4 shrink-0" />
              )}
              <span className="truncate">{preview?.siteName ?? hostname}</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
