'use client'

import { useEffect, useRef, useState } from 'react'
import { Music4, Pause, X } from 'lucide-react'
import type { WeddingData } from '@/lib/wedding-data'

type SectionStyle = 'romantic' | 'modern' | 'traditional'

const STYLE_VARS: Record<
  SectionStyle,
  {
    bg: string
    card: string
    label: string
    text: string
    muted: string
    accent: string
    border: string
  }
> = {
  romantic: {
    bg: '#f7f3ee',
    card: '#ffffff',
    label: '#9b8878',
    text: '#302b27',
    muted: '#706861',
    accent: '#9b8878',
    border: '#e6ddd1',
  },
  modern: {
    bg: '#fbfaf7',
    card: '#ffffff',
    label: '#d97832',
    text: '#1f1d1b',
    muted: '#6b6661',
    accent: '#d97832',
    border: '#e8e2d9',
  },
  traditional: {
    bg: '#fdf8ef',
    card: '#fffaf0',
    label: '#c9a227',
    text: '#5a1f1f',
    muted: '#8a6a4e',
    accent: '#c9a227',
    border: '#ead7b8',
  },
}

const DEFAULT_STYLE: SectionStyle = 'romantic'

function borderRadius(style: SectionStyle) {
  return style === 'romantic' ? '2rem' : style === 'modern' ? '1rem' : '0.5rem'
}

/* ---------------- Countdown ---------------- */
function parseWeddingDate(dateStr: string): Date | null {
  const parts = dateStr.match(/\d{1,2}/g)
  if (!parts || parts.length < 3) return null
  const [d, m, y] = parts.map((p) => parseInt(p, 10))
  const target = new Date(y, m - 1, d, 0, 0, 0)
  return Number.isNaN(target.getTime()) ? null : target
}

function Countdown({ weddingDate, style }: { weddingDate: string; style: SectionStyle }) {
  const [now, setNow] = useState(() => Date.now())
  const vars = STYLE_VARS[style]

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(t)
  }, [])

  const target = parseWeddingDate(weddingDate)
  let days = 0
  let hours = 0
  let minutes = 0
  let seconds = 0

  if (target) {
    const diff = Math.max(0, target.getTime() - now)
    days = Math.floor(diff / 86400000)
    hours = Math.floor((diff % 86400000) / 3600000)
    minutes = Math.floor((diff % 3600000) / 60000)
    seconds = Math.floor((diff % 60000) / 1000)
  }

  const Cells = [
    { label: 'Ngày', value: days },
    { label: 'Giờ', value: hours },
    { label: 'Phút', value: minutes },
    { label: 'Giây', value: seconds },
  ]

  return (
    <div className="flex justify-center gap-3 sm:gap-5">
      {Cells.map((c) => (
        <div
          key={c.label}
          className="flex min-w-[64px] flex-col items-center rounded-xl px-4 py-4 sm:min-w-[84px]"
          style={{ backgroundColor: vars.card, border: `1px solid ${vars.bg}` }}
        >
          <span
            className="font-serif text-3xl font-medium sm:text-4xl"
            style={{ color: vars.text }}
          >
            {String(c.value).padStart(2, '0')}
          </span>
          <span className="mt-2 text-[0.65rem] uppercase tracking-[0.2em]" style={{ color: vars.muted }}>
            {c.label}
          </span>
        </div>
      ))}
    </div>
  )
}

