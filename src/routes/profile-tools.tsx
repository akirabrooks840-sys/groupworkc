import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo } from "react";
import {
  Activity,
  ArrowUpRight,
  BadgeCheck,
  CheckCircle2,
  Eye,
  Lightbulb,
  Send,
  Sparkles,
  Target,
  TrendingUp,
  XCircle,
} from "lucide-react";
import { sel, useStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import type { User } from "@/lib/types";

export const Route = createFileRoute("/profile-tools")({
  head: () => ({
    meta: [
      { title: "Profile optimization — Hirewave" },
      {
        name: "description",
        content:
          "AI-assisted suggestions and analytics to improve your Hirewave freelancer profile, views and proposal success.",
      },
    ],
  }),
  component: ProfileTools,
});

// Deterministic hash so analytics stay stable per-user across refreshes.
function hash(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = (h * 16777619) >>> 0;
  }
  return h;
}
const rand = (seed: number, min: number, max: number) =>
  min + ((seed % 1000) / 1000) * (max - min);

function ProfileTools() {
  const me = useStore(sel.currentUser);
  const navigate = useNavigate();
  const proposals = useStore(
    me ? sel.proposalsByFreelancer(me.id) : () => [] as ReturnType<ReturnType<typeof sel.proposalsByFreelancer>>,
  );
  const tips = useMemo(() => (me ? buildSuggestions(me) : []), [me]);
  const completion = useMemo(() => completionScore(tips), [tips]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (me === null) {
      navigate({ to: "/login", search: { redirect: "/profile-tools" } as never });
    }
  }, [me, navigate]);

  if (!me) return <div className="mx-auto max-w-7xl px-4 py-20" />;

  if (me.role !== "freelancer") {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <h1 className="font-display text-2xl font-bold">Freelancer only</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Switch to your freelancer profile to use the optimization tools.
        </p>
        <Link to="/dashboard" className="mt-6 inline-block text-accent hover:underline">
          Back to dashboard →
        </Link>
      </div>
    );
  }


  const totalProps = proposals.length;
  const accepted = proposals.filter((p) => p.status === "accepted").length;
  const active = proposals.filter((p) => p.status === "active").length;
  const archived = proposals.filter((p) => p.status === "archived").length;
  const successRate = totalProps === 0 ? 0 : Math.round((accepted / totalProps) * 100);

  const seed = hash(me.id);
  const profileViews30d = Math.round(rand(seed, 480, 1850));
  const searchImpressions = Math.round(profileViews30d * rand(seed + 1, 4, 7));
  const shortlists = Math.round(rand(seed + 2, 6, 28));
  const replyRate = Math.round(rand(seed + 3, 72, 98));
  const responseHrs = +rand(seed + 4, 0.6, 4.2).toFixed(1);

  const viewsTrend = buildSeries(seed, 14, profileViews30d / 30);
  const propsTrend = buildSeries(seed + 7, 14, Math.max(0.4, totalProps / 14));

  const isPending = me.verificationStatus === "pending";
  const isRejected = me.verificationStatus === "rejected";

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-accent" /> Profile optimization
          </div>
          <h1 className="font-display text-3xl font-bold">Tune your profile, win more work</h1>
          <p className="mt-1 max-w-xl text-sm text-muted-foreground">
            Real-time analytics and tailored suggestions to boost your visibility, reply rate,
            and proposal-to-hire conversion.
          </p>
        </div>
        <Link
          to="/freelancers/$id"
          params={{ id: me.id }}
          className="inline-flex h-9 items-center gap-2 rounded-lg border border-border bg-surface px-3 text-sm font-medium hover:border-foreground/30"
        >
          View public profile <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>

      {(isPending || isRejected) && (
        <div
          className={cn(
            "mt-6 rounded-2xl border p-4 text-sm",
            isPending
              ? "border-accent/40 bg-accent/10 text-foreground"
              : "border-destructive/40 bg-destructive/10 text-foreground",
          )}
        >
          <div className="font-display font-semibold">
            {isPending
              ? "Your profile is pending admin verification."
              : "Your profile was not approved."}
          </div>
          <p className="mt-1 text-muted-foreground">
            {isPending
              ? "You can keep improving your profile while we review your submission. Approved profiles surface in search and unlock proposal sending."
              : "Update your pitch and the kind of work you do, then contact support to request re-review."}
          </p>
        </div>
      )}

      {/* Strength card */}
      <div className="mt-6 grid gap-4 md:grid-cols-[1.4fr_1fr]">
        <div className="rounded-2xl border border-border bg-gradient-to-br from-surface to-background p-6">
          <div className="flex items-center justify-between">
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Profile strength
            </div>
            <BadgeCheck className="h-4 w-4 text-accent" />
          </div>
          <div className="mt-3 flex items-baseline gap-3">
            <div className="font-display text-5xl font-bold tabular-nums">{completion.score}%</div>
            <div className="text-sm text-muted-foreground">{completion.label}</div>
          </div>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full rounded-full bg-gradient-to-r from-accent to-primary transition-all"
              style={{ width: `${completion.score}%` }}
            />
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3 text-xs sm:grid-cols-4">
            <Mini label="Skills" value={`${me.skills?.length ?? 0}`} ok={(me.skills?.length ?? 0) >= 5} />
            <Mini label="Bio" value={me.bio ? "Filled" : "Missing"} ok={!!me.bio} />
            <Mini label="Rate" value={me.hourlyRate ? `$${me.hourlyRate}/h` : "—"} ok={!!me.hourlyRate} />
            <Mini label="Location" value={me.location ? "Set" : "—"} ok={!!me.location} />
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-primary p-6 text-primary-foreground">
          <div className="text-xs font-semibold uppercase tracking-wider text-primary-foreground/70">
            Proposal success rate
          </div>
          <div className="mt-3 font-display text-5xl font-bold tabular-nums">{successRate}%</div>
          <p className="mt-2 text-sm text-primary-foreground/80">
            {accepted} of {totalProps || 0} submitted proposals converted into a hire.
          </p>
          <div className="mt-5 grid grid-cols-3 gap-3 text-center text-xs">
            <Pill label="Active" value={active} />
            <Pill label="Hired" value={accepted} />
            <Pill label="Archived" value={archived} />
          </div>
        </div>
      </div>

      {/* Analytics row */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat icon={Eye} label="Profile views · 30d" value={profileViews30d.toLocaleString()} delta="+12%" />
        <Stat icon={TrendingUp} label="Search impressions" value={searchImpressions.toLocaleString()} delta="+18%" />
        <Stat icon={Target} label="Client shortlists" value={shortlists} delta="+5" />
        <Stat icon={Activity} label="Reply rate" value={`${replyRate}%`} delta={`${responseHrs}h avg`} subtle />
      </div>

      {/* Trends */}
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <TrendCard title="Profile views" subtitle="Last 14 days" series={viewsTrend} />
        <TrendCard title="Proposals sent" subtitle="Last 14 days" series={propsTrend} accent />
      </div>

      {/* Suggestions */}
      <div className="mt-8">
        <div className="mb-3 flex items-end justify-between">
          <div>
            <h2 className="font-display text-xl font-semibold">Suggested improvements</h2>
            <p className="text-sm text-muted-foreground">
              Personalized actions ranked by impact on your conversion.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium">
            <Lightbulb className="h-3.5 w-3.5 text-accent" />
            {tips.filter((t) => !t.done).length} open
          </div>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {tips.map((t) => (
            <div
              key={t.id}
              className={cn(
                "rounded-2xl border p-5 transition",
                t.done ? "border-accent/30 bg-accent/5" : "border-border bg-surface hover:border-foreground/20",
              )}
            >
              <div className="flex items-start gap-3">
                <div
                  className={cn(
                    "grid h-9 w-9 shrink-0 place-items-center rounded-lg",
                    t.done ? "bg-accent/15 text-accent" : "bg-secondary text-foreground",
                  )}
                >
                  {t.done ? <CheckCircle2 className="h-4 w-4" /> : <t.icon className="h-4 w-4" />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <div className="font-display font-semibold">{t.title}</div>
                    <ImpactBadge impact={t.impact} />
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{t.body}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-10 rounded-3xl border border-border bg-surface p-6 sm:flex sm:items-center sm:justify-between sm:p-8">
        <div>
          <h3 className="font-display text-lg font-semibold">Ready to send a stronger proposal?</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Apply your improvements on a fresh brief from a verified client.
          </p>
        </div>
        <Link
          to="/jobs"
          className="mt-4 inline-flex h-10 items-center gap-2 rounded-xl bg-foreground px-5 text-sm font-semibold text-background hover:-translate-y-0.5 sm:mt-0"
        >
          Browse open jobs <Send className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}

// ---------- helpers ----------

interface Tip {
  id: string;
  title: string;
  body: string;
  done: boolean;
  impact: "high" | "medium" | "low";
  icon: React.ComponentType<{ className?: string }>;
}

function buildSuggestions(u: User): Tip[] {
  const skillsCount = u.skills?.length ?? 0;
  return [
    {
      id: "bio",
      title: "Write a sharper bio",
      body: u.bio
        ? "Your bio is set — review it quarterly and lead with recent outcomes."
        : "Add a 2–3 sentence bio leading with the outcomes you ship and your tech stack.",
      done: !!u.bio && u.bio.length > 80,
      impact: "high",
      icon: Sparkles,
    },
    {
      id: "skills",
      title: skillsCount < 5 ? `Add ${5 - skillsCount} more skills` : "Skills look strong",
      body:
        skillsCount < 5
          ? "Profiles with 5+ relevant skills get matched to 3× more briefs."
          : "Re-order skills so your strongest one is first — it's used in search ranking.",
      done: skillsCount >= 5,
      impact: "high",
      icon: Target,
    },
    {
      id: "rate",
      title: u.hourlyRate ? "Benchmark your rate" : "Set an hourly rate",
      body: u.hourlyRate
        ? `Your rate of $${u.hourlyRate}/h is within range. Clients filtering at $${u.hourlyRate + 25}/h see you when you opt-in.`
        : "Profiles without a rate are filtered out of 64% of premium searches.",
      done: !!u.hourlyRate,
      impact: "high",
      icon: TrendingUp,
    },
    {
      id: "location",
      title: u.location ? "Location set" : "Add your timezone & city",
      body: u.location
        ? "Great — your location helps clients filter for timezone overlap."
        : "Add a city. Clients value timezone overlap almost as much as portfolio.",
      done: !!u.location,
      impact: "medium",
      icon: Activity,
    },
    {
      id: "pitch",
      title: u.pitch ? "Pitch on file" : "Add a short pitch",
      body: u.pitch
        ? "Your pitch is logged with the admin team and shown during verification review."
        : "A 2-line pitch makes your application stand out during admin review and to shortlisting clients.",
      done: !!u.pitch,
      impact: "medium",
      icon: Lightbulb,
    },
    {
      id: "verify",
      title: "Get verified",
      body:
        u.verificationStatus === "approved"
          ? "You're verified — keep your profile fresh to retain the badge."
          : u.verificationStatus === "rejected"
            ? "Verification was declined. Update your pitch and request re-review."
            : "Verification unlocks the BadgeCheck and surfaces you in top-tier client searches.",
      done: u.verificationStatus === "approved",
      impact: "high",
      icon: BadgeCheck,
    },
  ];
}

function completionScore(tips: Tip[]) {
  if (tips.length === 0) return { score: 0, label: "—" };
  const done = tips.filter((t) => t.done).length;
  const score = Math.round((done / tips.length) * 100);
  const label =
    score >= 90 ? "Elite" : score >= 70 ? "Strong" : score >= 40 ? "Getting there" : "Needs work";
  return { score, label };
}

function buildSeries(seed: number, n: number, baseline: number): number[] {
  const arr: number[] = [];
  for (let i = 0; i < n; i++) {
    const r = rand(seed + i * 31, 0.5, 1.6);
    arr.push(Math.max(0, Math.round(baseline * r * (1 + i / (n * 2)))));
  }
  return arr;
}

function Mini({ label, value, ok }: { label: string; value: string; ok: boolean }) {
  return (
    <div className="rounded-lg border border-border bg-background p-3">
      <div className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        {ok ? (
          <CheckCircle2 className="h-3 w-3 text-accent" />
        ) : (
          <XCircle className="h-3 w-3 text-muted-foreground/60" />
        )}
        {label}
      </div>
      <div className="mt-1 text-sm font-semibold">{value}</div>
    </div>
  );
}

function Pill({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg bg-primary-foreground/10 p-2">
      <div className="font-display text-xl font-bold tabular-nums">{value}</div>
      <div className="text-[10px] font-semibold uppercase tracking-wider text-primary-foreground/70">
        {label}
      </div>
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
  delta,
  subtle,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: React.ReactNode;
  delta?: string;
  subtle?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <div className="flex items-center justify-between">
        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </div>
        <div className="grid h-8 w-8 place-items-center rounded-lg bg-secondary">
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <div className="mt-3 font-display text-2xl font-bold tabular-nums">{value}</div>
      {delta && (
        <div
          className={cn(
            "mt-1 text-xs font-medium",
            subtle ? "text-muted-foreground" : "text-accent",
          )}
        >
          {delta}
        </div>
      )}
    </div>
  );
}

function TrendCard({
  title,
  subtitle,
  series,
  accent,
}: {
  title: string;
  subtitle: string;
  series: number[];
  accent?: boolean;
}) {
  const max = Math.max(1, ...series);
  const stroke = accent ? "var(--accent)" : "var(--primary)";
  const path = series
    .map((p, i) => `${i === 0 ? "M" : "L"} ${(i / (series.length - 1)) * 100} ${30 - (p / max) * 26}`)
    .join(" ");
  const total = series.reduce((a, b) => a + b, 0);

  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <div className="flex items-end justify-between">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {title}
          </div>
          <div className="mt-1 font-display text-2xl font-bold tabular-nums">{total}</div>
        </div>
        <div className="text-xs text-muted-foreground">{subtitle}</div>
      </div>
      <svg viewBox="0 0 100 32" className="mt-4 h-20 w-full" preserveAspectRatio="none">
        <path d={path} fill="none" stroke={stroke} strokeWidth="1.5" />
        <path
          d={`${path} L 100 32 L 0 32 Z`}
          fill={accent ? "color-mix(in oklab, var(--accent) 20%, transparent)" : "color-mix(in oklab, var(--primary) 18%, transparent)"}
        />
      </svg>
    </div>
  );
}

function ImpactBadge({ impact }: { impact: "high" | "medium" | "low" }) {
  const cls =
    impact === "high"
      ? "bg-accent/15 text-accent"
      : impact === "medium"
        ? "bg-secondary text-foreground"
        : "bg-muted text-muted-foreground";
  return (
    <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider", cls)}>
      {impact}
    </span>
  );
}
