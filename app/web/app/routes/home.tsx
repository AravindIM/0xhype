import type { Route } from "./+types/home";
import { NavBar } from "~/components/navbar";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Hype0" },
    { name: "description", content: "Welcome to Hype0!" },
  ];
}

export default function Home() {
  return (
    <>
      <NavBar />
      <main className="flex items-center justify-center pt-16 pb-4">
        <div className="flex-1 flex flex-col items-center gap-16 min-h-0">
          <div className="max-w-[300px] w-full space-y-6 px-4">
            Welcome to Hype0!
          </div>
        </div>
      </main>
    </>
  );
}
