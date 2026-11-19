export type Account = {
  name: string;
  email: string;
  password: string;
};

const ACCOUNTS = "victoria-boiker-accounts";
const SESSION = "victoria-boiker-session";

function readAccounts(): Account[] {
  try {
    const raw = localStorage.getItem(ACCOUNTS);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is Account =>
        Boolean(item) &&
        typeof item === "object" &&
        typeof (item as Account).name === "string" &&
        typeof (item as Account).email === "string" &&
        typeof (item as Account).password === "string",
    );
  } catch {
    return [];
  }
}

function writeAccounts(accounts: Account[]) {
  localStorage.setItem(ACCOUNTS, JSON.stringify(accounts));
}

export function readSession(): string | null {
  const email = localStorage.getItem(SESSION);
  if (!email) return null;
  const known = readAccounts().some((account) => account.email === email);
  if (!known) {
    localStorage.removeItem(SESSION);
    return null;
  }
  return email;
}

export function registerAccount(account: Account): { ok: true } | { ok: false; reason: "exists" } {
  const accounts = readAccounts();
  const email = account.email.trim().toLowerCase();
  if (accounts.some((item) => item.email === email)) {
    return { ok: false, reason: "exists" };
  }
  accounts.push({ name: account.name.trim(), email, password: account.password });
  writeAccounts(accounts);
  localStorage.setItem(SESSION, email);
  return { ok: true };
}

export function signInAccount(email: string, password: string): { ok: true; email: string } | { ok: false } {
  const normalized = email.trim().toLowerCase();
  const match = readAccounts().find((account) => account.email === normalized && account.password === password);
  if (!match) return { ok: false };
  localStorage.setItem(SESSION, match.email);
  return { ok: true, email: match.email };
}

export function clearSession() {
  localStorage.removeItem(SESSION);
}
