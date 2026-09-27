import { isWeddingStatus, type WeddingStatus } from './status'
import { isUuid, str } from './validation'

/**
 * Allowlist cột + giá trị mặc định khi ghi bảng `weddings`.
 *
 * Mọi trường không có ở đây đều bị bỏ qua, nên body của client không thể
 * đặt `user_id`, `created_at`, `id` hay bất kỳ cột nào khác ngoài ý muốn.
 */

/** Ký hiệu "body không gửi trường này" — khác hẳn giá trị `null`/`''`. */
const UNSET = Symbol('unset')

export type WeddingWriteOptions = {
  /** Slug đã resolve trùng lặp ở route (cần DB nên không sinh ở đây). */
  slug?: string
}

function normalizeStatus(value: unknown): WeddingStatus {
  // Chấp nhận cả chữ thường để tương thích client cũ trong lúc chuyển đổi,
  // nhưng chỉ giá trị hợp lệ mới lọt xuống DB.
  const upper = typeof value === 'string' ? value.toUpperCase() : ''
  return isWeddingStatus(upper) ? upper : 'DRAFT'
}

/**
 * Đọc `a.b.c` và phân biệt "thiếu" với "có nhưng rỗng".
 *
 * Phải phân biệt vì client dùng `null` để gỡ ảnh (`avatar: null`) và `false` để
 * tắt tính năng (`music.enabled: false`) — coi hai giá trị đó là "không gửi" sẽ khiến
 * thao tác gỡ ảnh/tắt tính năng không bao giờ có hiệu lực.
 */
function readPath(body: any, path: string): { present: boolean; value: any } {
  const keys = path.split('.')
  let cursor: any = body
  for (const key of keys) {
    if (cursor === null || typeof cursor !== 'object' || !(key in cursor)) {
      return { present: false, value: undefined }
    }
    cursor = cursor[key]
  }
  return { present: true, value: cursor }
}

export function weddingInsertParams(
  ownerId: string,
  body: any,
  options: WeddingWriteOptions = {}
): unknown[] {
  const {
    templateId, templateKey, title, status,
    groom, bride, groomParents, brideParents, weddingDate,
    ceremony, reception, location,
    introduction, coupleStory,
    avatar, couplePhoto,
    rsvp, gift, dressCode, music, guestbook, envelope, og, map,
  } = body ?? {}

  // Client cũ gửi `templateId: 'romantic'` (khoá registry), client mới gửi UUID
  // trỏ vào bảng templates. Nhận cả hai để không phá phiên bản đang chạy.
  const isRegistryKey = typeof templateId === 'string' && templateId !== '' && !isUuid(templateId)
  const resolvedKey =
    (typeof templateKey === 'string' && templateKey) || (isRegistryKey ? templateId : null)

  return [
    ownerId,
    // Mẫu custom -> UUID (FK templates). Mẫu hệ thống -> khoá registry.
    isUuid(templateId) ? templateId : null,
    resolvedKey || 'romantic',
    title || 'Thiệp cưới mới',
    options.slug || null,
    normalizeStatus(status),
    groom || '', bride || '', groomParents || '', brideParents || '', weddingDate || '',
    JSON.stringify(ceremony ?? { time: '', date: '' }),
    JSON.stringify(reception ?? { time: '', description: '' }),
    JSON.stringify(location ?? { city: '', province: '', venueName: '' }),
    introduction || '', coupleStory || '',
    avatar?.url || null, avatar?.alt || '',
    couplePhoto?.url || null, couplePhoto?.alt || '',
    rsvp?.enabled ?? true, rsvp?.displayMode || 'button', rsvp?.maxGuestCount ?? 5,
    gift?.enabled ?? true, gift?.displayMode || 'button', gift?.title || 'Mừng cưới',
    dressCode?.enabled ?? true, dressCode?.title || 'Dress Code', dressCode?.subtitle || '',
    music?.enabled ?? false, music?.url || '', music?.title || '',
    guestbook?.enabled ?? true, envelope?.greeting || '',
    og?.style || 'envelope', og?.customUrl || '',
    map?.embedUrl || '', map?.address || '',
  ]
}

type FieldSpec = {
  column: string
  /** Trả `UNSET` khi body không gửi trường tương ứng. */
  value: (body: any) => unknown
}

const stringField = (column: string, path: string, fallback = ''): FieldSpec => ({
  column,
  value: (body) => {
    const { present, value } = readPath(body, path)
    return present ? str(value) || fallback : UNSET
  },
})

/** Cột JSON: thay trọn vẹn object khi có mặt, không gộp với giá trị cũ. */
const jsonField = (column: string, path: string, empty: object): FieldSpec => ({
  column,
  value: (body) => {
    const { present, value } = readPath(body, path)
    return present ? JSON.stringify(value ?? empty) : UNSET
  },
})

/**
 * Cặp `*.url` / `*.alt` của một ảnh.
 *
 * Cả hai đều dựa trên sự hiện diện của *thuộc tính cha* chứ không phải `avatar.url`:
 * client gỡ ảnh bằng cách gửi `avatar: null`, khi đó `avatar.url` không tồn tại và
 * sẽ bị hiểu nhầm là "không gửi" — ảnh cũ vẫn còn nguyên trong DB.
 */
