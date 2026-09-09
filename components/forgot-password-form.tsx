"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Step = "email" | "otp" | "password";

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        // Cho phép email vẫn có liên kết magic-link thay vì OTP nếu người dùng mở từ email
        options: { shouldCreateUser: false },
      });
      if (error) throw error;
      setStep("otp");
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: "email",
      });
      if (error) throw error;
      setStep("password");
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

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
        onSubmit={
          step === "email"
            ? handleSendOtp
            : step === "otp"
              ? handleVerifyOtp
              : handleResetPassword
        }
        className="flex flex-col gap-5 p-6 md:p-8"
      >
        {step === "email" && (
          <>
            <div className="grid gap-2">
              <Label htmlFor="email" className="text-sm text-foreground">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="ban@thuonghieu.com"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
              {isLoading ? "Đang gửi mã..." : "Gửi mã xác thực"}
            </Button>

            <p className="text-center text-sm font-light text-muted-foreground">
              Nhớ mật khẩu?{" "}
              <Link
                href="/auth/login"
                className="font-medium text-terracotta underline-offset-4 hover:underline"
              >
                Đăng nhập
              </Link>
            </p>
          </>
        )}

        {step === "otp" && (
          <>
            <div className="grid gap-2">
              <Label htmlFor="otp" className="text-sm text-foreground">
                Mã xác thực (OTP)
              </Label>
              <Input
                id="otp"
                type="text"
                inputMode="numeric"
                placeholder="6 chữ số"
                required
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                className="h-11 bg-card text-center text-lg tracking-[0.5em]"
              />
              <p className="text-xs font-light text-muted-foreground">
                Chúng tôi đã gửi một mã OTP đến{" "}
                <span className="text-foreground">{email}</span>. Vui lòng nhập
                mã để tiếp tục.
              </p>
            </div>

            {error && (
              <p className="text-sm font-light text-red-500" role="alert">
                {error}
              </p>
            )}

            <Button
              type="submit"
              className="w-full h-11 rounded-full bg-primary px-7 py-3.5 text-sm font-medium text-primary-foreground transition-all hover:opacity-90"
              disabled={isLoading || otp.length < 6}
            >
              {isLoading ? "Đang xác thực..." : "Xác thực mã"}
            </Button>

            <Button
              type="button"
              variant="ghost"
              className="h-9 text-sm font-light text-muted-foreground"
              onClick={() => {
                setOtp("");
                setError(null);
                setStep("email");
              }}
            >
              Nhập lại email
            </Button>
          </>
        )}

        {step === "password" && (
          <>
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
              <Label
                htmlFor="confirm-password"
                className="text-sm text-foreground"
              >
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
          </>
        )}
      </form>
    </div>
  );
}
