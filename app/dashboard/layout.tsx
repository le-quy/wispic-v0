import Link from 'next/link'
import { Suspense } from 'react'
import { Logo } from '@/components/logo'
import { AuthButton } from '@/components/auth-button'
import { getSessionUser } from '@/lib/session'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getSessionUser()
  const isAdmin = user?.role === 'admin'

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/dashboard" aria-label="WISPIC — Dashboard">
            <Logo className="transition-opacity hover:opacity-80" />
          </Link>

          <nav className="flex items-center gap-3 sm:gap-6" aria-label="Điều hướng dashboard">
            <Link
              href="/dashboard"
              className="text-xs sm:text-sm font-light text-foreground transition-colors hover:text-terracotta"
            >
              Thiệp của tôi
            </Link>
            {isAdmin && (
              <Link
                href="/dashboard/templates"
                className="text-xs sm:text-sm font-light text-foreground transition-colors hover:text-terracotta"
              >
                Quản lý mẫu
              </Link>
            )}
            <Link
              href="/dashboard/create"
              className="wispic-btn-primary !px-4 sm:!px-5 !py-2 sm:!py-2.5 text-xs sm:text-sm"
            >
              Tạo thiệp mới
            </Link>
            {user ? (
              <>
                {isAdmin ? (
                  <span className="hidden rounded-full bg-terracotta/10 px-3 py-1 text-xs font-light text-terracotta sm:inline-block">
                    Admin
                  </span>
                ) : (
                  <span className="hidden rounded-full bg-secondary px-3 py-1 text-xs font-light text-secondary-foreground sm:inline-block">
                    User
                  </span>
                )}
                <div className="hidden sm:block">
                  <Suspense>
                    <AuthButton />
                  </Suspense>
                </div>
              </>
            ) : (
              <Link
                href="/auth/login"
                className="rounded-full border border-border/70 px-3.5 py-1.5 text-xs font-light text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                Đăng nhập
              </Link>
            )}
          </nav>
        </div>
      </header>

      <main className="w-full flex-1">{children}</main>
    </div>
  )
}
