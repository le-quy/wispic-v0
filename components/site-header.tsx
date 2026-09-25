'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Menu, X, ArrowUpRight, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Logo } from '@/components/logo'
import { LOCAL_SESSION_EVENT } from '@/lib/local-auth'
import { InquiryDialog } from '@/components/inquiry-dialog'
import { useLanguage } from '@/lib/language-context'

export function SiteHeader() {
  const { language, setLanguage, t } = useLanguage()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [authed, setAuthed] = useState(false)
  const [inquiryOpen, setInquiryOpen] = useState(false)
  const router = useRouter()

  const navLinks = [
    {
      label: t('Nhiếp ảnh', 'Photography'),
      href: '#photography',
      subtitle: t('Bộ sưu tập', 'Gallery'),
    },
    {
      label: t('Khám phá', 'Explore'),
      href: '#explore',
      subtitle: t('Du hành & Ký ức', 'Travel & Stories'),
    },
    {
      label: t('Thiệp cưới', 'Wedding'),
      href: '#wedding',
      subtitle: t('Thiệp online', 'Invitations'),
    },
    {
      label: t('Phong cách', 'Style'),
      href: '#style',
      subtitle: t('Định hình thị giác', 'Visual Explorer'),
    },
    {
      label: t('Nhật ký', 'Journal'),
      href: '#journal',
      subtitle: t('Tạp chí biên tập', 'Editorial'),
    },
    {
      label: t('Dịch vụ', 'Services'),
      href: '#services',
      subtitle: t('Studio thực hành', 'Studio'),
    },
  ]

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

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

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-40 transition-all duration-500',
          scrolled
            ? 'border-b border-sand/60 bg-[#F7F2E9]/90 backdrop-blur-md py-3'
            : 'border-b border-transparent bg-transparent py-5 md:py-6',
        )}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 lg:px-12">
          {/* Brand & Editorial Issue mark */}
          <div className="flex items-center gap-6">
            <a href="#top" className="group flex items-center gap-3" aria-label="WISPIC — Stories worth remembering">
              <Logo showMark className="transition-opacity group-hover:opacity-85" />
            </a>

            <div className="hidden items-center gap-2 text-[10px] font-light uppercase tracking-[0.25em] text-earth/70 lg:flex">
              <span className="h-1 w-1 rounded-full bg-tangerine" aria-hidden />
              <span>{t('Tập IV · Studio Nhiếp ảnh Đương đại', 'Vol. IV · Contemporary Studio')}</span>
            </div>
          </div>

          {/* Desktop Editorial Navigation */}
          <nav className="hidden items-center gap-7 md:flex" aria-label={t('Điều hướng chính', 'Main Navigation')}>
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="group relative text-xs font-light tracking-[0.14em] uppercase text-charcoal/80 transition-colors hover:text-charcoal"
              >
                <span>{link.label}</span>
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-terracotta transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>

          {/* Right Action Cluster */}
          <div className="hidden items-center gap-5 lg:flex">
            {/* Language Selector */}
            <div
              className="flex items-center gap-1 border-r border-sand/80 pr-4 text-[11px] font-mono tracking-wider"
              aria-label={t('Chọn ngôn ngữ', 'Language selector')}
            >
              <button
                type="button"
                onClick={() => setLanguage('vi')}
                className={cn(
                  'px-1.5 py-0.5 transition-colors',
                  language === 'vi'
                    ? 'font-semibold text-charcoal border-b-2 border-terracotta'
                    : 'text-earth/60 hover:text-charcoal'
                )}
                title="Tiếng Việt"
              >
                VI
              </button>
              <span className="text-[10px] text-earth/30">/</span>
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={cn(
                  'px-1.5 py-0.5 transition-colors',
                  language === 'en'
                    ? 'font-semibold text-charcoal border-b-2 border-terracotta'
                    : 'text-earth/60 hover:text-charcoal'
                )}
                title="English"
              >
                EN
              </button>
            </div>

            <button
              type="button"
              onClick={() => setInquiryOpen(true)}
              className="text-xs font-light uppercase tracking-[0.16em] text-earth transition-colors hover:text-charcoal"
            >
              {t('Hợp tác', 'Work with Us')}
            </button>

            <Link
              href="/dashboard/create"
              className="group inline-flex items-center gap-2 border border-charcoal bg-charcoal px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-[#F7F2E9] transition-all hover:bg-transparent hover:text-charcoal"
            >
              <span>{t('Tạo thiệp cưới', 'Create Invitation')}</span>
              <ArrowUpRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>

            {authed ? (
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 text-xs font-light uppercase tracking-[0.14em] text-earth/80 transition-colors hover:text-charcoal"
                title={t('Đăng xuất', 'Sign out')}
              >
                <LogOut className="h-3.5 w-3.5" strokeWidth={1.5} />
              </button>
            ) : (
              <Link
                href="/auth/login"
                className="text-xs font-light uppercase tracking-[0.16em] text-earth/80 transition-colors hover:text-charcoal"
              >
                {t('Đăng nhập', 'Sign In')}
              </Link>
            )}
          </div>

          {/* Mobile hamburger & Quick language */}
          <div className="flex items-center gap-2 md:hidden">
            {/* Mobile Lang switch */}
            <div className="flex items-center gap-1 mr-1 text-[11px] font-mono">
              <button
                type="button"
                onClick={() => setLanguage('vi')}
                className={cn(
                  'px-1 py-0.5',
                  language === 'vi' ? 'font-bold text-charcoal border-b border-terracotta' : 'text-earth/60'
                )}
              >
                VI
              </button>
              <span className="text-[9px] text-earth/40">/</span>
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={cn(
                  'px-1 py-0.5',
                  language === 'en' ? 'font-bold text-charcoal border-b border-terracotta' : 'text-earth/60'
                )}
              >
                EN
              </button>
            </div>

            <Link
              href="/dashboard/create"
              className="border border-charcoal bg-charcoal px-3 py-1.5 text-[11px] font-medium uppercase tracking-wider text-[#F7F2E9]"
            >
              {t('Tạo thiệp', 'Create')}
            </Link>
            <button
              type="button"
              onClick={() => setOpen(!open)}
              aria-label={open ? t('Đóng menu', 'Close menu') : t('Mở menu', 'Open menu')}
              className="inline-flex h-9 w-9 items-center justify-center text-charcoal transition-colors hover:text-terracotta"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu drop */}
        {open && (
          <div className="border-b border-sand/60 bg-[#F7F2E9] px-6 py-6 md:hidden">
            <nav className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="flex items-baseline justify-between border-b border-sand/40 pb-2 text-sm font-light uppercase tracking-[0.16em] text-charcoal"
                >
                  <span>{link.label}</span>
                  <span className="text-[10px] font-light lowercase tracking-wider text-earth/60">
                    {link.subtitle}
                  </span>
                </a>
              ))}
              <div className="pt-2 flex flex-col gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false)
                    setInquiryOpen(true)
                  }}
                  className="w-full border border-sand py-2.5 text-center text-xs font-light uppercase tracking-[0.16em] text-charcoal"
                >
                  {t('Hợp tác cùng Wispic', 'Work with Wispic')}
                </button>
                {authed ? (
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full text-center text-xs font-light uppercase tracking-[0.14em] text-earth py-2"
                  >
                    {t('Đăng xuất tài khoản', 'Sign Out')}
                  </button>
                ) : (
                  <Link
                    href="/auth/login"
                    onClick={() => setOpen(false)}
                    className="w-full text-center text-xs font-light uppercase tracking-[0.14em] text-earth py-2"
                  >
                    {t('Đăng nhập tài khoản', 'Sign In')}
                  </Link>
                )}
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Inquiry Dialog */}
      <InquiryDialog open={inquiryOpen} onClose={() => setInquiryOpen(false)} />
    </>
  )
}
