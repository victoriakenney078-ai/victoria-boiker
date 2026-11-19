"use client";

import { useGallery } from "@/components/GalleryContext";
import { getArtwork } from "@/data/artworks";
import { salonTransition } from "@/lib/motion";
import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useEffect, useId, useState } from "react";

const rooms = [
  {
    id: "salon",
    label: "The Salon",
    wall: "linear-gradient(180deg, #e4d8c6 0%, #cbbba4 72%, #c3b199 100%)",
    floor: "linear-gradient(180deg, #5a4032 0%, #2c1e16 100%)",
    trim: "#9a8464",
    seat: "#3b281e",
  },
  {
    id: "study",
    label: "The Study",
    wall: "linear-gradient(180deg, #243044 0%, #151d2c 78%, #121826 100%)",
    floor: "linear-gradient(180deg, #1c140f 0%, #0b0908 100%)",
    trim: "#9a8464",
    seat: "#0e121b",
  },
  {
    id: "daylight",
    label: "Daylight",
    wall: "linear-gradient(180deg, #f3efe6 0%, #e3dcd0 70%, #ddd4c6 100%)",
    floor: "linear-gradient(180deg, #d7c3a4 0%, #b89a74 100%)",
    trim: "#8d7350",
    seat: "#efe8dc",
  },
] as const;

const scales = [
  { id: "small", label: "Small", value: 0.72 },
  { id: "hung", label: "As hung", value: 1 },
  { id: "large", label: "Large", value: 1.28 },
] as const;

export function RoomView() {
  const reduce = useReducedMotion();
  const { roomId, closeRoom } = useGallery();
  const titleId = useId();
  const work = roomId ? getArtwork(roomId) : null;
  const [room, setRoom] = useState<(typeof rooms)[number]["id"]>("salon");
  const [scale, setScale] = useState<(typeof scales)[number]["id"]>("hung");

  useEffect(() => {
    setRoom("salon");
    setScale("hung");
  }, [roomId]);

  useEffect(() => {
    if (!work) return;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      event.stopImmediatePropagation();
      closeRoom();
    };
    document.addEventListener("keydown", onKey, true);
    return () => {
      document.removeEventListener("keydown", onKey, true);
      document.body.style.overflow = overflow;
    };
  }, [work, closeRoom]);

  if (!work) return null;

  const setting = rooms.find((item) => item.id === room) ?? rooms[0];
  const factor = scales.find((item) => item.id === scale)?.value ?? 1;
  const shaped = /round|oval/i.test(work.dimensionsCm);
  const base = work.aspectRatio > 1.05 ? 34 : work.aspectRatio < 0.8 ? 18 : 24;
  const width = Math.min(base * factor, 46);

  return (
    <motion.div
      className="fixed inset-0 z-[85] bg-navy/80"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={salonTransition(reduce)}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="flex h-full flex-col bg-navy lg:flex-row"
      >
        <div className="relative min-h-0 flex-1">
          <div className="absolute inset-0" style={{ background: setting.wall }} />
          <div className="absolute inset-x-0 bottom-0 h-[32%]" style={{ background: setting.floor }} />
          <div className="absolute inset-x-0 bottom-[32%] h-2" style={{ background: setting.trim }} />
          <div
            className="absolute bottom-[32%] left-[7%] h-[16%] w-[30%]"
            style={{ background: setting.seat, boxShadow: "0 18px 30px rgba(11,19,32,0.18)" }}
          />
          <div
            className="absolute bottom-[32%] right-[9%] h-[22%] w-[7%]"
            style={{ background: setting.seat, opacity: 0.9 }}
          />
          <div
            className="absolute left-1/2 top-[14%] -translate-x-1/2"
            style={{ width: `${width}%` }}
          >
            <div
              aria-hidden="true"
              className="mx-auto mb-2 h-1 w-2/5"
              style={{ background: setting.trim, opacity: 0.7 }}
            />
            <div
              className={shaped ? "" : "border p-[2.5%]"}
              style={{
                borderColor: setting.trim,
                background: shaped ? "transparent" : "#2c1e16",
                boxShadow: "0 22px 40px rgba(11,19,32,0.28)",
              }}
            >
              <div className="relative w-full" style={{ aspectRatio: work.aspectRatio }}>
                <Image
                  src={work.textureUrl}
                  alt={`${work.artist}, ${work.title}, viewed in a room`}
                  fill
                  sizes="40vw"
                  className="object-contain object-center"
                />
              </div>
            </div>
          </div>
        </div>
        <aside className="flex w-full shrink-0 flex-col border-t border-hairline bg-navy-elevated px-6 py-6 lg:w-[22rem] lg:border-l lg:border-t-0 lg:px-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-sans text-[11px] uppercase tracking-[0.22em] text-brass">View in a Room</p>
              <h2
                id={titleId}
                className="mt-3 font-display text-4xl font-light italic leading-none tracking-[-0.025em] text-parchment"
              >
                {work.title}
              </h2>
            </div>
            <button
              type="button"
              onClick={closeRoom}
              className="border border-brass px-3 py-2 font-sans text-[11px] uppercase tracking-[0.22em] text-parchment"
            >
              Close
            </button>
          </div>
          <p className="mt-4 font-sans text-sm font-light leading-6 text-ink">
            The same work, hung on three walls. The size changes only the preview.
          </p>
          <p className="mt-8 font-sans text-[11px] uppercase tracking-[0.22em] text-brass">Room</p>
          <div className="mt-3 flex flex-wrap gap-3">
            {rooms.map((item) => (
              <button
                key={item.id}
                type="button"
                aria-pressed={room === item.id}
                onClick={() => setRoom(item.id)}
                className={`border px-3 py-2 font-sans text-[11px] uppercase tracking-[0.22em] ${
                  room === item.id ? "border-brass text-parchment" : "border-hairline text-ink"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
          <p className="mt-8 font-sans text-[11px] uppercase tracking-[0.22em] text-brass">Scale</p>
          <div className="mt-3 flex flex-wrap gap-3">
            {scales.map((item) => (
              <button
                key={item.id}
                type="button"
                aria-pressed={scale === item.id}
                onClick={() => setScale(item.id)}
                className={`border px-3 py-2 font-sans text-[11px] uppercase tracking-[0.22em] ${
                  scale === item.id ? "border-brass text-parchment" : "border-hairline text-ink"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </aside>
      </div>
    </motion.div>
  );
}
