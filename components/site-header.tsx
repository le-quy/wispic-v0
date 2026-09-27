'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'motion/react'
import { Menu, X, LogOut, ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Logo } from '@/components/logo'
import { LOCAL_SESSION_EVENT } from '@/lib/session-events'
import { InquiryDialog } from '@/components/inquiry-dialog'
import { useLanguage } from '@/lib/language-context'

const NAV_LINKS = [
  { href: '/photography', labelVi: 'Bộ Ảnh', labelEn: 'Portfolio' },
  { href: '/explore', labelVi: 'Khám Phá', labelEn: 'Explore' },
  { href: '/services', labelVi: 'Dịch Vụ', labelEn: 'Services' },
  { href: '/share', labelVi: 'Câu Chuyện', labelEn: 'Stories' },
  { href: '/wedding/templates', labelVi: 'Thiệp Cưới', labelEn: 'Invitations' },
  { href: '/services/booking', labelVi: 'Liên Hệ', labelEn: 'Contact' },
]

export function SiteHeader() {
  const { language, setLanguage, t } = useLanguage()
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [authed, setAuthed] = useState(false)
  const [inquiryOpen, setInquiryOpen] = useState(false)
  const router = useRouter()

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

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`)

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    window.dispatchEvent(new Event(LOCAL_SESSION_EVENT))
    setAuthed(false)
    setMobileOpen(false)
    router.refresh()
    router.push('/')
  }

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-40 transition-all duration-300',
          scrolled
            ? 'border-b border-sand/70 bg-[#F7F2E9]/95 py-2.5 backdrop-blur-md shadow-[0_4px_20px_-10px_rgba(41,37,34,0.08)]'
            : 'border-b border-sand/40 bg-[#F7F2E9]/80 py-3.5 backdrop-blur-sm'
        )}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 lg:px-12">
          <Link
            href="/"
            className="group shrink-0"
            aria-label="WISPIC — Studio Nhiếp Ảnh Cưới Tự Nhiên"
          >
            <Logo showMark className="transition-opacity group-hover:opacity-85" />
          </Link>

          <nav
            className="hidden items-center gap-7 lg:flex"
            aria-label={t('Điều hướng chính', 'Main Navigation')}
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'relative py-1 text-[11px] uppercase tracking-[0.18em] transition-colors',
                  isActive(link.href)
                    ? 'text-terracotta'
                    : 'text-charcoal/80 hover:text-terracotta'
                )}
              >
                {language === 'vi' ? link.labelVi : link.labelEn}
                {isActive(link.href) && (
                  <span className="absolute -bottom-0.5 left-0 h-px w-full bg-terracotta" />
                )}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3 lg:gap-5">
            <div
              className="hidden items-center gap-1 text-[11px] font-mono tracking-wider sm:flex"
              aria-label={t('Chọn ngôn ngữ', 'Language selector')}
            >
              <button
                type="button"
                onClick={() => setLanguage('vi')}
                className={cn(
                  'cursor-pointer px-1 py-0.5 transition-colors',
                  language === 'vi' ? 'font-bold text-charcoal' : 'text-earth/50 hover:text-charcoal'
                )}
                title="Tiếng Việt"
              >
                VI
              </button>
              <span className="text-[9px] text-earth/30">/</span>
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={cn(
                  'cursor-pointer px-1 py-0.5 transition-colors',
                  language === 'en' ? 'font-bold text-charcoal' : 'text-earth/50 hover:text-charcoal'
                )}
                title="English"
              >
                EN
              </button>
            </div>

            <button
              type="button"
              onClick={() => setInquiryOpen(true)}
              className="hidden cursor-pointer text-[11px] font-light uppercase tracking-[0.16em] text-earth transition-colors hover:text-charcoal md:block"
            >
              {t('Đặt Lịch', 'Book')}
            </button>

            <Link
              href="/dashboard/create"
              className="group hidden items-center gap-1.5 bg-charcoal px-4 py-2 text-[11px] font-medium uppercase tracking-[0.16em] text-[#F7F2E9] transition-colors hover:bg-terracotta sm:inline-flex"
            >
              <span>{t('Tạo Thiệp', 'Create')}</span>
              <ArrowUpRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>

            {authed ? (
              <button
                type="button"
                onClick={handleLogout}
                className="hidden cursor-pointer text-earth/80 transition-colors hover:text-charcoal lg:block"
                title={t('Đăng xuất', 'Sign out')}
                aria-label={t('Đăng xuất', 'Sign out')}
              >
                <LogOut className="h-4 w-4" strokeWidth={1.5} />
              </button>
            ) : (
              <Link
                href="/auth/login"
                className="hidden text-[11px] font-light uppercase tracking-[0.16em] text-earth/80 transition-colors hover:text-charcoal lg:block"
              >
                {t('Đăng Nhập', 'Sign In')}
              </Link>
            )}

            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? t('Đóng menu', 'Close menu') : t('Mở menu', 'Open menu')}
              aria-expanded={mobileOpen}
              className="inline-flex h-9 w-9 cursor-pointer items-center justify-center text-charcoal transition-colors hover:text-terracotta lg:hidden"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.22, ease: 'easeInOut' }}
              className="overflow-hidden border-b border-sand/70 bg-[#FAF7F2] lg:hidden"
            >
              <nav className="mx-auto max-w-7xl px-6 py-5">
                <div className="flex flex-col">
                  {NAV_LINKS.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        'border-b border-sand/40 py-3 text-xs uppercase tracking-[0.18em] transition-colors',
                        isActive(link.href) ? 'text-terracotta' : 'text-charcoal hover:text-terracotta'
                      )}
                    >
                      {language === 'vi' ? link.labelVi : link.labelEn}
                    </Link>
                  ))}
                </div>

                <div className="mt-5 flex flex-col gap-2.5">
                  <Link
                    href="/dashboard/create"
                    onClick={() => setMobileOpen(false)}
                    className="bg-charcoal py-2.5 text-center text-[11px] font-medium uppercase tracking-[0.18em] text-[#F7F2E9]"
                  >
                    {t('Tạo Thiệp Cưới', 'Create Invitation')}
                  </Link>

                  <button
                    type="button"
                    onClick={() => {
                      setMobileOpen(false)
                      setInquiryOpen(true)
                    }}
                    className="cursor-pointer border border-charcoal py-2.5 text-center text-[11px] font-light uppercase tracking-[0.18em] text-charcoal"
                  >
                    {t('Đặt Lịch Tư Vấn & Chụp Ảnh', 'Book a Consultation')}
                  </button>

                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-2 text-[11px] font-mono">
                      <button
                        type="button"
                        onClick={() => setLanguage('vi')}
                        className={cn(
                          'cursor-pointer px-1',
                          language === 'vi' ? 'font-bold text-charcoal' : 'text-earth/50'
                        )}
                      >
                        VI
                      </button>
                      <span className="text-earth/30">/</span>
                      <button
                        type="button"
                        onClick={() => setLanguage('en')}
                        className={cn(
                          'cursor-pointer px-1',
                          language === 'en' ? 'font-bold text-charcoal' : 'text-earth/50'
                        )}
                      >
                        EN
                      </button>
                    </div>

                    {authed ? (
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="cursor-pointer text-[11px] font-light uppercase tracking-[0.16em] text-earth"
                      >
                        {t('Đăng Xuất', 'Sign Out')}
                      </button>
                    ) : (
                      <Link
                        href="/auth/login"
                        onClick={() => setMobileOpen(false)}
                        className="text-[11px] font-light uppercase tracking-[0.16em] text-earth"
                      >
                        {t('Đăng Nhập', 'Sign In')}
                      </Link>
                    )}
                  </div>
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <InquiryDialog open={inquiryOpen} onClose={() => setInquiryOpen(false)} />
    </>
  )
}
