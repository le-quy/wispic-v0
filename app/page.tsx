import { SiteHeader } from '@/components/site-header'
import { Hero } from '@/components/hero'
import { TemplateShowcase } from '@/components/template-showcase'
import { Features } from '@/components/features'
import { HowItWorks } from '@/components/how-it-works'
import { Testimonials } from '@/components/testimonials'
import { Faq } from '@/components/faq'
import { FinalCta } from '@/components/final-cta'
import { SiteFooter } from '@/components/site-footer'

export default function Page() {
  return (
    <main className="min-h-screen bg-background">
      <SiteHeader />
      <Hero />
      <TemplateShowcase />
      <Features />
      <HowItWorks />
      <Testimonials />
      <Faq />
      <FinalCta />
      <SiteFooter />
    </main>
  )
}
