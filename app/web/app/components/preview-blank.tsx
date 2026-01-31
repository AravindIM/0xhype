import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import { Link } from "lucide-react";

interface PreviewBlankProps {
  link: string;
}

export function PreviewBlank({ link }: PreviewBlankProps) {
  try {
    const url = new URL(link);
    const title = url.host;
    return (
      <>
        <AspectRatio ratio={1.91 / 1} className="rounded-none!">
          <div className="h-full w-full flex items-center justify-center bg-primary">
            <Link className="h-1/2 w-1/2 text-primary-foreground" />
          </div>
        </AspectRatio>
        <Card className="gap-1 px-3">
          <CardHeader className="px-3">
            <CardTitle>{title}</CardTitle>
          </CardHeader>

          <CardContent className="px-3 text-muted-foreground font-medium">
            {link}
          </CardContent>

          <CardFooter className="px-3 pt-1 gap-3 flex flex-row items-center">
            <div className="h-4 w-4 shrink-0 object-contain">
              <Link className="h-full w-full text-muted-foreground" />
            </div>
            <div className="text-muted-foreground font-medium">{title}</div>
          </CardFooter>
        </Card>
      </>
    );
  } catch (_) {
    return null;
  }
}
