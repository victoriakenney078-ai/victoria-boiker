"use client";

import { ArtworkCanvasSlot } from "@/components/ArtworkCanvasSlot";
import { useCart } from "@/components/CartContext";
import { useGallery } from "@/components/GalleryContext";
import { artworks, formatDimensions, type ArtworkCategory } from "@/data/artworks";
import { formatPrice } from "@/lib/money";
import { salonEase, salonTransition } from "@/lib/motion";
import { LayoutGroup, motion, useReducedMotion } from "framer-motion";
import { useState } from "react";

type FilterId = "all" | ArtworkCategory;

const filters: { id: FilterId; label: string }[] = [
  { id: "all", label: "All Works" },
  { id: "horses", label: "Horses" },
  { id: "portraits", label: "Portraits" },
  { id: "scenes", label: "Scenes" },
];

const spans = [
  "xl:col-span-7",
  "xl:col-span-5",
  "xl:col-span-5",
  "xl:col-span-7",
  "xl:col-span-8",
  "xl:col-span-4",
  "xl:col-span-6",
  "xl:col-span-6",
];

export function Collection() {
  const reduce = useReducedMotion();
  const { openInspection, requestDossier, openRoom } = useGallery();
  const { add, lines } = useCart();
  const [filter, setFilter] = useState<FilterId>("all");
  const visible = artworks.filter((work) => filter === "all" || work.category === filter);

  return (
    <section id="collection" className="scroll-mt-24 border-t border-hairline bg-navy">
      <div className="mx-auto max-w-salon px-5 py-20 sm:px-8 lg:px-14 lg:py-28">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="font-sans text-[11px] uppercase tracking-[0.22em] text-brass">The Collection</p>
            <h2 className="mt-4 max-w-xl font-display text-5xl font-light leading-none tracking-[-0.025em] text-parchment md:text-6xl">
              The vault, hung for a private room
            </h2>
          </div>
          <p className="font-sans text-[11px] uppercase tracking-[0.22em] text-ink">
            {String(visible.length).padStart(2, "0")} works
          </p>
        </div>
        <LayoutGroup>
          <div className="mt-12 flex flex-wrap gap-x-8 gap-y-4" role="group" aria-label="Filter the collection">
            {filters.map((item) => {
              const active = filter === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setFilter(item.id)}
                  className={`relative pb-3 font-sans text-[11px] uppercase tracking-[0.22em] ${
                    active ? "text-parchment" : "text-ink"
                  }`}
                >
                  {item.label}
                  {active ? (
                    reduce ? (
                      <span className="absolute bottom-0 left-0 h-px w-full bg-brass" />
                    ) : (
                      <motion.span
                        layoutId="collection-filter"
                        className="absolute bottom-0 left-0 h-px w-full bg-brass"
                        transition={{ duration: 0.7, ease: salonEase }}
                      />
                    )
                  ) : null}
                </button>
              );
            })}
          </div>
        </LayoutGroup>
        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-12 xl:gap-6">
          {visible.map((work, index) => {
            const light = index % 2 === 1;
            const catalog = String(artworks.findIndex((item) => item.id === work.id) + 1).padStart(2, "0");
            return (
              <motion.article
                key={work.id}
                initial={reduce ? false : { opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                transition={salonTransition(reduce, Math.min(index * 0.08, 0.4))}
                className={`group flex flex-col border p-5 sm:p-7 md:col-span-1 ${spans[index % spans.length]} ${
                  light ? "border-mahogany/20 bg-parchment text-navy" : "border-hairline bg-navy-elevated text-parchment"
                }`}
              >
                <p className={`font-sans text-[11px] uppercase tracking-[0.22em] ${light ? "text-mahogany" : "text-brass"}`}>
                  No. {catalog}
                </p>
                <div
                  role="button"
                  tabIndex={0}
                  className="mt-4 block w-full cursor-pointer text-left"
                  aria-label={`Inspect ${work.title} in 3D`}
                  onClick={(event) => openInspection(work.id, event.currentTarget)}
                  onKeyDown={(event) => {
                    if (event.key !== "Enter" && event.key !== " ") return;
                    event.preventDefault();
                    openInspection(work.id, event.currentTarget);
                  }}
                >
                  <ArtworkCanvasSlot
                    id={work.id}
                    title={work.title}
                    artist={work.artist}
                    year={work.year}
                    medium={work.medium}
                    dimensions={formatDimensions(work)}
                    textureUrl={work.textureUrl}
                    frameStyle={work.frameStyle}
                    aspectRatio={work.aspectRatio}
                    hoverVideoUrl={work.hoverVideoUrl}
                  />
                </div>
                <div className="mt-6 flex flex-1 flex-col">
                  <h3 className="font-sans text-[12px] uppercase tracking-[0.22em]">{work.artist}</h3>
                  <p className="mt-3 font-display text-4xl font-light italic leading-none tracking-[-0.025em]">
                    {work.title}
                  </p>
                  <p className={`mt-4 font-sans text-sm font-light leading-6 ${light ? "text-navy/75" : "text-ink"}`}>
                    {work.year ? (
                      <>
                        {work.year}
                        <span className="mx-2">·</span>
                      </>
                    ) : null}
                    {work.medium}
                    <br />
                    {formatDimensions(work)}
                  </p>
                  <p className={`mt-3 font-sans text-[12px] uppercase tracking-[0.22em] ${light ? "text-mahogany" : "text-brass"}`}>
                    {formatPrice(work.price)}
                  </p>
                  <div className="mt-6 flex flex-wrap gap-3 opacity-100 transition-opacity duration-700 ease-salon [@media(hover:hover)]:lg:opacity-0 [@media(hover:hover)]:lg:group-focus-within:opacity-100 [@media(hover:hover)]:lg:group-hover:opacity-100">
                    <button
                      type="button"
                      onClick={(event) => openInspection(work.id, event.currentTarget)}
                      className={`border px-3 py-2 font-sans text-[11px] uppercase tracking-[0.22em] ${
                        light ? "border-mahogany/40 text-navy" : "border-brass text-parchment"
                      }`}
                    >
                      Inspect Artwork (3D)
                    </button>
                    <button
                      type="button"
                      onClick={() => requestDossier(work.id)}
                      className={`border px-3 py-2 font-sans text-[11px] uppercase tracking-[0.22em] ${
                        light ? "border-mahogany/40 text-navy" : "border-hairline text-parchment"
                      }`}
                    >
                      Request Dossier
                    </button>
                    <button
                      type="button"
                      onClick={() => openRoom(work.id)}
                      className={`border px-3 py-2 font-sans text-[11px] uppercase tracking-[0.22em] ${
                        light ? "border-mahogany/40 text-navy" : "border-hairline text-parchment"
                      }`}
                    >
                      View in a Room
                    </button>
                    <button
                      type="button"
                      onClick={() => add(work.id)}
                      className={`border px-3 py-2 font-sans text-[11px] uppercase tracking-[0.22em] ${
                        light ? "border-mahogany/40 text-navy" : "border-brass text-parchment"
                      }`}
                    >
                      {lines.some((line) => line.id === work.id) ? "Add another" : "Add to cart"}
                    </button>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
        {visible.length === 0 ? (
          <p className="mt-10 font-display text-3xl italic text-parchment">Nothing is hung in this bay.</p>
        ) : null}
      </div>
    </section>
  );
}
