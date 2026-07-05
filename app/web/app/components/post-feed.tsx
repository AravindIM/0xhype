import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useWindowVirtualizer } from "@tanstack/react-virtual";
import { PostItem, type PostItemProps } from "./post-item";
import { LoadingPosts } from "./loading-posts";

interface PostFeedProps {
  posts: PostItemProps[];
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
}

// Rough starting guess for a post card (image + text). Real heights are measured
// per row via `measureElement`, so this only affects the very first paint.
const ESTIMATED_POST_HEIGHT = 450;

/**
 * Window-virtualized, infinitely-scrolling feed shared by the home and profile
 * routes. Only the posts near the viewport are mounted, so the number of live
 * `PostItem`s (each with its own preview query + image preload) stays bounded
 * no matter how deep the feed grows — this is what prevents the main-thread
 * freeze that rendering the whole list caused.
 */
export function PostFeed({
  posts,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
}: PostFeedProps) {
  const listRef = useRef<HTMLDivElement>(null);
  // Absolute offset of the list from the top of the document. Kept in state (not
  // a ref) so updating it re-renders and the virtualizer picks up the correct
  // scrollMargin — otherwise rows are mispositioned beneath the navbar/header.
  const [listOffset, setListOffset] = useState(0);

  useLayoutEffect(() => {
    if (!listRef.current) return;
    const measure = () =>
      setListOffset(
        listRef.current!.getBoundingClientRect().top + window.scrollY
      );
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const virtualizer = useWindowVirtualizer({
    count: posts.length,
    estimateSize: () => ESTIMATED_POST_HEIGHT,
    overscan: 5,
    scrollMargin: listOffset,
    getItemKey: (index) => posts[index].postid,
  });

  const virtualItems = virtualizer.getVirtualItems();

  // Auto-load the next page when the last row enters the (overscanned) window.
  useEffect(() => {
    const last = virtualItems[virtualItems.length - 1];
    if (!last) return;
    if (last.index >= posts.length - 1 && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [
    virtualItems,
    posts.length,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  ]);

  return (
    <div ref={listRef} className="w-full">
      <div
        className="relative w-full"
        style={{ height: virtualizer.getTotalSize() }}
      >
        {virtualItems.map((row) => {
          const post = posts[row.index];
          return (
            <div
              key={row.key}
              data-index={row.index}
              ref={virtualizer.measureElement}
              className="absolute top-0 left-0 w-full"
              style={{
                transform: `translateY(${
                  row.start - virtualizer.options.scrollMargin
                }px)`,
              }}
            >
              <PostItem
                postid={post.postid}
                title={post.title}
                link={post.link}
                username={post.username}
                displayName={post.displayName}
                className="w-full"
              />
            </div>
          );
        })}
      </div>
      {isFetchingNextPage && <LoadingPosts />}
    </div>
  );
}
