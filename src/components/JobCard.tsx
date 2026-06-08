import { Link } from "@tanstack/react-router";
import { BadgeCheck, Clock, MapPin } from "lucide-react";
import type { Job } from "@/lib/types";
import { formatDistanceToNowStrict } from "date-fns";
import { ngn } from "@/lib/utils";

function money(n: number) {
  return ngn(n);
}

export function JobCard({ job }: { job: Job }) {
  return (
    <Link
      to="/jobs/$id"
      params={{ id: job.id }}
      className="hover-lift block rounded-2xl border border-border bg-surface p-6 transition"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="font-medium text-foreground">{job.clientName}</span>
            {job.verified && (
              <span className="inline-flex items-center gap-1 text-accent">
                <BadgeCheck className="h-3.5 w-3.5" /> Verified
              </span>
            )}
            <span>·</span>
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatDistanceToNowStrict(new Date(job.postedAt))} ago
            </span>
          </div>
          <h3 className="mt-2 font-display text-lg font-semibold text-foreground leading-snug">
            {job.title}
          </h3>
        </div>
        <div className="text-right">
          <div className="text-base font-semibold">
            {job.paymentType === "fixed"
              ? `${money(job.budgetMin)} – ${money(job.budgetMax)}`
              : `${ngn(job.budgetMin)}–${ngn(job.budgetMax)}/hr`}
          </div>
          <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
            {job.paymentType === "fixed" ? "Fixed price" : "Hourly"}
          </div>
        </div>
      </div>

      <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">{job.description}</p>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {job.skills.slice(0, 5).map((s) => (
          <span key={s} className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
            {s}
          </span>
        ))}
      </div>

      <div className="mt-5 flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-4">
          <span className="capitalize">{job.experience} level</span>
          <span>·</span>
          <span>{labelForDuration(job.duration)}</span>
          <span>·</span>
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-3 w-3" /> Remote
          </span>
        </div>
        <div className="font-medium">{job.proposalsCount} proposals</div>
      </div>
    </Link>
  );
}

export function labelForDuration(d: Job["duration"]) {
  switch (d) {
    case "less-1m":
      return "< 1 month";
    case "1-3m":
      return "1–3 months";
    case "3-6m":
      return "3–6 months";
    case "6m+":
      return "6+ months";
  }
}
