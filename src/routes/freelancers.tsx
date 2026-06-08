import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { sel, useStore } from "@/lib/store";
import { FreelancerCard } from "@/components/FreelancerCard";
import { FreelancerSkeleton } from "@/components/SkeletonCard";
import { useDelayedReady } from "@/lib/useDelayedReady";
import { Slider } from "@/components/ui/slider";

export const Route = createFileRoute("/freelancers")({
  component: FreelancersPage,
  head: () => ({ meta: [{ title: "Find talent — Hirewave" }, { name: "description", content: "Browse freelancers available for work." }] }),
});

function FreelancersPage() {
  const all = useStore(sel.freelancers);
  const [q, setQ] = useState("");
  const [rate, setRate] = useState<[number]>([50000]);
  const ready = useDelayedReady(350, [q, rate[0]]);

  const list = useMemo(() => {
    const ql = q.toLowerCase();
    return all.filter((u) => {
      const hay = (u.name + " " + (u.title ?? "") + " " + (u.skills ?? []).join(" ")).toLowerCase();
      if (ql && !hay.includes(ql)) return false;
      if ((u.hourlyRate ?? 0) > rate[0]) return false;
      return true;
    });
  }, [all, q, rate]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">Find talent</h1>
          <p className="mt-1 text-sm text-muted-foreground">{all.length} freelancers available</p>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[280px_1fr]">
        <aside className="space-y-6 rounded-2xl border border-border bg-surface p-5 h-fit sticky top-20">
          <div>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Search</div>
            <div className="flex items-center gap-2 rounded-lg border border-border bg-background px-3">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="React, Figma, ML…" className="h-10 w-full bg-transparent text-sm outline-none" />
            </div>
          </div>
          <div>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Max hourly rate · ₦{rate[0].toLocaleString("en-NG")}/hr</div>
            <Slider value={rate as number[]} onValueChange={(v) => setRate([v[0]] as [number])} min={5000} max={50000} step={1000} />
          </div>
        </aside>

        <div className="grid gap-4 md:grid-cols-2">
          {!ready
            ? Array.from({ length: 6 }).map((_, i) => <FreelancerSkeleton key={i} />)
            : list.length === 0
            ? <div className="md:col-span-2 rounded-2xl border border-dashed border-border bg-surface p-10 text-center text-sm text-muted-foreground">No matches. Try widening the rate or search.</div>
            : list.map((u) => <FreelancerCard key={u.id} user={u} />)}
        </div>
      </div>
    </div>
  );
}
