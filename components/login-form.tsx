"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Sparkles } from "lucide-react";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDevLoading, setIsDevLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Đăng nhập qua API + PostgreSQL (với fallback in-memory)
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Đăng nhập thất bại");
      window.dispatchEvent(new Event("wispic:local-session"));
      router.push("/dashboard");
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Đăng nhập thất bại");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFastDevLogin = async (role: "admin" | "user") => {
    setIsDevLoading(true);
    setError(null);
    try {
      await fetch("/api/auth/dev", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
      window.dispatchEvent(new Event("wispic:local-session"));
      if (role === "admin") {
        router.push("/dashboard/templates");
      } else {
        router.push("/dashboard");
      }
      router.refresh();
    } catch {
      setError("Không thể thiết lập phiên demo");
    } finally {
      setIsDevLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      {/* 1-Click Fast Login for Testing (Bypass Localhost DB) */}
      <div className="rounded-2xl border border-terracotta/30 bg-terracotta/5 p-5">
        <div className="flex items-center gap-2 text-terracotta">
          <Sparkles className="h-4 w-4" />
          <span className="text-xs font-semibold uppercase tracking-wider">
            Bypass Localhost DB (1-Click)
          </span>
        </div>
        <p className="mt-1.5 text-xs font-light text-muted-foreground leading-relaxed">
          Không cần kết nối cơ sở dữ liệu localhost. Bạn có thể kích hoạt phiên làm việc ngay lập tức:
        </p>

        <div className="mt-3.5 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <button
            type="button"
            disabled={isDevLoading}
            onClick={() => handleFastDevLogin("admin")}
            className="flex items-center justify-center gap-2 rounded-full bg-foreground px-4 py-2.5 text-xs font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            <span>👑</span>
            <span>Vào vai Admin</span>
          </button>
          <button
            type="button"
            disabled={isDevLoading}
            onClick={() => handleFastDevLogin("user")}
            className="flex items-center justify-center gap-2 rounded-full border border-border bg-card px-4 py-2.5 text-xs font-medium text-foreground transition-colors hover:bg-secondary disabled:opacity-50"
          >
            <span>👰</span>
            <span>Vào vai Cặp đôi</span>
          </button>
        </div>
      </div>

      <div className="relative text-center text-xs after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
        <span className="relative z-10 bg-background px-2 text-muted-foreground font-light">
          Hoặc đăng nhập thông thường
        </span>
      </div>

      <form onSubmit={handleLogin} className="flex flex-col gap-5">
        <div className="grid gap-2">
          <Label htmlFor="email" className="text-sm text-foreground">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="admin@local.com hoặc user@local.com"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-11 bg-card"
          />
        </div>

        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password" className="text-sm text-foreground">
              Mật khẩu
            </Label>
            <Link
              href="/auth/forgot-password"
              className="ml-auto text-sm font-light text-terracotta underline-offset-4 transition-colors hover:underline"
            >
              Quên mật khẩu?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            placeholder="admin hoặc user"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
          className="w-full rounded-full bg-primary px-7 py-3.5 text-sm font-medium text-primary-foreground transition-all hover:opacity-90 h-11"
          disabled={isLoading || isDevLoading}
        >
          {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
        </Button>

        <p className="text-center text-sm font-light text-muted-foreground">
          Chưa có tài khoản?{" "}
          <Link
            href="/auth/sign-up"
            className="font-medium text-terracotta underline-offset-4 hover:underline"
          >
            Đăng ký
          </Link>
        </p>
      </form>
    </div>
  );
}
