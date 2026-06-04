import { useRef, useSyncExternalStore } from "react";
import type { Job, Proposal, Review, User } from "./types";
import { seedJobs, seedReviews, seedUsers } from "./seed";

const KEY = "hirewave.state.v1";

interface State {
  users: User[];
  jobs: Job[];
  proposals: Proposal[];
  reviews: Review[];
  currentUserId: string | null;
}

const initial: State = {
  users: seedUsers,
  jobs: seedJobs,
  proposals: [],
  reviews: seedReviews,
  currentUserId: null,
};

function normalize(s: State): State {
  return {
    ...s,
    users: s.users.map((u) =>
      u.role === "freelancer" && !u.verificationStatus
        ? { ...u, verificationStatus: "approved" as const }
        : u,
    ),
  };
}

function load(): State {
  if (typeof window === "undefined") return normalize(initial);
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return normalize(initial);
    const parsed = JSON.parse(raw) as Partial<State>;
    return normalize({ ...initial, ...parsed });
  } catch {
    return normalize(initial);
  }
}

let state: State = initial;
let hydrated = false;
const listeners = new Set<() => void>();

function persist() {
  if (typeof window === "undefined") return;
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch {}
}

function emit() { listeners.forEach((l) => l()); }

function ensureHydrated() {
  if (hydrated || typeof window === "undefined") return;
  state = load();
  hydrated = true;
}

export function subscribe(l: () => void) {
  listeners.add(l);
  // Defer hydration until after first render to avoid SSR/CSR mismatch.
  if (!hydrated && typeof window !== "undefined") {
    hydrated = true;
    const loaded = load();
    if (JSON.stringify(loaded) !== JSON.stringify(state)) {
      state = loaded;
      queueMicrotask(emit);
    }
  }
  return () => listeners.delete(l);
}
export function getState(): State {
  return state;
}
function setState(updater: (s: State) => State) {
  state = updater(state);
  persist();
  emit();
}

function shallowEq(a: unknown, b: unknown): boolean {
  if (Object.is(a, b)) return true;
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) if (!Object.is(a[i], b[i])) return false;
    return true;
  }
  if (a && b && typeof a === "object" && typeof b === "object") {
    const ak = Object.keys(a as object);
    const bk = Object.keys(b as object);
    if (ak.length !== bk.length) return false;
    for (const k of ak) if (!Object.is((a as any)[k], (b as any)[k])) return false;
    return true;
  }
  return false;
}

export function useStore<T>(selector: (s: State) => T): T {
  const ref = useRef<{ v: T; set: boolean }>({ v: undefined as unknown as T, set: false });
  const getSnap = () => {
    const next = selector(getState());
    if (!ref.current.set || !shallowEq(ref.current.v, next)) {
      ref.current = { v: next, set: true };
    }
    return ref.current.v;
  };
  const getServerSnap = () => selector(initial);
  return useSyncExternalStore(subscribe, getSnap, getServerSnap);
}

// ---------- actions ----------
const id = (p: string) => `${p}_${Math.random().toString(36).slice(2, 9)}`;

