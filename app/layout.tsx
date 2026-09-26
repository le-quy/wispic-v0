import type { Metadata, Viewport } from 'next'
import { Cormorant_Garamond, Be_Vietnam_Pro } from 'next/font/google'
import { LanguageProvider } from '@/lib/language-context'
import './globals.css'

const cormorant = Cormorant_Garamond({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-cormorant',
  display: 'swap',
})

const beVietnam = Be_Vietnam_Pro({
  subsets: ['latin', 'vietnamese'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-be-vietnam',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'WISPIC — Ghi dấu cảm xúc | Studio Nhiếp ảnh Cưới Tự Nhiên',
  description:
    'WISPIC là studio nhiếp ảnh cưới tự nhiên và thiệp cưới online độc bản. Lưu giữ những rung động chân thật nhất qua lăng kính nhiếp ảnh và phim cưới vượt thời gian.',
  openGraph: {
    title: 'WISPIC — Ghi dấu cảm xúc | Studio Nhiếp ảnh Cưới Tự Nhiên',
    description:
      'WISPIC là studio nhiếp ảnh cưới tự nhiên và thiệp cưới online độc bản. Lưu giữ những rung động chân thật nhất.',
    type: 'website',
    locale: 'vi_VN',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#f7f2e9',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi" className={`${cormorant.variable} ${beVietnam.variable} bg-background`}>
      <body className="font-sans antialiased">
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  )
}
