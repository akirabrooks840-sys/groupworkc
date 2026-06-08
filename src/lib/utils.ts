import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format a number as Nigerian Naira. */
export function ngn(n: number, opts?: { compact?: boolean }): string {
  if (opts?.compact) {
    if (n >= 1_000_000) return `₦${(n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1)}M`;
    if (n >= 1_000) return `₦${(n / 1_000).toFixed(n % 1_000 === 0 ? 0 : 1)}k`;
  }
  return `₦${n.toLocaleString("en-NG", { maximumFractionDigits: 0 })}`;
}
