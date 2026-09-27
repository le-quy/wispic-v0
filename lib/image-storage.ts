import { createHash, randomUUID } from 'node:crypto'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, extname, join, normalize, resolve, sep } from 'node:path'

/**
 * Lưu ảnh trên ổ đĩa và phục vụ lại qua route `/media/[...path]`.
 *
 * Vì sao không bỏ thẳng vào `public/`: `output: 'standalone'` copy `public/`
 * lúc build, nên file ghi sau đó sẽ không được phục vụ. File nằm ngoài thư mục
 * đó và được đọc qua route, nên ghi lúc runtime vẫn có hiệu lực.
 *
 * Toàn bộ logic nằm sau vài hàm ở đây — khi chuyển sang S3/R2 chỉ cần thay
 * `saveImage` và `readImage`, các route và component không đổi.
 */

/** Định dạng cho phép, kèm content-type trả về khi phục vụ. */
const ALLOWED = {
  jpeg: { ext: '.jpg', contentType: 'image/jpeg' },
  png: { ext: '.png', contentType: 'image/png' },
  webp: { ext: '.webp', contentType: 'image/webp' },
  gif: { ext: '.gif', contentType: 'image/gif' },
} as const

type ImageKind = keyof typeof ALLOWED

/** Ảnh thiệp cưới thường dưới 2 MB; chặn sớm để không ghi rác vào đĩa. */
const MAX_UPLOAD_BYTES = 5 * 1024 * 1024
const MAX_BYTES = MAX_UPLOAD_BYTES

/** Danh sách content-type client được phép gửi — server vẫn kiểm lại bằng byte. */
export const ACCEPTED_UPLOAD_TYPES = Object.values(ALLOWED).map((v) => v.contentType)
export { MAX_UPLOAD_BYTES }

/** Tiền tố URL công khai, khớp route `app/media/[...path]/route.ts`. */
const PUBLIC_PREFIX = '/media'

/**
 * Thư mục lưu ảnh. Mặc định nằm cạnh `.next` để không lẫn vào mã nguồn; khi
 * deploy bằng container cần gắn volume vào đây, nếu không ảnh sẽ mất mỗi lần
 * thay thế container.
 *
 * `npm run build` in "Dynamic filesystem access causes tracing of the whole
 * project" — đây là cảnh báo từ trình đóng gói của Next khi thấy đường dẫn
 * đọc/ghi được tính lúc chạy. Ở đây vô hại và không khắc phục được: ảnh được
 * tải lên *sau khi* build nên lúc build chưa tồn tại, tracing chúng không có ý
 * nghĩa gì. `outputFileTracingExcludes` không tác dụng với Turbopack (đã thử,
 * cả warning lẫn kích thước bản standalone đều không đổi) nên không thêm.
 */
const UPLOAD_DIR = resolve(process.env.UPLOAD_DIR ?? join(process.cwd(), '.uploads'))

export type StoredImage = {
  url: string
  kind: ImageKind
  contentType: string
  bytes: number
}

/**
 * Nhận diện định dạng từ byte đầu tiên, không tin `file.type` do client khai —
 * client có thể gửi tên `.jpg` cho bất kỳ nội dung nào, kể cả HTML/JS.
 */
function detectKind(bytes: Uint8Array): ImageKind | null {
  if (bytes.length < 12) return null

  // JPEG: FF D8 FF
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return 'jpeg'

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47 &&
    bytes[4] === 0x0d && bytes[5] === 0x0a && bytes[6] === 0x1a && bytes[7] === 0x0a
  ) {
    return 'png'
  }

  // GIF: "GIF87a" / "GIF89a"
  if (bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x38) return 'gif'

  // WebP: "RIFF" .... "WEBP"
  if (
    bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46 &&
    bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50
  ) {
    return 'webp'
  }

  return null
}

export type SaveResult =
  | { ok: true; image: StoredImage }
  | { ok: false; reason: 'too_large' | 'unsupported_type' | 'empty'; message: string }

export async function saveImage(file: File): Promise<SaveResult> {
  if (file.size === 0) {
    return { ok: false, reason: 'empty', message: 'Tệp rỗng' }
  }
  if (file.size > MAX_BYTES) {
    return {
      ok: false,
      reason: 'too_large',
      message: `Ảnh vượt quá ${Math.round(MAX_BYTES / 1024 / 1024)} MB`,
    }
  }

  const bytes = new Uint8Array(await file.arrayBuffer())
  const kind = detectKind(bytes)
  if (!kind) {
    return {
      ok: false,
      reason: 'unsupported_type',
      message: 'Chỉ hỗ trợ ảnh JPG, PNG, WebP hoặc GIF',
    }
  }

  // Tên file do server sinh. Không dùng tên client gửi: vừa tránh ghi đè file
  // khác, vừa chặn đường dẫn như `../../etc/passwd`.
  // Đuôi file lấy từ định dạng đã xác minh, không lấy từ tên gốc.
  const id = `${randomUUID()}${ALLOWED[kind].ext}`
  const diskPath = join(UPLOAD_DIR, id)
  await mkdir(dirname(diskPath), { recursive: true })
  await writeFile(diskPath, bytes, { flag: 'wx' })

  return {
    ok: true,
    image: {
      url: `${PUBLIC_PREFIX}/${id}`,
      kind,
      contentType: ALLOWED[kind].contentType,
      bytes: bytes.length,
    },
  }
}

export type ReadResult =
  | { ok: true; bytes: Buffer; contentType: string; etag: string }
  | { ok: false; reason: 'not_found' | 'invalid_path' }

export async function readImage(path: string): Promise<ReadResult> {
  // Chặn path traversal: `..`, ký tự null, và đường dẫn tuyệt đối.
  // Chặn ở tầng đọc file chứ không chỉ ở route, để sau này gọi từ chỗ khác
  // vẫn an toàn.
  if (
    !path ||
    path.includes('\0') ||
    path.includes('..') ||
    path.startsWith('/') ||
    path.includes('\\')
  ) {
    return { ok: false, reason: 'invalid_path' }
  }

  // Chỉ phục vụ đúng các đuôi ảnh đã cho phép — chặn `.html`, `.svg`, `.js`
  // nằm trong thư mục upload.
  const ext = extname(path).toLowerCase()
  const entry = (Object.keys(ALLOWED) as ImageKind[])
    .map((k) => [k, ALLOWED[k]] as const)
    .find(([, v]) => v.ext === ext)
  if (!entry) return { ok: false, reason: 'invalid_path' }
  const { contentType } = entry[1]

  const diskPath = resolve(UPLOAD_DIR, path)
  // Chốt chặn cuối: kết quả resolve phải nằm trong thư mục upload.
  if (diskPath !== UPLOAD_DIR && !diskPath.startsWith(UPLOAD_DIR + sep)) {
    return { ok: false, reason: 'invalid_path' }
  }

  let bytes: Buffer
  try {
    bytes = await readFile(diskPath)
  } catch {
    return { ok: false, reason: 'not_found' }
  }

  return {
    ok: true,
    bytes,
    contentType,
    etag: `"${createHash('sha1').update(bytes).digest('base64url')}"`,
  }
}

/** Chỉ dùng để hiển thị log/debug. */
export function uploadDir() {
  return UPLOAD_DIR
}

/** Chuẩn hoá đường dẫn tương đối cho `readImage`. */
export function normalizeMediaPath(path: string) {
  return normalize(path).replace(/^\/+/, '')
}
