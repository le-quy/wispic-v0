import Image from 'next/image'

type TemplateImageProps = {
  src: string
  alt: string
  className?: string
  fill?: boolean
  sizes?: string
  priority?: boolean
  width?: number
  height?: number
}

function isRemote(src: string) {
  return src.startsWith('/') || /^https?:\/\//.test(src) || src.startsWith('blob:')
}

/**
 * Ảnh trong template thiệp:
 * - nguồn remote (http(s)/blob) → dùng next/image (optimize + lazy)
 * - nguồn local (data: base64 từ file upload) → dùng <img> thường (next/image không hỗ trợ data:)
 */
export function TemplateImage({
  src,
  alt,
  className,
  fill,
  sizes,
  priority,
  width,
  height,
}: TemplateImageProps) {
  if (!isRemote(src)) {
    if (fill) {
      return (
        // eslint-disable-next-line @next/next/no-img-element -- data: URL upload, next/image không hỗ trợ
        <img
          src={src}
          alt={alt}
          className={className ?? 'absolute inset-0 h-full w-full object-cover'}
          loading={priority ? 'eager' : 'lazy'}
        />
      )
    }
    return (
      // eslint-disable-next-line @next/next/no-img-element -- data: URL upload
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={className}
        loading={priority ? 'eager' : 'lazy'}
      />
    )
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      sizes={sizes}
      priority={priority}
      width={width}
      height={height}
      className={className}
    />
  )
}