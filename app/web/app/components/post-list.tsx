import { Post, type PostProps } from "./post";

interface PostListProps {
  posts?: PostProps[];
}

export function PostList({ posts }: PostListProps) {
  if (!posts || posts.length < 1) return null;
  return posts.map((post) => (
    <Post
      key={post.link}
      title={post.title}
      link={post.link}
      preview={post.preview}
      className="w-full"
    />
  ));
}
