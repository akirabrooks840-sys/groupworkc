import { cn } from "@/lib/utils";

const palette = [
  ["#10b981", "#0f766e"],
  ["#6366f1", "#4338ca"],
  ["#f59e0b", "#b45309"],
  ["#ef4444", "#991b1b"],
  ["#06b6d4", "#0e7490"],
  ["#8b5cf6", "#6d28d9"],
];

function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export function Avatar({ seed, name, size = 40, className }: { seed: string; name: string; size?: number; className?: string }) {
  const [a, b] = palette[hash(seed) % palette.length];
  const initials = name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <div
      className={cn("inline-flex items-center justify-center rounded-full text-white font-semibold shrink-0", className)}
      style={{
        width: size,
        height: size,
        fontSize: size * 0.38,
        background: `linear-gradient(135deg, ${a}, ${b})`,
      }}
      aria-hidden
    >
      {initials}
    </div>
  );
}
