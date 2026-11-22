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
    image: "/rooms/salon.jpg",
    focus: "center 42%",
    trim: "#c4b49a",
    frame: "#2a241c",
    artTop: "12%",
    artLeft: "50%",
    widthScale: 0.82,
  },
  {
    id: "study",
    label: "The Study",
    image: "/rooms/study.jpg",
    focus: "center 38%",
    trim: "#d7c4a2",
    frame: "#1a1612",
    artTop: "14%",
    artLeft: "44%",
    widthScale: 0.7,
  },
  {
    id: "daylight",
    label: "Daylight",
    image: "/rooms/daylight.jpg",
    focus: "center center",
    trim: "#8d7350",
    frame: "#3a3026",
    artTop: "14%",
    artLeft: "50%",
    widthScale: 0.88,
  },
  {
    id: "loft",
    label: "Loft",
    image: "/rooms/loft.jpg",
    focus: "center center",
    trim: "#8a8178",
    frame: "#1c1a18",
    artTop: "13%",
    artLeft: "56%",
    widthScale: 0.8,
  },
  {
    id: "white-cube",
    label: "White Cube",
    image: "/rooms/white-cube.jpg",
    focus: "center center",
    trim: "#d9d4cc",
    frame: "#111111",
    artTop: "15%",
    artLeft: "50%",
    widthScale: 0.76,
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
  const width = Math.min(base * factor * setting.widthScale, 46);

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
        className="flex h-full min-h-0 flex-col overflow-y-auto bg-navy lg:flex-row lg:overflow-hidden"
      >
        <div className="relative min-h-[52vh] w-full min-w-0 flex-1 lg:min-h-0">
          <div
            className="absolute inset-0 bg-cover"
            style={{ backgroundImage: `url(${setting.image})`, backgroundPosition: setting.focus }}
          />
          <div
            className="absolute -translate-x-1/2"
            style={{ width: `${width}%`, top: setting.artTop, left: setting.artLeft }}
          >
            <div
              className={shaped ? "" : "border p-[2.5%]"}
              style={{
                borderColor: setting.trim,
                background: shaped ? "transparent" : setting.frame,
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
            The same work, hung in five interiors. The size changes only the preview.
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
