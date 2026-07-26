import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useAuth } from "~/context/auth-context";
import { apiClient } from "~/lib/axios";

export interface CreatePostInput {
  title: string;
  link: string;
}

export function useCreatePostForm(options?: { onSuccess?: () => void }) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [resetSignal, setResetSignal] = useState(0);

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<CreatePostInput>();

  const mutation = useMutation({
    mutationFn: async (data: CreatePostInput) => {
      await apiClient.post(`/api/${user!.username}/posts`, data);
    },
    onSuccess: () => {
      reset();
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      setResetSignal((n) => n + 1);
      options?.onSuccess?.();
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    await mutation.mutateAsync(data);
  });

  return {
    register,
    onSubmit,
    reset,
    isSubmitting,
    isError: Boolean(mutation.error),
    resetSignal,
  };
}
