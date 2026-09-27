'use client'

import { apiFetch, jsonBody, ApiError } from '@/lib/api-client'
import { WEDDING_STATUS, type WeddingStatus } from '@/lib/status'
import {
  demoWedding,
  DEFAULT_RSVP,
  DEFAULT_GIFT,
  DEFAULT_TIMELINE,
  DEFAULT_DRESS_CODE,
  DEFAULT_MUSIC,
  DEFAULT_GUESTBOOK,
  DEFAULT_ENVELOPE,
  DEFAULT_OG,
  DEFAULT_MAP,
  type WeddingPhoto,
  type WeddingData,
} from '@/lib/wedding-data'

export type { WeddingStatus }

export type WeddingDraft = WeddingData & {
  id: string
  userId?: string
  title: string
  status: WeddingStatus
  templateId: string
  templateKey?: string
  slug?: string
  createdBy?: string
  createdAt: number
  updatedAt: number
}

export const DEFAULT_TEMPLATE_ID = 'romantic'

// Chuyển WeddingDraft -> WeddingData sống ở wedding-mapper (module không phải
// 'use client') để server component thiệp public dùng lại được.
export { toWeddingData } from '@/lib/wedding-mapper'

const API = '/api/weddings'

/** Lấp đầy các trường thiếu cho draft (migration-safe). */
export function ensureDraftDefaults(raw: Partial<WeddingDraft>): WeddingDraft {
  return {
    groom: raw.groom ?? demoWedding.groom,
    bride: raw.bride ?? demoWedding.bride,
    groomParents: raw.groomParents ?? demoWedding.groomParents,
    brideParents: raw.brideParents ?? demoWedding.brideParents,
    weddingDate: raw.weddingDate ?? demoWedding.weddingDate,
    ceremony: raw.ceremony ?? demoWedding.ceremony,
    reception: raw.reception ?? demoWedding.reception,
    location: {
      city: raw.location?.city ?? demoWedding.location.city,
      province: raw.location?.province ?? demoWedding.location.province,
      venueName: raw.location?.venueName ?? demoWedding.location.venueName,
    },
    introduction: raw.introduction ?? demoWedding.introduction,
    coupleStory: raw.coupleStory ?? demoWedding.coupleStory,
    avatar: 'avatar' in raw ? (raw.avatar ?? null) : demoWedding.avatar,
    couplePhoto: 'couplePhoto' in raw ? (raw.couplePhoto ?? null) : demoWedding.couplePhoto,
    photos: Array.isArray(raw.photos) ? raw.photos : demoWedding.photos,
    rsvp: {
      enabled: raw.rsvp?.enabled ?? DEFAULT_RSVP.enabled,
      displayMode: raw.rsvp?.displayMode ?? DEFAULT_RSVP.displayMode,
      maxGuestCount: raw.rsvp?.maxGuestCount ?? DEFAULT_RSVP.maxGuestCount,
      questions: Array.isArray(raw.rsvp?.questions)
        ? raw.rsvp.questions
        : DEFAULT_RSVP.questions,
    },
    gift: {
      enabled: raw.gift?.enabled ?? DEFAULT_GIFT.enabled,
      displayMode: raw.gift?.displayMode ?? DEFAULT_GIFT.displayMode,
      title: raw.gift?.title ?? DEFAULT_GIFT.title,
      accounts: Array.isArray(raw.gift?.accounts)
        ? raw.gift.accounts
        : DEFAULT_GIFT.accounts,
    },
    timeline: Array.isArray(raw.timeline)
      ? raw.timeline
      : DEFAULT_TIMELINE.map((e) => ({ ...e })),
    dressCode: {
      enabled: raw.dressCode?.enabled ?? DEFAULT_DRESS_CODE.enabled,
      title: raw.dressCode?.title ?? DEFAULT_DRESS_CODE.title,
      subtitle: raw.dressCode?.subtitle ?? DEFAULT_DRESS_CODE.subtitle,
      colors: Array.isArray(raw.dressCode?.colors)
        ? raw.dressCode.colors
        : DEFAULT_DRESS_CODE.colors,
    },
    music: {
      enabled: raw.music?.enabled ?? DEFAULT_MUSIC.enabled,
      url: raw.music?.url ?? DEFAULT_MUSIC.url,
      title: raw.music?.title ?? DEFAULT_MUSIC.title,
    },
    guestbook: {
      enabled: raw.guestbook?.enabled ?? DEFAULT_GUESTBOOK.enabled,
      questions: Array.isArray(raw.guestbook?.questions)
        ? raw.guestbook.questions
        : DEFAULT_GUESTBOOK.questions,
    },
    envelope: {
      greeting: raw.envelope?.greeting ?? DEFAULT_ENVELOPE.greeting,
    },
    og: {
      style: raw.og?.style ?? DEFAULT_OG.style,
      customUrl: raw.og?.customUrl ?? DEFAULT_OG.customUrl,
    },
    map: {
      embedUrl: raw.map?.embedUrl ?? DEFAULT_MAP.embedUrl,
      address: raw.map?.address ?? DEFAULT_MAP.address,
    },
    id: raw.id ?? createWeddingId(),
    title: raw.title ?? 'Thiệp cưới chưa đặt tên',
    status: raw.status ?? WEDDING_STATUS.DRAFT,
    templateId: raw.templateId ?? DEFAULT_TEMPLATE_ID,
    createdBy: raw.createdBy,
    createdAt: raw.createdAt ?? Date.now(),
    updatedAt: raw.updatedAt ?? Date.now(),
  }
}

