import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ResponsiveContainer, XAxis, YAxis, Tooltip, AreaChart, Area } from "recharts";
import {
  Calendar,
  DollarSign,
  Star,
  Video,
  MapPin,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
} from "lucide-react";
import { DoctorShell } from "@/layouts/DoctorShell";
import { appointmentsApi, AppointmentResponse } from "@/api/appointments";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

export const Route = createFileRoute("/doctor/dashboard")({
  head: () => ({ meta: [{ title: "Doctor Dashboard — ClinIQ" }] }),
  component: DoctorDashboard,
});

function StatSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-card p-5 animate-pulse">
      <div className="h-10 w-10 rounded-lg bg-muted" />
      <div className="mt-3 h-7 w-16 rounded bg-muted" />
      <div className="mt-1 h-3 w-28 rounded bg-muted" />
    </div>
  );
}

export function DoctorDashboard() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: appointments, isLoading } = useQuery({
    queryKey: ["doctor-appointments"],
    queryFn: appointmentsApi.getMy,
    staleTime: 30_000,
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      appointmentsApi.updateStatus(id, status),
    onSuccess: (_, { id, status }) => {
      queryClient.setQueryData(["doctor-appointments"], (old: AppointmentResponse[] | undefined) =>
        old?.map((a) => (a.id === id ? { ...a, status } : a)),
      );
      toast.success(`Appointment ${status.toLowerCase()}`);
    },
    onError: () => toast.error("Failed to update appointment"),
  });

  // حسابات من الداتا الحقيقية
  const today = new Date().toDateString();
  const todayAppts = (appointments ?? []).filter(
    (a) => new Date(a.appointmentDate).toDateString() === today,
  );
  const pendingAppts = (appointments ?? []).filter((a) => a.status === "Pending");
  const completedAppts = (appointments ?? []).filter((a) => a.status === "Completed");
  const totalRevenue = completedAppts.reduce((sum, a) => sum + a.fee, 0);
  const totalAll = appointments?.length ?? 0;

  // Revenue chart — آخر 6 شهور من الـ appointments
  const revenueChart = Array.from({ length: 6 }, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - (5 - i));
    const month = d.toLocaleString("default", { month: "short" });
    const rev = (appointments ?? [])
      .filter((a) => {
        const ad = new Date(a.appointmentDate);
        return (
          ad.getMonth() === d.getMonth() &&
          ad.getFullYear() === d.getFullYear() &&
          a.status === "Completed"
        );
      })
      .reduce((sum, a) => sum + a.fee, 0);
    return { m: month, v: rev };
  });

  return (
    <DoctorShell title="Dashboard">
      <div className="mb-6">
        <h1 className="text-3xl font-black tracking-tight">
          Welcome back, {user?.fullName?.split(" ").slice(0, 2).join(" ")}{" "}
        </h1>
        <p className="mt-1 text-muted-foreground">Here's your practice overview.</p>
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
                label: "Today",
                value: todayAppts.length,
                note: "appointments",
              },
              {
                icon: <Clock className="h-5 w-5 text-amber-500" />,
                label: "Pending",
                value: pendingAppts.length,
                note: "need confirmation",
              },
              {
                icon: <DollarSign className="h-5 w-5 text-accent" />,
                label: "Revenue",
                value: `${totalRevenue} EGP`,
                note: "from completed",
              },
              {
                icon: <Star className="h-5 w-5 text-yellow-400" />,
                label: "Total",
                value: totalAll,
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
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
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
        {/* Revenue Chart */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-card lg:col-span-2">
          <h3 className="mb-4 font-bold">Revenue (Last 6 Months)</h3>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={revenueChart}>
              <defs>
                <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0ea5e9" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="#0ea5e9" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="m" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="v"
                name="Revenue (EGP)"
                stroke="#0ea5e9"
                strokeWidth={3}
                fill="url(#rev)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Today's Appointments */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-card">
          <h3 className="mb-4 font-bold">
            Today's Schedule
            {todayAppts.length > 0 && (
              <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">
                {todayAppts.length}
              </span>
            )}
          </h3>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : todayAppts.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">No appointments today</p>
          ) : (
            <div className="space-y-2">
              {todayAppts.map((a, i) => (
                <motion.div
                  key={a.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="flex items-center gap-3 rounded-lg border border-border p-2.5"
                >
                  <div className="text-center">
                    <p className="text-xs font-black">{a.timeSlot}</p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-bold">{a.patientName}</p>
                    <p className="truncate text-xs text-muted-foreground">{a.status}</p>
                  </div>
                  {a.type === "Online" ? (
                    <Video className="h-4 w-4 text-primary shrink-0" />
                  ) : (
                    <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Pending Appointments */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-card lg:col-span-3">
          <h3 className="mb-4 font-bold">
            Pending Appointments
            {pendingAppts.length > 0 && (
              <span className="ml-2 rounded-full bg-amber-500/10 px-2 py-0.5 text-xs font-bold text-amber-600">
                {pendingAppts.length}
              </span>
            )}
          </h3>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : pendingAppts.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No pending appointments 🎉
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left text-xs uppercase text-muted-foreground">
                  <tr>
                    <th className="pb-2">Patient</th>
                    <th className="pb-2">Date</th>
                    <th className="pb-2">Time</th>
                    <th className="pb-2">Type</th>
                    <th className="pb-2">Fee</th>
                    <th className="pb-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingAppts.map((a) => (
                    <tr key={a.id} className="border-t border-border">
                      <td className="py-2.5 font-semibold">{a.patientName}</td>
                      <td className="py-2.5 text-muted-foreground">
                        {new Date(a.appointmentDate).toLocaleDateString()}
                      </td>
                      <td className="py-2.5 text-muted-foreground">{a.timeSlot}</td>
                      <td className="py-2.5">{a.type}</td>
                      <td className="py-2.5 font-bold">{a.fee} EGP</td>
                      <td className="py-2.5">
                        <div className="flex justify-end gap-1">
                          <button
                            onClick={() => statusMutation.mutate({ id: a.id, status: "Confirmed" })}
                            disabled={statusMutation.isPending}
                            className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 px-2 py-1 text-xs font-bold text-emerald-600 hover:bg-emerald-500/20 disabled:opacity-50"
                          >
                            <CheckCircle2 className="h-3 w-3" /> Confirm
                          </button>
                          <button
                            onClick={() => statusMutation.mutate({ id: a.id, status: "Cancelled" })}
                            disabled={statusMutation.isPending}
                            className="inline-flex items-center gap-1 rounded-md bg-destructive/10 px-2 py-1 text-xs font-bold text-destructive hover:bg-destructive/20 disabled:opacity-50"
                          >
                            <XCircle className="h-3 w-3" /> Cancel
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DoctorShell>
  );
}
