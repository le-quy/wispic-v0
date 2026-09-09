import Link from "next/link";
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
    <div className="flex min-h-svh w-full flex-col bg-background">
      <header className="flex w-full justify-center pt-12 md:pt-16">
        <Link href="/" aria-label="WISPIC — Trang chủ">
          <Logo />
        </Link>
      </header>

      <main className="wispic-container flex flex-1 flex-col items-center justify-center py-12 md:py-16">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <p className="wispic-label">{label}</p>
            <h1 className="mt-4 font-serif text-4xl font-medium tracking-tight text-foreground md:text-5xl">
              {title}
            </h1>
            <p className="mx-auto mt-4 max-w-sm text-pretty font-light leading-relaxed text-muted-foreground">
              {description}
            </p>
          </div>
          <div className="wispic-card overflow-hidden shadow-[0_24px_60px_-40px_rgba(41,37,34,0.4)]">
            {children}
          </div>
          <p className="mt-8 text-center text-xs font-light uppercase tracking-[0.28em] text-muted-foreground/70">
            WISPIC — Ghi dấu cảm xúc
          </p>
        </div>
      </main>
    </div>
  );
}
