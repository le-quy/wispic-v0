import Link from "next/link";
import { TemplateImage } from "@/components/wedding/template-image";
import { Countdown, WeddingExtraSections } from "@/components/wedding/wedding-extra-sections";
import type { WeddingData } from "@/lib/wedding-data";

interface TraditionalTemplateProps {
  wedding: WeddingData;
  backHref?: string;
  hideBack?: boolean;
}

export default function TraditionalTemplate({ wedding, backHref = "/", hideBack }: TraditionalTemplateProps) {
  const names = `${wedding.groom} & ${wedding.bride}`;

  return (
    <main className="min-h-screen bg-[#faf3e6] text-[#3a2620]">
      {!hideBack && (
      <div className="fixed left-5 top-5 z-50">
        <Link
          href={backHref}
          className="rounded-full bg-white/80 px-5 py-2.5 text-xs shadow-sm backdrop-blur transition hover:bg-white"
        >
          ← Quay lại
        </Link>
      </div>
      )}

      {/* Hero */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#7d1f1f] px-6 text-center text-[#f6e7c8]">
        <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full border border-[#f6e7c8]/20" />
        <div className="pointer-events-none absolute -bottom-32 -left-24 h-[28rem] w-[28rem] rounded-full border border-[#f6e7c8]/20" />
        <div className="relative z-10">
          <p className="text-7xl text-[#e8c15a] md:text-8xl" aria-hidden>
            囍
          </p>
          <p className="mt-8 text-xs uppercase tracking-[0.5em] text-[#e8c15a]">
            Thiệp mời · Hôn lễ
          </p>
          <h1 className="mt-6 font-serif text-5xl font-medium tracking-tight text-[#f6e7c8] md:text-7xl">
            {names}
          </h1>
          <div className="mx-auto mt-8 flex items-center justify-center gap-4">
            <span className="h-px w-16 bg-[#e8c15a]/60" />
            <span className="text-sm tracking-[0.3em] text-[#e8c15a]">{wedding.weddingDate}</span>
            <span className="h-px w-16 bg-[#e8c15a]/60" />
          </div>
        </div>
      </section>

      {/* Family */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-[#a9573f]">
            Kính mời gia đình thân hữu
          </p>
          <p className="mt-6 font-light leading-relaxed text-[#5a4638]">
            Chúng tôi trân trọng kính mời quý vị đến dự buổi lễ thành hôn của:
          </p>
          {(wedding.groomParents || wedding.brideParents) && (
            <div className="mt-8 space-y-6">
              {wedding.groomParents && (
                <p className="font-serif text-2xl text-[#7d1f1f]">
                  Chú rể {wedding.groom}
                  <span className="mt-1 block text-sm font-light tracking-wider text-[#5a4638]">
                    con trai {wedding.groomParents}
                  </span>
                </p>
              )}
              {wedding.brideParents && (
                <p className="font-serif text-2xl text-[#7d1f1f]">
                  Cô dâu {wedding.bride}
                  <span className="mt-1 block text-sm font-light tracking-wider text-[#5a4638]">
                    con gái {wedding.brideParents}
                  </span>
                </p>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Couple photo + story */}
      <section className="px-6 pb-20">
        <div className="mx-auto grid max-w-5xl items-center gap-12 md:grid-cols-2">
          <div className="overflow-hidden rounded-[1.25rem] border-4 border-[#c9a227]/40">
            <div className="relative aspect-[4/5]">
              <TemplateImage
                src={wedding.couplePhoto?.url ?? wedding.photos[0]?.url ?? ""}
                alt={names}
                fill
                className="object-cover"
              />
            </div>
          </div>
          <div className="text-center md:text-left">
            <p className="text-xs uppercase tracking-[0.3em] text-[#a9573f]">Một mái nhà chung</p>
            <h2 className="mt-5 font-serif text-4xl font-medium tracking-tight text-[#7d1f1f] md:text-5xl">
              Chuyện tình chúng mình
            </h2>
            <p className="mt-7 font-light leading-loose text-[#5a4638]">{wedding.coupleStory}</p>
          </div>
        </div>
      </section>

      {/* Ceremony details */}
      <section className="border-y border-[#c9a227]/30 bg-[#7d1f1f] px-6 py-20 text-center text-[#f6e7c8]">
        <div className="mx-auto max-w-4xl">
          <p className="text-xs uppercase tracking-[0.4em] text-[#e8c15a]">Ngày lành tháng tốt</p>
          <h2 className="mt-4 font-serif text-4xl font-light md:text-5xl">{wedding.weddingDate}</h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-[#e8c15a]">Lễ gia tiên</p>
              <p className="mt-3 font-serif text-3xl font-light">{wedding.ceremony.time}</p>
              <p className="mt-2 text-sm font-light text-[#f6e7c8]/70">
                {wedding.ceremony.date}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-[#e8c15a]">Tiệc cưới</p>
              <p className="mt-3 font-serif text-3xl font-light">{wedding.reception.time}</p>
              <p className="mt-2 text-sm font-light text-[#f6e7c8]/70">
                {wedding.reception.description}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-[#e8c15a]">Địa điểm</p>
              <p className="mt-3 font-serif text-3xl font-light">{wedding.location.city}</p>
              <p className="mt-2 text-sm font-light text-[#f6e7c8]/70">
                {wedding.location.venueName || wedding.location.province}
              </p>
            </div>
          </div>
          <div className="mt-14">
            <Countdown weddingDate={wedding.weddingDate} style="modern" />
          </div>
        </div>
      </section>

      {/* Gallery */}
      {wedding.photos.length > 0 && (
        <section className="px-6 py-20">
          <div className="mx-auto max-w-6xl">
            <p className="text-center text-xs uppercase tracking-[0.4em] text-[#a9573f]">
              Kỷ niệm đẹp
            </p>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              {wedding.photos.slice(0, 6).map((photo) => (
                <div key={photo.id} className="relative aspect-[4/5] overflow-hidden rounded-[1.25rem]">
                  <TemplateImage
                    src={photo.url}
                    alt={photo.alt ?? "Wedding memory"}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Extra sections */}
      <WeddingExtraSections wedding={wedding} style="traditional" />

      {/* Closing */}
      <section className="border-t border-[#c9a227]/30 px-6 py-24 text-center">
        <p className="text-6xl text-[#c9a227]" aria-hidden>
          囍
        </p>
        <h2 className="mt-6 font-serif text-4xl font-medium tracking-tight text-[#7d1f1f] md:text-5xl">
          {names}
        </h2>
        <p className="mx-auto mt-6 max-w-md text-sm font-light leading-relaxed text-[#5a4638]">
          Sự hiện diện của quý vị là niềm vinh hạnh lớn nhất của hai gia đình. Xin cảm ơn.
        </p>
      </section>
    </main>
  );
}