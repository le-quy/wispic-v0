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
  title: 'WISPIC — Stories worth remembering',
  description:
    'An editorial photography magazine and creative studio. Discover unhurried photography, travel chronicles, and thoughtfully designed digital wedding invitations.',
  generator: 'v0.app',
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
