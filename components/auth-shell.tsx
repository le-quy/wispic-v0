import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Logo } from "@/components/logo";

export function AuthShell({
  label,
  title,
  description,
  children,
}: {
  label: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-svh w-full flex-col bg-background selection:bg-terracotta/20 selection:text-terracotta overflow-x-hidden">
      {/* Subtle Warm Lighting Background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(55% 45% at 50% 10%, rgba(169,87,63,0.08), transparent 70%), radial-gradient(40% 35% at 90% 85%, rgba(217,120,50,0.06), transparent 70%)",
        }}
      />

      {/* Top Header with Back link and Brand */}
      <header className="w-full max-w-6xl mx-auto flex items-center justify-between px-6 pt-8 md:pt-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-light text-muted-foreground transition-colors hover:text-foreground group"
        >
          <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5 text-terracotta" />
          <span>Trang chủ</span>
        </Link>
        <Link href="/" aria-label="WISPIC — Trang chủ" className="transition-opacity hover:opacity-85">
          <Logo />
        </Link>
        <div className="w-16 sm:w-20" aria-hidden />
      </header>

      {/* Main Form Centerpiece */}
      <main className="wispic-container flex flex-1 flex-col items-center justify-center py-10 md:py-14">
        <div className="w-full max-w-[440px]">
          <div className="mb-6 sm:mb-8 text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-terracotta/30 bg-terracotta/5 px-3 py-1 text-[0.7rem] font-medium uppercase tracking-[0.22em] text-terracotta">
              <span className="h-1.5 w-1.5 rounded-full bg-terracotta animate-pulse" />
              {label}
            </span>
            <h1 className="mt-4 font-serif text-3xl sm:text-4xl font-medium tracking-tight text-foreground">
              {title}
            </h1>
            <p className="mx-auto mt-2.5 max-w-sm text-pretty text-xs sm:text-sm font-light leading-relaxed text-muted-foreground">
              {description}
            </p>
          </div>

          <div className="wispic-card p-6 sm:p-8 rounded-2xl border border-border/80 bg-card/95 shadow-[0_20px_50px_-25px_rgba(41,37,34,0.25)] backdrop-blur-md">
            {children}
          </div>

          <div className="mt-6 text-center">
            <p className="text-[0.72rem] font-light text-muted-foreground/80 tracking-wide">
              WISPIC Studio · Nền tảng thiệp cưới trực tuyến cao cấp
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

