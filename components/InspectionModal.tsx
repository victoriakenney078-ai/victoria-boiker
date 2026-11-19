"use client";

import { ArtworkCanvasSlot } from "@/components/ArtworkCanvasSlot";
import { useCart } from "@/components/CartContext";
import { useGallery } from "@/components/GalleryContext";
import { formatDimensions, getArtwork } from "@/data/artworks";
import { formatPrice } from "@/lib/money";
import { salonTransition } from "@/lib/motion";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useId, useRef } from "react";

const focusable =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

export function InspectionModal() {
  const reduce = useReducedMotion();
  const { selectedId, closeInspection, requestDossier, consumeRestore, openRoom } = useGallery();
  const { add, lines } = useCart();
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const work = selectedId ? getArtwork(selectedId) : null;

  useEffect(() => {
    if (!work) return;
    const dialog = dialogRef.current;
    if (!dialog) return;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const items = () =>
      Array.from(dialog.querySelectorAll<HTMLElement>(focusable)).filter(
        (node) => !node.hasAttribute("disabled") && node.getClientRects().length > 0,
      );
    items()[0]?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeInspection();
        return;
      }
      if (event.key !== "Tab") return;
      const list = items();
      if (list.length === 0) {
        event.preventDefault();
        return;
      }
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

    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      const restore = consumeRestore();
      if (restore.target === "trigger") restore.trigger?.focus();
    };
  }, [work, closeInspection, consumeRestore]);

  if (!work) return null;

  return (
    <motion.div
      className="fixed inset-0 z-[70] bg-navy/80"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={salonTransition(reduce)}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="grid h-full grid-cols-1 overflow-y-auto bg-navy lg:grid-cols-[65fr_35fr] lg:overflow-hidden"
      >
        <div className="flex flex-col bg-navy px-4 py-4 sm:px-8 lg:overflow-y-auto lg:px-10 lg:py-8">
          <button
            type="button"
            onClick={closeInspection}
            className="sticky top-0 z-10 mb-4 w-fit border border-brass bg-navy px-3 py-2 font-sans text-[11px] uppercase tracking-[0.22em] text-parchment lg:static"
          >
            Close
          </button>
          <ArtworkCanvasSlot
            interactiveMode
            id={work.id}
            title={work.title}
            artist={work.artist}
            year={work.year}
            medium={work.medium}
            dimensions={formatDimensions(work)}
            textureUrl={work.textureUrl}
            frameStyle={work.frameStyle}
            aspectRatio={work.aspectRatio}
            sizes="(min-width: 1024px) 60vw, 100vw"
          />
        </div>
        <aside className="border-t border-hairline bg-navy-elevated px-5 py-8 sm:px-8 lg:overflow-y-auto lg:border-l lg:border-t-0 lg:px-10 lg:py-8">
          <p className="font-sans text-[11px] uppercase tracking-[0.22em] text-brass">Private Viewing Room</p>
          <h2
            id={titleId}
            className="mt-4 font-display text-4xl font-light italic leading-none tracking-[-0.025em] text-parchment lg:text-5xl"
          >
            {work.title}
          </h2>
          <p className="mt-4 font-sans text-[12px] uppercase tracking-[0.22em] text-ink">
            {work.artist}
            {work.year ? (
              <>
                <span className="mx-2 text-brass">·</span>
                {work.year}
              </>
            ) : null}
          </p>
          <p className="mt-6 font-sans text-sm font-light leading-6 text-ink">{work.blurb}</p>
          <p className="mt-4 font-sans text-[12px] uppercase tracking-[0.22em] text-parchment">
            {work.medium}
            <br />
            {formatDimensions(work)}
            <br />
            {formatPrice(work.price)}
          </p>
          <h3 className="mt-10 font-sans text-[11px] uppercase tracking-[0.22em] text-brass">Provenance</h3>
          <ol className="mt-4 space-y-4 border-l border-brass/50 pl-4">
            {work.provenance.map((line) => (
              <li key={`${work.id}-${line.year}`}>
                <p className="font-sans text-[11px] uppercase tracking-[0.22em] text-brass">{line.year}</p>
                <p className="mt-1 font-sans text-sm font-light leading-6 text-ink">{line.text}</p>
              </li>
            ))}
          </ol>
          <h3 className="mt-10 font-sans text-[11px] uppercase tracking-[0.22em] text-brass">Condition</h3>
          <p className="mt-4 font-sans text-sm font-light leading-6 text-ink">{work.condition}</p>
          <div className="mt-10 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => requestDossier(work.id)}
              className="border border-brass px-5 py-3 font-sans text-[11px] uppercase tracking-[0.22em] text-parchment transition-colors duration-700 ease-salon hover:bg-mahogany"
            >
              Request this dossier
            </button>
            <button
              type="button"
              onClick={() => openRoom(work.id)}
              className="border border-brass px-5 py-3 font-sans text-[11px] uppercase tracking-[0.22em] text-parchment transition-colors duration-700 ease-salon hover:bg-mahogany"
            >
              View in a Room
            </button>
            <button
              type="button"
              onClick={() => add(work.id)}
              className="border border-brass px-5 py-3 font-sans text-[11px] uppercase tracking-[0.22em] text-parchment transition-colors duration-700 ease-salon hover:bg-mahogany"
            >
              {lines.some((line) => line.id === work.id) ? "Add another" : "Add to cart"}
            </button>
          </div>
        </aside>
      </div>
    </motion.div>
  );
}
