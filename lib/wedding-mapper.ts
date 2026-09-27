import type { WeddingData } from './wedding-data'

/**
 * Cùng hình dạng với `WeddingDraft` của client, nhưng khai báo cục bộ để module
 * này không phải import từ `wedding-storage.ts` (module 'use client').
 */
type WeddingDraft = WeddingData & {
  id: string
  title: string
  status: string
  templateId: string
}
/** Khối SELECT dùng chung: w.* + 6 bảng con gom về json_agg. */
export const WEDDING_SELECT = `
  SELECT
    w.*,
    COALESCE(
      (SELECT json_agg(json_build_object('id', wp.id, 'url', wp.url, 'alt', wp.alt, 'sort_order', wp.sort_order) ORDER BY wp.sort_order)
       FROM wedding_photos wp WHERE wp.wedding_id = w.id), '[]'
    ) as photos,
    COALESCE(
      (SELECT json_agg(json_build_object('id', rq.id, 'text', rq.text, 'type', rq.type) ORDER BY rq.sort_order)
       FROM rsvp_questions rq WHERE rq.wedding_id = w.id), '[]'
    ) as rsvp_questions,
    COALESCE(
      (SELECT json_agg(json_build_object('id', ga.id, 'bank_name', ga.bank_name, 'account_number', ga.account_number, 'holder_name', ga.holder_name, 'qr_url', ga.qr_url) ORDER BY ga.sort_order)
       FROM gift_accounts ga WHERE ga.wedding_id = w.id), '[]'
    ) as gift_accounts,
    COALESCE(
      (SELECT json_agg(json_build_object('id', te.id, 'time', te.time, 'title', te.title) ORDER BY te.sort_order)
       FROM timeline_events te WHERE te.wedding_id = w.id), '[]'
    ) as timeline_events,
    COALESCE(
      (SELECT json_agg(dc.color ORDER BY dc.sort_order)
       FROM dress_code_colors dc WHERE dc.wedding_id = w.id), '[]'
    ) as dress_code_colors,
    COALESCE(
      (SELECT json_agg(json_build_object('id', gq.id, 'text', gq.text, 'type', gq.type) ORDER BY gq.sort_order)
       FROM guestbook_questions gq WHERE gq.wedding_id = w.id), '[]'
    ) as guestbook_questions
  FROM weddings w
`

function parseJson<T>(value: unknown, fallback: T): T {
  if (value === null || value === undefined) return fallback
  if (typeof value === 'string') {
    try {
      return JSON.parse(value) as T
    } catch {
      return fallback
    }
  }
  return value as T
}

export function mapRowToWedding(row: any) {
  if (!row) return null

  return {
    id: row.id,
    userId: row.user_id,
    templateId: row.template_id,
    templateKey: row.template_key,
    title: row.title,
    slug: row.slug,
    status: row.status,
    groom: row.groom,
    bride: row.bride,
    groomParents: row.groom_parents,
    brideParents: row.bride_parents,
    weddingDate: row.wedding_date,
    ceremony: parseJson(row.ceremony, { time: '', date: '' }),
    reception: parseJson(row.reception, { time: '', description: '' }),
    location: parseJson(row.location, { city: '', province: '', venueName: '' }),
    introduction: row.introduction,
    coupleStory: row.couple_story,
    avatar: row.avatar_url ? { id: 'avatar', url: row.avatar_url, alt: row.avatar_alt || '' } : null,
    couplePhoto: row.couple_photo_url
      ? { id: 'couple', url: row.couple_photo_url, alt: row.couple_photo_alt || '' }
      : null,
    photos: (row.photos || []).map((p: any) => ({ id: p.id, url: p.url, alt: p.alt || '' })),
    rsvp: {
      enabled: row.rsvp_enabled,
      displayMode: row.rsvp_display_mode,
      maxGuestCount: row.rsvp_max_guest_count,
      questions: (row.rsvp_questions || []).map((q: any) => ({ id: q.id, text: q.text, type: q.type })),
    },
    gift: {
      enabled: row.gift_enabled,
      displayMode: row.gift_display_mode,
      title: row.gift_title,
      accounts: (row.gift_accounts || []).map((a: any) => ({
        id: a.id,
        bankName: a.bank_name,
        accountNumber: a.account_number,
        holderName: a.holder_name,
        qrUrl: a.qr_url,
      })),
    },
    timeline: (row.timeline_events || []).map((t: any) => ({
      id: t.id,
      time: t.time,
      title: t.title,
    })),
    dressCode: {
      enabled: row.dress_code_enabled,
      title: row.dress_code_title,
      subtitle: row.dress_code_subtitle,
      colors: row.dress_code_colors || [],
    },
    music: {
      enabled: row.music_enabled,
      url: row.music_url,
      title: row.music_title,
    },
    guestbook: {
      enabled: row.guestbook_enabled,
      questions: (row.guestbook_questions || []).map((q: any) => ({
        id: q.id,
        text: q.text,
        type: q.type,
      })),
    },
    envelope: { greeting: row.envelope_greeting },
    og: { style: row.og_style, customUrl: row.og_custom_url },
    map: { embedUrl: row.map_embed_url, address: row.map_address },
    createdAt: new Date(row.created_at).getTime(),
    updatedAt: new Date(row.updated_at).getTime(),
  }
}

/**
 * WeddingDraft -> WeddingData: dùng bởi cả server component (thiệp public) và
 * client (editor, preview).
 */
export function toWeddingData(d: WeddingDraft): WeddingData {
  return {
    groom: d.groom,
    bride: d.bride,
    groomParents: d.groomParents,
    brideParents: d.brideParents,
    weddingDate: d.weddingDate,
    ceremony: d.ceremony,
    reception: d.reception,
    location: d.location,
    introduction: d.introduction,
    coupleStory: d.coupleStory,
    avatar: d.avatar,
    couplePhoto: d.couplePhoto,
    photos: d.photos,
    rsvp: d.rsvp,
    gift: d.gift,
    timeline: d.timeline,
    dressCode: d.dressCode,
    music: d.music,
    guestbook: d.guestbook,
    envelope: d.envelope,
    og: d.og,
    map: d.map,
  }
}
