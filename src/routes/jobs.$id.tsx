import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { BadgeCheck, Calendar, Clock, MapPin, Star, Users } from "lucide-react";
import { formatDistanceToNowStrict } from "date-fns";
import { sel, useStore } from "@/lib/store";
import { labelForDuration } from "@/components/JobCard";

export const Route = createFileRoute("/jobs/$id")({ component: JobDetail });

function JobDetail() {
  const { id } = Route.useParams();
  const job = useStore(sel.jobById(id));
  const me = useStore(sel.currentUser);
  const navigate = useNavigate();

  if (!job) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="font-display text-2xl font-bold">Job not found</h1>
        <Link to="/jobs" className="mt-4 inline-block text-accent hover:underline">← Back to jobs</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <Link to="/jobs" className="text-sm text-muted-foreground hover:text-foreground">← All jobs</Link>

      <div className="mt-4 grid gap-6 lg:grid-cols-[1fr_320px]">
        <div>
          <div className="rounded-2xl border border-border bg-surface p-8">
            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <span className="rounded-full bg-secondary px-2.5 py-1 font-medium text-secondary-foreground">{job.category}</span>
              {job.verified && (
                <span className="inline-flex items-center gap-1 rounded-full bg-accent/15 px-2.5 py-1 font-medium text-accent">
                  <BadgeCheck className="h-3.5 w-3.5" /> Verified client
                </span>
              )}
              <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" />{formatDistanceToNowStrict(new Date(job.postedAt))} ago</span>
            </div>
            <h1 className="mt-3 font-display text-3xl font-bold leading-tight sm:text-4xl">{job.title}</h1>

            <div className="mt-6 grid gap-4 rounded-xl border border-border bg-background p-5 sm:grid-cols-4">
              <Stat label="Budget" value={job.paymentType === "fixed" ? `₦${job.budgetMin.toLocaleString("en-NG")}–₦${job.budgetMax.toLocaleString("en-NG")}` : `₦${job.budgetMin.toLocaleString("en-NG")}–₦${job.budgetMax.toLocaleString("en-NG")}/hr`} />
              <Stat label="Type" value={job.paymentType === "fixed" ? "Fixed" : "Hourly"} />
              <Stat label="Experience" value={<span className="capitalize">{job.experience}</span>} />
              <Stat label="Duration" value={labelForDuration(job.duration)} />
            </div>

            <div className="prose prose-sm mt-8 max-w-none whitespace-pre-line text-foreground/90">{job.description}</div>

            <div className="mt-8">
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Required skills</div>
              <div className="mt-3 flex flex-wrap gap-2">
                {job.skills.map((s) => (
                  <span key={s} className="rounded-full border border-border bg-background px-3 py-1 text-sm font-medium">{s}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-20 lg:self-start">
          <div className="rounded-2xl border border-border bg-surface p-6">
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">About the client</div>
            <div className="mt-3 font-display text-lg font-semibold">{job.clientName}</div>
            <div className="mt-2 flex items-center gap-1 text-sm text-muted-foreground"><MapPin className="h-3.5 w-3.5" /> Remote · Worldwide</div>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <Tile icon={Star} label="4.95 rating" />
              <Tile icon={Users} label="32 hires" />
              <Tile icon={Calendar} label="2 yrs on platform" />
              <Tile icon={BadgeCheck} label="Payment verified" />
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-primary p-6 text-primary-foreground">
            <div className="text-xs font-semibold uppercase tracking-wider text-primary-foreground/70">Ready to apply?</div>
            <div className="mt-2 font-display text-xl font-bold">{job.proposalsCount} proposals so far</div>
            <p className="mt-2 text-sm text-primary-foreground/80">Strong applications usually land within the first 24 hours.</p>
            <button
              onClick={() => {
                if (!me) { navigate({ to: "/login", search: { redirect: `/proposals/new/${job.id}` } as never }); return; }
                if (me.role !== "freelancer") { navigate({ to: "/dashboard" }); return; }
                navigate({ to: "/proposals/new/$jobId", params: { jobId: job.id } });
              }}
              className="mt-5 inline-flex h-11 w-full items-center justify-center rounded-xl bg-accent px-4 text-sm font-semibold text-accent-foreground"
            >
              Submit a proposal
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-1 font-display text-base font-semibold">{value}</div>
    </div>
  );
}
function Tile({ icon: Icon, label }: { icon: React.ComponentType<{ className?: string }>; label: string }) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-border bg-background p-2.5 text-xs">
      <Icon className="h-3.5 w-3.5 text-accent" /> {label}
    </div>
  );
}
