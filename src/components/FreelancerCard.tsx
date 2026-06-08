import { Link } from "@tanstack/react-router";
import { MapPin, Star } from "lucide-react";
import type { User } from "@/lib/types";
import { Avatar } from "@/components/Avatar";
import { ngn } from "@/lib/utils";

export function FreelancerCard({ user }: { user: User }) {
  return (
    <Link
      to="/freelancers/$id"
      params={{ id: user.id }}
      className="hover-lift block rounded-2xl border border-border bg-surface p-6"
    >
      <div className="flex items-start gap-4">
        <Avatar seed={user.avatarSeed} name={user.name} size={56} />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="truncate font-display text-base font-semibold">{user.name}</div>
              <div className="truncate text-sm text-muted-foreground">{user.title}</div>
            </div>
            <div className="text-right">
              <div className="text-base font-semibold">{ngn(user.hourlyRate ?? 0)}/hr</div>
              <div className="flex items-center justify-end gap-1 text-xs text-muted-foreground">
                <Star className="h-3 w-3 fill-accent text-accent" /> 5.0
              </div>
            </div>
          </div>
          <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">{user.bio}</p>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {user.skills?.slice(0, 4).map((s) => (
              <span key={s} className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium">
                {s}
              </span>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3" /> {user.location}
          </div>
        </div>
      </div>
    </Link>
  );
}
