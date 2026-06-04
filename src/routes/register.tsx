import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Briefcase, User2 } from "lucide-react";
import { z } from "zod";
import { actions } from "@/lib/store";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const schema = z.object({
  name: z.string().min(2, "Tell us your name"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "At least 6 characters"),
});

export const Route = createFileRoute("/register")({ component: Register });

function Register() {
  const navigate = useNavigate();
  const [role, setRole] = useState<"client" | "freelancer">("client");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [desiredJob, setDesiredJob] = useState("");
  const [pitch, setPitch] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse({ name, email, password });
    if (!parsed.success) {
      const fe: Record<string, string> = {};
      parsed.error.issues.forEach((i) => (fe[i.path[0] as string] = i.message));
      setErrors(fe);
      return;
    }
    if (role === "freelancer" && desiredJob.trim().length < 3) {
      setErrors({ desiredJob: "Tell us the kind of work you do" });
      return;
    }
    setErrors({});
    setLoading(true);

    try {
      await actions.register({ name, email, password, role, desiredJob, pitch });
      if (role === "freelancer") {
        toast.success("Account created — pending admin verification.");
      } else {
        toast.success("Account created successfully!");
      }
      navigate({ to: "/dashboard" });
    } catch (err: any) {
      toast.error(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 border p-8 rounded-xl shadow-sm bg-card">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-foreground">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Or{" "}
            <Link to="/login" className="font-medium text-primary hover:underline">
              sign in to your existing account
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={submit}>
          {/* Role Selection */}
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setRole("client")}
              className={cn(
                "flex flex-col items-center justify-center rounded-lg border-2 p-4 text-center transition-all",
                role === "client"
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-muted bg-transparent text-muted-foreground hover:border-muted-foreground"
              )}
            >
              <User2 className="h-6 w-6 mb-2" />
              <span className="text-sm font-semibold">I'm a Client</span>
            </button>
            <button
              type="button"
              onClick={() => setRole("freelancer")}
              className={cn(
                "flex flex-col items-center justify-center rounded-lg border-2 p-4 text-center transition-all",
                role === "freelancer"
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-muted bg-transparent text-muted-foreground hover:border-muted-foreground"
              )}
            >
              <Briefcase className="h-6 w-6 mb-2" />
              <span className="text-sm font-semibold">I'm a Freelancer</span>
            </button>
          </div>

          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <label htmlFor="name" className="text-sm font-medium block mb-1">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={cn(
                  "relative block w-full rounded-md border-0 py-1.5 px-3 text-foreground ring-1 ring-inset placeholder:text-muted-foreground focus:z-10 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 bg-background",
                  errors.name ? "ring-destructive" : "ring-input"
                )}
                placeholder="John Doe"
              />
              {errors.name && (
                <p className="mt-1 text-xs text-destructive">{errors.name}</p>
              )}
            </div>

            <div>
              <label htmlFor="email-address" className="text-sm font-medium block mb-1">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={cn(
                  "relative block w-full rounded-md border-0 py-1.5 px-3 text-foreground ring-1 ring-inset placeholder:text-muted-foreground focus:z-10 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 bg-background",
                  errors.email ? "ring-destructive" : "ring-input"
                )}
                placeholder="you@example.com"
              />
              {errors.email && (
                <p className="mt-1 text-xs text-destructive">{errors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="text-sm font-medium block mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={cn(
                  "relative block w-full rounded-md border-0 py-1.5 px-3 text-foreground ring-1 ring-inset placeholder:text-muted-foreground focus:z-10 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 bg-background",
                  errors.password ? "ring-destructive" : "ring-input"
                )}
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="mt-1 text-xs text-destructive">{errors.password}</p>
              )}
            </div>

            {role === "freelancer" && (
              <>
                <div>
                  <label htmlFor="desiredJob" className="text-sm font-medium block mb-1">
                    What kind of work do you do?
                  </label>
                  <input
                    id="desiredJob"
                    type="text"
                    value={desiredJob}
                    onChange={(e) => setDesiredJob(e.target.value)}
                    maxLength={120}
                    className={cn(
                      "relative block w-full rounded-md border-0 py-1.5 px-3 text-foreground ring-1 ring-inset placeholder:text-muted-foreground focus:z-10 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 bg-background",
                      errors.desiredJob ? "ring-destructive" : "ring-input",
                    )}
                    placeholder="e.g. Senior React engineer, Brand designer…"
                  />
                  {errors.desiredJob && (
                    <p className="mt-1 text-xs text-destructive">{errors.desiredJob}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="pitch" className="text-sm font-medium block mb-1">
                    Short pitch <span className="text-muted-foreground">(optional)</span>
                  </label>
                  <textarea
                    id="pitch"
                    value={pitch}
                    onChange={(e) => setPitch(e.target.value)}
                    rows={3}
                    maxLength={600}
                    className="block w-full rounded-md border-0 py-1.5 px-3 text-foreground ring-1 ring-inset ring-input placeholder:text-muted-foreground focus:z-10 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 bg-background"
                    placeholder="A few lines about your experience, stack, and recent work."
                  />
                  <p className="mt-1 text-xs text-muted-foreground">
                    Freelancer accounts are reviewed and approved by our admin team.
                  </p>
                </div>
              </>
            )}
          </div>


          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative flex w-full justify-center rounded-md bg-primary py-2 px-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50 transition-colors"
            >
              {loading ? "Creating account..." : "Sign up"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
