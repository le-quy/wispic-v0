import type { NextConfig } from "next";

/**
 * Đổi tên route public theo Level 2. Giữ 301 (permanent) để link cũ đã được
 * chia sẻ, in trên thiệp mời hoặc lưu trong bookmark vẫn dẫn đúng chỗ.
 *
 * Bỏ các mục này chỉ khi chắc chắn không còn traffic tới URL cũ.
 */
const LEGACY_REDIRECTS: { source: string; destination: string }[] = [
  { source: "/portfolio", destination: "/photography" },
  { source: "/portfolio/:path*", destination: "/photography/:path*" },
  { source: "/stories", destination: "/share" },
  { source: "/stories/:slug", destination: "/share/:slug" },
  { source: "/stories/:path*", destination: "/share/:path*" },
  { source: "/about", destination: "/services/about" },
  { source: "/contact", destination: "/services/booking" },
  { source: "/invitations", destination: "/wedding/templates" },
];

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }],
  },
  // `permanent: true` của Next tương đương 308 (giữ nguyên method). Đổi tên
  // route GET nên dùng 301 đúng như yêu cầu — 308 chỉ đúng khi cần giữ POST.
  // Next không cho khai cả `permanent` lẫn `statusCode` cùng lúc, nên chỉ
  // truyền `statusCode`.
  async redirects() {
    return LEGACY_REDIRECTS.map((rule) => ({
      ...rule,
      statusCode: 301 as const,
    }));
  },
};

export default nextConfig;
