import Link from "next/link";
import { TemplateImage } from "@/components/wedding/template-image";
import { Countdown, WeddingExtraSections } from "@/components/wedding/wedding-extra-sections";
import type { WeddingData } from "@/lib/wedding-data";

interface ModernTemplateProps {
  wedding: WeddingData;
  backHref?: string;
  hideBack?: boolean;
}

export default function ModernTemplate({ wedding, backHref = "/", hideBack }: ModernTemplateProps) {
  const names = `${wedding.groom} ${wedding.bride}`;
  const gallery = wedding.photos.slice(0, 4);

  return (
    <main className="min-h-screen bg-[#fbfaf7] text-[#1f1d1b]">
      {!hideBack && (
      <div className="fixed left-5 top-5 z-50">
        <Link
          href={backHref}
          className="rounded-full bg-[#fbfaf7]/85 px-5 py-2.5 text-xs shadow-sm backdrop-blur transition hover:bg-[#fbfaf7]"
        >
          ← Quay lại
        </Link>
      </div>
      )}

      {/* Hero */}
      <section className="mx-auto grid min-h-screen max-w-6xl items-center gap-12 px-6 py-20 md:grid-cols-[1.1fr_0.9fr] lg:px-8">
        <div className="order-last md:order-first">
          <p className="text-[0.65rem] uppercase tracking-[0.5em] text-[#a9573f]">
            Invitation · {wedding.weddingDate}
          </p>
          <h1 className="mt-6 font-serif text-5xl font-medium leading-[1.05] tracking-tight md:text-7xl">
            {wedding.groom}
            <span className="block text-[#d97832]">&</span>
            {wedding.bride}
          </h1>
          <div className="mt-8 h-px w-16 bg-[#1f1d1b]/30" />
          <div className="mt-8 grid max-w-sm grid-cols-3 gap-6 text-[0.7rem] uppercase tracking-[0.25em] text-[#7a726b]">
            <div>
              <p>Lễ</p>
              <p className="mt-2 font-serif text-xl normal-case tracking-normal text-[#1f1d1b]">
                {wedding.ceremony.time}
              </p>
            </div>
            <div>
              <p>Tiệc</p>
              <p className="mt-2 font-serif text-xl normal-case tracking-normal text-[#1f1d1b]">
                {wedding.reception.time}
              </p>
            </div>
            <div>
              <p>Nơi</p>
              <p className="mt-2 font-serif text-xl normal-case tracking-normal text-[#1f1d1b]">
                {wedding.location.city}
              </p>
            </div>
          </div>
        </div>
        <div className="relative aspect-[4/5] overflow-hidden rounded-[1.25rem]">
          <TemplateImage
            src={wedding.avatar?.url ?? wedding.photos[0]?.url ?? ""}
            alt={names}
            fill
            priority
            className="object-cover"
          />
        </div>
      </section>

      {/* Intro */}
      <section className="border-y border-[#1f1d1b]/10 bg-[#f4efe6] px-6 py-24">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-terracotta">Lời mời</p>
          <p className="mt-8 text-balance font-serif text-2xl font-light leading-relaxed md:text-3xl">
            {wedding.introduction}
          </p>
          {(wedding.groomParents || wedding.brideParents) && (
            <p className="mt-8 text-xs leading-7 tracking-[0.15em] text-muted-foreground">
              {wedding.groomParents && (
                <span>
                  <span className="text-terracotta">{wedding.groom}</span> — con trai{" "}
                  {wedding.groomParents}
                </span>
              )}
              {wedding.groomParents && wedding.brideParents && <span className="mx-2">·</span>}
              {wedding.brideParents && (
                <span>
                  <span className="text-terracotta">{wedding.bride}</span> — con gái{" "}
                  {wedding.brideParents}
                </span>
              )}
            </p>
          )}
        </div>
      </section>

      {/* Couple photo + story */}
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-24 md:grid-cols-2 lg:px-8">
        <div className="relative aspect-[4/5] overflow-hidden rounded-[1.25rem]">
          <TemplateImage
            src={wedding.couplePhoto?.url ?? wedding.photos[0]?.url ?? ""}
            alt={names}
            fill
            className="object-cover"
          />
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-terracotta">Câu chuyện</p>
          <h2 className="mt-5 font-serif text-4xl font-medium tracking-tight md:text-5xl">
            Từ một cuộc gặp gỡ
          </h2>
          <p className="mt-7 text-pretty font-light leading-relaxed text-[#6b635b]">
            {wedding.coupleStory}
          </p>
        </div>
      </section>

      {/* Details */}
      <section className="bg-[#1f1d1b] px-6 py-24 text-[#fbfaf7]">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <p className="text-xs uppercase tracking-[0.4em] text-[#d97832]">Save the date</p>
            <h2 className="mt-4 font-serif text-4xl font-light md:text-5xl">
              {wedding.weddingDate}
            </h2>
          </div>
          <div className="mt-14 grid gap-10 border-t border-white/10 pt-10 md:grid-cols-3">
            <div>
              <p className="text-[0.65rem] uppercase tracking-[0.35em] text-white/40">
                Lễ gia tiên
              </p>
              <p className="mt-3 font-serif text-3xl font-light">{wedding.ceremony.time}</p>
              <p className="mt-2 text-sm font-light text-white/60">{wedding.ceremony.date}</p>
            </div>
            <div>
              <p className="text-[0.65rem] uppercase tracking-[0.35em] text-white/40">
                Tiệc cưới
              </p>
              <p className="mt-3 font-serif text-3xl font-light">{wedding.reception.time}</p>
              <p className="mt-2 text-sm font-light text-white/60">
                {wedding.reception.description}
              </p>
            </div>
            <div>
              <p className="text-[0.65rem] uppercase tracking-[0.35em] text-white/40">
                Địa điểm
              </p>
              <p className="mt-3 font-serif text-3xl font-light">{wedding.location.city}</p>
              <p className="mt-2 text-sm font-light text-white/60">
                {wedding.location.venueName || wedding.location.province}
              </p>
            </div>
          </div>
          <div className="mt-16">
            <Countdown weddingDate={wedding.weddingDate} style="modern" />
          </div>
        </div>
      </section>

      {/* Gallery */}
      {gallery.length > 0 && (
        <section className="mx-auto max-w-6xl px-6 py-24 lg:px-8">
          <p className="text-center text-xs uppercase tracking-[0.4em] text-terracotta">
            Những khoảnh khắc
          </p>
          <div className="mt-10 grid grid-cols-2 gap-4">
            {gallery.map((photo, i) => (
              <div
                key={photo.id}
                className={i % 2 === 0 ? "aspect-[3/4]" : "aspect-[3/4] md:mt-12"}
              >
                <div className="relative h-full w-full overflow-hidden rounded-[1.25rem]">
                  <TemplateImage
                    src={photo.url}
                    alt={photo.alt ?? "Wedding memory"}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Extra sections */}
      <WeddingExtraSections wedding={wedding} style="modern" />

      {/* Closing */}
      <section className="px-6 py-24 text-center">
        <h2 className="font-serif text-4xl font-light tracking-tight md:text-6xl">
          {wedding.groom}
          <span className="mx-4 text-[#d97832]">·</span>
          {wedding.bride}
        </h2>
        <p className="mx-auto mt-6 max-w-md text-sm font-light leading-relaxed text-[#8a8178]">
          Cảm ơn bạn đã đồng hành cùng chúng mình trong ngày trọng đại.
        </p>
      </section>
    </main>
  );
}