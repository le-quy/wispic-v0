import { normalizeMediaPath, readImage } from '@/lib/image-storage'

/**
 * GET /media/[...path] — phục vụ ảnh đã tải lên.
 *
 * Cố ý không bọc `withErrorHandling`: route này trả ảnh chứ không trả JSON, nên
 * lỗi trả 404/500 dạng text thay vì envelope.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params
  const result = await readImage(normalizeMediaPath(path.join('/')))

  if (!result.ok) {
    // Không phân biệt "đường dẫn sai" với "không tồn tại" để không dò được
    // cấu trúc thư mục trên đĩa.
    return new Response('Not found', {
      status: 404,
      headers: { 'Cache-Control': 'no-store' },
    })
  }

  // Tên file là UUID nên nội dung của một URL không bao giờ đổi -> cache vĩnh viễn.
  const headers = new Headers({
    'Content-Type': result.contentType,
    'Content-Length': String(result.bytes.length),
    'Cache-Control': 'public, max-age=31536000, immutable',
    // Chặn trình duyệt tự đoán kiểu nội dung: tệp do người dùng tải lên là dữ
    // liệu, không phải tài nguyên của site.
    'X-Content-Type-Options': 'nosniff',
    'Content-Disposition': 'inline',
    ETag: result.etag,
  })

  // Trình duyệt đã có bản này -> 304, không tải lại ảnh.
  const ifNoneMatch = request.headers.get('if-none-match')
  if (ifNoneMatch && ifNoneMatch.split(',').some((tag) => tag.trim() === result.etag)) {
    return new Response(null, { status: 304, headers })
  }

  return new Response(new Uint8Array(result.bytes), { headers })
}
