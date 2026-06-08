import { createFileRoute, Link } from "@tanstack/react-router";
import { BadgeCheck, MapPin, Star } from "lucide-react";
import { Avatar } from "@/components/Avatar";
import { sel, useStore } from "@/lib/store";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/freelancers/$id")({ component: FreelancerProfile });

function FreelancerProfile() {
  const { id } = Route.useParams();
  const user = useStore(sel.freelancerById(id));
  const reviews = useStore(sel.reviewsForFreelancer(id));

  if (!user) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="font-display text-2xl font-bold">Profile not found</h1>
        <Link to="/freelancers" className="mt-4 inline-block text-accent hover:underline">← Browse talent</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <div className="rounded-3xl border border-border bg-surface p-8 gradient-mesh">
        <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
          <Avatar seed={user.avatarSeed} name={user.name} size={88} />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h1 className="font-display text-3xl font-bold">{user.name}</h1>
              <BadgeCheck className="h-5 w-5 text-accent" />
            </div>
            <div className="mt-1 text-muted-foreground">{user.title}</div>
            <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1"><Star className="h-4 w-4 fill-accent text-accent" /> 5.0 · {reviews.length || 24} reviews</span>
              <span className="inline-flex items-center gap-1"><MapPin className="h-4 w-4" />{user.location}</span>
              <span>Joined {new Date(user.joinedAt).getFullYear()}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="font-display text-3xl font-bold">₦{(user.hourlyRate ?? 0).toLocaleString("en-NG")}<span className="text-base text-muted-foreground">/hr</span></div>
            <button className="mt-3 inline-flex h-10 items-center rounded-xl bg-foreground px-5 text-sm font-semibold text-background">Invite to job</button>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-[1fr_280px]">
        <div>
          <Tabs defaultValue="about">
            <TabsList>
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="work">Work history</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>
            <TabsContent value="about" className="mt-4 space-y-4">
              <div className="rounded-2xl border border-border bg-surface p-6">
                <h3 className="font-display text-lg font-semibold">Bio</h3>
                <p className="mt-2 text-sm leading-relaxed text-foreground/90">{user.bio}</p>
              </div>
              <div className="rounded-2xl border border-border bg-surface p-6">
                <h3 className="font-display text-lg font-semibold">Highlights</h3>
                <ul className="mt-3 space-y-2 text-sm">
                  <li className="flex gap-3"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-accent" />Led design system rewrite for a Series B fintech, 4× faster ship velocity</li>
                  <li className="flex gap-3"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-accent" />Top-rated for 6 quarters running with 98% repeat client rate</li>
                  <li className="flex gap-3"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-accent" />Available 30 hrs/week, async-friendly in CET / ET overlap</li>
                </ul>
              </div>
            </TabsContent>
            <TabsContent value="work" className="mt-4 space-y-3">
              {[
                { t: "Internal admin tool rebuild", c: "Atlas Robotics", d: "Jan – Mar 2025" },
                { t: "Customer portal v2", c: "Northwind Studio", d: "Sep – Nov 2024" },
                { t: "Marketing site relaunch", c: "Voltway", d: "Apr – May 2024" },
              ].map((w) => (
                <div key={w.t} className="rounded-2xl border border-border bg-surface p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-display font-semibold">{w.t}</div>
                      <div className="text-sm text-muted-foreground">{w.c}</div>
                    </div>
                    <div className="text-xs text-muted-foreground">{w.d}</div>
                  </div>
                </div>
              ))}
            </TabsContent>
            <TabsContent value="reviews" className="mt-4 space-y-3">
              {(reviews.length ? reviews : []).map((r) => (
                <div key={r.id} className="rounded-2xl border border-border bg-surface p-5">
                  <div className="flex items-center justify-between">
                    <div className="font-display font-semibold">{r.clientName}</div>
                    <div className="flex items-center gap-1 text-accent">
                      {Array.from({ length: r.rating }).map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-accent" />)}
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">{r.jobTitle} · {r.date}</div>
                  <p className="mt-3 text-sm">{r.comment}</p>
                </div>
              ))}
              {reviews.length === 0 && (
                <div className="rounded-2xl border border-dashed border-border bg-surface p-8 text-center text-sm text-muted-foreground">No public reviews yet.</div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-border bg-surface p-6">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Skills</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {user.skills?.map((s) => (
                <span key={s} className="rounded-full bg-secondary px-3 py-1 text-xs font-medium">{s}</span>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-surface p-6">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Languages</h3>
            <div className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between"><span>English</span><span className="text-muted-foreground">Native</span></div>
              <div className="flex justify-between"><span>Spanish</span><span className="text-muted-foreground">Conversational</span></div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
