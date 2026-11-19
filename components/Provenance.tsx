"use client";

import { salonTransition } from "@/lib/motion";
import { motion, useReducedMotion } from "framer-motion";

export function Provenance() {
  const reduce = useReducedMotion();

  return (
    <section id="provenance" className="scroll-mt-24 border-t border-hairline bg-navy">
      <motion.div
        className="mx-auto grid max-w-salon gap-12 px-5 py-20 sm:px-8 lg:grid-cols-12 lg:px-14 lg:py-28"
        initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "0px 0px -10% 0px" }}
        transition={salonTransition(reduce)}
      >
        <div className="lg:col-span-4">
          <p className="font-sans text-[11px] uppercase tracking-[0.22em] text-brass">Provenance</p>
          <h2 className="mt-4 font-display text-5xl font-light leading-none tracking-[-0.025em] text-parchment">
            How a work is received
          </h2>
        </div>
        <div className="space-y-6 font-sans text-[15px] font-light leading-7 text-ink lg:col-span-7 lg:col-start-6">
          <p>
            Nothing enters the gallery on a photograph alone. A dossier begins with the chain of ownership: the studio, the first owner, the later collections, and the public museum that now keeps the picture. Where a date is uncertain, it is left uncertain. We do not improve a story to make a work seem older than it is.
          </p>
          <p>
            Condition is read in the same sitting. We look for lifted paint, discoloured varnish, and repairs that have wandered into a face or a hand. Sculpture is treated as stone, not as an illustration: breaks, recuts, and later socles are named. The notes in each private viewing are the notes we would give a lender.
          </p>
          <p>
            The gallery does not publish prices. A viewing is by appointment, and the conversation stays with the work in front of you. What we offer is time, a chair, and the paperwork.
          </p>
          <p className="font-sans text-[11px] uppercase tracking-[0.22em] text-brass">
            Viewing by appointment
            <span className="mx-3 text-hairline">/</span>
            No public prices
          </p>
        </div>
      </motion.div>
    </section>
  );
}
