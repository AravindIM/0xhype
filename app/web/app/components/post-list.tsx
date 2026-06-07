import { PostItem, type PostItemProps } from "./post-item";

interface PostListProps {
  posts?: PostItemProps[];
}

export function PostList({ posts }: PostListProps) {
  if (!posts || posts.length < 1) return null;
  return posts.map((post) => (
    <PostItem
      postid={post.postid}
      key={post.postid}
      title={post.title}
      link={post.link}
      username={post.username}
      fullName={post.fullName}
      className="w-full"
    />
  ));
}
