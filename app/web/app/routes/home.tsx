import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Hype0" },
    { name: "description", content: "Welcome to Hype0!" },
  ];
}

export default function Home() {
  return <Welcome />;
}
