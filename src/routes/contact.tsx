import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Mail, MapPin, MessagesSquare } from "lucide-react";

export const Route = createFileRoute("/contact")({
  component: Contact,
  head: () => ({ meta: [{ title: "Contact Hirewave" }, { name: "description", content: "Get in touch with the Hirewave team — partnerships, press, and customer support." }] }),
});

const schema = z.object({
  name: z.string().min(2, "Tell us your name"),
  email: z.string().email("Enter a valid email"),
  topic: z.string().min(2),
  message: z.string().min(20, "Add a little more detail (20+ characters)"),
});

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", topic: "Sales", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      const fe: Record<string, string> = {};
      parsed.error.issues.forEach((i) => (fe[i.path[0] as string] = i.message));
      setErrors(fe); return;
    }
    setErrors({}); setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    setLoading(false);
    toast.success("Message sent — we'll reply within one business day.");
    setForm({ name: "", email: "", topic: "Sales", message: "" });
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="grid gap-10 lg:grid-cols-[1fr_400px]">
        <div>
          <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Contact</div>
          <h1 className="mt-2 font-display text-3xl font-bold sm:text-4xl">Get in touch</h1>
          <p className="mt-3 max-w-md text-muted-foreground">
            Questions, feedback, or just want to say hi? Send a message and we'll get back to you.
          </p>
          <form onSubmit={submit} className="mt-8 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Name" error={errors.name}>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input" />
              </Field>
              <Field label="Email" error={errors.email}>
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input" />
              </Field>
            </div>
            <Field label="Topic">
              <select value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })} className="input">
                <option>Sales</option><option>Support</option><option>Press</option><option>Partnerships</option><option>Other</option>
              </select>
            </Field>
            <Field label="Message" error={errors.message}>
              <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="textarea" placeholder="Tell us what's going on…" />
            </Field>
            <button disabled={loading} className="inline-flex h-11 items-center justify-center rounded-xl bg-foreground px-5 text-sm font-semibold text-background disabled:opacity-60">
              {loading ? "Sending…" : "Send message"}
            </button>
          </form>
        </div>

        <aside className="space-y-3">
          {[
            { icon: Mail, t: "Email", d: "hello@hirewave.app" },
            { icon: MessagesSquare, t: "Response time", d: "Usually within a day or two" },
            { icon: MapPin, t: "Where we are", d: "Built remotely — a school project" },
          ].map((c) => (
            <div key={c.t} className="flex items-start gap-3 rounded-2xl border border-border bg-surface p-5">
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-accent/15 text-accent"><c.icon className="h-5 w-5" /></div>
              <div>
                <div className="font-display font-semibold">{c.t}</div>
                <div className="text-sm text-muted-foreground">{c.d}</div>
              </div>
            </div>
          ))}
        </aside>
      </div>

      <style>{`
        .input { width: 100%; height: 44px; border-radius: 12px; border: 1px solid var(--color-border); background: var(--color-surface); padding: 0 14px; font-size: 14px; }
        .input:focus { outline: none; border-color: var(--color-accent); box-shadow: 0 0 0 4px color-mix(in oklab, var(--color-accent) 22%, transparent); }
        .textarea { width: 100%; min-height: 140px; border-radius: 12px; border: 1px solid var(--color-border); background: var(--color-surface); padding: 12px 14px; font-size: 14px; }
        .textarea:focus { outline: none; border-color: var(--color-accent); box-shadow: 0 0 0 4px color-mix(in oklab, var(--color-accent) 22%, transparent); }
      `}</style>
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</span>
      {children}
      {error && <span className="mt-1.5 block text-xs text-destructive">{error}</span>}
    </label>
  );
}
