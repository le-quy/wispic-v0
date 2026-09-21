'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  CalendarDays,
  Check,
  Eye,
  FileSignature,
  Gift,
  ImageIcon,
  Mail,
  MapPin,
  Music,
  Palette,
  PenLine,
  Save,
  Sparkles,
  Timer,
} from 'lucide-react'
import {
  createDraftFromTemplate,
  createWedding,
  newPhoto,
  DEFAULT_TEMPLATE_ID,
  toWeddingData,
} from '@/lib/wedding-storage'
import type { WeddingData, WeddingPhoto } from '@/lib/wedding-data'
import { cn } from '@/lib/utils'
import {
  CollapsibleSection,
  DressCodeEditor,
  EditorQuickNav,
  EnvelopeEditor,
  GalleryManager,
  GiftEditor,
  GuestbookEditor,
  MapEditor,
  MusicEditor,
  OgImageEditor,
  PhoneMockupPreview,
  PhotoPicker,
  RsvpEditor,
  Section,
  TemplateGallery,
  TimelineEditor,
  inputCls,
  labelCls,
  readFileAsDataUrl,
  textareaCls,
  useTemplateInfo,
} from '@/components/wedding/editor-shared'

function initialData(): WeddingData {
  const draft = createDraftFromTemplate()
  return toWeddingData(draft)
}

