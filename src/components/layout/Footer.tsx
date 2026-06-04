import { Link } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";

const cols = [
  {
    title: "Marketplace",
    links: [
      { label: "Find work", to: "/jobs" },
      { label: "Find talent", to: "/freelancers" },
      { label: "Post a job", to: "/post-job" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", to: "/about" },
      { label: "FAQ", to: "/faq" },
      { label: "Contact", to: "/contact" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Sign in", to: "/login" },
      { label: "Create account", to: "/register" },
      { label: "Dashboard", to: "/dashboard" },
    ],
  },
] as const;

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface mt-24">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <Link to="/" className="flex items-center gap-2">
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground">
                <Sparkles className="h-4 w-4 text-accent" />
              </div>
              <span className="font-display text-lg font-bold tracking-tight">Hirewave</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              A small freelance marketplace where clients and freelancers find each other.
            </p>
          </div>
          {cols.map((c) => (
            <div key={c.title}>
              <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                {c.title}
              </div>
              <ul className="mt-4 space-y-2">
                {c.links.map((l) => (
                  <li key={l.to}>
                    <Link to={l.to} className="text-sm text-foreground/80 hover:text-accent">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center">
          <div>© {new Date().getFullYear()} Hirewave · A student project.</div>
          <div className="flex items-center gap-4">
            <span>Privacy</span>
            <span>Terms</span>
            <span>Status · all systems operational</span>
            <Link
              to="/admin"
              className="rounded-md border border-border bg-background px-2.5 py-1 font-mono text-[11px] font-semibold tracking-wider text-muted-foreground transition-colors hover:border-accent hover:text-accent"
              aria-label="Admin"
            >
              2000
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