export async function readWeddings(): Promise<WeddingDraft[]> {
  try {
    const data = await apiFetch<WeddingDraft[]>(API, { cache: 'no-store' })
    return data.map(ensureDraftDefaults)
  } catch {
    return []
  }
}

export async function readWedding(id: string): Promise<WeddingDraft | null> {
  try {
    return ensureDraftDefaults(await apiFetch<WeddingDraft>(`${API}/${id}`, { cache: 'no-store' }))
  } catch (error) {
    if (error instanceof ApiError && error.code === 'RESOURCE_NOT_FOUND') return null
    return null
  }
}

/**
 * Các field do server sở hữu — client không được gửi lên (kể cả khi sửa).
 * Server cũng allowlist lần nữa, nhưng gửi bớt giúp phát hiện sai sót sớm.
 */
function serverOwnedFields(draft: WeddingDraft) {
  const { id, userId, createdBy, createdAt, updatedAt, ...rest } = draft
  void id
  void userId
  void createdBy
  void createdAt
  void updatedAt
  return rest
}

/**
 * Lưu thiệp bằng PATCH: server chỉ ghi những cột có mặt trong body, nên gửi
 * thiếu một phần không xoá mất phần còn lại.
 */
export async function saveWedding(draft: WeddingDraft) {
  if (!draft.id.includes('-')) return
  return apiFetch<WeddingDraft>(`${API}/${draft.id}`, {
    method: 'PATCH',
    ...jsonBody(serverOwnedFields(draft)),
  })
}

export async function createWedding(draft: WeddingDraft) {
  return apiFetch<WeddingDraft>(API, { method: 'POST', ...jsonBody(serverOwnedFields(draft)) })
}

export async function deleteWedding(id: string) {
  return apiFetch<void>(`${API}/${id}`, { method: 'DELETE' })
}

/** DRAFT/UNPUBLISHED -> PUBLISHED. Endpoint riêng vì PUT thay toàn bộ cột. */
export async function publishWedding(id: string) {
  return apiFetch<WeddingDraft>(`${API}/${id}/publish`, { method: 'POST' })
}

/** PUBLISHED -> UNPUBLISHED. */
export async function unpublishWedding(id: string) {
  return apiFetch<WeddingDraft>(`${API}/${id}/unpublish`, { method: 'POST' })
}

export function createWeddingId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return `wispic-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

export function createDraftFromTemplate(
  templateId = DEFAULT_TEMPLATE_ID,
  createdBy?: string,
  userId?: string,
): WeddingDraft {
  return {
    ...demoWedding,
    id: createWeddingId(),
    userId,
    title: 'Thiệp cưới chưa đặt tên',
    status: WEDDING_STATUS.DRAFT,
    templateId,
    createdBy,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }
}

function byDateKey(data: WeddingDraft): string {
  const d = data.weddingDate?.replace(/\s+/g, ' ') ?? '20 · 10 · 2026'
  const parts = d.match(/\d{1,2}/g)
  if (!parts || parts.length < 3) return '20 · 10 · 2026'
  return `${parts[0]} · ${parts[1]} · ${parts[2]}`
}

export function summaryFromDraft(d: WeddingDraft) {
  const date = byDateKey(d)
  const city = d.location?.city ?? 'Địa điểm'
  const names = `${d.groom ?? ''} & ${d.bride ?? ''}`.trim().replace(/^& /, '')
  return { date, city, names: names || d.title }
}

export function newPhoto(url: string, alt?: string): WeddingPhoto {
  return { id: createWeddingId(), url, alt }
}

// Backward-compat helpers
export const writeWeddings = async (list: WeddingDraft[]) => {
  for (const w of list) {
    const exists = await readWedding(w.id)
    if (exists) await saveWedding(w)
    else await createWedding(w)
  }
}