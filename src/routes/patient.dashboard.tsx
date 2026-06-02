import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Calendar, Clock, CheckCircle2, XCircle, ChevronRight, Plus, Loader2 } from "lucide-react";
import { PatientShell } from "@/layouts/PatientShell";
import { appointmentsApi, AppointmentResponse } from "@/api/appointments";
import { useAuth } from "@/context/AuthContext";

export const Route = createFileRoute("/patient/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — ClinIQ" }] }),
  component: PatientDashboard,
});

const HEART_DATA = [
  { day: "Mon", bpm: 72 },
  { day: "Tue", bpm: 75 },
  { day: "Wed", bpm: 70 },
  { day: "Thu", bpm: 78 },
  { day: "Fri", bpm: 73 },
  { day: "Sat", bpm: 71 },
  { day: "Sun", bpm: 74 },
];

function StatSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-card p-5 animate-pulse">
      <div className="h-10 w-10 rounded-lg bg-muted" />
      <div className="mt-3 h-7 w-16 rounded bg-muted" />
      <div className="mt-1 h-3 w-28 rounded bg-muted" />
    </div>
  );
}

function AppointmentSkeleton() {
  return (
    <div className="flex gap-3 rounded-lg border border-border p-3 animate-pulse">
      <div className="h-12 w-12 rounded-lg bg-muted shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-3 w-28 rounded bg-muted" />
        <div className="h-2 w-20 rounded bg-muted" />
        <div className="h-2 w-24 rounded bg-muted" />
      </div>
    </div>
  );
}

const STATUS_COLORS: Record<string, string> = {
  Pending: "#EF9F27",
  Confirmed: "#3B6D11",
  Completed: "#0ea5e9",
  Cancelled: "#E24B4A",
};

function PatientDashboard() {
  const { user } = useAuth();

  const { data: appointments, isLoading } = useQuery({
    queryKey: ["patient-appointments"],
    queryFn: appointmentsApi.getMy,
    staleTime: 30_000,
  });

  // حسابات حقيقية
  const upcoming = (appointments ?? [])
    .filter((a) => a.status === "Pending" || a.status === "Confirmed")
    .slice(0, 2);

  const completed = (appointments ?? []).filter((a) => a.status === "Completed").length;
  const pending = (appointments ?? []).filter((a) => a.status === "Pending").length;
  const cancelled = (appointments ?? []).filter((a) => a.status === "Cancelled").length;
  const total = appointments?.length ?? 0;

  // Pie chart من الداتا الحقيقية
  const specialtyMap = new Map<string, number>();
  (appointments ?? []).forEach((a) => {
    specialtyMap.set(a.specialty, (specialtyMap.get(a.specialty) ?? 0) + 1);
  });
  const PIE_COLORS = ["#0ea5e9", "#10b981", "#f59e0b", "#8b5cf6", "#ef4444"];
  const visitsData = Array.from(specialtyMap.entries()).map(([name, value], i) => ({
    name,
    value,
    color: PIE_COLORS[i % PIE_COLORS.length],
  }));

  return (
    <PatientShell title="Dashboard">
      <div className="mb-6">
        <h1 className="text-3xl font-black tracking-tight">
          Welcome back, {user?.fullName?.split(" ")[0]} 👋
        </h1>
        <p className="mt-1 text-muted-foreground">Here's your health snapshot.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => <StatSkeleton key={i} />)
        ) : (
          <>
            {[
              {
                icon: <Calendar className="h-5 w-5 text-primary" />,
                bg: "bg-primary/10",
                label: "Upcoming",
                value: upcoming.length,
                note: "appointments",
              },
              {
                icon: <Clock className="h-5 w-5 text-amber-500" />,
                bg: "bg-amber-500/10",
                label: "Pending",
                value: pending,
                note: "awaiting confirmation",
              },
              {
                icon: <CheckCircle2 className="h-5 w-5 text-emerald-500" />,
                bg: "bg-emerald-500/10",
                label: "Completed",
                value: completed,
                note: "appointments",
              },
              {
                icon: <XCircle className="h-5 w-5 text-destructive" />,
                bg: "bg-destructive/10",
                label: "Cancelled",
                value: cancelled,
                note: "appointments",
              },
            ].map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="rounded-xl border border-border bg-card p-5 shadow-card"
              >
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${s.bg}`}>
                  {s.icon}
                </div>
                <div className="mt-3 text-2xl font-black">{s.value}</div>
                <p className="text-xs text-muted-foreground">
                  {s.label} · {s.note}
                </p>
              </motion.div>
            ))}
          </>
        )}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Heart Rate Chart — static للـ MVP */}
        <Card className="lg:col-span-2" title="Heart Rate Trend">
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={HEART_DATA}>
              <XAxis dataKey="day" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip
                contentStyle={{
                  background: "var(--color-card)",
                  border: "1px solid var(--color-border)",
                  borderRadius: 8,
                }}
              />
              <Line type="monotone" dataKey="bpm" stroke="#0ea5e9" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Visits by Specialty */}
        <Card title="Visits by Specialty">
          {isLoading ? (
            <div className="flex items-center justify-center h-48">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : visitsData.length === 0 ? (
            <div className="flex items-center justify-center h-48 text-sm text-muted-foreground">
              No visits yet
            </div>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={visitsData}
                    dataKey="value"
                    innerRadius={45}
                    outerRadius={75}
                    paddingAngle={3}
                  >
                    {visitsData.map((d, i) => (
                      <Cell key={i} fill={d.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-2 space-y-1">
                {visitsData.map((v) => (
                  <div key={v.name} className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full" style={{ background: v.color }} />
                      {v.name}
                    </span>
                    <span className="font-bold">{v.value}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </Card>

        {/* Upcoming Appointments */}
        <Card
          className="lg:col-span-3"
          title="Upcoming Appointments"
          action={
            <Link to="/patient/appointments" className="text-xs font-bold text-primary">
              View all
            </Link>
          }
        >
          <div className="space-y-3">
            {isLoading ? (
              Array.from({ length: 2 }).map((_, i) => <AppointmentSkeleton key={i} />)
            ) : upcoming.length === 0 ? (
              <p className="py-4 text-center text-sm text-muted-foreground">
                No upcoming appointments
              </p>
            ) : (
              upcoming.map((a) => (
                <Link
                  key={a.id}
                  to="/doctors/$doctorId"
                  params={{ doctorId: String(a.doctorId) }}
                  className="flex gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-muted"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-sm font-bold text-primary">
                    {a.doctorName
                      .split(" ")
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join("")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate font-bold text-sm">{a.doctorName}</p>
                    <p className="truncate text-xs text-primary">{a.specialty}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {new Date(a.appointmentDate).toLocaleDateString()} · {a.timeSlot}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold`}
                      style={{
                        background: STATUS_COLORS[a.status] + "20",
                        color: STATUS_COLORS[a.status],
                      }}
                    >
                      {a.status}
                    </span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </Link>
              ))
            )}
            <Link
              to="/search"
              className="flex items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border py-3 text-sm font-semibold text-muted-foreground hover:bg-muted"
            >
              <Plus className="h-4 w-4" /> Book new appointment
            </Link>
          </div>
        </Card>
      </div>
    </PatientShell>
  );
}

function Card({
  title,
  children,
  action,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-xl border border-border bg-card p-5 shadow-card ${className}`}>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-bold">{title}</h3>
        {action}
      </div>
      {children}
    </div>
  );
}
