import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AdminShell } from "@/layouts/AdminShell";
import { adminApi } from "@/api/admin";
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { TrendingUp, DollarSign, Calendar, Loader2 } from "lucide-react";

export const Route = createFileRoute("/admin/revenue")({
  head: () => ({ meta: [{ title: "Revenue — ClinIQ Admin" }] }),
  component: AdminRevenuePage,
});

function SkeletonStat() {
  return (
    <div className="rounded-xl border border-border bg-card p-5 animate-pulse">
      <div className="h-4 w-24 rounded bg-muted mb-3" />
      <div className="h-8 w-32 rounded bg-muted" />
    </div>
  );
}

function AdminRevenuePage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-revenue"],
    queryFn: adminApi.getRevenue,
    staleTime: 30_000,
  });

  return (
    <AdminShell title="Revenue Analytics">
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-3">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => <SkeletonStat key={i} />)
          ) : isError ? (
            <div className="col-span-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-center text-sm text-destructive">
              فشل تحميل بيانات الـ Revenue
            </div>
          ) : (
            <>
              <div className="rounded-xl border border-border bg-card p-5">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <DollarSign className="h-4 w-4" /> Total Revenue
                </div>
                <p className="text-2xl font-black">{data.totalRevenue.toLocaleString()} EGP</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-5">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Calendar className="h-4 w-4" /> This Month
                </div>
                <p className="text-2xl font-black">{data.thisMonth.toLocaleString()} EGP</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-5">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <TrendingUp className="h-4 w-4" /> Platform Fee (15%)
                </div>
                <p className="text-2xl font-black">{data.platformFee.toLocaleString()} EGP</p>
              </div>
            </>
          )}
        </div>

        {/* Chart */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="mb-4 font-bold">Revenue Trend (Last 6 Months)</h3>
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={data?.monthly ?? []}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0ea5e9" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="#0ea5e9" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="month" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  name="Revenue (EGP)"
                  stroke="#0ea5e9"
                  fill="url(#rev)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Top Doctors */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="mb-4 font-bold">Top Earning Doctors</h3>
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 animate-pulse">
                  <div className="h-8 w-8 rounded-full bg-muted" />
                  <div className="flex-1 h-3 rounded bg-muted" />
                  <div className="h-3 w-20 rounded bg-muted" />
                </div>
              ))}
            </div>
          ) : !data?.topDoctors?.length ? (
            <p className="text-center text-sm text-muted-foreground py-8">
              No completed appointments yet
            </p>
          ) : (
            <div className="space-y-3">
              {data.topDoctors.map(
                (
                  d: {
                    doctorId: number;
                    name: string;
                    specialty: string;
                    appointments: number;
                    earnings: number;
                  },
                  i: number,
                ) => {
                  const medals = ["🥇", "🥈", "🥉", "4.", "5."];
                  return (
                    <div
                      key={d.doctorId}
                      className="flex items-center gap-3 rounded-lg border border-border p-3"
                    >
                      <span className="text-lg w-8 text-center">{medals[i]}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm truncate">{d.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {d.specialty} · {d.appointments} appointments
                        </p>
                      </div>
                      <p className="font-black text-primary text-sm shrink-0">
                        {d.earnings.toLocaleString()} EGP
                      </p>
                    </div>
                  );
                },
              )}
            </div>
          )}
        </div>
      </div>
    </AdminShell>
  );
}
