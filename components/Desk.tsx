"use client";

import { useAuth } from "@/components/AuthGate";
import { getArtwork } from "@/data/artworks";
import { formatPrice } from "@/lib/money";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";

type OrderLine = {
  title?: string;
  quantity?: number;
  price?: number;
};

type OrderRow = {
  id: string;
  reference: string;
  customer_name: string;
  mail: string;
  city: string;
  note: string;
  lines: OrderLine[];
  total: number;
  created_at: string;
};

type ViewingRow = {
  id: string;
  full_name: string;
  email: string;
  meeting: string;
  artwork_id: string;
  note: string;
  created_at: string;
};

const meetingLabel: Record<string, string> = {
  "in-person": "In person",
  correspondence: "By correspondence",
  either: "Either",
};

function when(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" });
}

function linesOf(value: unknown): OrderLine[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is OrderLine => Boolean(item) && typeof item === "object");
}

export function Desk() {
  const { email, ready, isOwner, openSignIn } = useAuth();
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [viewings, setViewings] = useState<ViewingRow[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!ready || !isOwner) return;
    let active = true;
    Promise.all([
      supabase.from("gallery_orders").select("id, reference, customer_name, mail, city, note, lines, total, created_at").order("created_at", { ascending: false }),
      supabase.from("gallery_viewings").select("id, full_name, email, meeting, artwork_id, note, created_at").order("created_at", { ascending: false }),
    ]).then(([orderResult, viewingResult]) => {
      if (!active) return;
      if (orderResult.error || viewingResult.error) {
        setError("The desk could not be opened.");
        return;
      }
      setOrders(
        (orderResult.data ?? []).map((row) => ({
          ...row,
          lines: linesOf(row.lines),
        })),
      );
      setViewings(viewingResult.data ?? []);
    });
    return () => {
      active = false;
    };
  }, [ready, isOwner]);

  return (
    <main className="mx-auto max-w-salon px-5 py-16 sm:px-8 lg:px-14 lg:py-24">
      <p className="font-sans text-[11px] uppercase tracking-[0.22em] text-brass">Gallery desk</p>
      <h1 className="mt-4 font-display text-5xl font-light leading-none tracking-[-0.025em] text-parchment md:text-6xl">
        Orders and viewings
      </h1>
      {!ready ? <p className="mt-10 font-sans text-sm font-light text-ink">Opening the desk.</p> : null}
      {ready && !email ? (
        <div className="mt-10">
          <p className="font-sans text-sm font-light leading-6 text-ink">Sign in with the gallery account to read every order.</p>
          <button
            type="button"
            onClick={openSignIn}
            className="mt-6 border border-brass px-5 py-3 font-sans text-[11px] uppercase tracking-[0.22em] text-parchment"
          >
            Sign in
          </button>
        </div>
      ) : null}
      {ready && email && !isOwner ? (
        <p className="mt-10 font-sans text-sm font-light leading-6 text-ink">This desk is reserved for the gallery.</p>
      ) : null}
      {error ? <p className="mt-10 font-sans text-sm text-brass">{error}</p> : null}
      {isOwner ? (
        <div className="mt-14 space-y-16">
          <section>
            <h2 className="font-sans text-[11px] uppercase tracking-[0.22em] text-brass">Orders</h2>
            {orders.length === 0 ? (
              <p className="mt-6 font-display text-3xl font-light italic text-parchment">No orders yet.</p>
            ) : (
              <div className="mt-6 overflow-x-auto border border-hairline">
                <table className="w-full min-w-[720px] text-left">
                  <thead>
                    <tr className="border-b border-hairline font-sans text-[11px] uppercase tracking-[0.22em] text-brass">
                      <th className="px-4 py-3 font-normal">When</th>
                      <th className="px-4 py-3 font-normal">Reference</th>
                      <th className="px-4 py-3 font-normal">Buyer</th>
                      <th className="px-4 py-3 font-normal">Works</th>
                      <th className="px-4 py-3 font-normal">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id} className="border-b border-hairline align-top">
                        <td className="px-4 py-4 font-sans text-sm font-light text-ink">{when(order.created_at)}</td>
                        <td className="px-4 py-4 font-sans text-sm text-parchment">{order.reference}</td>
                        <td className="px-4 py-4 font-sans text-sm font-light text-ink">
                          {order.customer_name}
                          <br />
                          {order.mail}
                          <br />
                          {order.city}
                          {order.note ? (
                            <>
                              <br />
                              {order.note}
                            </>
                          ) : null}
                        </td>
                        <td className="px-4 py-4 font-sans text-sm font-light text-ink">
                          {order.lines.map((line, index) => (
                            <span key={`${order.id}-${index}`} className="block">
                              {line.title ?? "Work"} × {line.quantity ?? 1}
                            </span>
                          ))}
                        </td>
                        <td className="px-4 py-4 font-sans text-sm text-parchment">{formatPrice(order.total)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
          <section>
            <h2 className="font-sans text-[11px] uppercase tracking-[0.22em] text-brass">Private viewings</h2>
            {viewings.length === 0 ? (
              <p className="mt-6 font-display text-3xl font-light italic text-parchment">No viewing requests yet.</p>
            ) : (
              <div className="mt-6 overflow-x-auto border border-hairline">
                <table className="w-full min-w-[720px] text-left">
                  <thead>
                    <tr className="border-b border-hairline font-sans text-[11px] uppercase tracking-[0.22em] text-brass">
                      <th className="px-4 py-3 font-normal">When</th>
                      <th className="px-4 py-3 font-normal">Name</th>
                      <th className="px-4 py-3 font-normal">Meeting</th>
                      <th className="px-4 py-3 font-normal">Work</th>
                      <th className="px-4 py-3 font-normal">Note</th>
                    </tr>
                  </thead>
                  <tbody>
                    {viewings.map((viewing) => {
                      const work = getArtwork(viewing.artwork_id);
                      return (
                        <tr key={viewing.id} className="border-b border-hairline align-top">
                          <td className="px-4 py-4 font-sans text-sm font-light text-ink">{when(viewing.created_at)}</td>
                          <td className="px-4 py-4 font-sans text-sm font-light text-ink">
                            {viewing.full_name}
                            <br />
                            {viewing.email}
                          </td>
                          <td className="px-4 py-4 font-sans text-sm text-parchment">
                            {meetingLabel[viewing.meeting] ?? viewing.meeting}
                          </td>
                          <td className="px-4 py-4 font-sans text-sm text-parchment">{work?.title ?? viewing.artwork_id}</td>
                          <td className="px-4 py-4 font-sans text-sm font-light text-ink">{viewing.note || "—"}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      ) : null}
    </main>
  );
}
