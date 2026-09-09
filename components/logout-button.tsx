"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.dispatchEvent(new Event("wispic:local-session"));
    router.push("/auth/login");
    router.refresh();
  };

  return (
    <Button variant="outline" size="sm" onClick={logout}>
      Đăng xuất
    </Button>
  );
}