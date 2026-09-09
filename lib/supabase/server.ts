import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getLocalClaims, LOCAL_ADMIN_DISPLAY_EMAIL } from "@/lib/local-auth";
import { hasEnvVars } from "@/lib/utils";

/**
 * Especially important if using Fluid compute: Don't put this client in a
 * global variable. Always create a new client within each function when using
 * it.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have proxy refreshing
            // user sessions.
          }
        },
      },
    },
  );
}

/**
 * Trả về claims của người dùng hiện tại.
 * - Ưu tiên session local (admin@local.com / admin) nếu có cookie local.
 * - Nếu không, đọc từ Supabase Auth.
 */
export async function getAuthClaims() {
  const cookieStore = await cookies();
  const local = getLocalClaims(() => cookieStore.getAll());
  if (local) {
    return { data: { claims: local }, error: null };
  }
  if (!hasEnvVars) {
    return { data: { claims: null }, error: null };
  }
  const supabase = await createClient();
  return supabase.auth.getClaims();
}

/**
 * Lấy role của user hiện tại (nếu có). 'admin' | 'user' | null.
 */
export async function getCurrentRole(): Promise<string | null> {
  const { data } = await getAuthClaims();
  if (!data?.claims) return null;
  const role = data.claims.role;
  return typeof role === "string" ? role : null;
}

/**
 * Email của tài khoản local admin (đăng nhập bằng admin@local.com / admin).
 */
export const LOCAL_ADMIN_EMAIL = LOCAL_ADMIN_DISPLAY_EMAIL;
