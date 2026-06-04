import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { sel, useStore } from "@/lib/store";
import { JobCard } from "@/components/JobCard";
import { JobSkeleton } from "@/components/SkeletonCard";
import { useDelayedReady } from "@/lib/useDelayedReady";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/jobs")({
  component: JobsPage,
  validateSearch: (s: Record<string, unknown>): { q?: string } => ({
    q: typeof s.q === "string" && s.q.length > 0 ? s.q : undefined,
  }),
  head: () => ({ meta: [{ title: "Find work — Hirewave jobs board" }, { name: "description", content: "Browse open freelance jobs on Hirewave." }] }),
});

const experiences = ["entry", "intermediate", "expert"] as const;
const durations = [
  { v: "less-1m", l: "< 1 month" },
  { v: "1-3m", l: "1–3 months" },
  { v: "3-6m", l: "3–6 months" },
  { v: "6m+", l: "6+ months" },
] as const;

function JobsPage() {
  const { q: initialQ } = useSearch({ from: "/jobs" });
  const [q, setQ] = useState(initialQ ?? "");
  const [budget, setBudget] = useState<[number]>([20000]);
  const [exp, setExp] = useState<Set<string>>(new Set());
  const [dur, setDur] = useState<Set<string>>(new Set());
  const [payment, setPayment] = useState<"all" | "fixed" | "hourly">("all");

  const allJobs = useStore((s) => s.jobs);
  const ready = useDelayedReady(350, [q, exp.size, dur.size, payment, budget[0]]);

  const jobs = useMemo(() => {
    const ql = q.toLowerCase();
    return allJobs.filter((j) => {
      const hay = (j.title + " " + j.description + " " + j.skills.join(" ") + " " + j.category).toLowerCase();
      if (ql && !hay.includes(ql)) return false;
      if (j.budgetMax > budget[0] && j.paymentType === "fixed") return false;
      if (exp.size && !exp.has(j.experience)) return false;
      if (dur.size && !dur.has(j.duration)) return false;
      if (payment !== "all" && j.paymentType !== payment) return false;
      return true;
    });
  }, [allJobs, q, budget, exp, dur, payment]);

  const toggle = (set: Set<string>, val: string, setter: (s: Set<string>) => void) => {
    const next = new Set(set);
    if (next.has(val)) next.delete(val); else next.add(val);
    setter(next);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">Find work</h1>
          <p className="mt-1 text-sm text-muted-foreground">{allJobs.length} open jobs right now</p>
        </div>
        <div className="flex w-full items-center gap-2 rounded-xl border border-border bg-surface p-1.5 sm:w-auto sm:min-w-[360px]">
          <Search className="ml-2 h-4 w-4 text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search jobs, skills, companies" className="h-9 w-full bg-transparent text-sm outline-none" />
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[280px_1fr]">
        {/* Filters */}
        <aside className="space-y-6 rounded-2xl border border-border bg-surface p-5 h-fit sticky top-20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-display font-semibold"><SlidersHorizontal className="h-4 w-4" /> Filters</div>
            <button onClick={() => { setExp(new Set()); setDur(new Set()); setPayment("all"); setBudget([20000]); }} className="text-xs text-muted-foreground hover:text-foreground">Reset</button>
          </div>

          <FilterGroup label="Payment type">
            <div className="flex rounded-lg border border-border p-0.5">
              {(["all", "fixed", "hourly"] as const).map((p) => (
                <button key={p} onClick={() => setPayment(p)} className={cn("flex-1 rounded-md px-2 py-1.5 text-xs font-medium capitalize", payment === p ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground")}>{p}</button>
              ))}
            </div>
          </FilterGroup>

          <FilterGroup label={`Budget up to $${budget[0].toLocaleString()}`}>
            <Slider value={budget as number[]} onValueChange={(v) => setBudget([v[0]] as [number])} min={500} max={20000} step={500} />
          </FilterGroup>

          <FilterGroup label="Experience level">
            <div className="flex flex-col gap-1.5">
              {experiences.map((e) => (
                <label key={e} className="flex cursor-pointer items-center justify-between rounded-md px-2 py-1.5 hover:bg-secondary">
                  <span className="text-sm capitalize">{e}</span>
                  <input type="checkbox" checked={exp.has(e)} onChange={() => toggle(exp, e, setExp)} className="h-4 w-4 accent-foreground" />
                </label>
              ))}
            </div>
          </FilterGroup>

          <FilterGroup label="Project duration">
            <div className="flex flex-col gap-1.5">
              {durations.map((d) => (
                <label key={d.v} className="flex cursor-pointer items-center justify-between rounded-md px-2 py-1.5 hover:bg-secondary">
                  <span className="text-sm">{d.l}</span>
                  <input type="checkbox" checked={dur.has(d.v)} onChange={() => toggle(dur, d.v, setDur)} className="h-4 w-4 accent-foreground" />
                </label>
              ))}
            </div>
          </FilterGroup>
        </aside>

        {/* Results */}
        <div className="space-y-4">
          {!ready
            ? Array.from({ length: 4 }).map((_, i) => <JobSkeleton key={i} />)
            : jobs.length === 0
            ? <EmptyState />
            : jobs.map((j) => <JobCard key={j.id} job={j} />)}
        </div>
      </div>
    </div>
  );
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</div>
      {children}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-surface p-10 text-center">
      <div className="font-display text-lg font-semibold">Nothing matches those filters</div>
      <p className="mt-1 text-sm text-muted-foreground">Try widening the budget or clearing a filter.</p>
    </div>
  );
}
