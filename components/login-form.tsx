"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LOCAL_SESSION_EVENT } from "@/lib/session-events";
import { apiFetch } from "@/lib/api-client";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function LoginForm({
  className,
}: React.ComponentPropsWithoutRef<"div">) {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Standard email/password login
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError("Vui lòng nhập đầy đủ email và mật khẩu");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // apiFetch tự unwrap `{data}` và ném ApiError với message sẵn có —
      // không cần đọc `error` thủ công nữa.
      await apiFetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      window.dispatchEvent(new Event(LOCAL_SESSION_EVENT));
      router.push("/dashboard");
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Đăng nhập thất bại");
    } finally {
      setIsLoading(false);
    }
  };

  // Autofill helper for demo accounts
  const fillCredentials = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError(null);
  };

  return (
    <div className={cn("flex flex-col gap-5", className)}>
      {/* 3. Error Banner */}
      {error && (
        <div className="flex items-center gap-2.5 rounded-xl border border-destructive/20 bg-destructive/5 p-3 text-xs text-destructive animate-fade-in">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* 4. Traditional Login Form */}
      <form onSubmit={handleEmailLogin} className="flex flex-col gap-4">
        {/* Email Input */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="login-email" className="text-xs font-medium text-foreground">
            Địa chỉ Email
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground">
              <Mail className="h-4 w-4" strokeWidth={1.75} />
            </div>
            <input
              id="login-email"
              type="email"
              required
              autoComplete="email"
              placeholder="tenban@wispic.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-11 w-full rounded-xl border border-border bg-background pl-10 pr-3.5 text-sm text-foreground placeholder:text-muted-foreground/60 transition focus:border-terracotta focus:outline-none focus:ring-2 focus:ring-terracotta/20 shadow-2xs"
            />
          </div>
        </div>

        {/* Password Input */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="login-password" className="text-xs font-medium text-foreground">
            Mật khẩu
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground">
              <Lock className="h-4 w-4" strokeWidth={1.75} />
            </div>
            <input
              id="login-password"
              type={showPassword ? "text" : "password"}
              required
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-11 w-full rounded-xl border border-border bg-background pl-10 pr-10 text-sm text-foreground placeholder:text-muted-foreground/60 transition focus:border-terracotta focus:outline-none focus:ring-2 focus:ring-terracotta/20 shadow-2xs"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
              aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        {/* Remember me option */}
        <div className="flex items-center justify-between pt-0.5">
          <label className="flex items-center gap-2 text-xs font-light text-muted-foreground cursor-pointer select-none">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-3.5 w-3.5 rounded border-border accent-terracotta cursor-pointer"
            />
            <span>Ghi nhớ đăng nhập</span>
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="group mt-1 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-foreground px-5 text-sm font-medium text-background transition-all hover:bg-foreground/90 active:scale-[0.99] disabled:opacity-50 cursor-pointer shadow-xs"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin text-terracotta" />
              <span>Đang đăng nhập...</span>
            </>
          ) : (
            <>
              <span>Đăng nhập</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </>
          )}
        </button>
      </form>

      {/* 5. Discreet Demo Accounts Quick Fill (Clean & Professional) */}
      <div className="rounded-xl border border-border/60 bg-secondary/30 p-3 text-xs">
        <div className="flex items-center justify-between text-[0.7rem] text-muted-foreground mb-2">
          <span className="font-medium uppercase tracking-wider text-muted-foreground">
            Tài khoản mẫu để trải nghiệm:
          </span>
          <span className="text-[0.65rem] text-terracotta">1-Click điền</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => fillCredentials("admin@local.com", "admin")}
            className="flex flex-col rounded-lg border border-border/80 bg-background/80 p-2 text-left transition hover:border-terracotta/50 hover:bg-secondary/60 cursor-pointer"
          >
            <span className="font-medium text-foreground flex items-center gap-1">
              👑 Quản trị viên
            </span>
            <span className="text-[0.68rem] text-muted-foreground truncate">
              admin@local.com
            </span>
          </button>
          <button
            type="button"
            onClick={() => fillCredentials("user@local.com", "user")}
            className="flex flex-col rounded-lg border border-border/80 bg-background/80 p-2 text-left transition hover:border-terracotta/50 hover:bg-secondary/60 cursor-pointer"
          >
            <span className="font-medium text-foreground flex items-center gap-1">
              👰 Cặp đôi
            </span>
            <span className="text-[0.68rem] text-muted-foreground truncate">
              user@local.com
            </span>
          </button>
        </div>
      </div>

      {/* 6. Footer SignUp Link */}
      <div className="text-center text-xs font-light text-muted-foreground pt-1 border-t border-border/50">
        Chưa có tài khoản?{" "}
        <Link
          href="/auth/sign-up"
          className="font-medium text-terracotta underline-offset-4 hover:underline"
        >
          Đăng ký tạo thiệp miễn phí
        </Link>
      </div>

    </div>
  );
}
