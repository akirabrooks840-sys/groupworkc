import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ShieldCheck, Check, X, RotateCcw, Lock, Mail, MapPin, Briefcase } from "lucide-react";
import { toast } from "sonner";
import { actions, useStore } from "@/lib/store";
import { Avatar } from "@/components/Avatar";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin · Hirewave" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: Admin,
});

const ADMIN_PASSWORD = "2000";

function Admin() {
  const [unlocked, setUnlocked] = useState(false);
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pw === ADMIN_PASSWORD) {
      setUnlocked(true);
      setErr("");
    } else {
      setErr("Incorrect admin password.");
    }
  };

  if (!unlocked) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-md items-center px-4">
        <div className="w-full rounded-2xl border border-border bg-surface p-8 shadow-sm">
          <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-xl bg-primary text-primary-foreground">
            <Lock className="h-5 w-5 text-accent" />
          </div>
          <h1 className="text-center font-display text-2xl font-bold">Admin access</h1>
          <p className="mt-1 text-center text-sm text-muted-foreground">
            Enter the admin password to manage freelancer verification.
          </p>
          <form onSubmit={submit} className="mt-6 space-y-4">
            <input
              type="password"
              autoFocus
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              placeholder="Admin password"
              className={cn(
                "block w-full rounded-md border-0 bg-background py-2 px-3 text-foreground ring-1 ring-inset ring-input placeholder:text-muted-foreground focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm",
                err && "ring-destructive",
              )}
            />
            {err && <p className="text-xs text-destructive">{err}</p>}
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-primary py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Unlock
            </button>
          </form>
        </div>
      </div>
    );
  }

  return <AdminConsole />;
}

function AdminConsole() {
  const users = useStore((s) => s.users);
  const [filter, setFilter] = useState<"pending" | "approved" | "rejected" | "all">("pending");

  const freelancers = users.filter((u) => u.role === "freelancer");
  const counts = {
    pending: freelancers.filter((u) => u.verificationStatus === "pending").length,
    approved: freelancers.filter((u) => u.verificationStatus === "approved").length,
    rejected: freelancers.filter((u) => u.verificationStatus === "rejected").length,
    all: freelancers.length,
  };
  const list =
    filter === "all" ? freelancers : freelancers.filter((u) => u.verificationStatus === filter);

  const act = (id: string, status: "approved" | "rejected" | "pending", name: string) => {
    actions.setVerification(id, status);
    toast.success(
      status === "approved"
        ? `Approved ${name}`
        : status === "rejected"
          ? `Rejected ${name}`
          : `Moved ${name} back to pending`,
    );
  };

  const tabs: { key: typeof filter; label: string }[] = [
    { key: "pending", label: `Pending (${counts.pending})` },
    { key: "approved", label: `Approved (${counts.approved})` },
    { key: "rejected", label: `Rejected (${counts.rejected})` },
    { key: "all", label: `All (${counts.all})` },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <ShieldCheck className="h-3.5 w-3.5 text-accent" /> Admin console
          </div>
          <h1 className="font-display text-3xl font-bold">Freelancer verification</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Review submitted profiles and approve freelancers to list on Hirewave.
          </p>
        </div>
        <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
          ← Back to site
        </Link>
      </div>

      <div className="mt-6 flex flex-wrap gap-1 rounded-xl border border-border bg-surface p-1">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setFilter(t.key)}
            className={cn(
              "rounded-lg px-4 py-2 text-sm font-medium transition",
              filter === t.key
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-3">
        {list.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-surface p-12 text-center">
            <div className="font-display font-semibold">Nothing to review here</div>
            <p className="mt-1 text-sm text-muted-foreground">
              {filter === "pending"
                ? "All freelancer applications have been processed."
                : "No freelancers in this bucket yet."}
            </p>
          </div>
        ) : (
          list.map((u) => (
            <div
              key={u.id}
              className="flex flex-col gap-4 rounded-2xl border border-border bg-surface p-5 sm:flex-row sm:items-start"
            >
              <Avatar seed={u.avatarSeed} name={u.name} size={56} />
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="font-display text-base font-semibold">{u.name}</div>
                  <StatusBadge status={u.verificationStatus ?? "pending"} />
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <Mail className="h-3 w-3" /> {u.email}
                  </span>
                  {u.location && (
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {u.location}
                    </span>
                  )}
                  <span>Joined {new Date(u.joinedAt).toLocaleDateString()}</span>
                </div>
                <div className="mt-3 inline-flex items-center gap-2 rounded-md bg-secondary px-2.5 py-1 text-xs font-medium">
                  <Briefcase className="h-3 w-3" />
                  {u.desiredJob || u.title || "—"}
                </div>
                {u.pitch && (
                  <p className="mt-3 line-clamp-3 text-sm text-foreground/80">{u.pitch}</p>
                )}
              </div>
              <div className="flex flex-wrap gap-2 sm:flex-col sm:items-end">
                {u.verificationStatus !== "approved" && (
                  <button
                    onClick={() => act(u.id, "approved", u.name)}
                    className="inline-flex h-9 items-center gap-1.5 rounded-md bg-accent px-3 text-xs font-semibold text-accent-foreground transition hover:-translate-y-0.5"
                  >
                    <Check className="h-3.5 w-3.5" /> Approve
                  </button>
                )}
                {u.verificationStatus !== "rejected" && (
                  <button
                    onClick={() => act(u.id, "rejected", u.name)}
                    className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border bg-background px-3 text-xs font-semibold text-foreground transition hover:border-destructive hover:text-destructive"
                  >
                    <X className="h-3.5 w-3.5" /> Reject
                  </button>
                )}
                {u.verificationStatus !== "pending" && (
                  <button
                    onClick={() => act(u.id, "pending", u.name)}
                    className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border bg-background px-3 text-xs font-medium text-muted-foreground hover:text-foreground"
                  >
                    <RotateCcw className="h-3.5 w-3.5" /> Reset
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: "pending" | "approved" | "rejected" }) {
  const cls =
    status === "approved"
      ? "bg-accent/15 text-accent"
      : status === "rejected"
        ? "bg-destructive/15 text-destructive"
        : "bg-secondary text-foreground";
  return (
    <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-semibold capitalize", cls)}>
      {status}
    </span>
  );
}
