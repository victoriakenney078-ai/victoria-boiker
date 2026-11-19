"use client";

import { registerAccount, signInAccount } from "@/lib/auth";
import { FormEvent, useState } from "react";

type Mode = "sign-in" | "register";

type Errors = {
  name?: string;
  email?: string;
  password?: string;
  confirm?: string;
  form?: string;
};

const fieldClass =
  "w-full border-0 border-b border-hairline bg-transparent py-3 font-sans text-base font-light text-parchment placeholder:text-ink/50 focus:border-brass";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function AuthScreen({ onEnter }: { onEnter: (email: string) => void }) {
  const [mode, setMode] = useState<Mode>("sign-in");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState<Errors>({});

  function switchMode(next: Mode) {
    setMode(next);
    setErrors({});
    setPassword("");
    setConfirm("");
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next: Errors = {};
    if (mode === "register" && !name.trim()) next.name = "A name is required.";
    if (!emailPattern.test(email.trim())) next.email = "A complete email address is required.";
    if (password.length < 8) next.password = "Use at least 8 characters.";
    if (mode === "register" && password !== confirm) next.confirm = "The two passwords do not match.";
    setErrors(next);
    if (Object.keys(next).length > 0) {
      const order = ["auth-name", "auth-email", "auth-password", "auth-confirm"] as const;
      const map: Record<(typeof order)[number], keyof Errors> = {
        "auth-name": "name",
        "auth-email": "email",
        "auth-password": "password",
        "auth-confirm": "confirm",
      };
      const first = order.find((id) => next[map[id]]);
      if (first) document.getElementById(first)?.focus();
      return;
    }

    if (mode === "register") {
      const result = registerAccount({ name, email, password });
      if (!result.ok) {
        setErrors({ email: "This email is already registered. Sign in instead." });
        document.getElementById("auth-email")?.focus();
        return;
      }
      onEnter(email.trim().toLowerCase());
      return;
    }

    const result = signInAccount(email, password);
    if (!result.ok) {
      setErrors({ form: "The email or the password is not recognised." });
      document.getElementById("auth-email")?.focus();
      return;
    }
    onEnter(result.email);
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-5 py-16">
      <div className="w-full max-w-md">
        <p className="font-display text-[1.35rem] font-medium leading-none tracking-[-0.025em] text-parchment">
          VICTORIA BOIKER
        </p>
        <p className="mt-2 font-sans text-[11px] uppercase tracking-[0.22em] text-brass">unique art. private luxury</p>
        <h1 className="mt-12 font-display text-5xl font-light leading-none tracking-[-0.025em] text-parchment">
          {mode === "sign-in" ? "Enter the gallery" : "Request a name"}
        </h1>
        <p className="mt-5 font-sans text-[15px] font-light leading-7 text-ink">
          The collection is shown only to those who have signed in.
        </p>
        <div className="mt-10 flex gap-8" role="tablist" aria-label="Account">
          {(
            [
              ["sign-in", "Sign in"],
              ["register", "Register"],
            ] as const
          ).map(([id, label]) => {
            const active = mode === id;
            return (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => switchMode(id)}
                className={`border-b pb-3 font-sans text-[11px] uppercase tracking-[0.22em] ${
                  active ? "border-brass text-parchment" : "border-transparent text-ink"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
        <form onSubmit={onSubmit} noValidate className="mt-10 flex flex-col gap-8">
          {mode === "register" ? (
            <label className="block">
              <span className="font-sans text-[11px] uppercase tracking-[0.22em] text-brass">Full Name</span>
              <input
                id="auth-name"
                name="name"
                autoComplete="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                className={fieldClass}
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? "auth-name-error" : undefined}
              />
              {errors.name ? (
                <span id="auth-name-error" className="mt-2 block font-sans text-[12px] text-brass">
                  {errors.name}
                </span>
              ) : null}
            </label>
          ) : null}
          <label className="block">
            <span className="font-sans text-[11px] uppercase tracking-[0.22em] text-brass">Email</span>
            <input
              id="auth-email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className={fieldClass}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "auth-email-error" : undefined}
            />
            {errors.email ? (
              <span id="auth-email-error" className="mt-2 block font-sans text-[12px] text-brass">
                {errors.email}
              </span>
            ) : null}
          </label>
          <label className="block">
            <span className="font-sans text-[11px] uppercase tracking-[0.22em] text-brass">Password</span>
            <input
              id="auth-password"
              name="password"
              type="password"
              autoComplete={mode === "register" ? "new-password" : "current-password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className={fieldClass}
              aria-invalid={Boolean(errors.password)}
              aria-describedby={errors.password ? "auth-password-error" : undefined}
            />
            {errors.password ? (
              <span id="auth-password-error" className="mt-2 block font-sans text-[12px] text-brass">
                {errors.password}
              </span>
            ) : null}
          </label>
          {mode === "register" ? (
            <label className="block">
              <span className="font-sans text-[11px] uppercase tracking-[0.22em] text-brass">Confirm Password</span>
              <input
                id="auth-confirm"
                name="confirm"
                type="password"
                autoComplete="new-password"
                value={confirm}
                onChange={(event) => setConfirm(event.target.value)}
                className={fieldClass}
                aria-invalid={Boolean(errors.confirm)}
                aria-describedby={errors.confirm ? "auth-confirm-error" : undefined}
              />
              {errors.confirm ? (
                <span id="auth-confirm-error" className="mt-2 block font-sans text-[12px] text-brass">
                  {errors.confirm}
                </span>
              ) : null}
            </label>
          ) : null}
          {errors.form ? (
            <p role="alert" className="font-sans text-[12px] text-brass">
              {errors.form}
            </p>
          ) : null}
          <button
            type="submit"
            className="mt-2 w-fit border border-brass px-5 py-3 font-sans text-[11px] uppercase tracking-[0.22em] text-parchment transition-colors duration-700 ease-salon hover:bg-mahogany"
          >
            {mode === "sign-in" ? "Sign in" : "Create account"}
          </button>
        </form>
      </div>
    </main>
  );
}
