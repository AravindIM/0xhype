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
import type { Route } from "./+types/register";

interface RegisterInput {
  firstName: string;
  lastName: string;
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
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        username: data.username,
        password: data.password,
      });
      login(res.data);
      navigate("/");
    } catch (err: any) {
      const msg = err.response?.data?.message;
      setError(Array.isArray(msg) ? msg.join(", ") : (msg ?? "Registration failed. Please try again."));
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
        <Logo className="size-8 text-primary mb-6 md:mb-8" />

        {/* Content */}
        <div className="flex flex-col gap-3 max-w-sm">
          <div>
            <p className="hidden md:block text-4xl font-extrabold leading-tight mb-4">
              Latest Hypes all in one place
            </p>
            <h1 className="text-2xl font-bold">Create your account</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Already have an account?{" "}
              <Link to="/login" className="underline text-foreground">
                Sign in
              </Link>
            </p>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2.5">
            <div className="grid grid-cols-2 gap-2.5">
              <div className="flex flex-col gap-1">
                <Label htmlFor="firstName">First name</Label>
                <Input
                  id="firstName"
                  autoComplete="given-name"
                  {...register("firstName", { required: "Required" })}
                />
                {errors.firstName && (
                  <p className="text-xs text-destructive">{errors.firstName.message}</p>
                )}
              </div>
              <div className="flex flex-col gap-1">
                <Label htmlFor="lastName">Last name</Label>
                <Input
                  id="lastName"
                  autoComplete="family-name"
                  {...register("lastName", { required: "Required" })}
                />
                {errors.lastName && (
                  <p className="text-xs text-destructive">{errors.lastName.message}</p>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                {...register("email", {
                  required: "Required",
                  pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email" },
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
                <p className="text-xs text-destructive">{errors.username.message}</p>
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
                <p className="text-xs text-destructive">{errors.password.message}</p>
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
                <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>
              )}
            </div>

            <Button type="submit" disabled={isSubmitting} className="w-full mt-1">
              {isSubmitting ? "Creating account…" : "Create account"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
