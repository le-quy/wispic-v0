/**
 * Client-side helper cho API envelope của Level 2.
 *
 * Mọi response thành công có dạng `{ data, meta? }`, lỗi có dạng
 * `{ error: { code, message, fields? } }`. Hàm này trả thẳng `data` và ném
 * `ApiError` để UI hiển thị `message` / `fields` mà không phải parse thủ công.
 */

export class ApiError extends Error {
  readonly code: string
  readonly status: number
  readonly fields?: Record<string, string>

  constructor(
    message: string,
    options: { code?: string; status?: number; fields?: Record<string, string> } = {}
  ) {
    super(message)
    this.name = 'ApiError'
    this.code = options.code ?? 'UNKNOWN'
    this.status = options.status ?? 0
    this.fields = options.fields
  }
}

export async function apiFetch<T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> {
  let res: Response
  try {
    res = await fetch(input, init)
  } catch {
    throw new ApiError('Không kết nối được máy chủ', { code: 'NETWORK_ERROR' })
  }

  // 204 không có body.
  if (res.status === 204) return undefined as T

  let body: any
  try {
    body = await res.json()
  } catch {
    throw new ApiError('Máy chủ trả về dữ liệu không hợp lệ', {
      code: 'INVALID_RESPONSE',
      status: res.status,
    })
  }

  if (!res.ok) {
    const error = body?.error
    throw new ApiError(error?.message ?? `Lỗi ${res.status}`, {
      code: error?.code,
      status: res.status,
      fields: error?.fields,
    })
  }

  if (!('data' in (body ?? {}))) {
    throw new ApiError('Máy chủ trả về thiếu trường `data`', {
      code: 'INVALID_RESPONSE',
      status: res.status,
    })
  }

  return body.data as T
}

export function jsonBody(payload: unknown): RequestInit {
  return {
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }
}
