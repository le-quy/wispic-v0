/**
 * Validate phía server. Spec 00-level2-conventions yêu cầu validation ở
 * cả client lẫn server — client chỉ để UX, server mới là hàng rào thật.
 *
 * Kiểu trả về: hàm này ném `ValidationError`; route bắt và chuyển thành
 * response 422 qua `fail(ErrorCode.VALIDATION_ERROR, ...)`.
 */

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export class ValidationError extends Error {
  readonly fields: Record<string, string>

  constructor(fields: Record<string, string>) {
    super('Dữ liệu không hợp lệ')
    this.name = 'ValidationError'
    this.fields = fields
  }
}

export function isUuid(value: unknown): value is string {
  return typeof value === 'string' && UUID_RE.test(value)
}

/** Cắt khoảng trắng thừa, `undefined` thành chuỗi rỗng. */
export function str(value: unknown): string {
  return typeof value === 'string' ? value.trim() : ''
}

export function optionalStr(value: unknown): string {
  return str(value) || ''
}

export function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value)
}

export function clampInt(value: unknown, min: number, max: number, fallback: number): number {
  if (!isFiniteNumber(value)) return fallback
  return Math.min(max, Math.max(min, Math.trunc(value)))
}

/**
 * Thu thập lỗi thay vì ném ngay, để trả về tất cả trường sai trong
 * một response duy nhất thay vì bắt người dùng sửa lần lượt.
 */
export class FieldErrors {
  private readonly errors: Record<string, string> = {}

  required(field: string, value: unknown, label?: string): string {
    const v = str(value)
    if (!v) this.errors[field] = `${label ?? field} là bắt buộc`
    return v
  }

  maxLength(field: string, value: string, max: number, label?: string): string {
    if (value.length > max) this.errors[field] = `${label ?? field} tối đa ${max} ký tự`
    return value
  }

  oneOf(field: string, value: unknown, allowed: readonly string[], label?: string): string {
    const v = str(value)
    if (!v || !(allowed as readonly string[]).includes(v)) {
      this.errors[field] = `${label ?? field} không hợp lệ`
      return ''
    }
    return v
  }

  uuid(field: string, value: unknown, label?: string): string {
    if (value === undefined || value === null || value === '') return ''
    if (!isUuid(value)) {
      this.errors[field] = `${label ?? field} không hợp lệ`
      return ''
    }
    return value
  }

  add(field: string, message: string): void {
    this.errors[field] = message
  }

  get isEmpty(): boolean {
    return Object.keys(this.errors).length === 0
  }

  get fields(): Record<string, string> {
    return this.errors
  }

  throwIfAny(): void {
    if (!this.isEmpty) throw new ValidationError(this.errors)
  }
}
