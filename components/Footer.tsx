"use client";

import { useState } from "react";

const notices = {
  privacy: {
    title: "Privacy",
    body: "Names and notes sent through this page are used only to arrange a viewing. The gallery does not sell correspondence, and it does not publish a list of visitors.",
  },
  terms: {
    title: "Terms",
    body: "Viewings are by appointment. Pictures on this page are shown for private study. Nothing here is an offer of sale, and no price is stated or implied.",
  },
  impressum: {
    title: "Impressum",
    body: "Victoria Boiker. Private gallery. Viewing by appointment.",
  },
} as const;

type NoticeId = keyof typeof notices;

export function Footer() {
  const [notice, setNotice] = useState<NoticeId | null>(null);
  const active = notice ? notices[notice] : null;

  return (
    <footer className="border-t border-hairline bg-navy text-ink">
      <div className="mx-auto flex max-w-salon flex-col gap-6 px-5 py-16 sm:px-8 lg:px-14">
        <div>
          <p className="font-display text-3xl tracking-[-0.025em] text-parchment">Victoria Boiker</p>
          <p className="mt-3 font-sans text-[11px] uppercase tracking-[0.22em] text-brass">
            unique art. private luxury
          </p>
          <p className="mt-6 max-w-xs font-sans text-sm font-light leading-6">Viewing by appointment.</p>
        </div>
      </div>
      <div className="mx-auto max-w-salon border-t border-hairline px-5 py-6 sm:px-8 lg:px-14">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-sans text-[11px] uppercase tracking-[0.22em]">© 2026 Victoria Boiker</p>
          <div className="flex flex-wrap gap-5">
            {(Object.keys(notices) as NoticeId[]).map((id) => (
              <button
                key={id}
                type="button"
                aria-expanded={notice === id}
                onClick={() => setNotice((current) => (current === id ? null : id))}
                className="font-sans text-[11px] uppercase tracking-[0.22em] text-parchment"
              >
                {notices[id].title}
              </button>
            ))}
          </div>
        </div>
        {active ? (
          <div className="mt-6 max-w-2xl border-t border-hairline pt-6">
            <h2 className="font-display text-2xl italic tracking-[-0.025em] text-parchment">{active.title}</h2>
            <p className="mt-3 font-sans text-sm font-light leading-6">{active.body}</p>
          </div>
        ) : null}
      </div>
    </footer>
  );
}
