import { AuthShell } from "@/components/auth-shell";
import { ForgotPasswordForm } from "@/components/forgot-password-form";

export default function Page() {
  return (
    <AuthShell
      label="Khôi phục mật khẩu"
      title="Quên mật khẩu"
      description="Nhập email của bạn, chúng tôi sẽ gửi mã xác thực (OTP) để bạn đặt lại mật khẩu."
    >
      <ForgotPasswordForm />
    </AuthShell>
  );
}
