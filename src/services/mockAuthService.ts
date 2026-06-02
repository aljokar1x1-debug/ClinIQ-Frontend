export type Role = "patient" | "doctor" | "admin";
export type MockUser = { name: string; email: string; role: Role; avatar?: string };

const KEY = "cliniq-user";

const ACCOUNTS: Record<string, { password: string; user: MockUser; redirect: string }> = {
  "mohamed@gmail.com": {
    password: "123456",
    user: { name: "Mohamed Admin", email: "mohamed@gmail.com", role: "admin" },
    redirect: "/admin/overview",
  },
  "doctor@cliniq.com": {
    password: "123456",
    user: { name: "Dr. Ahmed Hassan", email: "doctor@cliniq.com", role: "doctor" },
    redirect: "/doctor/overview",
  },
  "patient@cliniq.com": {
    password: "123456",
    user: { name: "Sarah Mohamed", email: "patient@cliniq.com", role: "patient" },
    redirect: "/patient/dashboard",
  },
};

export function mockLogin(email: string, _password: string): { user: MockUser; redirect: string } {
  const match = ACCOUNTS[email.toLowerCase()];
  if (match) {
    persist(match.user);
    return { user: match.user, redirect: match.redirect };
  }
  const user: MockUser = {
    name: email.split("@")[0] || "Patient",
    email,
    role: "patient",
  };
  persist(user);
  return { user, redirect: "/patient/dashboard" };
}

export function mockRegister(name: string, email: string): { user: MockUser; redirect: string } {
  const user: MockUser = { name: name || email.split("@")[0], email, role: "patient" };
  persist(user);
  return { user, redirect: "/patient/dashboard" };
}

export function mockLogout(): void {
  if (typeof window !== "undefined") localStorage.removeItem(KEY);
}

export function getStoredUser(): MockUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as MockUser) : null;
  } catch {
    return null;
  }
}

export function dashboardForRole(role: Role): string {
  if (role === "admin") return "/admin/overview";
  if (role === "doctor") return "/doctor/overview";
  return "/patient/dashboard";
}

function persist(user: MockUser) {
  if (typeof window !== "undefined") localStorage.setItem(KEY, JSON.stringify(user));
}
