import { AuthShell } from "@/components/auth-shell";
import { SignUpForm } from "@/components/sign-up-form";

export default function Page() {
  return (
    <AuthShell
      label="Bắt đầu hành trình"
      title="Đăng ký"
      description="Tạo tài khoản miễn phí và bắt đầu tạo một chiếc thiệp cưới mang dấu ấn riêng."
    >
      <SignUpForm />
    </AuthShell>
  );
}
