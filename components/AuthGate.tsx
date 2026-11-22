"use client";

import { AuthScreen } from "@/components/AuthScreen";
import { clearSession, watchSession } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type AuthValue = {
  email: string | null;
  ready: boolean;
  isOwner: boolean;
  signOut: () => void;
  openSignIn: () => void;
  closeSignIn: () => void;
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
  const [isOwner, setIsOwner] = useState(false);
  const [signInOpen, setSignInOpen] = useState(false);

  useEffect(() => {
    const stop = watchSession((next) => {
      setEmail(next);
      setReady(true);
    });
    return stop;
  }, []);

  useEffect(() => {
    if (!email) {
      setIsOwner(false);
      return;
    }
    let active = true;
    supabase
      .from("gallery_staff")
      .select("user_id")
      .maybeSingle()
      .then(({ data }) => {
        if (active) setIsOwner(Boolean(data));
      });
    return () => {
      active = false;
    };
  }, [email]);

  useEffect(() => {
    if (!signInOpen) return;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSignInOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [signInOpen]);

  return (
    <AuthContext.Provider
      value={{
        email,
        ready,
        isOwner,
        signOut: () => {
          void clearSession();
          setEmail(null);
          setIsOwner(false);
        },
        openSignIn: () => setSignInOpen(true),
        closeSignIn: () => setSignInOpen(false),
      }}
    >
      {children}
      {signInOpen ? (
        <div className="fixed inset-0 z-[90] overflow-y-auto bg-navy">
          <button
            type="button"
            onClick={() => setSignInOpen(false)}
            className="absolute right-5 top-5 z-[91] border border-brass px-3 py-2 font-sans text-[11px] uppercase tracking-[0.22em] text-parchment"
          >
            Close
          </button>
          <AuthScreen
            onEnter={(next) => {
              setEmail(next);
              setSignInOpen(false);
            }}
          />
        </div>
      ) : null}
    </AuthContext.Provider>
  );
}
