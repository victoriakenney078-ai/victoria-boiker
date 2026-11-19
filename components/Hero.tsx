"use client";

import { ArtworkCanvasSlot } from "@/components/ArtworkCanvasSlot";
import { useGallery } from "@/components/GalleryContext";
import { artworks, formatDimensions } from "@/data/artworks";
import { salonTransition } from "@/lib/motion";
import { motion, useReducedMotion } from "framer-motion";

const flagship = artworks[0];

export function Hero() {
  const reduce = useReducedMotion();
  const { openInspection } = useGallery();
  const rise = reduce ? { opacity: 0 } : { opacity: 0, y: 28 };

  return (
    <section id="top" className="relative min-h-screen overflow-hidden bg-navy">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 48% 58% at 72% 46%, rgba(234,224,208,0.09), transparent 70%)",
        }}
      />
      <div className="relative mx-auto grid min-h-screen max-w-salon items-center gap-14 px-5 pb-20 pt-16 sm:px-8 lg:grid-cols-12 lg:gap-10 lg:px-14 lg:pb-24 lg:pt-20">
        <motion.div
          className="lg:col-span-5"
          initial={rise}
          animate={{ opacity: 1, y: 0 }}
          transition={salonTransition(reduce)}
        >
          <p className="font-sans text-[11px] uppercase tracking-[0.22em] text-brass">Private luxury</p>
          <h1 className="mt-6 max-w-xl font-display text-[clamp(3.1rem,6.4vw,6.4rem)] font-light leading-[0.9] tracking-[-0.025em] text-parchment">
            Timeless Mastery, Curated for Generations
          </h1>
          <p className="mt-8 max-w-md font-sans text-[15px] font-light leading-7 text-ink">
            Our gallery was founded for collectors who look beyond the surface of the canvas and recognize true painterly mastery. We remain indifferent to fleeting market trends, curating only works of enduring artistic weight. Every piece undergoes rigorous scholarly selection—examining brushwork, provenance, and compositional integrity. We assemble private collections meant to live across generations.
          </p>
          <a
            href="#collection"
            className="mt-10 inline-flex border border-brass px-6 py-3 font-sans text-[11px] uppercase tracking-[0.22em] text-parchment transition-colors duration-700 ease-salon hover:bg-mahogany-mid"
          >
            Explore the Vault
          </a>
        </motion.div>
        <motion.div
          className="relative lg:col-span-7"
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 36 }}
          animate={{ opacity: 1, y: 0 }}
          transition={salonTransition(reduce, 0.12)}
        >
          <div className="relative ml-auto w-full max-w-[460px]">
            <button
              type="button"
              className="block w-full text-left"
              aria-label={`Inspect ${flagship.title} in 3D`}
              onClick={(event) => openInspection(flagship.id, event.currentTarget)}
            >
              <ArtworkCanvasSlot
                id={flagship.id}
                title={flagship.title}
                artist={flagship.artist}
                year={flagship.year}
                medium={flagship.medium}
                dimensions={formatDimensions(flagship)}
                textureUrl={flagship.textureUrl}
                frameStyle={flagship.frameStyle}
                aspectRatio={flagship.aspectRatio}
                priority
                sizes="(min-width: 1024px) 460px, 88vw"
                maxHeight="68vh"
              />
            </button>
            <button
              type="button"
              onClick={(event) => openInspection(flagship.id, event.currentTarget)}
              className="absolute left-6 top-6 z-10 border border-brass bg-navy/85 px-3 py-2 font-sans text-[11px] uppercase tracking-[0.22em] text-parchment backdrop-blur-md"
            >
              3D Salon View
            </button>
            <p className="mt-4 font-sans text-[11px] uppercase tracking-[0.22em] text-ink">
              {flagship.artist}
              <span className="mx-3 text-brass">/</span>
              <span className="font-display text-[15px] normal-case italic tracking-[-0.025em] text-parchment">
                {flagship.title}
              </span>
              {flagship.year ? (
                <>
                  <span className="mx-3 text-brass">/</span>
                  {flagship.year}
                </>
              ) : null}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
