import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useNavigate, Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "~/context/auth-context";
import { apiClient } from "~/lib/axios";
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
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { isSubmitting, errors },
  } = useForm<RegisterInput>();

  const password = watch("password");

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
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-sm flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold">Create your account</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Already have an account?{" "}
            <Link to="/" className="underline text-foreground">
              Sign in
            </Link>
          </p>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
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
            <div className="flex flex-col gap-1.5">
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

          <div className="flex flex-col gap-1.5">
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

          <div className="flex flex-col gap-1.5">
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

          <div className="flex flex-col gap-1.5">
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

          <div className="flex flex-col gap-1.5">
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

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Creating account…" : "Create account"}
          </Button>
        </form>
      </div>
    </div>
  );
}
