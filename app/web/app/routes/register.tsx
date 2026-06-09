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
import type { Route } from "./+types/register";

interface RegisterInput {
  displayName: string;
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
}

export function meta({}: Route.MetaArgs) {
  return [{ title: "Create account · 0xhype" }];
}

export default function Register() {
  const { user, isLoading, login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { isSubmitting, errors },
  } = useForm<RegisterInput>();

  const password = watch("password");

  if (isLoading) return null;
  if (user) {
    navigate("/", { replace: true });
    return null;
  }

  const onSubmit: SubmitHandler<RegisterInput> = async (data) => {
    setError(null);
    try {
      const res = await apiClient.post("/api/auth/register", {
        displayName: data.displayName,
        email: data.email,
        username: data.username,
        password: data.password,
      });
      login(res.data);
      navigate("/");
    } catch (err: any) {
      const msg = err.response?.data?.message;
      setError(
        Array.isArray(msg)
          ? msg.join(", ")
          : (msg ?? "Registration failed. Please try again."),
      );
    }
  };

  return (
    <AuthLayout>
      <AuthPageHeader
        heading="Create your account"
        prompt="Already have an account?"
        linkText="Sign in"
        linkTo="/login"
      />

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-2.5"
      >
        <div className="flex flex-col gap-1">
          <Label htmlFor="displayName">Name</Label>
          <Input
            id="displayName"
            autoComplete="name"
            {...register("displayName", { required: "Required" })}
          />
          {errors.displayName && (
            <p className="text-xs text-destructive">
              {errors.displayName.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            {...register("email", {
              required: "Required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Invalid email",
              },
            })}
          />
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            autoComplete="username"
            {...register("username", {
              required: "Required",
              minLength: { value: 3, message: "At least 3 characters" },
              maxLength: { value: 20, message: "At most 20 characters" },
            })}
          />
          {errors.username && (
            <p className="text-xs text-destructive">
              {errors.username.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            {...register("password", {
              required: "Required",
              minLength: { value: 8, message: "At least 8 characters" },
              validate: {
                hasNumber: (v) => /\d/.test(v) || "Must contain a number",
                hasSpecial: (v) =>
                  /[^A-Za-z0-9]/.test(v) || "Must contain a special character",
              },
            })}
          />
          {errors.password && (
            <p className="text-xs text-destructive">
              {errors.password.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <Label htmlFor="confirmPassword">Confirm password</Label>
          <Input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            {...register("confirmPassword", {
              required: "Required",
              validate: (v) => v === password || "Passwords do not match",
            })}
          />
          {errors.confirmPassword && (
            <p className="text-xs text-destructive">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <Button type="submit" disabled={isSubmitting} className="w-full mt-1">
          {isSubmitting ? "Creating account…" : "Create account"}
        </Button>
      </form>
    </AuthLayout>
  );
}
