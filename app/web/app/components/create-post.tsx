import { Card } from "@/components/ui/card";
import {
  CreatePostForm,
  type CreatePostFormProps,
} from "@/components/create-post-form";

export function CreatePost(props: CreatePostFormProps) {
  return (
    <Card className="gap-0! px-6 pt-2 pb-3">
      <CreatePostForm {...props} />
    </Card>
  );
}
