import { SiteHeader } from '@/components/site-header'
import { Hero } from '@/components/hero'
import { EditorialGallery } from '@/components/editorial-gallery'
import { EditorialExplore } from '@/components/editorial-explore'
import { WeddingCollection } from '@/components/wedding-collection'
import { StyleExplorer } from '@/components/style-explorer'
import { EditorialJournal } from '@/components/editorial-journal'
import { EditorialServices } from '@/components/editorial-services'
import { FinalCta } from '@/components/final-cta'
import { SiteFooter } from '@/components/site-footer'

export default function Page() {
  return (
    <main className="min-h-screen bg-[#F7F2E9] text-[#292522] selection:bg-terracotta/20 selection:text-charcoal font-sans antialiased">
      <SiteHeader />
      <Hero />
      <EditorialGallery />
      <EditorialExplore />
      <WeddingCollection />
      <StyleExplorer />
      <EditorialJournal />
      <EditorialServices />
      <FinalCta />
      <SiteFooter />
    </main>
  )
}
