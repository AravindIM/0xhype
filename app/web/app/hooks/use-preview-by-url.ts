import { useQuery } from "@tanstack/react-query";
import { useAuth } from "~/context/auth-context";
import { apiClient } from "~/lib/axios";
import type { PreviewProps } from "~/components/post-item";

export function usePreviewByUrl(link: string, enabled: boolean) {
  const { user } = useAuth();

  return useQuery<PreviewProps | null, Error>({
    queryKey: ["preview", "by-url", link],
    queryFn: async () => {
      const { data } = await apiClient.get(
        `/api/${user!.username}/posts/preview`,
        { params: { url: link }, timeout: 25_000 }
      );
      return data;
    },
    enabled: enabled && Boolean(user),
    staleTime: 3_600_000,
    gcTime: 3_600_000,
    refetchOnWindowFocus: false,
  });
}
