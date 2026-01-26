import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import { Skeleton } from "@/components/ui/skeleton";

export function PreviewSkeleton() {
  return (
    <>
      <AspectRatio ratio={1.91 / 1} className="rounded-none!">
        <Skeleton className="h-full w-full rounded-none! animate-pulse" />
      </AspectRatio>
      <Card className="gap-2.5 px-3">
        <CardHeader className="px-3">
          <Skeleton className="leading-none h-4  w-3/4 animate-pulse" />
        </CardHeader>

        <CardContent className="px-3 flex flex-col text-muted-foreground font-medium gap-3">
          <Skeleton className="h-4  w-full animate-pulse" />
          <Skeleton className="h-4  w-full animate-pulse" />
        </CardContent>

        <CardFooter className="px-3 pt-1 gap-3 flex flex-row items-center">
          <Skeleton className="h-4  w-4 rounded-sm animate-pulse" />
          <Skeleton className="h-4  w-3/16 animate-pulse" />
        </CardFooter>
      </Card>
    </>
  );
}
