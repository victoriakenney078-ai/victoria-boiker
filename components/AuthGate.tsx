"use client";

import { AuthScreen } from "@/components/AuthScreen";
import { clearSession, readSession } from "@/lib/auth";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type AuthValue = {
  email: string;
  signOut: () => void;
};

const AuthContext = createContext<AuthValue | null>(null);

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error("useAuth must be used inside AuthGate");
  }
  return value;
}

export function AuthGate({ children }: { children: ReactNode }) {
  const [email, setEmail] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setEmail(readSession());
    setReady(true);
  }, []);

  if (!ready) {
    return <div className="min-h-screen bg-navy" aria-busy="true" />;
  }

  if (!email) {
    return <AuthScreen onEnter={setEmail} />;
  }

  return (
    <AuthContext.Provider
      value={{
        email,
        signOut: () => {
          clearSession();
          setEmail(null);
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
