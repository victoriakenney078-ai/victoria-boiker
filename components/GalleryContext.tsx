"use client";

import { artworks } from "@/data/artworks";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";

type RestoreTarget = "trigger" | "form";

type GalleryContextValue = {
  selectedId: string | null;
  interestId: string;
  dossierNonce: number;
  openInspection: (id: string, trigger: HTMLElement | null) => void;
  closeInspection: () => void;
  setInterestId: (id: string) => void;
  requestDossier: (id: string) => void;
  consumeRestore: () => { target: RestoreTarget; trigger: HTMLElement | null };
};

const GalleryContext = createContext<GalleryContextValue | null>(null);

export function GalleryProvider({ children }: { children: React.ReactNode }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [interestId, setInterestId] = useState(artworks[0]?.id ?? "");
  const [dossierNonce, setDossierNonce] = useState(0);
  const triggerRef = useRef<HTMLElement | null>(null);
  const restoreRef = useRef<RestoreTarget>("trigger");

  const openInspection = useCallback((id: string, trigger: HTMLElement | null) => {
    triggerRef.current = trigger;
    restoreRef.current = "trigger";
    setSelectedId(id);
  }, []);

  const closeInspection = useCallback(() => {
    restoreRef.current = "trigger";
    setSelectedId(null);
  }, []);

  const requestDossier = useCallback((id: string) => {
    restoreRef.current = "form";
    setInterestId(id);
    setDossierNonce((value) => value + 1);
    setSelectedId(null);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.setTimeout(() => {
      document.getElementById("advisory")?.scrollIntoView({
        behavior: reduce ? "auto" : "smooth",
        block: "start",
      });
      document.getElementById("artwork-interest")?.focus();
    }, 40);
  }, []);

  const consumeRestore = useCallback(() => {
    return { target: restoreRef.current, trigger: triggerRef.current };
  }, []);

  const value = useMemo(
    () => ({
      selectedId,
      interestId,
      dossierNonce,
      openInspection,
      closeInspection,
      setInterestId,
      requestDossier,
      consumeRestore,
    }),
    [
      selectedId,
      interestId,
      dossierNonce,
      openInspection,
      closeInspection,
      requestDossier,
      consumeRestore,
    ],
  );

  return <GalleryContext.Provider value={value}>{children}</GalleryContext.Provider>;
}

export function useGallery() {
  const context = useContext(GalleryContext);
  if (!context) {
    throw new Error("useGallery must be used within GalleryProvider");
  }
  return context;
}
