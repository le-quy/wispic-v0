import Link from 'next/link'
import { redirect } from 'next/navigation'
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
  if (!user) {
    redirect('/auth/login')
  }

  const isAdmin = user.role === 'admin'

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 md:px-8">
          <Link href="/dashboard" aria-label="WISPIC — Dashboard">
            <Logo className="transition-opacity hover:opacity-80" />
          </Link>

          <nav className="flex items-center gap-6" aria-label="Điều hướng dashboard">
            <Link
              href="/dashboard"
              className="text-sm font-light text-foreground transition-colors hover:text-terracotta"
            >
              Thiệp của tôi
            </Link>
            {isAdmin && (
              <Link
                href="/dashboard/templates"
                className="text-sm font-light text-foreground transition-colors hover:text-terracotta"
              >
                Quản lý mẫu
              </Link>
            )}
            <Link
              href="/dashboard/create"
              className="wispic-btn-primary !px-5 !py-2.5"
            >
              Tạo thiệp mới
            </Link>
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
          </nav>
        </div>
      </header>

      <main className="wispic-container flex-1 py-10 md:py-14">{children}</main>
    </div>
  )
}