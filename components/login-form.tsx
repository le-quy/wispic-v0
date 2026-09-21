"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  Loader2,
  CheckCircle2,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" width="20" height="20">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
}

function GmailIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
    </svg>
  );
}

export function LoginForm({
  className,
}: React.ComponentPropsWithoutRef<"div">) {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Google / Gmail modal state
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [gmailInput, setGmailInput] = useState("leanhquyqn22@gmail.com");

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
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Email hoặc mật khẩu không chính xác");
      }
      window.dispatchEvent(new Event("wispic:local-session"));
      router.push("/dashboard");
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Đăng nhập thất bại");
    } finally {
      setIsLoading(false);
    }
  };

  // Google / Gmail sign in
  const handleGoogleLogin = async (selectedEmail?: string) => {
    const targetEmail = (selectedEmail || gmailInput || "leanhquyqn22@gmail.com").trim();
    setIsGoogleLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: targetEmail,
          name: targetEmail.split("@")[0] || "Người dùng Google",
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Không thể đăng nhập bằng tài khoản Google");
      }

      window.dispatchEvent(new Event("wispic:local-session"));
      setShowGoogleModal(false);
      router.push("/dashboard");
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Đăng nhập bằng Gmail thất bại");
    } finally {
      setIsGoogleLoading(false);
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
      {/* 1. Gmail / Google Sign-In (Primary Social Button) */}
      <div className="flex flex-col gap-2.5">
        <button
          type="button"
          disabled={isGoogleLoading || isLoading}
          onClick={() => setShowGoogleModal(true)}
          className="group relative flex w-full items-center justify-center gap-3 rounded-xl border border-border/90 bg-background px-4 py-3 text-sm font-medium text-foreground shadow-xs transition-all hover:border-terracotta/50 hover:bg-secondary/40 active:scale-[0.99] disabled:pointer-events-none disabled:opacity-60 cursor-pointer"
        >
          {isGoogleLoading ? (
            <Loader2 className="h-5 w-5 animate-spin text-terracotta" />
          ) : (
            <GoogleIcon className="h-5 w-5 shrink-0 transition-transform group-hover:scale-110 duration-200" />
          )}
          <span className="font-medium tracking-tight">
            {isGoogleLoading ? "Đang xác thực Google..." : "Đăng nhập bằng Gmail"}
          </span>
          <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-red-500/10 px-2 py-0.5 text-[0.65rem] font-medium text-red-600 dark:text-red-400">
            <GmailIcon className="h-3 w-3" />
            Google
          </span>
        </button>
      </div>

      {/* 2. Visual Divider */}
      <div className="relative my-1 text-center text-xs after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border/70">
        <span className="relative z-10 bg-card px-3 font-light text-muted-foreground">
          hoặc đăng nhập bằng Email
        </span>
      </div>

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
          <div className="flex items-center justify-between">
            <label htmlFor="login-password" className="text-xs font-medium text-foreground">
              Mật khẩu
            </label>
            <Link
              href="/auth/forgot-password"
              className="text-xs font-light text-terracotta transition hover:underline"
            >
              Quên mật khẩu?
            </Link>
          </div>
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
          disabled={isLoading || isGoogleLoading}
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

      {/* Google / Gmail Sign In Modal */}
      {showGoogleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-fade-in">
          <div className="relative w-full max-w-sm rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-2xl animate-scale-up">
            <button
              type="button"
              onClick={() => setShowGoogleModal(false)}
              className="absolute right-3.5 top-3.5 rounded-full p-1 text-muted-foreground hover:bg-secondary hover:text-foreground transition"
              aria-label="Đóng"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Google Header */}
            <div className="flex flex-col items-center text-center gap-2 pt-1">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-background border border-border shadow-xs">
                <GoogleIcon className="h-6 w-6" />
              </div>
              <h3 className="font-serif text-lg font-medium text-foreground">
                Đăng nhập với Google
              </h3>
              <p className="text-xs text-muted-foreground">
                Chọn tài khoản Gmail để kết nối trực tiếp với WISPIC
              </p>
            </div>

            {/* Accounts options */}
            <div className="mt-4 flex flex-col gap-2">
              {/* Detected primary Google account */}
              <button
                type="button"
                disabled={isGoogleLoading}
                onClick={() => handleGoogleLogin("leanhquyqn22@gmail.com")}
                className="flex items-center gap-3 rounded-xl border border-terracotta/40 bg-terracotta/5 p-3 text-left transition hover:bg-terracotta/10 active:scale-[0.99] cursor-pointer"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-terracotta text-white font-serif text-sm font-semibold">
                  Q
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-semibold text-foreground truncate">
                    Lê Anh Quý
                  </div>
                  <div className="text-[0.7rem] text-muted-foreground truncate">
                    leanhquyqn22@gmail.com
                  </div>
                </div>
                <CheckCircle2 className="h-4 w-4 text-terracotta shrink-0" />
              </button>

              {/* Custom Gmail Input option */}
              <div className="mt-2 pt-2 border-t border-border/60">
                <label htmlFor="custom-gmail" className="text-[0.7rem] text-muted-foreground block mb-1">
                  Hoặc nhập địa chỉ Gmail khác:
                </label>
                <div className="flex gap-2">
                  <input
                    id="custom-gmail"
                    type="email"
                    value={gmailInput}
                    onChange={(e) => setGmailInput(e.target.value)}
                    placeholder="tenban@gmail.com"
                    className="h-9 flex-1 rounded-lg border border-border bg-background px-2.5 text-xs text-foreground focus:border-terracotta focus:outline-none"
                  />
                  <button
                    type="button"
                    disabled={isGoogleLoading || !gmailInput.trim()}
                    onClick={() => handleGoogleLogin(gmailInput)}
                    className="h-9 rounded-lg bg-foreground px-3 text-xs font-medium text-background hover:bg-foreground/90 disabled:opacity-50 transition"
                  >
                    {isGoogleLoading ? "..." : "Vào ngay"}
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => setShowGoogleModal(false)}
                className="text-xs font-light text-muted-foreground hover:text-foreground underline underline-offset-2"
              >
                Quay lại hình thức khác
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
