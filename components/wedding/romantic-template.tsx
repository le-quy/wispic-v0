import Link from "next/link";
import { TemplateImage } from "@/components/wedding/template-image";
import { Countdown, WeddingExtraSections } from "@/components/wedding/wedding-extra-sections";
import type { WeddingData } from "@/lib/wedding-data";

interface RomanticTemplateProps {
  wedding: WeddingData;
  backHref?: string;
  hideBack?: boolean;
}

export default function RomanticTemplate({ wedding, backHref = "/", hideBack }: RomanticTemplateProps) {
  const names = `${wedding.groom} & ${wedding.bride}`;

  return (
    <main className="min-h-screen bg-[#f7f3ee] text-[#302b27]">
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
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
        <TemplateImage
          src={wedding.avatar?.url ?? wedding.photos[0]?.url ?? ""}
          alt={names}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/25" />
        <div className="relative z-10 px-6 text-center text-white">
          <p className="mb-6 text-xs uppercase tracking-[0.5em]">Wedding Invitation</p>
          <h1 className="font-serif text-6xl italic md:text-8xl">
            {names}
          </h1>
          <div className="mx-auto my-8 h-px w-20 bg-white/70" />
          <p className="text-sm tracking-[0.3em]">{wedding.weddingDate}</p>
        </div>
      </section>

      {/* Introduction */}
      <section className="px-6 py-28">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs uppercase tracking-[0.35em] text-[#9b8878]">
            We are getting married
          </p>
          <h2 className="mt-6 font-serif text-4xl italic md:text-5xl">
            Hai người, một câu chuyện.
          </h2>
          <p className="mt-8 text-sm leading-8 text-[#706861]">
            {wedding.introduction}
          </p>
          {(wedding.groomParents || wedding.brideParents) && (
            <p className="mt-6 text-xs leading-7 tracking-wider text-[#9b8878]">
              {wedding.groomParents && <span>{wedding.groomParents} · con trai</span>}
              {wedding.groomParents && wedding.brideParents && <span className="mx-2">—</span>}
              {wedding.brideParents && <span>{wedding.brideParents} · con gái</span>}
            </p>
          )}
        </div>
      </section>

      {/* Couple */}
      <section className="bg-white px-6 py-24">
        <div className="mx-auto grid max-w-5xl items-center gap-12 md:grid-cols-2">
          <div className="overflow-hidden rounded-[2rem]">
            <TemplateImage
              src={wedding.couplePhoto?.url ?? wedding.photos[0]?.url ?? ""}
              alt={names}
              width={1000}
              height={1250}
              className="aspect-[4/5] w-full object-cover"
            />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[#9b8878]">
              The Couple
            </p>
            <h2 className="mt-5 font-serif text-5xl italic">{names}</h2>
            <p className="mt-7 text-sm leading-8 text-[#706861]">{wedding.coupleStory}</p>
          </div>
        </div>
      </section>

      {/* Wedding Information */}
      <section className="px-6 py-28">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-[#9b8878]">
            Save the date
          </p>
          <h2 className="mt-5 font-serif text-5xl italic">{wedding.weddingDate}</h2>
          <div className="mx-auto mt-12">
            <Countdown weddingDate={wedding.weddingDate} style="romantic" />
          </div>
          <div className="mt-14 grid gap-5 md:grid-cols-3">
            <div className="rounded-2xl bg-white p-8">
              <p className="text-xs uppercase tracking-widest text-[#9b8878]">Ceremony</p>
              <p className="mt-4 font-serif text-2xl">{wedding.ceremony.time}</p>
              <p className="mt-2 text-sm text-[#706861]">{wedding.ceremony.date}</p>
            </div>
            <div className="rounded-2xl bg-white p-8">
              <p className="text-xs uppercase tracking-widest text-[#9b8878]">Reception</p>
              <p className="mt-4 font-serif text-2xl">{wedding.reception.time}</p>
              <p className="mt-2 text-sm text-[#706861]">{wedding.reception.description}</p>
            </div>
            <div className="rounded-2xl bg-white p-8">
              <p className="text-xs uppercase tracking-widest text-[#9b8878]">Location</p>
              <p className="mt-4 font-serif text-2xl">{wedding.location.city}</p>
              <p className="mt-2 text-sm text-[#706861]">{wedding.location.province}</p>
            </div>
          </div>
          {wedding.location.venueName && (
            <p className="mt-6 text-sm italic text-[#706861]">{wedding.location.venueName}</p>
          )}
        </div>
      </section>

      {/* Gallery */}
      {wedding.photos.length > 0 && (
        <section className="bg-white px-6 py-24">
          <div className="mx-auto max-w-7xl">
            <div className="mb-12 text-center">
              <p className="text-xs uppercase tracking-[0.3em] text-[#9b8878]">
                Our memories
              </p>
              <h2 className="mt-4 font-serif text-4xl italic md:text-5xl">Những khoảnh khắc</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {wedding.photos.slice(0, 6).map((photo) => (
                <TemplateImage
                  key={photo.id}
                  src={photo.url}
                  alt={photo.alt ?? "Wedding memory"}
                  width={900}
                  height={1200}
                  className="aspect-[3/4] w-full rounded-2xl object-cover"
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Extra sections: dress code, timeline, map, gift, guestbook, rsvp */}
      <WeddingExtraSections wedding={wedding} style="romantic" />

      {/* Closing */}
      <section className="bg-[#302b27] px-6 py-32 text-center text-white">
        <p className="text-xs uppercase tracking-[0.4em] text-white/50">With love</p>
        <h2 className="mt-6 font-serif text-5xl italic md:text-7xl">{names}</h2>
        <p className="mt-8 text-sm text-white/60">
          Cảm ơn bạn đã đến và chia sẻ niềm vui cùng chúng mình.
        </p>
      </section>
    </main>
  );
}