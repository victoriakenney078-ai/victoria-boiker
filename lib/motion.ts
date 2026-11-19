export const salonEase: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function salonTransition(reduce: boolean | null, delay = 0) {
  if (reduce) {
    return { duration: 0.15, ease: "linear" as const, delay: 0 };
  }

  return { duration: 0.9, ease: salonEase, delay };
}
