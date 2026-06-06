import { ReactNode } from "react";
import { LayoutDashboard, Calendar, FileText, User } from "lucide-react";
import { DashboardLayout, type NavItem } from "@/layouts/DashboardLayout";
import { useAuth } from "@/context/AuthContext";

export const PATIENT_NAV: NavItem[] = [
  { to: "/patient/dashboard", label: "Dashboard", icon: <LayoutDashboard className="h-5 w-5" /> },
  { to: "/patient/appointments", label: "Appointments", icon: <Calendar className="h-5 w-5" /> },
  { to: "/patient/medical-records", label: "Records", icon: <FileText className="h-5 w-5" /> },
  { to: "/patient/profile", label: "Profile", icon: <User className="h-5 w-5" /> },
];

export function PatientShell({ title, children }: { title: string; children: ReactNode }) {
  const { user } = useAuth();
  return (
    <DashboardLayout
      items={PATIENT_NAV}
      title={title}
      user={{ name: user?.fullName ?? "Patient", role: "patient" }}
    >
      {children}
    </DashboardLayout>
  );
}
