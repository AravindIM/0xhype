import { Link } from "react-router";

interface AuthPageHeaderProps {
  heading: string;
  prompt: string;
  linkText: string;
  linkTo: string;
}

export function AuthPageHeader({
  heading,
  prompt,
  linkText,
  linkTo,
}: AuthPageHeaderProps) {
  return (
    <div>
      <p className="hidden md:block text-4xl font-extrabold leading-tight mb-4">
        Latest Hypes All In One Place
      </p>
      <h1 className="text-2xl font-bold">{heading}</h1>
      <p className="text-sm text-muted-foreground mt-1">
        {prompt}{" "}
        <Link to={linkTo} className="underline text-foreground">
          {linkText}
        </Link>
      </p>
    </div>
  );
}
