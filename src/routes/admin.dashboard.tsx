import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AdminShell } from "@/layouts/AdminShell";
import { adminApi } from "@/api/admin";
import { motion } from "framer-motion";
import { Users, Stethoscope, Calendar, DollarSign, TrendingUp, Loader2 } from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";

export const Route = createFileRoute("/admin/dashboard")({
  head: () => ({ meta: [{ title: "Admin Overview — ClinIQ" }] }),
  component: AdminDashboardPage,
});

const PIE = [
  "#0ea5e9",
  "#10b981",
  "#f59e0b",
  "#8b5cf6",
  "#ef4444",
  "#ec4899",
  "#14b8a6",
  "#f97316",
  "#6366f1",
  "#84cc16",
];

const STAT_CONFIG = [
  {
    key: "totalDoctors",
    label: "Total Doctors",
    icon: Stethoscope,
    tone: "bg-primary/10 text-primary",
  },
  {
    key: "totalPatients",
    label: "Active Patients",
    icon: Users,
    tone: "bg-emerald-500/10 text-emerald-600",
  },
  {
    key: "totalAppointments",
    label: "Total Appointments",
    icon: Calendar,
    tone: "bg-amber-500/10 text-amber-600",
  },
  {
    key: "totalRevenue",
    label: "Total Revenue",
    icon: DollarSign,
    tone: "bg-violet-500/10 text-violet-600",
  },
] as const;

// Skeleton card
function StatSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-card p-5 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-10 w-10 rounded-lg bg-muted" />
        <div className="h-4 w-12 rounded bg-muted" />
      </div>
      <div className="mt-3 h-7 w-24 rounded bg-muted" />
      <div className="mt-1 h-3 w-28 rounded bg-muted" />
    </div>
  );
}

export function AdminDashboardPage() {
  const {
    data: stats,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: adminApi.getStats,
    staleTime: 30_000,
  });

  // بيانات الشارت — لو عندك endpoint للـ revenue هنغيرها بعدين في Task 10
  const revenueChart = [
    { m: "Jan", r: 42000, b: 38000 },
    { m: "Feb", r: 48000, b: 41000 },
    { m: "Mar", r: 51000, b: 44000 },
    { m: "Apr", r: 58000, b: 47000 },
    { m: "May", r: 63000, b: 52000 },
    { m: "Jun", r: 71000, b: 58000 },
    { m: "Jul", r: 78000, b: 64000 },
  ];

  // Pie chart من الـ stats الحقيقية
  const specialtyPie = stats
    ? [
        { name: "Doctors", value: stats.totalDoctors },
        { name: "Patients", value: stats.totalPatients },
        { name: "Appointments", value: stats.totalAppointments },
        { name: "Completed", value: stats.completedAppointments },
        { name: "Pending", value: stats.pendingAppointments },
      ]
    : [];

  const formatValue = (key: string, val: number) => {
    if (key === "totalRevenue") return `$${val.toLocaleString()}`;
    return val.toLocaleString();
  };

  return (
    <AdminShell title="Platform Overview">
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => <StatSkeleton key={i} />)
          ) : isError ? (
            <div className="col-span-4 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-center text-sm text-destructive">
              فشل تحميل الإحصائيات — تأكد إن الـ API شغال
            </div>
          ) : (
            STAT_CONFIG.map((s, i) => (
              <motion.div
                key={s.key}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="rounded-xl border border-border bg-card p-5"
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`flex h-10 w-10 items-center justify-center rounded-lg ${s.tone}`}
                  >
                    <s.icon className="h-5 w-5" />
                  </span>
                  <span className="flex items-center gap-1 text-xs font-bold text-emerald-600">
                    <TrendingUp className="h-3 w-3" />
                  </span>
                </div>
                <p className="mt-3 text-2xl font-black">{formatValue(s.key, stats![s.key])}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </motion.div>
            ))
          )}
        </div>

        {/* Charts Row */}
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="rounded-xl border border-border bg-card p-5 lg:col-span-2">
            <h3 className="mb-4 font-bold">Revenue vs Bookings</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueChart}>
                  <defs>
                    <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#0ea5e9" stopOpacity={0.5} />
                      <stop offset="100%" stopColor="#0ea5e9" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="m" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="r"
                    name="Revenue"
                    stroke="#0ea5e9"
                    fill="url(#g1)"
                  />
                  <Area
                    type="monotone"
                    dataKey="b"
                    name="Bookings $"
                    stroke="#10b981"
                    fill="url(#g2)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="mb-4 font-bold">Platform Overview</h3>
            <div className="h-72">
              {isLoading ? (
                <div className="flex h-full items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={specialtyPie}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={50}
                      outerRadius={90}
                      paddingAngle={3}
                    >
                      {specialtyPie.map((_, i) => (
                        <Cell key={i} fill={PIE[i % PIE.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>

        {/* Extra stats row */}
        {stats && (
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-border bg-card p-5 text-center">
              <p className="text-3xl font-black text-amber-500">{stats.pendingAppointments}</p>
              <p className="mt-1 text-sm text-muted-foreground">Pending Appointments</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-5 text-center">
              <p className="text-3xl font-black text-emerald-500">{stats.completedAppointments}</p>
              <p className="mt-1 text-sm text-muted-foreground">Completed Appointments</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-5 text-center">
              <p className="text-3xl font-black text-primary">{stats.totalUsers}</p>
              <p className="mt-1 text-sm text-muted-foreground">Total Users</p>
            </div>
          </div>
        )}

        {/* Monthly Bar Chart */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="mb-4 font-bold">Monthly Appointments</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueChart}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="m" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="r" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
