import { ReactNode } from "react";
import { LayoutDashboard, Calendar, Users, Clock, User } from "lucide-react";
import { DashboardLayout, type NavItem } from "@/layouts/DashboardLayout";
import { useAuth } from "@/context/AuthContext";

export const DOCTOR_NAV: NavItem[] = [
  { to: "/doctor/dashboard", label: "Dashboard", icon: <LayoutDashboard className="h-5 w-5" /> },
  { to: "/doctor/appointments", label: "Appointments", icon: <Calendar className="h-5 w-5" /> },
  { to: "/doctor/patients", label: "Patients", icon: <Users className="h-5 w-5" /> },
  { to: "/doctor/schedule", label: "Schedule", icon: <Clock className="h-5 w-5" /> },
  { to: "/doctor/profile", label: "Profile", icon: <User className="h-5 w-5" /> },
];

export function DoctorShell({ title, children }: { title: string; children: ReactNode }) {
  const { user } = useAuth();
  return (
    <DashboardLayout
      items={DOCTOR_NAV}
      title={title}
      user={{ name: user?.fullName ?? "Doctor", role: "doctor" }}
    >
      {children}
    </DashboardLayout>
  );
}
