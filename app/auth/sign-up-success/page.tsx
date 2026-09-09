import Link from "next/link";
import { AuthShell } from "@/components/auth-shell";

export default function Page() {
  return (
    <AuthShell
      label="Kiểm tra email"
      title="Gần xong rồi"
      description="Bạn đã đăng ký thành công. Vui lòng kiểm tra email để xác nhận tài khoản trước khi đăng nhập."
    >
      <div className="wispic-card">
        <div className="flex flex-col items-center gap-4 p-6 text-center md:p-8">
          <p className="text-sm font-light leading-relaxed text-muted-foreground">
            Nếu bạn đăng ký bằng email, một liên kết xác nhận đã được gửi đến
            hộp thư của bạn. Hãy mở email và bấm vào liên kết để hoàn tất.
          </p>
          <Link
            href="/auth/login"
            className="wispic-btn-primary mt-2 justify-center"
          >
            Đăng nhập
          </Link>
          <Link
            href="/"
            className="text-sm font-medium text-terracotta underline-offset-4 hover:underline"
          >
            Quay lại trang chủ
          </Link>
        </div>
      </div>
    </AuthShell>
  );
}
