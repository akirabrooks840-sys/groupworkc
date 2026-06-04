export type Role = "client" | "freelancer";

export interface User {
  id: string;
  name: string;
  email: string;
  password: string; // mock only; never do this in production
  role: Role;
  title?: string;
  bio?: string;
  hourlyRate?: number;
  skills?: string[];
  avatarSeed: string;
  location?: string;
  joinedAt: string;
  /** Freelancer verification status. Existing seeded users are "approved". */
  verificationStatus?: "pending" | "approved" | "rejected";
  /** Free-text pitch submitted during registration, reviewed by admin. */
  pitch?: string;
  /** Type of work the freelancer wants to do (admin-reviewed). */
  desiredJob?: string;
}

export interface Job {
  id: string;
  clientId: string;
  clientName: string;
  title: string;
  description: string;
  category: string;
  skills: string[];
  budgetMin: number;
  budgetMax: number;
  paymentType: "fixed" | "hourly";
  experience: "entry" | "intermediate" | "expert";
  duration: "less-1m" | "1-3m" | "3-6m" | "6m+";
  verified: boolean;
  postedAt: string;
  proposalsCount: number;
}

export interface Proposal {
  id: string;
  jobId: string;
  jobTitle: string;
  clientId: string;
  freelancerId: string;
  freelancerName: string;
  coverLetter: string;
  bidAmount: number;
  paymentType: "fixed" | "hourly";
  milestones: { title: string; amount: number; dueDays: number }[];
  status: "active" | "accepted" | "archived";
  submittedAt: string;
}

export interface Review {
  id: string;
  freelancerId: string;
  clientName: string;
  jobTitle: string;
  rating: number;
  comment: string;
  date: string;
}
