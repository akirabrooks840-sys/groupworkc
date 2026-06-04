import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Briefcase, Code2, Database, Megaphone, Palette, PenLine, Search, Server, Smartphone, Sparkles } from "lucide-react";
import { useState } from "react";
import { sel, useStore } from "@/lib/store";
import { JobCard } from "@/components/JobCard";
import { FreelancerCard } from "@/components/FreelancerCard";
import { categories } from "@/lib/seed";

export const Route = createFileRoute("/")({ component: Home });

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Code2, Palette, Sparkles, Smartphone, Server, PenLine, Megaphone, Database,
};

function Home() {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const jobs = useStore((s) => s.jobs).slice(0, 3);
  const freelancers = useStore(sel.freelancers).slice(0, 3);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="gradient-mesh absolute inset-0 -z-10" />
        <div className="mx-auto max-w-7xl px-4 pt-16 pb-14 sm:px-6 sm:pt-24 sm:pb-20">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              A simple marketplace for freelance work
            </div>
            <h1 className="mt-6 font-display text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl md:text-6xl">
              Find good people.<br />
              <span className="text-accent">Get good work done.</span>
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-base text-muted-foreground">
              Hirewave lets clients post jobs and freelancers send proposals. Create an account, browse what's open, and start working together.
            </p>

            <form
              onSubmit={(e) => { e.preventDefault(); navigate({ to: "/jobs", search: { q } as never }); }}
              className="mx-auto mt-8 flex max-w-2xl items-center gap-2 rounded-2xl border border-border bg-surface p-2 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.10)]"
            >
              <div className="flex flex-1 items-center gap-2 px-3">
                <Search className="h-5 w-5 text-muted-foreground" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search jobs e.g. React developer"
                  className="h-11 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/70"
                />
              </div>
              <button className="inline-flex h-11 items-center gap-2 rounded-xl bg-foreground px-5 text-sm font-semibold text-background transition-transform hover:-translate-y-0.5">
                Search <ArrowRight className="h-4 w-4" />
              </button>
            </form>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground">
              <span>Try:</span>
              {["React", "UI design", "Python", "Writing", "Mobile"].map((t) => (
                <Link
                  key={t}
                  to="/jobs"
                  search={{ q: t } as never}
                  className="rounded-full border border-border bg-surface px-3 py-1 hover:border-foreground/30"
                >
                  {t}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold sm:text-3xl">Categories</h2>
            <p className="mt-1 text-sm text-muted-foreground">Pick an area and see what's available.</p>
          </div>
          <Link to="/freelancers" className="hidden text-sm font-medium text-accent hover:underline sm:block">View all →</Link>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {categories.map((c) => {
            const Icon = iconMap[c.icon] ?? Briefcase;
            return (
              <Link
                key={c.name}
                to="/jobs"
                search={{ q: c.name } as never}
                className="hover-lift group flex flex-col gap-3 rounded-2xl border border-border bg-surface p-5"
              >
                <div className="grid h-10 w-10 place-items-center rounded-lg bg-secondary text-foreground transition-colors group-hover:bg-accent group-hover:text-accent-foreground">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-semibold">{c.name}</div>
                  <div className="text-xs text-muted-foreground">{c.count.toLocaleString()} jobs</div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured jobs */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold sm:text-3xl">Recent jobs</h2>
            <p className="mt-1 text-sm text-muted-foreground">A few of the latest postings.</p>
          </div>
          <Link to="/jobs" className="text-sm font-medium text-accent hover:underline">Browse all →</Link>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {jobs.map((j) => <JobCard key={j.id} job={j} />)}
        </div>
      </section>

      {/* Featured talent */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold sm:text-3xl">Freelancers</h2>
            <p className="mt-1 text-sm text-muted-foreground">Meet a few of the people on Hirewave.</p>
          </div>
          <Link to="/freelancers" className="text-sm font-medium text-accent hover:underline">See more →</Link>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {freelancers.map((u) => <FreelancerCard key={u.id} user={u} />)}
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <h2 className="font-display text-2xl font-bold sm:text-3xl">How it works</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {[
            { n: "1", t: "Sign up", d: "Create an account as a client or a freelancer. Takes about a minute." },
            { n: "2", t: "Post or apply", d: "Clients describe what they need. Freelancers send a proposal with their rate." },
            { n: "3", t: "Get to work", d: "Accept a proposal from your dashboard and start the project." },
          ].map((b) => (
            <div key={b.n} className="rounded-2xl border border-border bg-surface p-6">
              <div className="grid h-9 w-9 place-items-center rounded-lg bg-secondary font-display text-sm font-bold">
                {b.n}
              </div>
              <div className="mt-3 font-display text-lg font-semibold">{b.t}</div>
              <p className="mt-1 text-sm text-muted-foreground">{b.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-primary p-8 text-primary-foreground sm:p-12">
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-accent/30 blur-3xl" />
          <div className="relative grid gap-6 md:grid-cols-2 md:items-center">
            <div>
              <h2 className="font-display text-2xl font-bold sm:text-3xl">Ready to start?</h2>
              <p className="mt-2 max-w-md text-sm text-primary-foreground/80">
                Make a free account and either post a job or send your first proposal today.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 md:justify-end">
              <Link to="/register" className="inline-flex h-11 items-center gap-2 rounded-xl bg-accent px-5 text-sm font-semibold text-accent-foreground hover:-translate-y-0.5 transition-transform">
                Create account <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/jobs" className="inline-flex h-11 items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-5 text-sm font-semibold hover:bg-white/10">
                Browse jobs
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
