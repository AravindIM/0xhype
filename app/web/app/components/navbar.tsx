import { Link } from "react-router";

export function NavBar() {
  return (
    <nav className="flex items-center justify-between p-4 bg-background border-b">
      <Link to="/" className="text-xl font-bold">
        0xhype
      </Link>
    </nav>
  );
}