/* ---------------- Timeline ---------------- */
function TimelineSection({ wedding, style }: { wedding: WeddingData; style: SectionStyle }) {
  const vars = STYLE_VARS[style]
  const items = wedding.timeline ?? []
  if (items.length === 0) return null
  return (
    <section style={{ backgroundColor: vars.bg, color: vars.text }} className="px-6 py-24">
      <div className="mx-auto max-w-3xl text-center">
        <p
          className="text-xs uppercase tracking-[0.35em]"
          style={{ color: vars.label }}
        >
          Timeline
        </p>
        <h2 className="mt-5 font-serif text-4xl font-medium md:text-5xl">
          Lịch trình buổi tiệc
        </h2>
        <div className="mt-14 space-y-0">
          {items.map((ev, i) => (
            <div key={ev.id} className="relative flex items-start gap-6 py-5">
              {i < items.length - 1 && (
                <span
                  className="absolute left-[5px] top-14 h-full w-px"
                  style={{ backgroundColor: vars.accent, opacity: 0.4 }}
                />
              )}
              <span
                className="relative mt-1 h-[11px] w-[11px] shrink-0 rounded-full"
                style={{ backgroundColor: vars.accent }}
              />
              <div className="flex-1 text-left">
                {ev.time && (
                  <p className="font-serif text-2xl font-medium" style={{ color: vars.accent }}>
                    {ev.time}
                  </p>
                )}
                {ev.title && (
                  <p className="mt-1 text-sm leading-6" style={{ color: vars.text }}>
                    {ev.title}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ---------------- Dress code ---------------- */
function DressCodeSection({ wedding, style }: { wedding: WeddingData; style: SectionStyle }) {
  const vars = STYLE_VARS[style]
  const dc = wedding.dressCode
  if (!dc || !dc.enabled || !dc.title) return null
  const colors = dc.colors ?? []
  return (
    <section style={{ backgroundColor: vars.bg, color: vars.text }} className="px-6 py-24">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-xs uppercase tracking-[0.35em]" style={{ color: vars.label }}>
          Dress Code
        </p>
        <h2 className="mt-5 font-serif text-4xl font-medium md:text-5xl">{dc.title}</h2>
        {dc.subtitle && (
          <p className="mt-4 text-sm leading-7" style={{ color: vars.muted }}>
            {dc.subtitle}
          </p>
        )}
        {colors.length > 0 && (
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {colors.map((c) => (
              <div key={c} className="flex flex-col items-center gap-2">
                <span
                  className="h-14 w-14 rounded-full border"
                  style={{
                    backgroundColor: c,
                    borderColor: vars.border ?? '#e2d6c3',
                    boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.08)',
                  }}
                />
                <span className="text-xs font-light" style={{ color: vars.muted }}>
                  {c}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

/* ---------------- Gift / QR ---------------- */
function GiftSection({ wedding, style }: { wedding: WeddingData; style: SectionStyle }) {
  const vars = STYLE_VARS[style]
  const gift = wedding.gift
  const accounts = gift?.enabled ? (gift.accounts ?? []) : []
  if (accounts.length === 0) return null
  const radius = borderRadius(style)
  return (
    <section style={{ backgroundColor: vars.bg, color: vars.text }} className="px-6 py-24">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-xs uppercase tracking-[0.35em]" style={{ color: vars.label }}>
          Mừng cưới
        </p>
        <h2 className="mt-5 font-serif text-4xl font-medium md:text-5xl">
          {gift.title || 'Mừng cưới'}
        </h2>
        <p className="mt-4 text-sm leading-7" style={{ color: vars.muted }}>
          Nếu bạn muốn gửi lời chúc mừng, chúng mình rất trân trọng.
        </p>
        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {accounts.map((acc) => (
            <div
              key={acc.id}
              className="p-6 text-left"
              style={{ backgroundColor: vars.card, borderRadius: radius }}
            >
              {acc.qrUrl && (
                <div className="mb-4 flex justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element -- data: URL upload */}
                  <img
                    src={acc.qrUrl}
                    alt="QR mừng cưới"
                    className="h-28 w-28 rounded-lg object-contain"
                  />
                </div>
              )}
              {acc.bankName && (
                <p className="text-xs uppercase tracking-[0.2em]" style={{ color: vars.accent }}>
                  {acc.bankName}
                </p>
              )}
              {acc.accountNumber && (
                <p className="mt-2 font-serif text-2xl font-medium" style={{ color: vars.text }}>
                  {acc.accountNumber}
                </p>
              )}
              {acc.holderName && (
                <p className="mt-2 text-sm font-light" style={{ color: vars.muted }}>
                  {acc.holderName}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ---------------- Map ---------------- */
function MapSection({ wedding, style }: { wedding: WeddingData; style: SectionStyle }) {
  const vars = STYLE_VARS[style]
  const map = wedding.map
  if (!map?.embedUrl) return null
  const radius = borderRadius(style)
  return (
    <section style={{ backgroundColor: vars.bg, color: vars.text }} className="px-6 py-24">
      <div className="mx-auto max-w-4xl text-center">
        <p className="text-xs uppercase tracking-[0.35em]" style={{ color: vars.label }}>
          Chỉ đường
        </p>
        <h2 className="mt-5 font-serif text-4xl font-medium md:text-5xl">Bản đồ</h2>
        {map.address && (
          <p className="mt-4 text-sm leading-7" style={{ color: vars.muted }}>
            {map.address}
          </p>
        )}
        <div className="mt-10 overflow-hidden" style={{ borderRadius: radius }}>
          <iframe
            src={map.embedUrl}
            title="Bản đồ"
            className="h-80 w-full border-0"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  )
}

/* ---------------- RSVP ---------------- */
function RsvpSection({ wedding, style }: { wedding: WeddingData; style: SectionStyle }) {
  const vars = STYLE_VARS[style]
  const rsvp = wedding.rsvp
  const [attending, setAttending] = useState<boolean | null>(null)

  if (!rsvp?.enabled) return null
  const questions = rsvp.questions ?? []

  const handleConfirm = (v: boolean) => {
    setAttending(v)
    alert(
      v
        ? 'Cảm ơn bạn đã xác nhận tham dự!'
        : 'Chúng mình rất tiếc vì bạn không thể tham dự. Hãy luôn giữ liên lạc nhé!',
    )
  }

  return (
    <section style={{ backgroundColor: vars.bg, color: vars.text }} className="px-6 py-24">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-xs uppercase tracking-[0.35em]" style={{ color: vars.label }}>
          RSVP
        </p>
        <h2 className="mt-5 font-serif text-4xl font-medium md:text-5xl">
          Xác nhận tham dự
        </h2>
        <p className="mt-4 text-sm leading-7" style={{ color: vars.muted }}>
          Hãy cho chúng mình biết bạn có thể đến và tham gia ngày vui.
        </p>

        {attending === null ? (
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => handleConfirm(true)}
              className="rounded-full px-8 py-3 text-sm font-medium text-white transition-transform hover:scale-105"
              style={{ backgroundColor: vars.accent }}
            >
              Tôi sẽ đến
            </button>
            <button
              type="button"
              onClick={() => handleConfirm(false)}
              className="rounded-full border px-8 py-3 text-sm font-medium transition-colors hover:opacity-80"
              style={{ borderColor: vars.text, color: vars.text }}
            >
              Tiếc quá, tôi không đến được
            </button>
          </div>
        ) : (
          <p
            className="mt-10 text-lg font-medium"
            style={{ color: attending ? vars.accent : vars.muted }}
          >
            {attending
              ? 'Tuyệt vời! Hẹn gặp bạn.'
              : 'Cảm ơn bạn đã phản hồi. Hẹn gặp lại bạn lần khác.'}
          </p>
        )}

        {questions.length > 0 && (
          <div className="mt-10 space-y-4 text-left">
            {questions.map((q) => (
              <div key={q.id} className="text-left">
                <p className="text-sm font-medium" style={{ color: vars.text }}>
                  {q.text}
                </p>
                {q.type === 'yes_no' ? (
                  <div className="mt-2 flex gap-2">
                    {['Có', 'Không'].map((opt) => (
                      <span
                        key={opt}
                        className="rounded-full border px-4 py-1.5 text-xs"
                        style={{ borderColor: vars.border ?? '#e2d6c3', color: vars.text }}
                      >
                        {opt}
                      </span>
                    ))}
                  </div>
                ) : (
                  <input
                    className="mt-2 w-full rounded-lg border px-3 py-2 text-sm"
                    placeholder="Trả lời..."
                    style={{ borderColor: vars.border ?? '#e2d6c3', backgroundColor: vars.card, color: vars.text }}
                  />
                )}
              </div>
            ))}
          </div>
        )}

        {rsvp.displayMode === 'button' && (
          <div className="mt-10">
            <button
              type="button"
              onClick={() => handleConfirm(true)}
              className="rounded-full px-8 py-3 text-sm font-medium text-white transition-transform hover:scale-105"
              style={{ backgroundColor: vars.accent }}
            >
              Xác nhận tham dự
            </button>
          </div>
        )}
      </div>
    </section>
  )
}

/* ---------------- Guest book ---------------- */
function GuestbookSection({ wedding, style }: { wedding: WeddingData; style: SectionStyle }) {
  const vars = STYLE_VARS[style]
  const gb = wedding.guestbook
  const [wish, setWish] = useState('')
  const [sent, setSent] = useState(false)

  if (!gb?.enabled) return null

  const submit = () => {
    if (!wish.trim()) return
    setSent(true)
    setWish('')
    setTimeout(() => setSent(false), 3000)
  }

  return (
    <section style={{ backgroundColor: vars.bg, color: vars.text }} className="px-6 py-24">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-xs uppercase tracking-[0.35em]" style={{ color: vars.label }}>
          Lời chúc
        </p>
        <h2 className="mt-5 font-serif text-4xl font-medium md:text-5xl">
          Gửi lời chúc đến cặp đôi
        </h2>
        {sent && (
          <p className="mt-4 rounded-lg px-4 py-2 text-sm font-medium" style={{ backgroundColor: vars.card, color: vars.accent }}>
            Cảm ơn lời chúc của bạn!
          </p>
        )}
        <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row">
          <input
            value={wish}
            onChange={(e) => setWish(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submit()}
            placeholder="Viết lời chúc của bạn..."
            className="flex-1 rounded-full px-5 py-3 text-sm"
            style={{ backgroundColor: vars.card, border: `1px solid ${vars.bg}`, color: vars.text }}
          />
          <button
            type="button"
            onClick={submit}
            className="rounded-full px-7 py-3 text-sm font-medium text-white transition-transform hover:scale-105"
            style={{ backgroundColor: vars.accent }}
          >
            Gửi
          </button>
        </div>
      </div>
    </section>
  )
}

/* ---------------- Envelope greeting ---------------- */
function EnvelopeSection({ wedding, style }: { wedding: WeddingData; style: SectionStyle }) {
  const vars = STYLE_VARS[style]
  const greeting = wedding.envelope?.greeting
  if (!greeting) return null
  return (
    <section
      style={{ backgroundColor: vars.card, color: vars.text }}
      className="px-6 py-20 text-center"
    >
      <div className="mx-auto max-w-md">
        <p className="font-serif text-2xl italic leading-relaxed md:text-3xl">{greeting}</p>
      </div>
    </section>
  )
}

/* ---------------- Music player ---------------- */
function isAudioUrl(url?: string): boolean {
  if (!url) return false
  const lower = url.toLowerCase()
  return (
    lower.endsWith('.mp3') ||
    lower.endsWith('.wav') ||
    lower.endsWith('.ogg') ||
    lower.endsWith('.m4a') ||
    lower.endsWith('.aac') ||
    lower.endsWith('.flac')
  )
}

function extractYoutubeId(url?: string): string | null {
  if (!url) return null
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([\w-]{11})/,
    /(?:youtu\.be\/)([\w-]{11})/,
    /(?:youtube\.com\/embed\/)([\w-]{11})/,
    /(?:youtube\.com\/shorts\/)([\w-]{11})/,
    /^([\w-]{11})$/,
  ]
  for (const p of patterns) {
    const m = url.match(p)
    if (m) return m[1]
  }
  return null
}

function MusicPlayer({ wedding, style }: { wedding: WeddingData; style: SectionStyle }) {
  const vars = STYLE_VARS[style]
  const music = wedding.music
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [playing, setPlaying] = useState(false)
  const [youtubeOpen, setYoutubeOpen] = useState(false)

  const src = music?.url?.trim() ?? ''
  const youtubeId = extractYoutubeId(src)

  // Hiện player khi có link nhạc hợp lệ (file audio hoặc YouTube) — kể cả khi toggle chưa bật,
  // để tránh trường hợp nhập link mà không thấy gì.
  const musicEnabled =
    !!music && !!src && (!!youtubeId || isAudioUrl(src))

  // Cố gắng tự phát nhạc nền (trình duyệt có thể chặn autoplay)
  useEffect(() => {
    if (!isAudioUrl(src) || !src) return

    const audio = new Audio(src)
    audio.loop = true
    audio.volume = 0.5
    audioRef.current = audio

    let cancelled = false
    audio
      .play()
      .then(() => {
        if (!cancelled) setPlaying(true)
      })
      .catch(() => {
        if (!cancelled) setPlaying(false)
      })

    return () => {
      cancelled = true
      audio.pause()
      audio.src = ''
      audioRef.current = null
    }
  }, [src])

  if (!musicEnabled) return null

  // YouTube: nút nổi mở/đóng trình phát nhạc dạng popup
  if (youtubeId) {
    return (
      <>
        <button
          type="button"
          onClick={() => setYoutubeOpen((v) => !v)}
          aria-label={youtubeOpen ? 'Đóng nhạc' : 'Mở nhạc'}
          title={music.title || 'Nhạc nền'}
          className="fixed bottom-6 right-6 z-50 inline-flex h-12 w-12 items-center justify-center rounded-full text-white shadow-xl transition-transform hover:scale-110"
          style={{ backgroundColor: vars.accent }}
        >
          {youtubeOpen ? (
            <X className="h-5 w-5" strokeWidth={2} />
          ) : (
            <Music4 className="h-5 w-5" strokeWidth={2} />
          )}
        </button>
        {youtubeOpen && (
          <div className="fixed bottom-24 right-6 z-50 w-[min(90vw,340px)] overflow-hidden rounded-2xl bg-black/85 p-3 text-white shadow-2xl">
            <iframe
              src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&loop=1&playlist=${youtubeId}&rel=0`}
              title={music.title || 'Nhạc nền YouTube'}
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
              className="aspect-video w-full rounded-lg border-0"
            />
            {music.title && (
              <p className="mt-2 truncate px-1 text-xs text-white/80">{music.title}</p>
            )}
          </div>
        )}
        {!youtubeOpen && music.title && (
          <div className="pointer-events-none fixed bottom-6 left-1/2 z-50 max-w-[70vw] -translate-x-1/2 rounded-full bg-black/50 px-4 py-1.5 text-xs text-white backdrop-blur">
            {music.title}
          </div>
        )}
      </>
    )
  }

  const toggle = () => {
    const audio = audioRef.current
    if (!audio) return
    if (playing) {
      audio.pause()
      setPlaying(false)
    } else {
      audio.play().then(() => setPlaying(true)).catch(() => {})
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? 'Tắt nhạc' : 'Bật nhạc'}
        title={music.title || 'Nhạc nền'}
        className="fixed bottom-6 right-6 z-50 inline-flex h-12 w-12 items-center justify-center rounded-full text-white shadow-xl transition-transform hover:scale-110"
        style={{ backgroundColor: vars.accent }}
      >
        {playing ? (
          <Pause className="h-5 w-5" strokeWidth={2} />
        ) : (
          <Music4 className="h-5 w-5" strokeWidth={2} />
        )}
      </button>
      {music.title && (
        <div className="pointer-events-none fixed bottom-6 left-1/2 z-50 max-w-[70vw] -translate-x-1/2 truncate rounded-full bg-black/50 px-4 py-1.5 text-xs text-white backdrop-blur">
          {playing ? '♪ ' : ''}
          {music.title}
        </div>
      )}
    </>
  )
}

/* ---------------- Aggregate ---------------- */
export function WeddingExtraSections({
  wedding,
  style = DEFAULT_STYLE,
}: {
  wedding: WeddingData
  style?: SectionStyle
}) {
  return (
    <>
      <MusicPlayer wedding={wedding} style={style} />
      <EnvelopeSection wedding={wedding} style={style} />
      <DressCodeSection wedding={wedding} style={style} />
      <TimelineSection wedding={wedding} style={style} />
      <MapSection wedding={wedding} style={style} />
      <GiftSection wedding={wedding} style={style} />
      <GuestbookSection wedding={wedding} style={style} />
      <RsvpSection wedding={wedding} style={style} />
    </>
  )
}

export { Countdown }