export const actions = {
  register(input: {
    name: string;
    email: string;
    password: string;
    role: "client" | "freelancer";
    desiredJob?: string;
    pitch?: string;
  }) {
    const s = getState();
    if (s.users.some((u) => u.email.toLowerCase() === input.email.toLowerCase())) {
      throw new Error("An account with this email already exists.");
    }
    const isFreelancer = input.role === "freelancer";
    const user: User = {
      id: id("u"),
      name: input.name,
      email: input.email,
      password: input.password,
      role: input.role,
      avatarSeed: input.name.replace(/\s/g, "") + Math.floor(Math.random() * 999),
      joinedAt: new Date().toISOString(),
      ...(isFreelancer
        ? {
            title: input.desiredJob?.trim() || "New freelancer",
            desiredJob: input.desiredJob?.trim(),
            pitch: input.pitch?.trim(),
            skills: [],
            hourlyRate: 50,
            verificationStatus: "pending" as const,
          }
        : {}),
    };
    setState((s) => ({ ...s, users: [...s.users, user], currentUserId: user.id }));
    return user;
  },
  login(input: { email: string; password: string }) {
    const s = getState();
    const u = s.users.find(
      (u) => u.email.toLowerCase() === input.email.toLowerCase() && u.password === input.password,
    );
    if (!u) throw new Error("Invalid email or password.");
    setState((s) => ({ ...s, currentUserId: u.id }));
    return u;
  },
  logout() { setState((s) => ({ ...s, currentUserId: null })); },
  switchRole(role: "client" | "freelancer") {
    setState((s) => {
      if (!s.currentUserId) return s;
      return { ...s, users: s.users.map((u) => (u.id === s.currentUserId ? { ...u, role } : u)) };
    });
  },
  postJob(input: Omit<Job, "id" | "postedAt" | "proposalsCount" | "clientName" | "clientId">) {
    const s = getState();
    const me = s.users.find((u) => u.id === s.currentUserId);
    if (!me) throw new Error("Not signed in.");
    const job: Job = {
      ...input,
      id: id("j"),
      clientId: me.id,
      clientName: me.name,
      postedAt: new Date().toISOString(),
      proposalsCount: 0,
    };
    setState((s) => ({ ...s, jobs: [job, ...s.jobs] }));
    return job;
  },
  submitProposal(input: Omit<Proposal, "id" | "submittedAt" | "status" | "freelancerId" | "freelancerName" | "clientId" | "jobTitle">) {
    const s = getState();
    const me = s.users.find((u) => u.id === s.currentUserId);
    if (!me) throw new Error("Sign in to submit a proposal.");
    const job = s.jobs.find((j) => j.id === input.jobId);
    if (!job) throw new Error("Job not found.");
    const proposal: Proposal = {
      ...input,
      id: id("p"),
      jobTitle: job.title,
      clientId: job.clientId,
      freelancerId: me.id,
      freelancerName: me.name,
      submittedAt: new Date().toISOString(),
      status: "active",
    };
    setState((s) => ({
      ...s,
      proposals: [proposal, ...s.proposals],
      jobs: s.jobs.map((j) => (j.id === job.id ? { ...j, proposalsCount: j.proposalsCount + 1 } : j)),
    }));
    return proposal;
  },
  setProposalStatus(proposalId: string, status: Proposal["status"]) {
    setState((s) => ({ ...s, proposals: s.proposals.map((p) => (p.id === proposalId ? { ...p, status } : p)) }));
  },
  setVerification(userId: string, status: "pending" | "approved" | "rejected") {
    setState((s) => ({
      ...s,
      users: s.users.map((u) => (u.id === userId ? { ...u, verificationStatus: status } : u)),
    }));
  },
};

// helper selectors
export const sel = {
  currentUser: (s: State) => s.users.find((u) => u.id === s.currentUserId) ?? null,
  jobById: (id: string) => (s: State) => s.jobs.find((j) => j.id === id) ?? null,
  freelancerById: (id: string) => (s: State) => s.users.find((u) => u.id === id && u.role === "freelancer") ?? null,
  reviewsForFreelancer: (id: string) => (s: State) => s.reviews.filter((r) => r.freelancerId === id),
  freelancers: (s: State) => s.users.filter((u) => u.role === "freelancer"),
  jobsByClient: (clientId: string) => (s: State) => s.jobs.filter((j) => j.clientId === clientId),
  proposalsForJob: (jobId: string) => (s: State) => s.proposals.filter((p) => p.jobId === jobId),
  proposalsByFreelancer: (id: string) => (s: State) => s.proposals.filter((p) => p.freelancerId === id),
  proposalsForClient: (id: string) => (s: State) => s.proposals.filter((p) => p.clientId === id),
};
