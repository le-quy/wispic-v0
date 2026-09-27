"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { LOCAL_SESSION_EVENT } from "@/lib/session-events";

export function LogoutButton() {
  const router = useRouter();

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.dispatchEvent(new Event(LOCAL_SESSION_EVENT));
    router.push("/auth/login");
    router.refresh();
  };

  return (
    <Button variant="outline" size="sm" onClick={logout}>
      Đăng xuất
    </Button>
  );
}