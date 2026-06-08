import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { ArrowRight, BriefcaseBusiness, CheckCircle2, DollarSign, FileText, Sparkles, TrendingUp, Users } from "lucide-react";
import { actions, sel, useStore } from "@/lib/store";
import { JobCard } from "@/components/JobCard";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard")({ component: Dashboard });

function Dashboard() {
  const me = useStore(sel.currentUser);
  const navigate = useNavigate();

  useEffect(() => {
    if (typeof window !== "undefined" && me === null) {
      navigate({ to: "/login", search: { redirect: "/dashboard" } as never });
    }
  }, [me, navigate]);

  if (!me) return <div className="mx-auto max-w-7xl px-4 py-20" />;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{me.role} dashboard</div>
          <h1 className="font-display text-3xl font-bold">Welcome back, {me.name.split(" ")[0]}</h1>
        </div>
        <div className="flex rounded-xl border border-border bg-surface p-1">
          {(["client", "freelancer"] as const).map((r) => (
            <button
              key={r}
              onClick={() => actions.switchRole(r)}
              className={cn("rounded-lg px-4 py-2 text-sm font-medium capitalize transition", me.role === r ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground")}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8">{me.role === "client" ? <ClientView clientId={me.id} /> : <FreelancerView freelancerId={me.id} />}</div>
    </div>
  );
}

function ClientView({ clientId }: { clientId: string }) {
  const myJobs = useStore(sel.jobsByClient(clientId));
  const proposals = useStore(sel.proposalsForClient(clientId));

  return (
    <>
      <div className="grid gap-3 sm:grid-cols-4">
        <StatCard icon={BriefcaseBusiness} label="Active jobs" value={myJobs.length} />
        <StatCard icon={Users} label="Proposals received" value={proposals.length} />
        <StatCard icon={CheckCircle2} label="Hires made" value={proposals.filter((p) => p.status === "accepted").length} />
        <StatCard icon={TrendingUp} label="Avg time to hire" value="3.2d" />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
        <div>
          <SectionHeader title="Your job postings" action={<Link to="/post-job" className="inline-flex h-9 items-center gap-2 rounded-lg bg-foreground px-3 text-sm font-semibold text-background">Post a job <ArrowRight className="h-4 w-4" /></Link>} />
          <div className="space-y-3">
            {myJobs.length === 0
              ? <Empty title="No jobs posted yet" cta={<Link to="/post-job" className="text-accent hover:underline">Post your first job →</Link>} />
              : myJobs.map((j) => <JobCard key={j.id} job={j} />)}
          </div>
        </div>

        <aside>
          <SectionHeader title="Recent proposals" />
          <div className="space-y-3">
            {proposals.length === 0
              ? <Empty title="No incoming proposals yet" />
              : proposals.slice(0, 6).map((p) => (
                <div key={p.id} className="rounded-2xl border border-border bg-surface p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-display font-semibold">{p.freelancerName}</div>
                      <div className="text-xs text-muted-foreground line-clamp-1">on “{p.jobTitle}”</div>
                    </div>
                    <div className="text-right text-sm font-semibold">₦{p.bidAmount.toLocaleString("en-NG")}</div>
                  </div>
                  <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">{p.coverLetter}</p>
                  <div className="mt-3 flex gap-2">
                    <button onClick={() => actions.setProposalStatus(p.id, "accepted")} className="flex-1 rounded-md bg-accent px-3 py-1.5 text-xs font-semibold text-accent-foreground">Accept</button>
                    <button onClick={() => actions.setProposalStatus(p.id, "archived")} className="flex-1 rounded-md border border-border px-3 py-1.5 text-xs font-medium">Archive</button>
                  </div>
                </div>
              ))}
          </div>
        </aside>
      </div>
    </>
  );
}

function FreelancerView({ freelancerId }: { freelancerId: string }) {
  const myProposals = useStore(sel.proposalsByFreelancer(freelancerId));
  const active = myProposals.filter((p) => p.status === "active");
  const accepted = myProposals.filter((p) => p.status === "accepted");
  const archived = myProposals.filter((p) => p.status === "archived");
  const earnings = accepted.reduce((sum, p) => sum + p.bidAmount, 0);

  return (
    <>
      <div className="grid gap-3 sm:grid-cols-4">
        <StatCard icon={FileText} label="Active proposals" value={active.length} />
        <StatCard icon={CheckCircle2} label="Accepted" value={accepted.length} />
        <StatCard icon={DollarSign} label="Pipeline value" value={`₦${earnings.toLocaleString("en-NG")}`} />
        <StatCard icon={Sparkles} label="Profile strength" value="88%" />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
        <div>
          <SectionHeader title="My proposals" action={<Link to="/jobs" className="text-sm text-accent hover:underline">Find more work →</Link>} />
          {myProposals.length === 0
            ? <Empty title="No proposals yet" cta={<Link to="/jobs" className="text-accent hover:underline">Browse open jobs →</Link>} />
            : (
              <div className="rounded-2xl border border-border bg-surface overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-secondary/50 text-xs uppercase tracking-wider text-muted-foreground">
                    <tr>
                      <th className="p-4 text-left">Job</th>
                      <th className="p-4 text-left">Bid</th>
                      <th className="p-4 text-left">Submitted</th>
                      <th className="p-4 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myProposals.map((p) => (
                      <tr key={p.id} className="border-t border-border transition-colors hover:bg-secondary/40">
                        <td className="p-4 font-medium">{p.jobTitle}</td>
                        <td className="p-4">₦{p.bidAmount.toLocaleString("en-NG")} <span className="text-xs text-muted-foreground">{p.paymentType}</span></td>
                        <td className="p-4 text-muted-foreground">{new Date(p.submittedAt).toLocaleDateString()}</td>
                        <td className="p-4">
                          <StatusPill status={p.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
        </div>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-border bg-surface p-5">
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Earnings · last 30d</div>
            <div className="mt-2 font-display text-3xl font-bold">₦{earnings.toLocaleString("en-NG")}</div>
            <Sparkline />
          </div>
          <div className="rounded-2xl border border-border bg-primary p-5 text-primary-foreground">
            <div className="text-xs font-semibold uppercase tracking-wider text-primary-foreground/70">Profile optimization</div>
            <p className="mt-2 text-sm text-primary-foreground/90">See tailored suggestions, profile views, and proposal success analytics.</p>
            <Link to="/profile-tools" className="mt-4 inline-flex h-9 items-center rounded-lg bg-accent px-3 text-xs font-semibold text-accent-foreground">Open optimization tools</Link>
          </div>
          <div className="rounded-2xl border border-border bg-surface p-5 text-sm">
            <div className="flex items-center justify-between"><span className="text-muted-foreground">Archived</span><span className="font-semibold">{archived.length}</span></div>
            <div className="mt-2 flex items-center justify-between"><span className="text-muted-foreground">Response rate</span><span className="font-semibold">96%</span></div>
            <div className="mt-2 flex items-center justify-between"><span className="text-muted-foreground">Avg response time</span><span className="font-semibold">1h 12m</span></div>
          </div>
        </aside>
      </div>
    </>
  );
}

function StatCard({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <div className="flex items-center justify-between">
        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</div>
        <div className="grid h-8 w-8 place-items-center rounded-lg bg-secondary"><Icon className="h-4 w-4" /></div>
      </div>
      <div className="mt-3 font-display text-2xl font-bold">{value}</div>
    </div>
  );
}
function SectionHeader({ title, action }: { title: string; action?: React.ReactNode }) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <h2 className="font-display text-lg font-semibold">{title}</h2>
      {action}
    </div>
  );
}
function Empty({ title, cta }: { title: string; cta?: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-surface p-10 text-center">
      <div className="font-display font-semibold">{title}</div>
      {cta && <div className="mt-2 text-sm">{cta}</div>}
    </div>
  );
}
function StatusPill({ status }: { status: "active" | "accepted" | "archived" }) {
  const cls = status === "accepted" ? "bg-accent/15 text-accent" : status === "active" ? "bg-secondary text-foreground" : "bg-muted text-muted-foreground";
  return <span className={cn("rounded-full px-2.5 py-1 text-xs font-semibold capitalize", cls)}>{status}</span>;
}
function Sparkline() {
  const pts = [4, 8, 6, 10, 12, 9, 14, 11, 16, 13, 18, 22];
  const max = Math.max(...pts);
  const path = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${(i / (pts.length - 1)) * 100} ${30 - (p / max) * 28}`).join(" ");
  return (
    <svg viewBox="0 0 100 30" className="mt-3 h-12 w-full" preserveAspectRatio="none">
      <path d={path} fill="none" stroke="var(--accent)" strokeWidth="1.5" />
      <path d={`${path} L 100 30 L 0 30 Z`} fill="color-mix(in oklab, var(--accent) 20%, transparent)" />
    </svg>
  );
}
