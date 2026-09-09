import Link from "next/link";
import { Button } from "./ui/button";
import { getSessionUser } from "@/lib/session";
import { LogoutButton } from "./logout-button";

export async function AuthButton() {
  const user = await getSessionUser();

  return user ? (
    <div className="flex items-center gap-3">
      <span className="hidden text-sm font-light text-muted-foreground sm:inline">
        {user.email}
      </span>
      <LogoutButton />
    </div>
  ) : (
    <div className="flex gap-2">
      <Button size="sm" variant={"outline"} render={<Link href="/auth/login" />}>
        Sign in
      </Button>
      <Button size="sm" variant={"default"} render={<Link href="/auth/sign-up" />}>
        Sign up
      </Button>
    </div>
  );
}