export function CreateWedding() {
  const router = useRouter()
  const [data, setData] = useState<WeddingData>(initialData)
  const [templateId, setTemplateId] = useState(DEFAULT_TEMPLATE_ID)
  const [mobileView, setMobileView] = useState<'edit' | 'preview'>('edit')
  const [saved, setSaved] = useState(false)

  const templateInfo = useTemplateInfo(templateId)

  const set = <K extends keyof WeddingData>(key: K, value: WeddingData[K]) =>
    setData((prev) => ({ ...prev, [key]: value }))

  const setNested = (
    key: 'ceremony' | 'reception' | 'location',
    field: string,
    value: string,
  ) =>
    setData((prev) => ({
      ...prev,
      [key]: { ...(prev[key] as Record<string, string>), [field]: value },
    }))

  const setPhoto = (key: 'avatar' | 'couplePhoto', photo: WeddingPhoto | null) =>
    setData((prev) => ({ ...prev, [key]: photo }))

  const setPhotos = (photos: WeddingPhoto[]) => set('photos', photos)

  const addGalleryFile = async (file: File) => {
    const url = await readFileAsDataUrl(file)
    setPhotos([...data.photos, newPhoto(url, 'Kỷ niệm')])
  }

  const addGalleryUrl = (url: string) => {
    if (!url.trim()) return
    setPhotos([...data.photos, newPhoto(url.trim(), 'Kỷ niệm')])
  }

  const removePhoto = (photoId: string) =>
    setPhotos(data.photos.filter((p) => p.id !== photoId))

  const handleSave = async (status: 'draft' | 'published') => {
    let userId: string | undefined
    try {
      const meRes = await fetch('/api/auth/me', { cache: 'no-store' })
      if (meRes.ok) {
        const me = await meRes.json()
        userId = me.id
      }
    } catch {}

    const draft = createDraftFromTemplate(templateId, userId)
    const now = Date.now()
    const next = {
      ...draft,
      ...data,
      id: draft.id,
      userId,
      templateId,
      title: data.groom
        ? `${data.groom} & ${data.bride || 'Cô dâu'}`
        : 'Thiệp cưới chưa đặt tên',
      status,
      createdAt: now,
      updatedAt: now,
    }
    await createWedding(next)
    setSaved(true)
    setTimeout(() => router.push('/dashboard'), 400)
  }

  return (
    <div className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8 flex flex-col gap-6">
      {/* Top Header Bar (Chungdoi Style) */}
      <div className="flex flex-col gap-4 border-b border-border/60 pb-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-card px-3.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground shadow-xs"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Danh sách thiệp
            </Link>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-terracotta/10 px-3 py-1 text-xs font-medium text-terracotta">
              <Sparkles className="h-3 w-3" />
              Bản nháp mới
            </span>
            <span className="hidden md:inline-flex items-center gap-1.5 text-xs font-light text-muted-foreground">
              Mẫu: <strong className="font-medium text-foreground">{templateInfo.name}</strong>
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => handleSave('draft')}
              disabled={saved}
              className="wispic-btn-outline !py-2 !px-4 text-xs sm:text-sm"
            >
              <Save className="h-3.5 w-3.5" strokeWidth={1.8} />
              {saved ? 'Đã lưu...' : 'Lưu bản nháp'}
            </button>
            <button
              type="button"
              onClick={() => handleSave('published')}
              disabled={saved}
              className="wispic-btn-primary !py-2 !px-5 text-xs sm:text-sm"
            >
              <Check className="h-3.5 w-3.5" strokeWidth={2} />
              Tạo thiệp & Xuất bản
            </button>
          </div>
        </div>

        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-medium tracking-tight text-foreground">
            {data.groom ? `${data.groom} & ${data.bride || 'Cô dâu'}` : 'Tạo thiệp cưới mới'}
          </h1>
          <p className="mt-1 text-xs sm:text-sm font-light text-muted-foreground">
            Không gian chỉnh sửa rộng rãi. Tùy chỉnh thông tin, kích hoạt tính năng thông minh và xem trước trực tiếp trên khung điện thoại.
          </p>
        </div>

        {/* Quick section navigation pills */}
        <EditorQuickNav />
      </div>

      {/* Mobile view switch bar (Clean, non-intrusive) */}
      <div className="sticky top-16 z-20 xl:hidden -mx-4 px-4 py-2 bg-background/95 backdrop-blur border-b border-border/60">
        <div className="flex rounded-full bg-secondary/70 p-1">
          <button
            type="button"
            onClick={() => setMobileView('edit')}
            className={cn(
              'flex-1 flex items-center justify-center gap-2 rounded-full py-2 text-xs font-medium transition-all',
              mobileView === 'edit'
                ? 'bg-card text-foreground shadow-xs font-semibold'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            <PenLine className="h-3.5 w-3.5 text-terracotta" strokeWidth={1.8} />
            Chỉnh sửa thông tin
          </button>
          <button
            type="button"
            onClick={() => setMobileView('preview')}
            className={cn(
              'flex-1 flex items-center justify-center gap-2 rounded-full py-2 text-xs font-medium transition-all',
              mobileView === 'preview'
                ? 'bg-card text-foreground shadow-xs font-semibold'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            <Eye className="h-3.5 w-3.5 text-terracotta" strokeWidth={1.8} />
            Xem trước thiệp
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </button>
        </div>
      </div>

      {/* Main Grid: Spacious Left Form + Sticky Right Phone Preview */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_420px] xl:grid-cols-[minmax(0,1fr)_440px] 2xl:grid-cols-[minmax(0,1fr)_460px] items-start">
        {/* Controls Column */}
        <form
          className={cn(
            'flex flex-col gap-6',
            mobileView === 'preview' && 'hidden xl:flex',
          )}
          onSubmit={(e) => {
            e.preventDefault()
            handleSave('published')
          }}
        >
          {/* 1. Template Gallery */}
          <div id="section-template" className="scroll-mt-28">
            <TemplateGallery activeId={templateId} onSelect={setTemplateId} />
          </div>

          {/* 2. Couple Information */}
          <Section id="section-couple" title="Cô dâu & chú rể" hint="Tên và thông tin gia đình hai bên">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="groom" className={labelCls}>
                  Tên chú rể
                </label>
                <input
                  id="groom"
                  className={inputCls}
                  placeholder="Nguyễn Văn A"
                  value={data.groom}
                  onChange={(e) => set('groom', e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="bride" className={labelCls}>
                  Tên cô dâu
                </label>
                <input
                  id="bride"
                  className={inputCls}
                  placeholder="Trần Thị B"
                  value={data.bride}
                  onChange={(e) => set('bride', e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="groomParents" className={labelCls}>
                  Gia đình chú rể (Bố & Mẹ)
                </label>
                <input
                  id="groomParents"
                  className={inputCls}
                  placeholder="Ông Nguyễn Văn C & Bà Lê Thị D"
                  value={data.groomParents}
                  onChange={(e) => set('groomParents', e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="brideParents" className={labelCls}>
                  Gia đình cô dâu (Bố & Mẹ)
                </label>
                <input
                  id="brideParents"
                  className={inputCls}
                  placeholder="Ông Trần Văn E & Bà Phạm Thị F"
                  value={data.brideParents}
                  onChange={(e) => set('brideParents', e.target.value)}
                />
              </div>
            </div>
          </Section>

          {/* 3. Event Dates & Times */}
          <Section id="section-event" title="Ngày cưới & giờ giấc" hint="Thời gian làm lễ và đãi tiệc">
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="weddingDate" className={labelCls}>
                  Ngày cưới (hiển thị chính trên thiệp)
                </label>
                <input
                  id="weddingDate"
                  className={inputCls}
                  placeholder="20 · 10 · 2026"
                  value={data.weddingDate}
                  onChange={(e) => set('weddingDate', e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="ceremonyTime" className={labelCls}>
                  Giờ hôn lễ
                </label>
                <input
                  id="ceremonyTime"
                  className={inputCls}
                  placeholder="09:00"
                  value={data.ceremony.time}
                  onChange={(e) => setNested('ceremony', 'time', e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="receptionTime" className={labelCls}>
                  Giờ tiệc mừng
                </label>
                <input
                  id="receptionTime"
                  className={inputCls}
                  placeholder="11:30"
                  value={data.reception.time}
                  onChange={(e) => setNested('reception', 'time', e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="ceremonyDate" className={labelCls}>
                  Ngày lễ (dương lịch / âm lịch chi tiết)
                </label>
                <input
                  id="ceremonyDate"
                  className={inputCls}
                  placeholder="Chủ Nhật, ngày 20 tháng 10 năm 2026"
                  value={data.ceremony.date}
                  onChange={(e) => setNested('ceremony', 'date', e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="receptionDesc" className={labelCls}>
                  Ghi chú tiệc cưới
                </label>
                <input
                  id="receptionDesc"
                  className={inputCls}
                  placeholder="Buổi tiệc thân mật cùng gia đình & bạn bè"
                  value={data.reception.description}
                  onChange={(e) => setNested('reception', 'description', e.target.value)}
                />
              </div>
            </div>
          </Section>

          {/* 4. Location */}
          <Section id="section-location" title="Địa điểm tổ chức" hint="Tên trung tâm tiệc cưới và địa chỉ">
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="venueName" className={labelCls}>
                  Tên địa điểm / Trung tâm tiệc cưới
                </label>
                <input
                  id="venueName"
                  className={inputCls}
                  placeholder="Trung tâm tiệc cưới Hoàng Gia (Sảnh Diamond)"
                  value={data.location.venueName}
                  onChange={(e) => setNested('location', 'venueName', e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="city" className={labelCls}>
                  Quận / Huyện / Thành phố
                </label>
                <input
                  id="city"
                  className={inputCls}
                  placeholder="Quận 1"
                  value={data.location.city}
                  onChange={(e) => setNested('location', 'city', e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="province" className={labelCls}>
                  Tỉnh / Thành phố
                </label>
                <input
                  id="province"
                  className={inputCls}
                  placeholder="TP. Hồ Chí Minh"
                  value={data.location.province}
                  onChange={(e) => setNested('location', 'province', e.target.value)}
                />
              </div>
            </div>
          </Section>

          {/* 5. Content */}
          <Section id="section-content" title="Nội dung thiệp" hint="Lời mời trang trọng và câu chuyện tình yêu">
            <div className="grid gap-5">
              <div>
                <label htmlFor="introduction" className={labelCls}>
                  Lời mời chân thành gửi khách
                </label>
                <textarea
                  id="introduction"
                  rows={4}
                  className={textareaCls}
                  placeholder="Sự hiện diện của quý khách là niềm vinh hạnh lớn nhất của gia đình chúng tôi..."
                  value={data.introduction}
                  onChange={(e) => set('introduction', e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="coupleStory" className={labelCls}>
                  Câu chuyện tình yêu của hai bạn
                </label>
                <textarea
                  id="coupleStory"
                  rows={4}
                  className={textareaCls}
                  placeholder="Từ ánh mắt đầu tiên gặp gỡ cho đến ngày hôm nay..."
                  value={data.coupleStory}
                  onChange={(e) => set('coupleStory', e.target.value)}
                />
              </div>
            </div>
          </Section>

          {/* 6. Photos */}
          <Section id="section-photos" title="Album & Hình ảnh" hint="Ảnh đại diện, ảnh đôi và bộ sưu tập kỷ niệm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <PhotoPicker
                label="Ảnh đại diện (Cô dâu / Chú rể)"
                value={data.avatar}
                onChange={(p) => setPhoto('avatar', p)}
              />
              <PhotoPicker
                label="Ảnh cặp đôi (Ảnh bìa thiệp)"
                value={data.couplePhoto}
                onChange={(p) => setPhoto('couplePhoto', p)}
              />
            </div>

            <div className="mt-8 border-t border-border/60 pt-6">
              <div className="mb-4">
                <p className="text-sm font-medium text-foreground">Bộ sưu tập ảnh kỷ niệm</p>
                <p className="text-xs font-light text-muted-foreground">Tải ảnh kỷ niệm cưới để hiển thị trong slide ảnh</p>
              </div>
              <GalleryManager
                photos={data.photos}
                onAddFile={addGalleryFile}
                onAddUrl={addGalleryUrl}
                onRemove={removePhoto}
              />
            </div>
          </Section>

          {/* 7. Extended Features Header */}
          <div id="section-features" className="pt-2 scroll-mt-28">
            <div className="mb-1 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-terracotta" />
              <h2 className="text-xs font-semibold uppercase tracking-[0.25em] text-terracotta">
                Tính năng tương tác & Mở rộng
              </h2>
            </div>
            <p className="text-xs font-light text-muted-foreground">
              Bật hoặc tắt các tính năng như RSVP xác nhận tham dự, mừng cưới online, dress code và nhạc nền với công tắc toggle.
            </p>
          </div>

          {/* RSVP */}
          <CollapsibleSection
            id="section-rsvp"
            title="RSVP — Xác nhận tham dự"
            hint="Khách báo trước việc tham dự và số lượng đi cùng"
            icon={<CalendarDays className="h-4 w-4" strokeWidth={1.8} />}
            enabled={data.rsvp.enabled}
            onToggle={(enabled) => set('rsvp', { ...data.rsvp, enabled })}
          >
            <RsvpEditor
              value={data.rsvp}
              onChange={(rsvp) => set('rsvp', rsvp)}
              hideToggle
            />
          </CollapsibleSection>

          {/* Gift / Banking */}
          <CollapsibleSection
            id="section-gift"
            title="Mừng cưới & Tài khoản ngân hàng"
            hint="Hiển thị số tài khoản và mã QR để khách gửi quà mừng"
            icon={<Gift className="h-4 w-4" strokeWidth={1.8} />}
            enabled={data.gift.enabled}
            onToggle={(enabled) => set('gift', { ...data.gift, enabled })}
          >
            <GiftEditor
              value={data.gift}
              onChange={(gift) => set('gift', gift)}
              hideToggle
            />
          </CollapsibleSection>

          {/* Timeline */}
          <CollapsibleSection
            id="section-timeline"
            title="Lịch trình ngày cưới (Timeline)"
            hint="Các mốc thời gian đón khách, làm lễ, khai tiệc"
            icon={<Timer className="h-4 w-4" strokeWidth={1.8} />}
            badge={`${data.timeline.length} mốc`}
          >
            <TimelineEditor
              value={data.timeline}
              onChange={(timeline) => set('timeline', timeline)}
            />
          </CollapsibleSection>

          {/* Dress code */}
          <CollapsibleSection
            id="section-dresscode"
            title="Dress code"
            hint="Gợi ý tông màu trang phục cho khách tham dự"
            icon={<Palette className="h-4 w-4" strokeWidth={1.8} />}
            enabled={data.dressCode.enabled}
            onToggle={(enabled) => set('dressCode', { ...data.dressCode, enabled })}
          >
            <DressCodeEditor
              value={data.dressCode}
              onChange={(dressCode) => set('dressCode', dressCode)}
              hideToggle
            />
          </CollapsibleSection>

          {/* Music */}
          <CollapsibleSection
            id="section-music"
            title="Nhạc nền đám cưới"
            hint="Tự động phát khi khách mở thiệp (MP3 hoặc link YouTube)"
            icon={<Music className="h-4 w-4" strokeWidth={1.8} />}
            enabled={data.music.enabled}
            onToggle={(enabled) => set('music', { ...data.music, enabled })}
          >
            <MusicEditor
              value={data.music}
              onChange={(music) => set('music', music)}
              hideToggle
            />
          </CollapsibleSection>

          {/* Guestbook */}
          <CollapsibleSection
            id="section-guestbook"
            title="Sổ lưu bút & Lời chúc"
            hint="Cho phép khách gửi lời chúc mừng chân thành tới đôi bạn"
            icon={<FileSignature className="h-4 w-4" strokeWidth={1.8} />}
            enabled={data.guestbook.enabled}
            onToggle={(enabled) => set('guestbook', { ...data.guestbook, enabled })}
          >
            <GuestbookEditor
              value={data.guestbook}
              onChange={(guestbook) => set('guestbook', guestbook)}
              hideToggle
            />
          </CollapsibleSection>

          {/* Envelope Greeting */}
          <CollapsibleSection
            id="section-envelope"
            title="Lời chào phong bì thiệp"
            hint="Lời ngỏ trang trọng xuất hiện ở bìa phong thư khi mở thiệp"
            icon={<Mail className="h-4 w-4" strokeWidth={1.8} />}
          >
            <EnvelopeEditor
              value={data.envelope}
              onChange={(envelope) => set('envelope', envelope)}
            />
          </CollapsibleSection>

          {/* Social Share Image (OG) */}
          <CollapsibleSection
            id="section-og"
            title="Ảnh hiển thị khi chia sẻ (Zalo / Facebook)"
            hint="Ảnh thumbnail xuất hiện khi gửi link thiệp qua tin nhắn hoặc mạng xã hội"
            icon={<ImageIcon className="h-4 w-4" strokeWidth={1.8} />}
          >
            <OgImageEditor
              value={data.og}
              onChange={(og) => set('og', og)}
            />
          </CollapsibleSection>

          {/* Google Maps */}
          <CollapsibleSection
            id="section-map"
            title="Bản đồ chỉ đường (Google Maps)"
            hint="Khung bản đồ dẫn đường trực tiếp đến sảnh tiệc"
            icon={<MapPin className="h-4 w-4" strokeWidth={1.8} />}
            badge={data.map?.embedUrl ? 'Đã có link bản đồ' : undefined}
          >
            <MapEditor
              value={data.map}
              onChange={(map) => set('map', map)}
            />
          </CollapsibleSection>

          {/* Bottom Save Bar */}
          <div className="flex flex-col gap-3.5 border-t border-border/60 pt-6 sm:flex-row">
            <button
              type="button"
              onClick={() => handleSave('draft')}
              className="wispic-btn-outline flex-1 !py-3"
              disabled={saved}
            >
              <Save className="h-4 w-4" strokeWidth={1.8} />
              {saved ? 'Đang lưu...' : 'Lưu bản nháp'}
            </button>
            <button
              type="submit"
              className="wispic-btn-primary flex-1 !py-3"
              disabled={saved}
            >
              <Check className="h-4 w-4" strokeWidth={2} />
              Tạo thiệp & Xuất bản
            </button>
          </div>
        </form>

        {/* Realtime Phone Mockup Preview (Chungdoi Style) */}
        <div className={cn('flex flex-col gap-3', mobileView === 'edit' && 'hidden xl:flex')}>
          <PhoneMockupPreview
            templateId={templateId}
            wedding={data}
            className="xl:sticky xl:top-20"
          />
        </div>
      </div>
    </div>
  )
}
