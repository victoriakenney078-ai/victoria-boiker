import { supabase } from "@/lib/supabase";

export type Account = {
  name: string;
  email: string;
  password: string;
};

export type AuthResult =
  | { ok: true; email: string }
  | { ok: false; reason: "exists" | "confirm" | "invalid" | "failed" };

export async function registerAccount(account: Account): Promise<AuthResult> {
  const email = account.email.trim().toLowerCase();
  const { data, error } = await supabase.auth.signUp({
    email,
    password: account.password,
    options: { data: { gallery_name: account.name.trim() } },
  });
  if (error) {
    if (/already|registered/i.test(error.message)) return { ok: false, reason: "exists" };
    return { ok: false, reason: "failed" };
  }
  if (data.user && data.user.identities && data.user.identities.length === 0) {
    return { ok: false, reason: "exists" };
  }
  const sessionEmail = data.session?.user.email;
  if (!sessionEmail) return { ok: false, reason: "confirm" };
  return { ok: true, email: sessionEmail };
}

export async function signInAccount(email: string, password: string): Promise<AuthResult> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim().toLowerCase(),
    password,
  });
  if (error || !data.session?.user.email) return { ok: false, reason: "invalid" };
  return { ok: true, email: data.session.user.email };
}

export async function clearSession() {
  await supabase.auth.signOut();
}

export function watchSession(onEmail: (email: string | null) => void) {
  const { data } = supabase.auth.onAuthStateChange((_event, session) => {
    onEmail(session?.user.email ?? null);
  });
  return () => data.subscription.unsubscribe();
}
