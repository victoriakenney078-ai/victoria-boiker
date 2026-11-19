"use client";

import { useAuth } from "@/components/AuthGate";
import { salonTransition } from "@/lib/motion";
import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";

export function Hero() {
  const reduce = useReducedMotion();
  const { email, ready, openSignIn } = useAuth();
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
          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href="#collection"
              className="inline-flex border border-brass px-6 py-3 font-sans text-[11px] uppercase tracking-[0.22em] text-parchment transition-colors duration-700 ease-salon hover:bg-mahogany-mid"
            >
              Explore the Vault
            </a>
            {ready && !email ? (
              <button
                type="button"
                onClick={openSignIn}
                className="border border-brass px-6 py-3 font-sans text-[11px] uppercase tracking-[0.22em] text-parchment transition-colors duration-700 ease-salon hover:bg-mahogany-mid"
              >
                Sign in
              </button>
            ) : null}
          </div>
        </motion.div>
        <motion.div
          className="relative lg:col-span-7"
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 36 }}
          animate={{ opacity: 1, y: 0 }}
          transition={salonTransition(reduce, 0.12)}
        >
          <div className="relative ml-auto w-full max-w-[460px]">
            <div className="border border-brass bg-mahogany p-3 shadow-[0_28px_70px_rgba(44,30,22,0.45)] sm:p-4">
              <div className="relative w-full overflow-hidden bg-navy" style={{ aspectRatio: "769 / 950", maxHeight: "68vh" }}>
                <Image
                  src="/founder/victoria-boiker.jpg"
                  alt="Victoria Boiker, founder and author"
                  fill
                  priority
                  sizes="(min-width: 1024px) 460px, 88vw"
                  className="object-cover object-center text-transparent"
                />
              </div>
            </div>
            <p className="mt-4 font-sans text-[11px] uppercase tracking-[0.22em] text-brass">Founder and author</p>
            <p className="mt-2 font-display text-[1.7rem] font-medium leading-none tracking-[-0.025em] text-parchment">
              VICTORIA BOIKER
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
