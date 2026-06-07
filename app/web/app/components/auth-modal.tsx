import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "~/context/auth-context";
import { apiClient } from "~/lib/axios";

interface LoginInput {
  usernameOrEmail: string;
  password: string;
}

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AuthModal({ open, onOpenChange }: AuthModalProps) {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<LoginInput>();

  const onSubmit: SubmitHandler<LoginInput> = async (data) => {
    setError(null);
    try {
      const res = await apiClient.post("/api/auth/login", data);
      login(res.data);
      reset();
      onOpenChange(false);
    } catch (err: any) {
      setError(
        err.response?.data?.message ?? "Invalid credentials. Please try again."
      );
    }
  };

  const handleOpenChange = (val: boolean) => {
    reset();
    setError(null);
    onOpenChange(val);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-xl">Sign in to 0xhype</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

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

        <p className="text-sm text-center text-muted-foreground">
          Don&apos;t have an account?{" "}
          <button
            type="button"
            className="underline text-foreground"
            onClick={() => {
              handleOpenChange(false);
              navigate("/register");
            }}
          >
            Sign up
          </button>
        </p>
      </DialogContent>
    </Dialog>
  );
}
