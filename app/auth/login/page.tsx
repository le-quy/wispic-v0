import { AuthShell } from "@/components/auth-shell";
import { LoginForm } from "@/components/login-form";

export default function Page() {
  return (
    <AuthShell
      label="Chào mừng trở lại"
      title="Đăng nhập"
      description="Đăng nhập bằng email để tiếp tục tạo và quản lý thiệp cưới của bạn."
    >
      <LoginForm />
    </AuthShell>
  );
}
