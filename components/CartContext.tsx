"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

const KEY = "victoria-boiker-cart";

export type CartLine = {
  id: string;
  quantity: number;
};

type CartValue = {
  lines: CartLine[];
  ready: boolean;
  count: number;
  open: boolean;
  setOpen: (open: boolean) => void;
  add: (id: string) => void;
  setQuantity: (id: string, quantity: number) => void;
  remove: (id: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartValue | null>(null);

function readLines(): CartLine[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(KEY) ?? "[]") as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (line): line is CartLine =>
        Boolean(line) &&
        typeof line === "object" &&
        typeof (line as CartLine).id === "string" &&
        Number.isInteger((line as CartLine).quantity) &&
        (line as CartLine).quantity > 0,
    );
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setLines(readLines());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(KEY, JSON.stringify(lines));
  }, [lines, ready]);

  const value = useMemo<CartValue>(
    () => ({
      lines,
      ready,
      count: lines.reduce((sum, line) => sum + line.quantity, 0),
      open,
      setOpen,
      add: (id) => {
        setLines((current) => {
          const existing = current.find((line) => line.id === id);
          if (!existing) return [...current, { id, quantity: 1 }];
          return current.map((line) => (line.id === id ? { ...line, quantity: line.quantity + 1 } : line));
        });
        setOpen(true);
      },
      setQuantity: (id, quantity) => {
        setLines((current) =>
          quantity < 1
            ? current.filter((line) => line.id !== id)
            : current.map((line) => (line.id === id ? { ...line, quantity } : line)),
        );
      },
      remove: (id) => setLines((current) => current.filter((line) => line.id !== id)),
      clear: () => setLines([]),
    }),
    [lines, ready, open],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const value = useContext(CartContext);
  if (!value) throw new Error("useCart must be used inside CartProvider");
  return value;
}
