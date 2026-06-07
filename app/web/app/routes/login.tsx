import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "~/context/auth-context";
import { apiClient } from "~/lib/axios";
import { AuthLayout } from "~/components/auth-layout";
import { AuthPageHeader } from "~/components/auth-page-header";
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
        err.response?.data?.message ?? "Invalid credentials. Please try again.",
      );
    }
  };

  return (
    <AuthLayout>
      <AuthPageHeader
        heading="Sign in to 0xhype"
        prompt="Don't have an account?"
        linkText="Sign up"
        linkTo="/register"
      />

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
    </AuthLayout>
  );
}
