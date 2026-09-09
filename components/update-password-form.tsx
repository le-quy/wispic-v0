"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function UpdatePasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      router.push("/dashboard");
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form
        onSubmit={handleResetPassword}
        className="flex flex-col gap-5 p-6 md:p-8"
      >
        <div className="grid gap-2">
          <Label htmlFor="password" className="text-sm text-foreground">
            Mật khẩu mới
          </Label>
          <Input
            id="password"
            type="password"
            placeholder="Tạo mật khẩu mới"
            required
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-11 bg-card"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="confirm-password" className="text-sm text-foreground">
            Xác nhận mật khẩu
          </Label>
          <Input
            id="confirm-password"
            type="password"
            placeholder="Nhập lại mật khẩu mới"
            required
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="h-11 bg-card"
          />
        </div>

        {error && (
          <p className="text-sm font-light text-red-500" role="alert">
            {error}
          </p>
        )}

        <Button
          type="submit"
          className="w-full h-11 rounded-full bg-primary px-7 py-3.5 text-sm font-medium text-primary-foreground transition-all hover:opacity-90"
          disabled={isLoading}
        >
          {isLoading ? "Đang lưu..." : "Đặt lại mật khẩu"}
        </Button>
      </form>
    </div>
  );
}
