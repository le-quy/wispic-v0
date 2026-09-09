import { AuthShell } from "@/components/auth-shell";
import { UpdatePasswordForm } from "@/components/update-password-form";

export default function Page() {
  return (
    <AuthShell
      label="Mật khẩu mới"
      title="Đặt lại mật khẩu"
      description="Nhập mật khẩu mới cho tài khoản của bạn để hoàn tất quá trình khôi phục."
    >
      <UpdatePasswordForm />
    </AuthShell>
  );
}
