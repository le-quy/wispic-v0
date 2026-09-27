import { ErrorCode, created, fail, isErrorResponse, ok, withErrorHandling } from '@/lib/api-response'
import { requireUser } from '@/lib/api-auth'
import { ACCEPTED_UPLOAD_TYPES, MAX_UPLOAD_BYTES, saveImage } from '@/lib/image-storage'

/**
 * POST /api/uploads — tải một ảnh lên, trả về URL để nhúng vào thiệp.
 *
 * Chỉ cần đăng nhập, không giới hạn theo vai trò: cả chủ thiệp lẫn người dùng
 * đều dùng chung trình soạn thảo.
 */
export const POST = withErrorHandling(
  async (request: Request) => {
    const actor = await requireUser()
    if (isErrorResponse(actor)) return actor

    let form: FormData
    try {
      form = await request.formData()
    } catch {
      return fail(ErrorCode.VALIDATION_ERROR, 'Body phải là multipart/form-data')
    }

    const file = form.get('file')
    if (!(file instanceof File)) {
      return fail(ErrorCode.VALIDATION_ERROR, 'Thiếu trường "file"')
    }

    const result = await saveImage(file)
    if (!result.ok) {
      return fail(ErrorCode.VALIDATION_ERROR, result.message, {
        fields: { file: result.message },
      })
    }

    return created(result.image)
  },
  'POST /api/uploads'
)

/** Quy tắc tối thiểu để client biết trước khi tải, tránh gửi file quá lớn. */
export const GET = withErrorHandling(
  async () => {
    const actor = await requireUser()
    if (isErrorResponse(actor)) return actor

    return ok({ maxBytes: MAX_UPLOAD_BYTES, accepts: ACCEPTED_UPLOAD_TYPES })
  },
  'GET /api/uploads'
)
