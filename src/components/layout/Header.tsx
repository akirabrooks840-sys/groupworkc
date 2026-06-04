import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Bell, ChevronDown, LogOut, Menu, Search, Sparkles, X } from "lucide-react";
import { useState } from "react";
import { actions, sel, useStore } from "@/lib/store";
import { Avatar } from "@/components/Avatar";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

const nav = [
  { to: "/jobs", label: "Find Work" },
  { to: "/freelancers", label: "Find Talent" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header() {
  const user = useStore(sel.currentUser);
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const switchRole = () => {
    if (!user) return;
    const next = user.role === "client" ? "freelancer" : "client";
    actions.switchRole(next);
    toast.success(`Switched to ${next === "client" ? "Client" : "Freelancer"} mode`);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground">
            <Sparkles className="h-4 w-4 text-accent" />
          </div>
          <span className="font-display text-lg font-bold tracking-tight">Hirewave</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {nav.map((n) => {
            const active = pathname === n.to || pathname.startsWith(n.to + "/");
            return (
              <Link
                key={n.to}
                to={n.to}
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  active ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {n.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <Link
            to="/jobs"
            className="hidden h-9 items-center gap-2 rounded-full border border-border bg-surface px-3 text-sm text-muted-foreground transition-colors hover:text-foreground md:flex"
          >
            <Search className="h-4 w-4" />
            <span>Search jobs, skills, talent…</span>
          </Link>

          {user ? (
            <>
              <button
                onClick={switchRole}
                className="hidden h-9 items-center gap-2 rounded-full border border-border bg-surface px-3 text-xs font-medium uppercase tracking-wider text-muted-foreground hover:text-foreground sm:inline-flex"
                title="Switch role"
              >
                <span className={cn("h-1.5 w-1.5 rounded-full", user.role === "client" ? "bg-[var(--chart-2)]" : "bg-accent")} />
                {user.role}
                <ChevronDown className="h-3 w-3" />
              </button>
              <button className="relative grid h-9 w-9 place-items-center rounded-full border border-border bg-surface text-muted-foreground hover:text-foreground">
                <Bell className="h-4 w-4" />
                <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-accent" />
              </button>
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-2 rounded-full p-0.5 outline-none ring-ring focus-visible:ring-2">
                  <Avatar seed={user.avatarSeed} name={user.name} size={32} />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="font-normal">
                    <div className="text-sm font-medium">{user.name}</div>
                    <div className="text-xs text-muted-foreground">{user.email}</div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate({ to: "/dashboard" })}>Dashboard</DropdownMenuItem>
                  {user.role === "freelancer" && (
                    <DropdownMenuItem onClick={() => navigate({ to: "/freelancers/$id", params: { id: user.id } })}>
                      My profile
                    </DropdownMenuItem>
                  )}
                  {user.role === "client" && (
                    <DropdownMenuItem onClick={() => navigate({ to: "/post-job" })}>Post a job</DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={switchRole}>
                    Switch to {user.role === "client" ? "Freelancer" : "Client"}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => {
                      actions.logout();
                      toast.message("Signed out");
                      navigate({ to: "/" });
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" /> Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="hidden h-9 items-center rounded-md px-3 text-sm font-medium text-muted-foreground hover:text-foreground sm:inline-flex"
              >
                Sign in
              </Link>
              <Link
                to="/register"
                className="inline-flex h-9 items-center rounded-md bg-foreground px-4 text-sm font-medium text-background transition-transform hover:-translate-y-0.5"
              >
                Sign up
              </Link>
            </>
          )}

          <button
            onClick={() => setOpen((o) => !o)}
            className="grid h-9 w-9 place-items-center rounded-md border border-border md:hidden"
            aria-label="Menu"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border bg-background md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col px-4 py-3">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-3 text-sm font-medium text-foreground hover:bg-secondary"
              >
                {n.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
