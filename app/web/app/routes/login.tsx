import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useNavigate, Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "~/context/auth-context";
import { apiClient } from "~/lib/axios";
import Logo from "@/assets/logo.svg?react";
import type { Route } from "./+types/login";

interface LoginInput {
  usernameOrEmail: string;
  password: string;
}

export function meta({}: Route.MetaArgs) {
  return [{ title: "Sign in · 0xhype" }];
}

export default function Login() {
  const { user, isLoading, login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<LoginInput>();

  if (isLoading) return null;
  if (user) {
    navigate("/", { replace: true });
    return null;
  }

  const onSubmit: SubmitHandler<LoginInput> = async (data) => {
    setError(null);
    try {
      const res = await apiClient.post("/api/auth/login", data);
      login(res.data);
      navigate("/");
    } catch (err: any) {
      setError(
        err.response?.data?.message ?? "Invalid credentials. Please try again."
      );
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel — desktop only */}
      <div className="hidden md:flex w-1/2 bg-black items-center justify-center p-12">
        <Logo className="w-1/2 h-auto text-white" />
      </div>

      {/* Right panel */}
      <div className="flex-1 flex flex-col p-8 md:px-16 md:py-12">
        {/* Top logo — always visible on right panel */}
        <Logo className="size-8 text-primary mb-10 md:mb-12" />

        {/* Content */}
        <div className="flex flex-col gap-6 max-w-sm">
          <div>
            <p className="hidden md:block text-5xl font-extrabold leading-tight mb-6">
              Latest Hypes all in one place
            </p>
            <h1 className="text-2xl font-bold">Sign in to 0xhype</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Don&apos;t have an account?{" "}
              <Link to="/register" className="underline text-foreground">
                Sign up
              </Link>
            </p>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="usernameOrEmail">Username or Email</Label>
              <Input
                id="usernameOrEmail"
                autoComplete="username"
                {...register("usernameOrEmail", { required: true })}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                {...register("password", { required: true })}
              />
            </div>

            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Signing in…" : "Sign in"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
