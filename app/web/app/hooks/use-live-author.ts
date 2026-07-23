import { useAuth } from "~/context/auth-context";
import type { PostAuthor } from "~/components/post-item";

export function useLiveAuthor(author: PostAuthor): PostAuthor {
  const { user } = useAuth();
  if (user?.username === author.username) {
    return {
      username: user.username,
      displayName: user.displayName,
      avatarUrl: user.avatarUrl ?? null,
    };
  }
  return author;
}
