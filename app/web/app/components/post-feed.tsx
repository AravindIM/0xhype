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

const ESTIMATED_POST_HEIGHT = 500;

export function PostFeed({
  posts,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
}: PostFeedProps) {
  const listRef = useRef<HTMLDivElement>(null);
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
                author={post.author}
                date={post.date}
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
