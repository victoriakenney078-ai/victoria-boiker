"use client";

import { useAuth } from "@/components/AuthGate";
import { useGallery } from "@/components/GalleryContext";
import { salonTransition } from "@/lib/motion";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";

const links = [
  { href: "#collection", label: "The Collection" },
  { href: "#provenance", label: "Provenance" },
  { href: "#advisory", label: "Advisory" },
];

const focusable =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

export function Navbar() {
  const { selectedId } = useGallery();
  const { signOut } = useAuth();
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (selectedId) setOpen(false);
  }, [selectedId]);

  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    if (!panel) return;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const items = () =>
      Array.from(panel.querySelectorAll<HTMLElement>(focusable)).filter((node) => node.getClientRects().length > 0);
    items()[0]?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        return;
      }
      if (event.key !== "Tab") return;
      const list = items();
      if (list.length === 0) return;
      const first = list[0];
      const last = list[list.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    const menuButton = menuButtonRef.current;
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      menuButton?.focus();
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-hairline bg-navy/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-salon items-center justify-between gap-6 px-5 py-4 sm:px-8 lg:px-14">
        <a href="#top" className="min-w-0">
          <span className="block font-display text-[1.15rem] font-medium leading-none tracking-[-0.025em] text-parchment sm:text-[1.35rem]">
            VICTORIA BOIKER
          </span>
          <span className="mt-1 block font-sans text-[11px] uppercase tracking-[0.22em] text-brass">
            unique art. private luxury
          </span>
        </a>
        <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="font-sans text-[11px] uppercase tracking-[0.22em] text-parchment transition-colors duration-700 ease-salon hover:text-brass"
            >
              {link.label}
            </a>
          ))}
          <button
            type="button"
            onClick={signOut}
            className="font-sans text-[11px] uppercase tracking-[0.22em] text-parchment transition-colors duration-700 ease-salon hover:text-brass"
          >
            Sign out
          </button>
          <a
            href="#advisory"
            className="border border-brass px-4 py-2 font-sans text-[11px] uppercase tracking-[0.22em] text-parchment transition-colors duration-700 ease-salon hover:bg-mahogany-mid"
          >
            Private Viewing
          </a>
        </nav>
        <button
          ref={menuButtonRef}
          type="button"
          className="border border-hairline px-3 py-2 font-sans text-[11px] uppercase tracking-[0.22em] text-parchment lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-navigation"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>
      {open && mounted
        ? createPortal(
        <motion.div
          ref={panelRef}
          id="mobile-navigation"
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={salonTransition(reduce, 0)}
          className="fixed inset-0 z-[55] flex flex-col bg-navy px-6 py-6 lg:hidden"
        >
          <div className="flex items-start justify-between">
            <p id={titleId} className="font-display text-2xl tracking-[-0.025em] text-parchment">
              Victoria Boiker
            </p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="border border-brass px-3 py-2 font-sans text-[11px] uppercase tracking-[0.22em] text-parchment"
            >
              Close
            </button>
          </div>
          <nav className="mt-16 flex flex-col gap-6" aria-label="Mobile">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="border-b border-hairline pb-4 font-display text-4xl font-light tracking-[-0.025em] text-parchment"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              signOut();
            }}
            className="mt-10 w-fit font-sans text-[11px] uppercase tracking-[0.22em] text-parchment"
          >
            Sign out
          </button>
          <a
            href="#advisory"
            onClick={() => setOpen(false)}
            className="mt-auto inline-flex w-fit border border-brass px-5 py-3 font-sans text-[11px] uppercase tracking-[0.22em] text-parchment"
          >
            Private Viewing
          </a>
        </motion.div>,
            document.body,
          )
        : null}
    </header>
  );
}
