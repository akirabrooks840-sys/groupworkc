import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { actions, sel, useStore } from "@/lib/store";
import { toast } from "sonner";
import { Slider } from "@/components/ui/slider";

export const Route = createFileRoute("/post-job")({ component: PostJob });

const schema = z.object({
  title: z.string().min(8, "Job title is too short"),
  description: z.string().min(40, "Add at least 40 characters of context"),
  category: z.string().min(2),
  skillsRaw: z.string().min(2, "List at least one skill"),
});

function PostJob() {
  const me = useStore(sel.currentUser);
  const navigate = useNavigate();
  useEffect(() => {
    if (typeof window !== "undefined" && me === null) navigate({ to: "/login", search: { redirect: "/post-job" } as never });
    if (me && me.role !== "client") {
      actions.switchRole("client");
      toast.message("Switched to client mode to post a job");
    }
  }, [me, navigate]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Web Development");
  const [skillsRaw, setSkillsRaw] = useState("");
  const [paymentType, setPaymentType] = useState<"fixed" | "hourly">("fixed");
  const [budget, setBudget] = useState<[number, number]>([2000, 8000]);
  const [experience, setExperience] = useState<"entry" | "intermediate" | "expert">("expert");
  const [duration, setDuration] = useState<"less-1m" | "1-3m" | "3-6m" | "6m+">("1-3m");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse({ title, description, category, skillsRaw });
    if (!parsed.success) {
      const fe: Record<string, string> = {};
      parsed.error.issues.forEach((i) => (fe[i.path[0] as string] = i.message));
      setErrors(fe); return;
    }
    setErrors({}); setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 500));
      const job = actions.postJob({
        title, description, category,
        skills: skillsRaw.split(",").map((s) => s.trim()).filter(Boolean),
        budgetMin: budget[0], budgetMax: budget[1],
        paymentType, experience, duration, verified: true,
      });
      toast.success("Job posted — applications will start arriving shortly");
      navigate({ to: "/jobs/$id", params: { id: job.id } });
    } catch (err) {
      toast.error((err as Error).message);
    } finally { setLoading(false); }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl font-bold">Post a job</h1>
      <p className="mt-1 text-sm text-muted-foreground">Write a clear brief — strong posts get 4× more qualified proposals.</p>

      <form onSubmit={submit} className="mt-8 space-y-5 rounded-2xl border border-border bg-surface p-6">
        <Field label="Job title" error={errors.title}>
          <input value={title} onChange={(e) => setTitle(e.target.value)} className="input" placeholder="e.g. Senior React engineer for telemetry dashboard" />
        </Field>
        <Field label="Description" error={errors.description}>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="textarea" placeholder="Outline scope, stack, deliverables, and what success looks like." />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Category">
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="input">
              {["Web Development", "Design", "AI / ML", "Mobile", "DevOps", "Writing", "Marketing", "Data"].map((c) => <option key={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="Skills (comma-separated)" error={errors.skillsRaw}>
            <input value={skillsRaw} onChange={(e) => setSkillsRaw(e.target.value)} className="input" placeholder="React, TypeScript, Tailwind" />
          </Field>
        </div>

        <Field label="Payment type">
          <div className="flex rounded-lg border border-border p-0.5">
            {(["fixed", "hourly"] as const).map((p) => (
              <button key={p} type="button" onClick={() => setPaymentType(p)} className={`flex-1 rounded-md px-3 py-2 text-sm font-medium capitalize ${paymentType === p ? "bg-foreground text-background" : "text-muted-foreground"}`}>{p}</button>
            ))}
          </div>
        </Field>

        <Field label={paymentType === "fixed" ? `Budget range $${budget[0].toLocaleString()} – $${budget[1].toLocaleString()}` : `Hourly rate $${budget[0]} – $${budget[1]}/hr`}>
          <div className="grid grid-cols-2 gap-3">
            <input type="number" value={budget[0]} min={0} onChange={(e) => setBudget([Number(e.target.value), budget[1]])} className="input" />
            <input type="number" value={budget[1]} min={0} onChange={(e) => setBudget([budget[0], Number(e.target.value)])} className="input" />
          </div>
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Experience">
            <select value={experience} onChange={(e) => setExperience(e.target.value as "entry" | "intermediate" | "expert")} className="input">
              <option value="entry">Entry</option><option value="intermediate">Intermediate</option><option value="expert">Expert</option>
            </select>
          </Field>
          <Field label="Duration">
            <select value={duration} onChange={(e) => setDuration(e.target.value as "less-1m" | "1-3m" | "3-6m" | "6m+")} className="input">
              <option value="less-1m">Less than 1 month</option><option value="1-3m">1–3 months</option><option value="3-6m">3–6 months</option><option value="6m+">6+ months</option>
            </select>
          </Field>
        </div>

        <button disabled={loading} className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-foreground px-4 text-sm font-semibold text-background disabled:opacity-60">
          {loading ? "Posting…" : "Publish job"}
        </button>
      </form>

      <style>{`
        .input { width: 100%; height: 44px; border-radius: 12px; border: 1px solid var(--color-border); background: var(--color-background); padding: 0 14px; font-size: 14px; }
        .input:focus { outline: none; border-color: var(--color-accent); box-shadow: 0 0 0 4px color-mix(in oklab, var(--color-accent) 22%, transparent); }
        .textarea { width: 100%; min-height: 140px; border-radius: 12px; border: 1px solid var(--color-border); background: var(--color-background); padding: 12px 14px; font-size: 14px; resize: vertical; }
        .textarea:focus { outline: none; border-color: var(--color-accent); box-shadow: 0 0 0 4px color-mix(in oklab, var(--color-accent) 22%, transparent); }
      `}</style>
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</span>
      {children}
      {error && <span className="mt-1.5 block text-xs text-destructive">{error}</span>}
    </label>
  );
}
void Slider;
