import { ReactNode } from "react";
import { LayoutDashboard, Stethoscope, Users, Calendar, BarChart3, DollarSign, Settings, Bell, Layout } from "lucide-react";
import { DashboardLayout, type NavItem } from "@/layouts/DashboardLayout";
import { useAuth } from "@/context/AuthContext";

export const ADMIN_NAV: NavItem[] = [
  { to: "/admin/overview", label: "Overview", icon: <LayoutDashboard className="h-5 w-5" /> },
  { to: "/admin/doctors", label: "Doctors", icon: <Stethoscope className="h-5 w-5" /> },
  { to: "/admin/patients", label: "Patients", icon: <Users className="h-5 w-5" /> },
  { to: "/admin/appointments", label: "Appointments", icon: <Calendar className="h-5 w-5" /> },
  { to: "/admin/content", label: "Content", icon: <Layout className="h-5 w-5" /> },
  { to: "/admin/revenue", label: "Revenue", icon: <DollarSign className="h-5 w-5" /> },
  { to: "/admin/analytics", label: "Analytics", icon: <BarChart3 className="h-5 w-5" /> },
  { to: "/admin/settings", label: "Settings", icon: <Settings className="h-5 w-5" /> },
  { to: "/notifications", label: "Notifications", icon: <Bell className="h-5 w-5" /> },
];

export function AdminShell({ title, children }: { title: string; children: ReactNode }) {
  const { user } = useAuth();
  return (
    <DashboardLayout
      items={ADMIN_NAV}
      title={title}
      user={{ name: user?.fullName ?? "Admin", role: "admin" }}
    >
      {children}
    </DashboardLayout>
  );
}
