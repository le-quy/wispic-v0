'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Menu, X, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Logo } from '@/components/logo'
import { LOCAL_SESSION_EVENT } from '@/lib/local-auth'

const NAV_LINKS = [
  { label: 'Mẫu thiệp', href: '#mau-thiep' },
  { label: 'Tính năng', href: '#tinh-nang' },
  { label: 'Cách hoạt động', href: '#cach-hoat-dong' },
  { label: 'Bảng giá', href: '#bang-gia' },
  { label: 'Cẩm nang', href: '#cam-nang' },
]

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [authed, setAuthed] = useState(false)
  const router = useRouter()

  // Cập nhật trạng thái scroll cho header nền đổi màu.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Theo dõi session để đổi nút Đăng nhập ↔ Đăng xuất.
  useEffect(() => {
    const sync = async () => {
      try {
        const res = await fetch('/api/auth/me', { cache: 'no-store' })
        setAuthed(res.ok)
      } catch {
        setAuthed(false)
      }
    }
    sync()
    window.addEventListener(LOCAL_SESSION_EVENT, sync)
    return () => window.removeEventListener(LOCAL_SESSION_EVENT, sync)
  }, [])

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    window.dispatchEvent(new Event(LOCAL_SESSION_EVENT))
    setAuthed(false)
    setOpen(false)
    router.refresh()
    router.push('/')
  }

  const close = () => setOpen(false)

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-500',
        scrolled
          ? 'border-b border-border/60 bg-background/80 backdrop-blur-md'
          : 'border-b border-transparent bg-transparent',
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 md:h-20 md:px-8">
        <a href="#top" className="group" aria-label="WISPIC trang chủ">
          <Logo className="transition-opacity group-hover:opacity-80" />
        </a>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Điều hướng chính">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-light text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-5 lg:flex">
          {authed ? (
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 text-sm font-light text-muted-foreground transition-colors hover:text-foreground"
            >
              <LogOut className="h-4 w-4" strokeWidth={1.6} />
              Đăng xuất
            </button>
          ) : (
            <Link
              href="/auth/login"
              className="text-sm font-light text-muted-foreground transition-colors hover:text-foreground"
            >
              Đăng nhập
            </Link>
          )}
          <Link href="/dashboard/create" className="wispic-btn-primary">
            Tạo thiệp ngay
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full text-foreground lg:hidden"
          aria-label={open ? 'Đóng menu' : 'Mở menu'}
          aria-expanded={open}
        >
          {open ? <Menu className="h-5 w-5 opacity-0" /> : null}
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          'overflow-hidden border-t border-border/60 bg-background/95 backdrop-blur-md transition-[max-height,opacity] duration-500 lg:hidden',
          open ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0',
        )}
      >
        <nav className="flex flex-col gap-1 px-5 py-4" aria-label="Điều hướng di động">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={close}
              className="rounded-lg px-3 py-3 text-base font-light text-foreground/90 transition-colors hover:bg-secondary"
            >
              {link.label}
            </a>
          ))}
          <div className="mt-2 flex flex-col gap-2 px-1">
            {authed ? (
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center justify-center gap-1.5 rounded-full border border-border px-5 py-3 text-center text-sm font-medium text-foreground"
              >
                <LogOut className="h-4 w-4" strokeWidth={1.6} />
                Đăng xuất
              </button>
            ) : (
              <Link
                href="/auth/login"
                onClick={close}
                className="rounded-full border border-border px-5 py-3 text-center text-sm font-medium text-foreground"
              >
                Đăng nhập
              </Link>
            )}
            <Link
              href="/dashboard/create"
              onClick={close}
              className="rounded-full bg-primary px-5 py-3 text-center text-sm font-medium text-primary-foreground"
            >
              Tạo thiệp ngay
            </Link>
          </div>
        </nav>
      </div>
    </header>
  )
}