import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ — Hirewave" },
      { name: "description", content: "Common questions about how Hirewave works: posting jobs, sending proposals, accounts, and payments." },
    ],
  }),
  component: FAQPage,
});

const groups: { title: string; items: { q: string; a: string }[] }[] = [
  {
    title: "Getting started",
    items: [
      {
        q: "Do I need an account to browse?",
        a: "No. You can browse jobs and freelancers without signing in. You only need an account to post a job, send a proposal, or use the dashboard.",
      },
      {
        q: "What's the difference between a client and a freelancer?",
        a: "Clients post jobs and review proposals. Freelancers create a profile, browse jobs, and apply to ones they like. You can switch between the two roles from your dashboard at any time.",
      },
      {
        q: "How do I switch between client and freelancer mode?",
        a: "Open your dashboard. There's a toggle at the top right of the page that flips your active role. You can also use the menu in the header.",
      },
    ],
  },
  {
    title: "Jobs and proposals",
    items: [
      {
        q: "How do I post a job?",
        a: "Sign in as a client, click 'Post a job' from your dashboard or the header menu, and fill in the title, description, budget, and skills. Once submitted it shows up on the jobs board.",
      },
      {
        q: "How do I apply to a job?",
        a: "Open any job from the jobs board and click 'Submit a proposal'. You'll be asked for your bid, a short cover letter, and (optionally) milestones.",
      },
      {
        q: "Can I edit a proposal after sending it?",
        a: "Not in this version. If you need to update something, archive the proposal from your dashboard and send a new one.",
      },
      {
        q: "How does pricing work?",
        a: "Jobs can be fixed-price or hourly. The proposal form shows a small service fee preview so you can see what you'll receive after fees.",
      },
    ],
  },
  {
    title: "Accounts and verification",
    items: [
      {
        q: "Why is my freelancer account pending verification?",
        a: "New freelancer accounts go through a quick admin review before showing up in search. You can still use the dashboard and improve your profile while you wait.",
      },
      {
        q: "I forgot my password. What do I do?",
        a: "This project is a school demo and doesn't include password recovery. Sign up again with a different email, or use one of the demo accounts on the login page.",
      },
      {
        q: "Where is my data stored?",
        a: "All accounts, jobs, and proposals are saved in your browser's localStorage. Clearing your browser data resets the app to its seeded demo state.",
      },
    ],
  },
  {
    title: "About the project",
    items: [
      {
        q: "Is this a real marketplace?",
        a: "No. Hirewave is a student project built to practice React, routing, forms, and state management. There are no real payments, freelancers, or contracts.",
      },
      {
        q: "What is the '2000' button in the footer?",
        a: "It's the admin console for reviewing freelancer applications. The password is '2000' — it's part of the demo, not a real security boundary.",
      },
      {
        q: "Can I deploy my own copy?",
        a: "Yes. It's a standard TanStack Start + Vite app. Clone it, run 'bun install' and 'bun run dev', then deploy to any provider that supports the framework.",
      },
    ],
  },
];

function FAQPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        <HelpCircle className="h-3.5 w-3.5 text-accent" /> FAQ
      </div>
      <h1 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">
        Questions people have asked
      </h1>
      <p className="mt-3 text-muted-foreground">
        Short answers to the things that come up most often. Can't find what you're looking for?{" "}
        <Link to="/contact" className="text-accent underline-offset-4 hover:underline">
          Send us a note
        </Link>
        .
      </p>

      <div className="mt-10 space-y-10">
        {groups.map((g) => (
          <section key={g.title}>
            <h2 className="font-display text-lg font-semibold text-foreground/90">{g.title}</h2>
            <div className="mt-3 divide-y divide-border rounded-2xl border border-border bg-surface">
              {g.items.map((item) => (
                <FAQItem key={item.q} q={item.q} a={item.a} />
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="mt-14 rounded-2xl border border-dashed border-border bg-surface p-6 text-center">
        <div className="font-display font-semibold">Still stuck?</div>
        <p className="mt-1 text-sm text-muted-foreground">
          The contact form goes straight to the project inbox. Be nice — it's a student running this.
        </p>
        <Link
          to="/contact"
          className="mt-4 inline-flex h-10 items-center rounded-lg bg-foreground px-4 text-sm font-semibold text-background transition-transform hover:-translate-y-0.5"
        >
          Open contact form
        </Link>
      </div>
    </div>
  );
}

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <button
      type="button"
      onClick={() => setOpen((o) => !o)}
      className="block w-full text-left"
      aria-expanded={open}
    >
      <div className="flex items-start justify-between gap-3 p-5">
        <div className="font-medium text-foreground">{q}</div>
        <ChevronDown
          className={cn(
            "mt-0.5 h-4 w-4 shrink-0 text-muted-foreground transition-transform",
            open && "rotate-180 text-foreground",
          )}
        />
      </div>
      <div
        className={cn(
          "grid overflow-hidden px-5 transition-all",
          open ? "grid-rows-[1fr] pb-5 opacity-100" : "grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="min-h-0 text-sm leading-relaxed text-muted-foreground">{a}</div>
      </div>
    </button>
  );
}
