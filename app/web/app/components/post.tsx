import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PostProps {
  title: string;
  link: string;
}

export function Post({ title, link }: PostProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{link}</p>
      </CardContent>
    </Card>
  );
}
