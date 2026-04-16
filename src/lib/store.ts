"use client";

export interface JobSeekerEntry {
  id: string;
  name: string;
  mobile: string;
  location: string;
  category: string;
  timestamp: string;
}

export interface EmployerEntry {
  id: string;
  companyName: string;
  requirement: string;
  contactNumber: string;
  timestamp: string;
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

export function saveJobSeeker(data: Omit<JobSeekerEntry, "id" | "timestamp">): JobSeekerEntry {
  const entry: JobSeekerEntry = {
    ...data,
    id: generateId(),
    timestamp: new Date().toISOString(),
  };
  const existing = getJobSeekers();
  existing.push(entry);
  if (typeof window !== "undefined") {
    localStorage.setItem("youvarozgar_jobseekers", JSON.stringify(existing));
  }
  return entry;
}

export function getJobSeekers(): JobSeekerEntry[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem("youvarozgar_jobseekers");
  return raw ? JSON.parse(raw) : [];
}

export function saveEmployer(data: Omit<EmployerEntry, "id" | "timestamp">): EmployerEntry {
  const entry: EmployerEntry = {
    ...data,
    id: generateId(),
    timestamp: new Date().toISOString(),
  };
  const existing = getEmployers();
  existing.push(entry);
  if (typeof window !== "undefined") {
    localStorage.setItem("youvarozgar_employers", JSON.stringify(existing));
  }
  return entry;
}

export function getEmployers(): EmployerEntry[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem("youvarozgar_employers");
  return raw ? JSON.parse(raw) : [];
}

export function clearAllData(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("youvarozgar_jobseekers");
    localStorage.removeItem("youvarozgar_employers");
  }
}
