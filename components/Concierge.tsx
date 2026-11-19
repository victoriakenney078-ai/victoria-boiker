"use client";

import { useGallery } from "@/components/GalleryContext";
import { artworks, getArtwork } from "@/data/artworks";
import { FormEvent, useEffect, useState } from "react";

type Meeting = "" | "in-person" | "correspondence" | "either";

type Errors = {
  name?: string;
  email?: string;
  meeting?: string;
  artwork?: string;
};

const fieldClass =
  "w-full border-0 border-b border-mahogany/40 bg-transparent py-3 font-sans text-base font-light text-navy placeholder:text-mahogany/40 focus:border-mahogany";

export function Concierge() {
  const { interestId, setInterestId, dossierNonce } = useGallery();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [meeting, setMeeting] = useState<Meeting>("");
  const [note, setNote] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    setConfirmed(false);
  }, [dossierNonce]);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next: Errors = {};
    if (!name.trim()) next.name = "A name is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      next.email = "A complete email address is required.";
    }
    if (!meeting) next.meeting = "Choose how you would like to meet.";
    if (!interestId) next.artwork = "Name the work you wish to see.";
    setErrors(next);
    if (Object.keys(next).length > 0) {
      const order = ["full-name", "email", "preferred-meeting", "artwork-interest"] as const;
      const map: Record<(typeof order)[number], keyof Errors> = {
        "full-name": "name",
        email: "email",
        "preferred-meeting": "meeting",
        "artwork-interest": "artwork",
      };
      const first = order.find((id) => next[map[id]]);
      if (first) document.getElementById(first)?.focus();
      return;
    }
    setConfirmed(true);
  }

  const work = getArtwork(interestId);

  return (
    <section id="advisory" className="scroll-mt-24 bg-parchment text-navy">
      <div className="mx-auto grid max-w-salon gap-14 px-5 py-20 sm:px-8 lg:grid-cols-12 lg:px-14 lg:py-28">
        <div className="lg:col-span-4">
          <p className="font-sans text-[11px] uppercase tracking-[0.22em] text-mahogany">Advisory</p>
          <h2 className="mt-4 font-display text-5xl font-light leading-[0.95] tracking-[-0.025em] md:text-6xl">
            A private viewing
          </h2>
          <p className="mt-6 max-w-sm font-sans text-[15px] font-light leading-7 text-navy/80">
            Write to the gallery. Name the picture, bust, or object you wish to sit with. The reply comes by correspondence, not by a public list.
          </p>
        </div>
        <div className="lg:col-span-7 lg:col-start-6">
          {confirmed ? (
            <div role="status" className="border-t border-mahogany/30 pt-8">
              <p className="font-display text-4xl font-light italic leading-tight tracking-[-0.025em]">
                The gallery will reply by private correspondence.
              </p>
              {work ? (
                <p className="mt-6 font-sans text-[12px] uppercase tracking-[0.22em] text-mahogany">
                  {work.artist} — {work.title}
                </p>
              ) : null}
              <button
                type="button"
                onClick={() => {
                  setConfirmed(false);
                  setName("");
                  setEmail("");
                  setMeeting("");
                  setNote("");
                  setErrors({});
                }}
                className="mt-10 border border-mahogany px-5 py-3 font-sans text-[11px] uppercase tracking-[0.22em] text-navy"
              >
                Send another note
              </button>
            </div>
          ) : (
            <form onSubmit={onSubmit} noValidate className="flex flex-col gap-8">
              <label className="block">
                <span className="font-sans text-[11px] uppercase tracking-[0.22em] text-mahogany">Full Name</span>
                <input
                  id="full-name"
                  name="name"
                  autoComplete="name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className={fieldClass}
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? "name-error" : undefined}
                />
                {errors.name ? (
                  <span id="name-error" className="mt-2 block font-sans text-[12px] text-mahogany">
                    {errors.name}
                  </span>
                ) : null}
              </label>
              <label className="block">
                <span className="font-sans text-[11px] uppercase tracking-[0.22em] text-mahogany">Email</span>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className={fieldClass}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? "email-error" : undefined}
                />
                {errors.email ? (
                  <span id="email-error" className="mt-2 block font-sans text-[12px] text-mahogany">
                    {errors.email}
                  </span>
                ) : null}
              </label>
              <label className="block">
                <span className="font-sans text-[11px] uppercase tracking-[0.22em] text-mahogany">Preferred meeting</span>
                <select
                  id="preferred-meeting"
                  name="meeting"
                  value={meeting}
                  onChange={(event) => setMeeting(event.target.value as Meeting)}
                  className={`${fieldClass} appearance-none`}
                  aria-invalid={Boolean(errors.meeting)}
                  aria-describedby={errors.meeting ? "meeting-error" : undefined}
                >
                  <option value="">Select a meeting</option>
                  <option value="in-person">In person</option>
                  <option value="correspondence">By correspondence</option>
                  <option value="either">Either</option>
                </select>
                {errors.meeting ? (
                  <span id="meeting-error" className="mt-2 block font-sans text-[12px] text-mahogany">
                    {errors.meeting}
                  </span>
                ) : null}
              </label>
              <label className="block">
                <span className="font-sans text-[11px] uppercase tracking-[0.22em] text-mahogany">Artwork of Interest</span>
                <select
                  id="artwork-interest"
                  name="artwork"
                  value={interestId}
                  onChange={(event) => setInterestId(event.target.value)}
                  className={`${fieldClass} appearance-none`}
                  aria-invalid={Boolean(errors.artwork)}
                  aria-describedby={errors.artwork ? "artwork-error" : undefined}
                >
                  <option value="">Select a work</option>
                  {artworks.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.artist} — {item.title}
                    </option>
                  ))}
                </select>
                {errors.artwork ? (
                  <span id="artwork-error" className="mt-2 block font-sans text-[12px] text-mahogany">
                    {errors.artwork}
                  </span>
                ) : null}
              </label>
              <label className="block">
                <span className="font-sans text-[11px] uppercase tracking-[0.22em] text-mahogany">Private Note</span>
                <textarea
                  id="private-note"
                  name="note"
                  rows={4}
                  value={note}
                  onChange={(event) => setNote(event.target.value)}
                  placeholder="A line to the gallery, if you wish."
                  className={`${fieldClass} resize-none`}
                />
              </label>
              <button
                type="submit"
                className="mt-2 w-fit border border-navy px-6 py-3 font-sans text-[11px] uppercase tracking-[0.22em] text-navy transition-colors duration-700 ease-salon hover:bg-navy hover:text-parchment"
              >
                Request the appointment
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
