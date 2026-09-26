'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'motion/react'
import {
  Menu,
  X,
  ArrowUpRight,
  LogOut,
  ChevronDown,
  ArrowRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Logo } from '@/components/logo'
import { LOCAL_SESSION_EVENT } from '@/lib/local-auth'
import { InquiryDialog } from '@/components/inquiry-dialog'
import { useLanguage } from '@/lib/language-context'

interface DropdownItem {
  titleVi: string
  titleEn: string
  descVi: string
  descEn: string
  href: string
  badge?: string
}

interface NavSection {
  id: string
  labelVi: string
  labelEn: string
  href: string
  dropdown?: {
    featured?: {
      titleVi: string
      titleEn: string
      image: string
      href: string
      captionVi: string
      captionEn: string
    }
    items: DropdownItem[]
  }
}

export function SiteHeader() {
  const { language, setLanguage, t } = useLanguage()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [mobileExpandedSection, setMobileExpandedSection] = useState<string | null>(null)
  const [authed, setAuthed] = useState(false)
  const [inquiryOpen, setInquiryOpen] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const router = useRouter()

  const navSections: NavSection[] = [
    {
      id: 'portfolio',
      labelVi: 'Bộ Ảnh',
      labelEn: 'Portfolio',
      href: '/portfolio',
      dropdown: {
        featured: {
          titleVi: 'Bộ ảnh mới nhất: Hoàng hôn biển An Bàng',
          titleEn: 'Latest series: Twilight at An Bang',
          image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=600&q=80',
          href: '/portfolio?category=pre-wedding',
          captionVi: 'Pre-wedding ngoại cảnh Hội An',
          captionEn: 'Hoi An coastal pre-wedding',
        },
        items: [
          {
            titleVi: 'Phóng Sự Ngày Cưới',
            titleEn: 'Wedding Day Documentary',
            descVi: 'Ghi lại trọn vẹn cảm xúc lễ gia tiên & tiệc cưới chân thật',
            descEn: 'Candid emotions of vows, tea ceremony & evening celebration',
            href: '/portfolio?category=wedding-day',
          },
          {
            titleVi: 'Pre-Wedding Ngoại Cảnh & Studio',
            titleEn: 'Pre-Wedding & Studio',
            descVi: 'Buổi chụp tự nhiên, lãng mạn như một buổi hẹn hò',
            descEn: 'Natural romantic session captured like a weekend date',
            href: '/portfolio?category=pre-wedding',
          },
          {
            titleVi: 'Concept & Chân Dung Couple',
            titleEn: 'Concept & Couple Portraits',
            descVi: 'Điện ảnh cổ điển, tối giản, thanh lịch vượt thời gian',
            descEn: 'Classic noir, minimal and timeless editorial portraits',
            href: '/portfolio?category=concept',
          },
          {
            titleVi: 'Destination Wedding',
            titleEn: 'Destination Weddings',
            descVi: 'Đà Lạt, Hội An, Phú Quốc, Ninh Bình & Biển đảo',
            descEn: 'Da Lat, Hoi An, Phu Quoc, Ninh Binh & Island shores',
            href: '/portfolio?category=destination',
          },
        ],
      },
    },
    {
      id: 'services',
      labelVi: 'Dịch Vụ & Báo Giá',
      labelEn: 'Services & Pricing',
      href: '/services',
      dropdown: {
        items: [
          {
            titleVi: 'Gói Chụp Pre-Wedding Signature',
            titleEn: 'Signature Pre-Wedding Package',
            descVi: 'Trọn gói makeup, trang phục thiết kế, xe di chuyển và photobook cao cấp',
            descEn: 'Complete with designer gown, makeup, transit & fine art album',
            href: '/services#pre-wedding',
            badge: 'Bestseller',
          },
          {
            titleVi: 'Phóng Sự Ngày Cưới Trọn Gói',
            titleEn: 'Full Wedding Day Coverage',
            descVi: '2 máy chụp bắt trọn mọi góc lễ gia tiên và tiệc tối thân mật',
            descEn: 'Dual-camera documentary from morning vows to evening toast',
            href: '/services#wedding-day',
          },
          {
            titleVi: 'Phim Cưới Phóng Sự Cinematic 4K',
            titleEn: 'Cinematic 4K Wedding Film',
            descVi: 'Thu âm trực tiếp lời thề nguyện và biên tập phong cách điện ảnh',
            descEn: 'Direct vow recordings, drone footage & film color grade',
            href: '/services#wedding-film',
          },
          {
            titleVi: 'Thiệp Cưới Online Thông Minh',
            titleEn: 'Interactive Digital Invitations',
            descVi: 'Trang web thiệp độc bản, RSVP quản lý khách mời & nhạc nền',
            descEn: 'Bespoke wedding website with RSVP, map & music track',
            href: '/services#digital-invitations',
          },
          {
            titleVi: 'Quy Trình 4 Bước Làm Việc',
            titleEn: 'Our 4-Step Process',
            descVi: 'Từ tư vấn concept đến buổi chụp thoải mái và bàn giao album',
            descEn: 'From initial consultation to relaxed shoot & final keepsakes',
            href: '/services#process',
          },
        ],
      },
    },
    {
      id: 'stories',
      labelVi: 'Câu Chuyện',
      labelEn: 'Stories',
      href: '/stories',
      dropdown: {
        items: [
          {
            titleVi: 'Slide Lật Trang Tương Tác',
            titleEn: 'Interactive Story Reader',
            descVi: 'Trải nghiệm lướt xem từng trang sách ảnh chuyển động mượt mà',
            descEn: 'Flip through multi-page albums with fluid motion slides',
            href: '/stories#interactive-reader',
            badge: 'Mới',
          },
          {
            titleVi: 'Minh & Hà · Biển An Bàng',
            titleEn: 'Minh & Ha · An Bang Coast',
            descVi: 'Hoàng hôn dịu dàng và những cái ôm siết trong gió biển',
            descEn: 'Tender dusk and quiet seaside embraces',
            href: '/stories/minh-ha-an-bang',
          },
          {
            titleVi: 'Tuấn & Linh · Đà Lạt Mờ Sương',
            titleEn: 'Tuan & Linh · Da Lat Pine Mist',
            descVi: 'Sương sớm cao nguyên, căn nhà gỗ cổ và tách trà ấm',
            descEn: 'Highland dawn, antique wooden villa & warm tea',
            href: '/stories/tuan-linh-da-lat',
          },
          {
            titleVi: 'Đức & Trang · Tiệc Cưới Sân Vườn',
            titleEn: 'Duc & Trang · Courtyard Wedding',
            descVi: 'Đám cưới ấm cúng 40 khách ngập ánh nến và tiếng cười',
            descEn: 'Intimate 40-guest celebration lit by candlelight',
            href: '/stories/duc-trang-hoi-an',
          },
        ],
      },
    },
    {
      id: 'invitations',
      labelVi: 'Thiệp Cưới',
      labelEn: 'Invitations',
      href: '/invitations',
      dropdown: {
        items: [
          {
            titleVi: 'Bộ Sưu Tập Mẫu Thiệp Online',
            titleEn: 'Online Stationery Templates',
            descVi: 'Giao diện phong cách ảnh cưới tinh tế, lãng mạn & hiện đại',
            descEn: 'Fine art photo layouts, romantic & modern typography',
            href: '/invitations#templates',
          },
          {
            titleVi: 'Tính Năng RSVP & Nhạc Nền',
            titleEn: 'Smart RSVP & Ambient Audio',
            descVi: 'Xác nhận tham dự thông minh, bản đồ chỉ đường & lời chúc khách mời',
            descEn: 'Interactive RSVP tracking, directions & guest wishes',
            href: '/invitations#features',
          },
          {
            titleVi: 'Tự Khởi Tạo Thiệp Ngay',
            titleEn: 'Create Your Invitation',
            descVi: 'Điền thông tin và xem trước trực tiếp trên điện thoại',
            descEn: 'Enter details and preview instantly on mobile',
            href: '/dashboard/create',
            badge: 'Tạo ngay',
          },
        ],
      },
    },
    {
      id: 'about',
      labelVi: 'Về Wispic',
      labelEn: 'About Us',
      href: '/about',
      dropdown: {
        items: [
          {
            titleVi: 'Triết Lý Nhiếp Ảnh Tự Nhiên',
            titleEn: 'Natural Photography Philosophy',
            descVi: 'Không tạo dáng gượng gạo, để cảm xúc của hai bạn tự cất lời',
            descEn: 'Unposed, unhurried, letting genuine love speak for itself',
            href: '/about#philosophy',
          },
          {
            titleVi: 'Tone Màu & Cảm Xúc',
            titleEn: 'Signature Warm Tones',
            descVi: 'Màu sắc ấm áp, trong trẻo lấy cảm hứng từ phim 35mm hoài niệm',
            descEn: 'Warm, luminous palettes inspired by nostalgic 35mm film',
            href: '/about#aesthetic',
          },
          {
            titleVi: 'Đội Ngũ & Không Gian Studio',
            titleEn: 'Team & Studio Sanctuaries',
            descVi: 'Hội An · Đà Lạt · Sài Gòn — Những người bạn đồng hành tận tâm',
            descEn: 'Hoi An · Da Lat · Saigon — Passionate creative companions',
            href: '/about#team',
          },
        ],
      },
    },
    {
      id: 'contact',
      labelVi: 'Liên Hệ',
      labelEn: 'Contact',
      href: '/contact',
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

  const handleMouseEnter = (id: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setActiveDropdown(id)
  }

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveDropdown(null)
    }, 200)
  }

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
            ? 'border-b border-sand/70 bg-[#F7F2E9]/95 backdrop-blur-md py-3 shadow-[0_4px_20px_-10px_rgba(41,37,34,0.08)]'
            : 'border-b border-sand/40 bg-[#F7F2E9]/80 backdrop-blur-sm py-4 md:py-5'
        )}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 lg:px-12">
          {/* Brand Logo & Studio Tagline */}
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="group flex items-center gap-3"
              aria-label="WISPIC — Studio Nhiếp Ảnh Cưới Tự Nhiên"
            >
              <Logo showMark className="transition-opacity group-hover:opacity-85" />
            </Link>

            <div className="hidden items-center gap-2 text-[10px] font-light uppercase tracking-[0.22em] text-earth/70 xl:flex">
              <span className="h-1.5 w-1.5 rounded-full bg-terracotta" aria-hidden />
              <span>
                {t(
                  'Nhiếp Ảnh Cưới Tự Nhiên · Cảm Xúc · Vượt Thời Gian',
                  'Natural & Emotional Wedding Photography'
                )}
              </span>
            </div>
          </div>

          {/* Desktop Navigation with Animated Dropdown Menus */}
          <nav
            className="hidden items-center gap-1 lg:flex"
            aria-label={t('Điều hướng chính', 'Main Navigation')}
          >
            {navSections.map((section) => {
              const hasDropdown = Boolean(section.dropdown)
              const isOpen = activeDropdown === section.id

              return (
                <div
                  key={section.id}
                  className="relative"
                  onMouseEnter={() => (hasDropdown ? handleMouseEnter(section.id) : undefined)}
                  onMouseLeave={hasDropdown ? handleMouseLeave : undefined}
                >
                  {/* Main Link (Clickable Landing Page) */}
                  <Link
                    href={section.href}
                    className={cn(
                      'group inline-flex items-center gap-1 px-3 py-2 text-xs uppercase tracking-[0.14em] transition-all rounded',
                      isOpen
                        ? 'text-terracotta font-medium bg-sand/30'
                        : 'text-charcoal/85 hover:text-charcoal hover:bg-sand/20 font-light'
                    )}
                  >
                    <span>{language === 'vi' ? section.labelVi : section.labelEn}</span>
                    {hasDropdown && (
                      <ChevronDown
                        className={cn(
                          'h-3 w-3 transition-transform duration-200 text-earth/60 group-hover:text-charcoal',
                          isOpen && 'rotate-180 text-terracotta'
                        )}
                      />
                    )}
                  </Link>

                  {/* Animated Dropdown Menu */}
                  <AnimatePresence>
                    {hasDropdown && isOpen && section.dropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.98 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                        className={cn(
                          'absolute top-full left-0 mt-1 z-50 rounded-none border border-sand/80 bg-[#FAF7F2] p-5 shadow-[0_20px_45px_-15px_rgba(41,37,34,0.18)] backdrop-blur-md',
                          section.dropdown.featured
                            ? 'w-[560px] grid grid-cols-12 gap-6'
                            : 'w-[360px]'
                        )}
                      >
                        {/* Optional Featured Thumbnail */}
                        {section.dropdown.featured && (
                          <div className="col-span-5 border-r border-sand/60 pr-4 flex flex-col justify-between">
                            <div className="space-y-2">
                              <span className="text-[10px] font-mono uppercase tracking-widest text-terracotta">
                                {t('Nổi bật', 'Featured')}
                              </span>
                              <Link
                                href={section.dropdown.featured.href}
                                onClick={() => setActiveDropdown(null)}
                                className="group/feat block space-y-2"
                              >
                                <div className="relative aspect-[4/3] w-full overflow-hidden bg-sand/20 shadow-sm">
                                  <Image
                                    src={section.dropdown.featured.image}
                                    alt="Featured shoot"
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover/feat:scale-105"
                                  />
                                </div>
                                <h5 className="font-serif text-sm font-medium text-charcoal leading-snug group-hover/feat:text-terracotta transition-colors">
                                  {language === 'vi'
                                    ? section.dropdown.featured.titleVi
                                    : section.dropdown.featured.titleEn}
                                </h5>
                                <p className="text-[11px] text-earth/70 font-light">
                                  {language === 'vi'
                                    ? section.dropdown.featured.captionVi
                                    : section.dropdown.featured.captionEn}
                                </p>
                              </Link>
                            </div>

                            <Link
                              href={section.href}
                              onClick={() => setActiveDropdown(null)}
                              className="inline-flex items-center gap-1.5 text-xs text-terracotta font-medium tracking-wide hover:underline pt-3"
                            >
                              <span>{t('Xem trang chính', 'View Main Page')}</span>
                              <ArrowRight className="h-3 w-3" />
                            </Link>
                          </div>
                        )}

                        {/* Dropdown Items List */}
                        <div
                          className={cn(
                            'space-y-1',
                            section.dropdown.featured ? 'col-span-7' : 'w-full'
                          )}
                        >
                          <div className="pb-2 mb-1 border-b border-sand/60 flex items-center justify-between">
                            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-earth/60">
                              {language === 'vi' ? section.labelVi : section.labelEn}
                            </span>
                            <Link
                              href={section.href}
                              onClick={() => setActiveDropdown(null)}
                              className="text-[11px] text-terracotta hover:underline font-light"
                            >
                              {t('Tất cả →', 'All →')}
                            </Link>
                          </div>

                          {section.dropdown.items.map((item, idx) => (
                            <Link
                              key={idx}
                              href={item.href}
                              onClick={() => setActiveDropdown(null)}
                              className="group block p-2 rounded transition-colors hover:bg-sand/30"
                            >
                              <div className="flex items-center justify-between">
                                <h6 className="text-xs font-medium text-charcoal group-hover:text-terracotta transition-colors">
                                  {language === 'vi' ? item.titleVi : item.titleEn}
                                </h6>
                                {item.badge && (
                                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-terracotta/10 text-terracotta font-normal">
                                    {item.badge}
                                  </span>
                                )}
                              </div>
                              <p className="mt-0.5 text-[11px] font-light text-earth/70 line-clamp-1">
                                {language === 'vi' ? item.descVi : item.descEn}
                              </p>
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}
          </nav>

          {/* Right Action Cluster */}
          <div className="hidden items-center gap-4 lg:flex">
            {/* Language Switcher [VI | EN] */}
            <div
              className="flex items-center gap-1 border-r border-sand/80 pr-4 text-[11px] font-mono tracking-wider"
              aria-label={t('Chọn ngôn ngữ', 'Language selector')}
            >
              <button
                type="button"
                onClick={() => setLanguage('vi')}
                className={cn(
                  'px-1.5 py-0.5 transition-colors cursor-pointer',
                  language === 'vi'
                    ? 'font-bold text-charcoal border-b-2 border-terracotta'
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
                  'px-1.5 py-0.5 transition-colors cursor-pointer',
                  language === 'en'
                    ? 'font-bold text-charcoal border-b-2 border-terracotta'
                    : 'text-earth/60 hover:text-charcoal'
                )}
                title="English"
              >
                EN
              </button>
            </div>

            {/* Consultation / Booking Button */}
            <button
              type="button"
              onClick={() => setInquiryOpen(true)}
              className="text-xs font-light uppercase tracking-[0.16em] text-earth transition-colors hover:text-charcoal cursor-pointer"
            >
              {t('Đặt Lịch Chụp', 'Book a Shoot')}
            </button>

            {/* Direct Link to Create Invitation */}
            <Link
              href="/dashboard/create"
              className="group inline-flex items-center gap-2 border border-charcoal bg-charcoal px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-[#F7F2E9] transition-all hover:bg-transparent hover:text-charcoal"
            >
              <span>{t('Tạo Thiệp Cưới', 'Create Invitation')}</span>
              <ArrowUpRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>

            {authed ? (
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 text-xs font-light uppercase tracking-[0.14em] text-earth/80 transition-colors hover:text-charcoal cursor-pointer"
                title={t('Đăng xuất', 'Sign out')}
              >
                <LogOut className="h-3.5 w-3.5" strokeWidth={1.5} />
              </button>
            ) : (
              <Link
                href="/auth/login"
                className="text-xs font-light uppercase tracking-[0.16em] text-earth/80 transition-colors hover:text-charcoal"
              >
                {t('Đăng Nhập', 'Sign In')}
              </Link>
            )}
          </div>

          {/* Mobile hamburger & Quick language switcher */}
          <div className="flex items-center gap-2 lg:hidden">
            {/* Mobile Lang switch */}
            <div className="flex items-center gap-1 mr-1 text-[11px] font-mono">
              <button
                type="button"
                onClick={() => setLanguage('vi')}
                className={cn(
                  'px-1 py-0.5 cursor-pointer',
                  language === 'vi'
                    ? 'font-bold text-charcoal border-b border-terracotta'
                    : 'text-earth/60'
                )}
              >
                VI
              </button>
              <span className="text-[9px] text-earth/40">/</span>
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={cn(
                  'px-1 py-0.5 cursor-pointer',
                  language === 'en'
                    ? 'font-bold text-charcoal border-b border-terracotta'
                    : 'text-earth/60'
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
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? t('Đóng menu', 'Close menu') : t('Mở menu', 'Open menu')}
              className="inline-flex h-9 w-9 items-center justify-center text-charcoal transition-colors hover:text-terracotta cursor-pointer"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Full Animated Slide Drawer with Accordions */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="border-b border-sand/70 bg-[#FAF7F2] px-6 py-6 lg:hidden max-h-[80vh] overflow-y-auto"
            >
              <nav className="flex flex-col space-y-3">
                {navSections.map((section) => {
                  const hasDropdown = Boolean(section.dropdown)
                  const isExpanded = mobileExpandedSection === section.id

                  return (
                    <div key={section.id} className="border-b border-sand/40 pb-2.5">
                      <div className="flex items-center justify-between">
                        <Link
                          href={section.href}
                          onClick={() => setMobileOpen(false)}
                          className="text-sm font-medium uppercase tracking-[0.16em] text-charcoal hover:text-terracotta"
                        >
                          {language === 'vi' ? section.labelVi : section.labelEn}
                        </Link>

                        {hasDropdown && (
                          <button
                            type="button"
                            onClick={() =>
                              setMobileExpandedSection(isExpanded ? null : section.id)
                            }
                            className="p-1 text-earth hover:text-charcoal"
                            aria-label="Toggle submenu"
                          >
                            <ChevronDown
                              className={cn(
                                'h-4 w-4 transition-transform duration-200',
                                isExpanded && 'rotate-180 text-terracotta'
                              )}
                            />
                          </button>
                        )}
                      </div>

                      {/* Expanded Mobile Submenu */}
                      {hasDropdown && isExpanded && section.dropdown && (
                        <div className="mt-2.5 pl-3 border-l-2 border-terracotta/40 space-y-2">
                          <Link
                            href={section.href}
                            onClick={() => setMobileOpen(false)}
                            className="block text-xs font-semibold text-terracotta pb-1"
                          >
                            {t('→ Xem toàn bộ mục này', '→ View landing page')}
                          </Link>
                          {section.dropdown.items.map((sub, sIdx) => (
                            <Link
                              key={sIdx}
                              href={sub.href}
                              onClick={() => setMobileOpen(false)}
                              className="block py-1 text-xs text-earth hover:text-charcoal"
                            >
                              <span className="font-light">
                                {language === 'vi' ? sub.titleVi : sub.titleEn}
                              </span>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}

                {/* Mobile Bottom Actions */}
                <div className="pt-3 flex flex-col gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      setMobileOpen(false)
                      setInquiryOpen(true)
                    }}
                    className="w-full border border-charcoal bg-charcoal py-2.5 text-center text-xs font-medium uppercase tracking-[0.16em] text-[#F7F2E9]"
                  >
                    {t('Đặt Lịch Tư Vấn & Chụp Ảnh', 'Book a Consultation')}
                  </button>

                  <Link
                    href="/contact"
                    onClick={() => setMobileOpen(false)}
                    className="w-full border border-sand bg-white py-2 text-center text-xs font-light uppercase tracking-[0.14em] text-charcoal hover:bg-sand/20"
                  >
                    {t('Thông Tin Liên Hệ & Studio', 'Contact Information')}
                  </Link>

                  {authed ? (
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full text-center text-xs font-light uppercase tracking-[0.14em] text-earth py-2"
                    >
                      {t('Đăng Xuất Tài Khoản', 'Sign Out')}
                    </button>
                  ) : (
                    <Link
                      href="/auth/login"
                      onClick={() => setMobileOpen(false)}
                      className="w-full text-center text-xs font-light uppercase tracking-[0.14em] text-earth py-2"
                    >
                      {t('Đăng Nhập Tài Khoản', 'Sign In')}
                    </Link>
                  )}
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Inquiry & Booking Dialog */}
      <InquiryDialog open={inquiryOpen} onClose={() => setInquiryOpen(false)} />
    </>
  )
}
