import { NextResponse } from 'next/server'

/**
 * Chuẩn response API theo spec lib/docs/ba/Wispic_BA_Level2/00-level2-conventions.md
 *
 *   thành công: { "data": ..., "meta": {...} }
 *   thất bại:  { "error": { "code": "RESOURCE_NOT_FOUND", "message": "..." } }
 *
 * Client chỉ được đọc `data` — không còn mảng trần hay `{ error: "chuỗi" }`.
 */

export const ErrorCode = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  RESOURCE_NOT_FOUND: 'RESOURCE_NOT_FOUND',
  CONFLICT: 'CONFLICT',
  RATE_LIMITED: 'RATE_LIMITED',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
} as const

export type ErrorCodeValue = (typeof ErrorCode)[keyof typeof ErrorCode]

const STATUS_BY_CODE: Record<ErrorCodeValue, number> = {
  [ErrorCode.VALIDATION_ERROR]: 422,
  [ErrorCode.UNAUTHORIZED]: 401,
  [ErrorCode.FORBIDDEN]: 403,
  [ErrorCode.RESOURCE_NOT_FOUND]: 404,
  [ErrorCode.CONFLICT]: 409,
  [ErrorCode.RATE_LIMITED]: 429,
  [ErrorCode.INTERNAL_ERROR]: 500,
}

type Meta = Record<string, unknown> | undefined

/**
 * Đánh dấu những response được tạo từ `fail()`.
 * `ok()` cũng trả về một Response, nên phân biệt bằng `instanceof Response`
 * sẽ dễ nhầm — WeakSet là cách kiểm tra chắc chắn.
 */
const errorResponses = new WeakSet<object>()

export function isErrorResponse(value: unknown): value is NextResponse {
  return typeof value === 'object' && value !== null && errorResponses.has(value)
}

/** 200 (hoặc status tuỳ chọn) với body `{ data, meta }`. */
export function ok<T>(data: T, meta?: Meta, status = 200) {
  return NextResponse.json(meta === undefined ? { data } : { data, meta }, { status })
}

/** 201 — dùng khi tạo mới. */
export function created<T>(data: T, meta?: Meta) {
  return ok(data, meta, 201)
}

/** 204 — không có body, client chỉ cần biết thành công. */
export function noContent() {
  return new NextResponse(null, { status: 204 })
}

/**
 * Lỗi có mã ổn định để client bắt theo `code`, không parse message.
 * `fields` dành cho lỗi validation: { email: 'Email không hợp lệ' }.
 */
export function fail(
  code: ErrorCodeValue,
  message: string,
  options: { status?: number; fields?: Record<string, string> } = {}
) {
  const body: { error: { code: ErrorCodeValue; message: string; fields?: Record<string, string> } } = {
    error: { code, message },
  }
  if (options.fields) body.error.fields = options.fields

  const response = NextResponse.json(body, {
    status: options.status ?? STATUS_BY_CODE[code],
  })
  errorResponses.add(response)
  return response
}

/**
 * Bọc handler để lỗi ngoài ý muốn luôn trả đúng chuẩn thay vì
 * Next trả HTML 500. Log ở server, không lộ chi tiết cho client.
 */
export function withErrorHandling<Args extends unknown[]>(
  handler: (...args: Args) => Promise<NextResponse>,
  label: string
) {
  return async (...args: Args): Promise<NextResponse> => {
    try {
      return await handler(...args)
    } catch (error) {
      console.error(`${label} error:`, error)
      return fail(ErrorCode.INTERNAL_ERROR, 'Đã có lỗi xảy ra, vui lòng thử lại')
    }
  }
}