const imageField = (urlColumn: string, altColumn: string, path: string): FieldSpec[] => [
  {
    column: urlColumn,
    value: (body) => {
      const { present, value } = readPath(body, path)
      return present ? str(value?.url) || null : UNSET
    },
  },
  {
    column: altColumn,
    value: (body) => {
      const { present, value } = readPath(body, path)
      return present ? str(value?.alt) : UNSET
    },
  },
]

const PATCH_FIELDS: FieldSpec[] = [
  stringField('title', 'title', 'Thiệp cưới mới'),
  {
    column: 'status',
    value: (body) => {
      const { present, value } = readPath(body, 'status')
      return present ? normalizeStatus(value) : UNSET
    },
  },
  // Mẫu: UUID -> FK templates, khoá registry -> template_key (xem weddingInsertParams).
  {
    column: 'template_id',
    value: (body) => {
      const { present, value } = readPath(body, 'templateId')
      if (!present) return UNSET
      return isUuid(str(value)) ? str(value) : null
    },
  },
  {
    column: 'template_key',
    value: (body) => {
      const explicit = readPath(body, 'templateKey')
      if (explicit.present && str(explicit.value)) return str(explicit.value)

      const { present, value } = readPath(body, 'templateId')
      if (!present) return UNSET
      const raw = str(value)
      if (!raw || isUuid(raw)) return UNSET
      return raw
    },
  },
  stringField('groom', 'groom'),
  stringField('bride', 'bride'),
  stringField('groom_parents', 'groomParents'),
  stringField('bride_parents', 'brideParents'),
  stringField('wedding_date', 'weddingDate'),
  jsonField('ceremony', 'ceremony', { time: '', date: '' }),
  jsonField('reception', 'reception', { time: '', description: '' }),
  jsonField('location', 'location', { city: '', province: '', venueName: '' }),
  stringField('introduction', 'introduction'),
  stringField('couple_story', 'coupleStory'),
  ...imageField('avatar_url', 'avatar_alt', 'avatar'),
  ...imageField('couple_photo_url', 'couple_photo_alt', 'couplePhoto'),
  {
    column: 'rsvp_enabled',
    value: (body) => {
      const { present, value } = readPath(body, 'rsvp.enabled')
      return present ? Boolean(value) : UNSET
    },
  },
  stringField('rsvp_display_mode', 'rsvp.displayMode', 'button'),
  {
    column: 'rsvp_max_guest_count',
    value: (body) => {
      const { present, value } = readPath(body, 'rsvp.maxGuestCount')
      return present ? Number(value) || 0 : UNSET
    },
  },
  {
    column: 'gift_enabled',
    value: (body) => {
      const { present, value } = readPath(body, 'gift.enabled')
      return present ? Boolean(value) : UNSET
    },
  },
  stringField('gift_display_mode', 'gift.displayMode', 'button'),
  stringField('gift_title', 'gift.title', 'Mừng cưới'),
  {
    column: 'dress_code_enabled',
    value: (body) => {
      const { present, value } = readPath(body, 'dressCode.enabled')
      return present ? Boolean(value) : UNSET
    },
  },
  stringField('dress_code_title', 'dressCode.title', 'Dress Code'),
  stringField('dress_code_subtitle', 'dressCode.subtitle'),
  {
    column: 'music_enabled',
    value: (body) => {
      const { present, value } = readPath(body, 'music.enabled')
      return present ? Boolean(value) : UNSET
    },
  },
  stringField('music_url', 'music.url'),
  stringField('music_title', 'music.title'),
  {
    column: 'guestbook_enabled',
    value: (body) => {
      const { present, value } = readPath(body, 'guestbook.enabled')
      return present ? Boolean(value) : UNSET
    },
  },
  stringField('envelope_greeting', 'envelope.greeting'),
  stringField('og_style', 'og.style', 'envelope'),
  stringField('og_custom_url', 'og.customUrl'),
  stringField('map_embed_url', 'map.embedUrl'),
  stringField('map_address', 'map.address'),
]

/**
 * Sinh mệnh đề `SET` cho PATCH: chỉ những cột có mặt trong body mới được ghi.
 *
 * Đây là điều PUT cũ thiếu. PUT ghi đè **mọi** cột, nên một body chỉ đổi `title`
 * sẽ xoá trắng tên công dâu chú rể, câu chuyện, ảnh và timeline — đã xảy ra
 * một lần trong quá trình kiểm thử và phải khôi phục dữ liệu từ backup.
 *
 * Trả `null` khi body rỗng, để route báo 400 thay vì chạy UPDATE vô nghĩa.
 */
export function weddingPatchSet(
  body: any,
  options: WeddingWriteOptions = {}
): { set: string; values: unknown[] } | null {
  const values: unknown[] = []
  const assignments: string[] = []

  for (const field of PATCH_FIELDS) {
    const value = field.value(body ?? {})
    if (value === UNSET) continue
    values.push(value)
    assignments.push(`${field.column} = $${values.length}`)
  }

  if (options.slug) {
    values.push(options.slug)
    assignments.push(`slug = $${values.length}`)
  }

  if (assignments.length === 0) return null
  return { set: assignments.join(', '), values }
}
