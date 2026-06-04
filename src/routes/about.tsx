import { createFileRoute, Link } from "@tanstack/react-router";
import { Code2, GitBranch, Github, Sparkles, Users } from "lucide-react";

export const Route = createFileRoute("/about")({
  component: About,
  head: () => ({
    meta: [
      { title: "About — Hirewave" },
      {
        name: "description",
        content:
          "Hirewave is a simple freelance marketplace built as a student project with React and TanStack Start.",
      },
    ],
  }),
});

function About() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">About</div>
      <h1 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">
        About Hirewave
      </h1>
      <p className="mt-5 text-base text-muted-foreground">
        Hirewave is a small freelance marketplace. Clients post jobs, freelancers send proposals,
        and both sides manage everything from a single dashboard. It was built as a school project
        to practice React, file-based routing, forms, and state management.
      </p>

      {/* What you can do */}
      <div className="mt-10 space-y-3">
        <h2 className="font-display text-xl font-bold">What you can do here</h2>
        <ul className="space-y-3">
          {[
            {
              t: "Post a job as a client",
              d: "Describe the work, set a budget, and review proposals from your dashboard.",
            },
            {
              t: "Apply as a freelancer",
              d: "Build a profile, browse open jobs, and send a proposal with your rate and milestones.",
            },
            {
              t: "Switch roles any time",
              d: "One account can act as both a client and a freelancer — handy for testing the whole flow.",
            },
            {
              t: "Track everything in one place",
              d: "Active proposals, accepted work, recent jobs, and earnings all live on the dashboard.",
            },
          ].map((p) => (
            <li key={p.t} className="rounded-xl border border-border bg-surface p-5">
              <div className="font-semibold">{p.t}</div>
              <p className="mt-1 text-sm text-muted-foreground">{p.d}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* Why it exists */}
      <div className="mt-10 rounded-2xl border border-border bg-surface p-6">
        <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5 text-accent" /> Why this project exists
        </div>
        <p className="mt-3 text-sm leading-relaxed text-foreground/90">
          Freelance marketplaces are surprisingly fun to model: two-sided users, search and filters,
          forms with validation, a notion of state machines (proposal status), and a tiny admin
          panel. Building one end-to-end is a great way to practice everything that goes into a
          real product UI without having to ship a real one.
        </p>
      </div>

      {/* Tech stack */}
      <div className="mt-6 rounded-2xl border border-border bg-surface p-6">
        <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          <Code2 className="h-3.5 w-3.5 text-accent" /> Built with
        </div>
        <div className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
          {[
            ["React 19", "Components, hooks, and Suspense"],
            ["TypeScript", "Types across the whole app"],
            ["TanStack Router & Start", "File-based routes and SSR"],
            ["Tailwind CSS v4", "Design tokens and utility classes"],
            ["Radix UI primitives", "Accessible dropdowns and dialogs"],
            ["Zod", "Form validation"],
            ["localStorage store", "No real backend — data persists in the browser"],
            ["Cloudflare Workers", "Where it's deployed"],
          ].map(([name, note]) => (
            <div key={name} className="flex gap-2 rounded-lg border border-border bg-background p-3">
              <div className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-accent" />
              <div>
                <div className="font-semibold">{name}</div>
                <div className="text-xs text-muted-foreground">{note}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Roadmap */}
      <div className="mt-6 rounded-2xl border border-border bg-surface p-6">
        <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          <GitBranch className="h-3.5 w-3.5 text-accent" /> Things still on the list
        </div>
        <ul className="mt-4 space-y-2 text-sm text-foreground/90">
          {[
            "Real authentication with a backend (currently localStorage)",
            "Messaging between clients and freelancers",
            "Email notifications for new proposals",
            "Payments (this version is UI-only)",
            "A proper profile editor for freelancers",
          ].map((t) => (
            <li key={t} className="flex items-start gap-2">
              <span className="mt-2 h-1 w-1 rounded-full bg-muted-foreground" />
              {t}
            </li>
          ))}
        </ul>
      </div>

      {/* Credits */}
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-border bg-surface p-5">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            <Users className="h-3.5 w-3.5 text-accent" /> Who made it
          </div>
          <p className="mt-2 text-sm text-foreground/90">
            A student building a portfolio piece. The mock freelancers and jobs are fictional;
            avatars are generated from seed names.
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-surface p-5">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            <Github className="h-3.5 w-3.5 text-accent" /> Source & questions
          </div>
          <p className="mt-2 text-sm text-foreground/90">
            Got feedback or want to know how something works? Drop a note on the{" "}
            <Link to="/contact" className="text-accent underline-offset-4 hover:underline">
              contact page
            </Link>
            .
          </p>
        </div>
      </div>

      <div className="mt-10 flex flex-wrap gap-2">
        <Link
          to="/faq"
          className="inline-flex h-10 items-center rounded-lg border border-border bg-surface px-4 text-sm font-medium hover:border-foreground/30"
        >
          Read the FAQ →
        </Link>
        <Link
          to="/jobs"
          className="inline-flex h-10 items-center rounded-lg bg-foreground px-4 text-sm font-medium text-background hover:-translate-y-0.5 transition-transform"
        >
          Browse jobs
        </Link>
      </div>
    </div>
  );
}
