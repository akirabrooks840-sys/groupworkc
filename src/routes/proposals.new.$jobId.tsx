import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { actions, sel, useStore } from "@/lib/store";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/proposals/new/$jobId")({ component: NewProposal });

const FEE_PCT = 0.1; // platform service fee

function NewProposal() {
  const { jobId } = Route.useParams();
  const job = useStore(sel.jobById(jobId));
  const me = useStore(sel.currentUser);
  const navigate = useNavigate();

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (me === null) navigate({ to: "/login", search: { redirect: `/proposals/new/${jobId}` } as never });
      else if (me.role !== "freelancer") { actions.switchRole("freelancer"); toast.message("Switched to freelancer mode to submit your proposal"); }
    }
  }, [me, navigate, jobId]);

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [coverLetter, setCoverLetter] = useState("");
  const [paymentType, setPaymentType] = useState<"fixed" | "hourly">("fixed");
  const [bidAmount, setBidAmount] = useState(5000);
  const [milestones, setMilestones] = useState<{ title: string; amount: number; dueDays: number }[]>([
    { title: "Kickoff & architecture", amount: 1500, dueDays: 7 },
    { title: "Implementation phase 1", amount: 2000, dueDays: 21 },
    { title: "Final delivery & QA", amount: 1500, dueDays: 35 },
  ]);

  if (!job) return <div className="mx-auto max-w-3xl px-4 py-24 text-center">Job not found</div>;

  const fee = bidAmount * FEE_PCT;
  const payout = bidAmount - fee;

  const next = () => {
    if (step === 1 && coverLetter.trim().length < 80) { toast.error("Cover letter should be at least 80 characters"); return; }
    if (step === 2 && bidAmount <= 0) { toast.error("Enter a valid bid amount"); return; }
    setStep((s) => (s === 3 ? 3 : ((s + 1) as 1 | 2 | 3)));
  };

  const submit = () => {
    try {
      actions.submitProposal({ jobId, coverLetter, bidAmount, paymentType, milestones });
      toast.success("Proposal submitted! The client has been notified.");
      navigate({ to: "/dashboard" });
    } catch (err) { toast.error((err as Error).message); }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <button onClick={() => navigate({ to: "/jobs/$id", params: { id: jobId } })} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to job
      </button>
      <h1 className="mt-3 font-display text-3xl font-bold">Submit a proposal</h1>
      <p className="text-sm text-muted-foreground">for <span className="font-medium text-foreground">{job.title}</span></p>

      <div className="mt-8 flex items-center gap-2">
        {[1, 2, 3].map((n) => (
          <div key={n} className="flex flex-1 items-center gap-2">
            <div className={cn("grid h-8 w-8 place-items-center rounded-full text-xs font-semibold", step >= n ? "bg-foreground text-background" : "bg-secondary text-muted-foreground")}>
              {step > n ? <Check className="h-4 w-4" /> : n}
            </div>
            <div className={cn("h-0.5 flex-1 rounded-full", step > n ? "bg-foreground" : "bg-border")} />
          </div>
        ))}
      </div>
      <div className="mt-2 grid grid-cols-3 text-xs text-muted-foreground">
        <span className={step >= 1 ? "text-foreground font-medium" : ""}>1 · Cover letter</span>
        <span className={cn("text-center", step >= 2 && "text-foreground font-medium")}>2 · Pricing</span>
        <span className={cn("text-right", step >= 3 && "text-foreground font-medium")}>3 · Milestones</span>
      </div>

      <div className="mt-6 rounded-2xl border border-border bg-surface p-6">
        {step === 1 && (
          <div className="space-y-3">
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Cover letter</label>
            <textarea value={coverLetter} onChange={(e) => setCoverLetter(e.target.value)} placeholder="Open with the result you'll deliver, prove relevance with 2-3 specific past wins, and end with a clear next step." className="min-h-[220px] w-full rounded-xl border border-border bg-background p-4 text-sm" />
            <div className="text-right text-xs text-muted-foreground">{coverLetter.length} chars · 80+ recommended</div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Payment type</label>
              <div className="flex rounded-lg border border-border p-0.5">
                {(["fixed", "hourly"] as const).map((p) => (
                  <button key={p} type="button" onClick={() => setPaymentType(p)} className={cn("flex-1 rounded-md px-3 py-2 text-sm font-medium capitalize", paymentType === p ? "bg-foreground text-background" : "text-muted-foreground")}>{p}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">{paymentType === "fixed" ? "Total bid (USD)" : "Hourly rate (USD)"}</label>
              <input type="number" value={bidAmount} min={1} onChange={(e) => setBidAmount(Number(e.target.value))} className="h-12 w-full rounded-xl border border-border bg-background px-4 text-lg font-semibold" />
            </div>
            <div className="rounded-xl border border-dashed border-border bg-background p-4 text-sm">
              <Row label="Your bid" value={`$${bidAmount.toLocaleString()}`} />
              <Row label="Platform service fee (10%)" value={`-$${fee.toLocaleString()}`} muted />
              <div className="my-2 border-t border-border" />
              <Row label="You'll receive" value={`$${payout.toLocaleString()}`} strong />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-3">
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Milestones</label>
            {milestones.map((m, i) => (
              <div key={i} className="grid gap-2 rounded-xl border border-border bg-background p-3 sm:grid-cols-[1fr_120px_120px_36px]">
                <input value={m.title} onChange={(e) => { const next = [...milestones]; next[i] = { ...m, title: e.target.value }; setMilestones(next); }} className="h-10 rounded-lg border border-border bg-surface px-3 text-sm" />
                <input type="number" value={m.amount} onChange={(e) => { const next = [...milestones]; next[i] = { ...m, amount: Number(e.target.value) }; setMilestones(next); }} className="h-10 rounded-lg border border-border bg-surface px-3 text-sm" placeholder="$" />
                <input type="number" value={m.dueDays} onChange={(e) => { const next = [...milestones]; next[i] = { ...m, dueDays: Number(e.target.value) }; setMilestones(next); }} className="h-10 rounded-lg border border-border bg-surface px-3 text-sm" placeholder="days" />
                <button type="button" onClick={() => setMilestones(milestones.filter((_, j) => j !== i))} className="h-10 rounded-lg border border-border text-sm text-muted-foreground hover:text-destructive">×</button>
              </div>
            ))}
            <button type="button" onClick={() => setMilestones([...milestones, { title: "New milestone", amount: 500, dueDays: 14 }])} className="text-sm font-medium text-accent hover:underline">+ Add milestone</button>
          </div>
        )}

        <div className="mt-8 flex items-center justify-between">
          <button onClick={() => setStep((s) => (s === 1 ? 1 : ((s - 1) as 1 | 2 | 3)))} disabled={step === 1} className="inline-flex h-10 items-center gap-2 rounded-lg border border-border bg-background px-4 text-sm font-medium disabled:opacity-50">
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
          {step < 3 ? (
            <button onClick={next} className="inline-flex h-10 items-center gap-2 rounded-lg bg-foreground px-4 text-sm font-semibold text-background">
              Continue <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button onClick={submit} className="inline-flex h-10 items-center gap-2 rounded-lg bg-accent px-4 text-sm font-semibold text-accent-foreground">
              Submit proposal <Check className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, muted, strong }: { label: string; value: string; muted?: boolean; strong?: boolean }) {
  return (
    <div className={cn("flex items-center justify-between py-1", muted && "text-muted-foreground", strong && "font-semibold text-foreground")}>
      <span>{label}</span><span>{value}</span>
    </div>
  );
}
