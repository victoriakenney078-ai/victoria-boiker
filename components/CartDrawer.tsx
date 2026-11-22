"use client";

import { useAuth } from "@/components/AuthGate";
import { useCart } from "@/components/CartContext";
import { getArtwork } from "@/data/artworks";
import { formatPrice } from "@/lib/money";
import { supabase } from "@/lib/supabase";
import { FormEvent, useEffect, useId, useState } from "react";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const fieldClass =
  "w-full border-0 border-b border-hairline bg-transparent py-3 font-sans text-base font-light text-parchment placeholder:text-ink/50 focus:border-brass";

export function CartDrawer() {
  const { lines, open, setOpen, setQuantity, remove, clear } = useCart();
  const { email, openSignIn } = useAuth();
  const titleId = useId();
  const [name, setName] = useState("");
  const [mail, setMail] = useState("");
  const [city, setCity] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [reference, setReference] = useState<string | null>(null);

  const items = lines.flatMap((line) => {
    const work = getArtwork(line.id);
    return work ? [{ line, work }] : [];
  });
  const total = items.reduce((sum, item) => sum + item.work.price * item.line.quantity, 0);

  useEffect(() => {
    if (email && !mail) setMail(email);
  }, [email, mail]);

  useEffect(() => {
    if (!open) return;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, setOpen]);

  async function placeOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email) {
      setError("Sign in to place this order.");
      openSignIn();
      return;
    }
    if (items.length === 0) return;
    if (!name.trim() || !emailPattern.test(mail.trim()) || !city.trim()) {
      setError("A name, a complete email, and a city are required.");
      return;
    }
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData.session?.user.id;
    if (!userId) {
      setError("Sign in to place this order.");
      openSignIn();
      return;
    }
    const nextReference = `VB-${Date.now().toString(36).toUpperCase()}`;
    const { error: insertError } = await supabase.from("gallery_orders").insert({
      user_id: userId,
      reference: nextReference,
      customer_name: name.trim(),
      mail: mail.trim(),
      city: city.trim(),
      note: note.trim(),
      lines: items.map((item) => ({
        id: item.work.id,
        title: item.work.title,
        quantity: item.line.quantity,
        price: item.work.price,
      })),
      total,
    });
    if (insertError) {
      setError("The order could not be saved. Try again.");
      return;
    }
    clear();
    setNote("");
    setError("");
    setReference(nextReference);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[75] flex justify-end bg-navy/80">
      <button type="button" className="h-full flex-1" aria-label="Close the cart" onClick={() => setOpen(false)} />
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="flex h-full w-full max-w-md flex-col border-l border-hairline bg-navy-elevated"
      >
        <div className="flex items-center justify-between border-b border-hairline px-6 py-5">
          <h2 id={titleId} className="font-display text-4xl font-light tracking-[-0.025em] text-parchment">
            Cart
          </h2>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="border border-brass px-3 py-2 font-sans text-[11px] uppercase tracking-[0.22em] text-parchment"
          >
            Close
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {reference ? (
            <p className="font-sans text-sm font-light leading-6 text-ink">
              Order {reference} is reserved. The gallery will confirm payment by private correspondence.
            </p>
          ) : null}
          {items.length === 0 && !reference ? (
            <p className="font-display text-3xl font-light italic text-parchment">The cart is empty.</p>
          ) : null}
          <ul className="space-y-6">
            {items.map((item) => (
              <li key={item.work.id} className="border-b border-hairline pb-6">
                <p className="font-display text-3xl font-light italic tracking-[-0.025em] text-parchment">
                  {item.work.title}
                </p>
                <p className="mt-2 font-sans text-[12px] uppercase tracking-[0.22em] text-brass">
                  {formatPrice(item.work.price)}
                </p>
                <div className="mt-4 flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => setQuantity(item.work.id, item.line.quantity - 1)}
                    className="border border-hairline px-3 py-1 font-sans text-parchment"
                    aria-label={`Fewer ${item.work.title}`}
                  >
                    −
                  </button>
                  <span className="font-sans text-[12px] uppercase tracking-[0.22em] text-parchment">
                    {item.line.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(item.work.id, item.line.quantity + 1)}
                    className="border border-hairline px-3 py-1 font-sans text-parchment"
                    aria-label={`More ${item.work.title}`}
                  >
                    +
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(item.work.id)}
                    className="ml-auto font-sans text-[11px] uppercase tracking-[0.22em] text-ink"
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
          {items.length > 0 ? (
            <form onSubmit={placeOrder} noValidate className="mt-8 flex flex-col gap-6">
              <p className="font-sans text-[12px] uppercase tracking-[0.22em] text-parchment">
                Total {formatPrice(total)}
              </p>
              <label className="block">
                <span className="font-sans text-[11px] uppercase tracking-[0.22em] text-brass">Full Name</span>
                <input value={name} onChange={(event) => setName(event.target.value)} className={fieldClass} />
              </label>
              <label className="block">
                <span className="font-sans text-[11px] uppercase tracking-[0.22em] text-brass">Email</span>
                <input
                  type="email"
                  value={mail}
                  onChange={(event) => setMail(event.target.value)}
                  className={fieldClass}
                />
              </label>
              <label className="block">
                <span className="font-sans text-[11px] uppercase tracking-[0.22em] text-brass">City</span>
                <input value={city} onChange={(event) => setCity(event.target.value)} className={fieldClass} />
              </label>
              <label className="block">
                <span className="font-sans text-[11px] uppercase tracking-[0.22em] text-brass">Note</span>
                <textarea
                  value={note}
                  onChange={(event) => setNote(event.target.value)}
                  rows={3}
                  className={fieldClass}
                />
              </label>
              {error ? <p className="font-sans text-[12px] text-brass">{error}</p> : null}
              {!email ? (
                <button
                  type="button"
                  onClick={openSignIn}
                  className="w-fit border border-brass px-5 py-3 font-sans text-[11px] uppercase tracking-[0.22em] text-parchment"
                >
                  Sign in
                </button>
              ) : null}
              <button
                type="submit"
                className="w-fit border border-brass px-5 py-3 font-sans text-[11px] uppercase tracking-[0.22em] text-parchment transition-colors duration-700 ease-salon hover:bg-mahogany"
              >
                Place order
              </button>
            </form>
          ) : null}
        </div>
      </aside>
    </div>
  );
}
