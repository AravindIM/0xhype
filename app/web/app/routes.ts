import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("register", "routes/register.tsx"),
  route("login", "routes/login.tsx"),
  route(":username/posts/:postid", "routes/post.tsx"),
  route(":username", "routes/profile.tsx"),
] satisfies RouteConfig;
