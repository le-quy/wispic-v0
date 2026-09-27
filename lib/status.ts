/**
 * Nguồn sự thật duy nhất cho mọi trạng thái trong DB.
 *
 * Level 2 quy định trạng thái viết HOA và có `UNPUBLISHED` (bỏ xuất bản
 * nhưng giữ nguyên dữ liệu đã nhập) — xem
 * lib/docs/ba/Wispic_BA_Level2/00-level2-conventions.md
 *
 * So sánh chuỗi trực tiếp (`w.status === 'published'`) là nguồn sai lệch
 * thường gặp: DB đã đổi sang VIẾT HOA ở migration-2026-09-27.
 */

export const WEDDING_STATUSES = ['DRAFT', 'PUBLISHED', 'UNPUBLISHED', 'ARCHIVED'] as const
export type WeddingStatus = (typeof WEDDING_STATUSES)[number]

export const TEMPLATE_STATUSES = ['DRAFT', 'PUBLISHED', 'ARCHIVED'] as const
export type TemplateStatus = (typeof TEMPLATE_STATUSES)[number]

export const ARTICLE_STATUSES = ['DRAFT', 'PUBLISHED', 'UNPUBLISHED', 'ARCHIVED'] as const
export type ArticleStatus = (typeof ARTICLE_STATUSES)[number]

export const COLLECTION_STATUSES = ['DRAFT', 'PUBLISHED', 'UNPUBLISHED', 'ARCHIVED'] as const
export type CollectionStatus = (typeof COLLECTION_STATUSES)[number]

export const BOOKING_STATUSES = ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'] as const
export type BookingStatus = (typeof BOOKING_STATUSES)[number]

export const ARTICLE_CONTENT_TYPES = ['EXPLORE', 'SHARE'] as const
export type ArticleContentType = (typeof ARTICLE_CONTENT_TYPES)[number]

export const ARTICLE_CONTENT = {
  EXPLORE: 'EXPLORE',
  SHARE: 'SHARE',
} as const satisfies Record<ArticleContentType, ArticleContentType>

/** Trạng thái duy nhất được phép xem công khai. */
export const PUBLISHED = 'PUBLISHED' as const

/**
 * Hằng số trạng thái thiệp, dùng khi so sánh/ghi DB.
 * Ràng buộc CHECK trong DB là nguồn sự thật; đây là bản sao phía TypeScript.
 */
export const WEDDING_STATUS = {
  DRAFT: 'DRAFT',
  PUBLISHED: 'PUBLISHED',
  UNPUBLISHED: 'UNPUBLISHED',
  ARCHIVED: 'ARCHIVED',
} as const satisfies Record<WeddingStatus, WeddingStatus>

export const TEMPLATE_STATUS = {
  DRAFT: 'DRAFT',
  PUBLISHED: 'PUBLISHED',
  ARCHIVED: 'ARCHIVED',
} as const satisfies Record<TemplateStatus, TemplateStatus>

/** Các trạng thái bị ẩn khỏi mọi route public. */
export function isPublicStatus(status: string): boolean {
  return status === PUBLISHED
}

function isOneOf<T extends readonly string[]>(value: unknown, allowed: T): value is T[number] {
  return typeof value === 'string' && (allowed as readonly string[]).includes(value)
}

export const isWeddingStatus = (v: unknown): v is WeddingStatus => isOneOf(v, WEDDING_STATUSES)
export const isTemplateStatus = (v: unknown): v is TemplateStatus => isOneOf(v, TEMPLATE_STATUSES)
export const isArticleStatus = (v: unknown): v is ArticleStatus => isOneOf(v, ARTICLE_STATUSES)
export const isCollectionStatus = (v: unknown): v is CollectionStatus => isOneOf(v, COLLECTION_STATUSES)
export const isBookingStatus = (v: unknown): v is BookingStatus => isOneOf(v, BOOKING_STATUSES)
export const isArticleContentType = (v: unknown): v is ArticleContentType =>
  isOneOf(v, ARTICLE_CONTENT_TYPES)
