"use client";

import type { FrameStyle } from "@/data/artworks";
import { salonEase } from "@/lib/motion";
import { useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useId, useRef, useState } from "react";

export type ArtworkCanvasSlotProps = {
  id: string;
  title: string;
  artist: string;
  year: string;
  dimensions: string;
  medium: string;
  textureUrl: string;
  frameStyle: FrameStyle;
  aspectRatio: number;
  interactiveMode?: boolean;
  priority?: boolean;
  sizes?: string;
  maxHeight?: string;
  hoverVideoUrl?: string;
};

type LightAngle = "north" | "raking" | "east";

const frameClass: Record<FrameStyle, string> = {
  mahogany:
    "bg-mahogany border border-brass shadow-[0_28px_70px_rgba(44,30,22,0.45)]",
  brass:
    "bg-mahogany-mid border border-brass shadow-[0_28px_70px_rgba(11,19,32,0.42)]",
  ebonized:
    "border border-brass bg-mahogany shadow-[inset_0_0_0_1px_rgba(11,19,32,0.65),0_28px_70px_rgba(11,19,32,0.5)]",
};

const lightOverlay: Record<LightAngle, string> = {
  north:
    "radial-gradient(ellipse at 50% 0%, rgba(234,224,208,0.2), transparent 58%)",
  raking: "linear-gradient(102deg, rgba(234,224,208,0.2), transparent 46%)",
  east: "radial-gradient(ellipse at 100% 42%, rgba(234,224,208,0.18), transparent 52%)",
};

/**
 * 2D museum shadow-box. A later pass can swap the image stage for a
 * React Three Fiber Canvas without changing these props or parent layout.
 */
export function ArtworkCanvasSlot({
  id,
  title,
  artist,
  year,
  dimensions,
  medium,
  textureUrl,
  frameStyle,
  aspectRatio,
  interactiveMode = false,
  priority = false,
  sizes = "(min-width: 1280px) 36vw, (min-width: 768px) 46vw, 92vw",
  maxHeight,
  hoverVideoUrl,
}: ArtworkCanvasSlotProps) {
  const reduce = useReducedMotion();
  const instance = useId().replace(/:/g, "");
  const [zoom, setZoom] = useState(1);
  const [angle, setAngle] = useState<LightAngle>("north");
  const [hovering, setHovering] = useState(false);
  const hoverVideoRef = useRef<HTMLVideoElement>(null);
  const motion = reduce ? "none" : `transform 0.7s cubic-bezier(${salonEase.join(",")})`;
  const fadeMotion = reduce ? "none" : `opacity 0.9s cubic-bezier(${salonEase.join(",")})`;
  const showHoverVideo = Boolean(hoverVideoUrl && !interactiveMode && !reduce);

  const handleStageEnter = () => {
    if (!showHoverVideo) return;
    setHovering(true);
    const video = hoverVideoRef.current;
    if (!video) return;
    void video.play().catch(() => {
      /* ignored if the asset is missing or autoplay is blocked */
    });
  };

  const handleStageLeave = () => {
    if (!showHoverVideo) return;
    setHovering(false);
    const video = hoverVideoRef.current;
    if (!video) return;
    video.pause();
    video.currentTime = 0;
  };

  return (
    <div
      id={`artwork-slot-${id}-${instance}`}
      data-artwork-id={id}
      data-medium={medium}
      data-dimensions={dimensions}
      data-frame-style={frameStyle}
      data-texture-url={textureUrl}
      className={`p-3 sm:p-4 ${frameClass[frameStyle]}`}
    >
      <div
        className="relative w-full overflow-hidden bg-navy"
        style={{
          aspectRatio,
          maxHeight: interactiveMode ? "calc(100vh - 8rem)" : maxHeight,
        }}
        onMouseEnter={showHoverVideo ? handleStageEnter : undefined}
        onMouseLeave={showHoverVideo ? handleStageLeave : undefined}
      >
        <Image
          src={textureUrl}
          alt={year ? `${artist}, ${title}, ${year}` : `${artist}, ${title}`}
          fill
          priority={priority}
          sizes={sizes}
          className="object-cover object-center text-transparent"
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: angle === "east" ? "80% 40%" : angle === "raking" ? "20% 50%" : "50% 30%",
            transition: motion,
          }}
        />
        {showHoverVideo ? (
          <video
            ref={hoverVideoRef}
            src={hoverVideoUrl}
            muted
            loop
            playsInline
            preload="none"
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center"
            style={{ opacity: hovering ? 1 : 0, transition: fadeMotion }}
          />
        ) : null}
        {interactiveMode ? (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{ background: lightOverlay[angle], transition: motion }}
          />
        ) : null}
        {interactiveMode ? (
          <div className="absolute inset-x-0 bottom-0 z-10 flex flex-wrap items-center gap-x-6 gap-y-3 bg-navy/85 px-4 py-3 text-parchment">
            <fieldset className="flex items-center gap-2">
              <legend className="mr-2 font-sans text-[11px] uppercase tracking-[0.22em] text-brass">Light</legend>
              {(["north", "raking", "east"] as const).map((value) => (
                <button
                  key={value}
                  type="button"
                  aria-pressed={angle === value}
                  onClick={() => setAngle(value)}
                  className={`border px-2 py-1 font-sans text-[11px] uppercase tracking-[0.22em] ${
                    angle === value ? "border-brass text-parchment" : "border-hairline text-ink"
                  }`}
                >
                  {value}
                </button>
              ))}
            </fieldset>
            <div className="flex items-center gap-2">
              <span className="font-sans text-[11px] uppercase tracking-[0.22em] text-brass">Scale</span>
              <button
                type="button"
                aria-label="Zoom out"
                disabled={zoom <= 1}
                onClick={() => setZoom((value) => Math.max(1, Number((value - 0.2).toFixed(2))))}
                className="border border-hairline px-2 py-1 font-sans text-[12px] text-parchment disabled:opacity-40"
              >
                −
              </button>
              <span className="min-w-10 text-center font-sans text-[11px] tracking-[0.22em] text-ink">
                {Math.round(zoom * 100)}
              </span>
              <button
                type="button"
                aria-label="Zoom in"
                disabled={zoom >= 2.2}
                onClick={() => setZoom((value) => Math.min(2.2, Number((value + 0.2).toFixed(2))))}
                className="border border-hairline px-2 py-1 font-sans text-[12px] text-parchment disabled:opacity-40"
              >
                +
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
