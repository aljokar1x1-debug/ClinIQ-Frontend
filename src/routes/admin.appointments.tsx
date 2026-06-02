import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AdminShell } from "@/layouts/AdminShell";
import { adminApi } from "@/api/admin";
import { appointmentsApi } from "@/api/appointments";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

export const Route = createFileRoute("/admin/appointments")({
  head: () => ({ meta: [{ title: "Appointments — ClinIQ Admin" }] }),
  component: AdminAppointmentsPage,
});

type Status = "Confirmed" | "Pending" | "Completed" | "Cancelled";

const TONE: Record<string, string> = {
  Confirmed: "bg-emerald-500/10 text-emerald-600",
  Pending: "bg-amber-500/10 text-amber-600",
  Completed: "bg-primary/10 text-primary",
  Cancelled: "bg-destructive/10 text-destructive",
};

function SkeletonRow() {
  return (
    <tr className="border-t border-border animate-pulse">
      <td className="px-4 py-3">
        <div className="h-3 w-24 rounded bg-muted" />
      </td>
      <td className="px-4 py-3">
        <div className="h-3 w-28 rounded bg-muted mb-1" />
        <div className="h-2 w-20 rounded bg-muted" />
      </td>
      <td className="px-4 py-3">
        <div className="h-3 w-32 rounded bg-muted" />
      </td>
      <td className="px-4 py-3">
        <div className="h-3 w-14 rounded bg-muted" />
      </td>
      <td className="px-4 py-3">
        <div className="h-5 w-20 rounded-full bg-muted" />
      </td>
      <td className="px-4 py-3">
        <div className="h-3 w-16 rounded bg-muted ml-auto" />
      </td>
      <td className="px-4 py-3">
        <div className="h-7 w-24 rounded bg-muted ml-auto" />
      </td>
    </tr>
  );
}

function AdminAppointmentsPage() {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<Status | "all">("all");

  const {
    data: appointments,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["admin-appointments"],
    queryFn: adminApi.getAllAppointments,
    staleTime: 30_000,
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      appointmentsApi.updateStatus(id, status),
    onSuccess: (_, { id, status }) => {
      queryClient.setQueryData(["admin-appointments"], (old: typeof appointments) =>
        old?.map((a) => (a.id === id ? { ...a, status } : a)),
      );
      toast.success(`Appointment ${status.toLowerCase()} successfully`);
    },
    onError: () => toast.error("Failed to update appointment status"),
  });

  const list = (appointments ?? []).filter((a) => filter === "all" || a.status === filter);

  const counts = {
    all: appointments?.length ?? 0,
    Pending: appointments?.filter((a) => a.status === "Pending").length ?? 0,
    Confirmed: appointments?.filter((a) => a.status === "Confirmed").length ?? 0,
    Completed: appointments?.filter((a) => a.status === "Completed").length ?? 0,
    Cancelled: appointments?.filter((a) => a.status === "Cancelled").length ?? 0,
  };

  return (
    <AdminShell title="All Appointments">
      <div className="space-y-4">
        {/* Filter tabs */}
        <div className="flex flex-wrap gap-1 rounded-md border border-border bg-card p-1 w-fit">
          {(["all", "Pending", "Confirmed", "Completed", "Cancelled"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded px-3 py-1.5 text-xs font-bold capitalize transition-colors ${
                filter === f
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              {f}
              <span className="ml-1 opacity-60">
                ({f === "all" ? counts.all : counts[f as Status]})
              </span>
            </button>
          ))}
        </div>

        {/* Error */}
        {isError && (
          <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-center text-sm text-destructive">
            فشل تحميل المواعيد — تأكد إن الـ API شغال
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto overflow-hidden rounded-xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Patient</th>
                <th className="px-4 py-3">Doctor</th>
                <th className="px-4 py-3">Date & Time</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Fee</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)
              ) : list.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-sm text-muted-foreground">
                    No appointments found
                  </td>
                </tr>
              ) : (
                list.map((a, i) => (
                  <motion.tr
                    key={a.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.02 }}
                    className="border-t border-border hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-4 py-3 font-semibold">{a.patientName}</td>
                    <td className="px-4 py-3">
                      <p className="font-semibold">{a.doctorName}</p>
                      <p className="text-xs text-muted-foreground">{a.specialty}</p>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      <p>{new Date(a.appointmentDate).toLocaleDateString()}</p>
                      <p className="text-xs">{a.timeSlot}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded-full border border-border px-2 py-0.5 text-xs">
                        {a.type}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-bold ${TONE[a.status] ?? "bg-muted text-muted-foreground"}`}
                      >
                        {a.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-bold">{a.fee} EGP</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        {a.status === "Pending" && (
                          <button
                            onClick={() => statusMutation.mutate({ id: a.id, status: "Confirmed" })}
                            disabled={statusMutation.isPending}
                            className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 px-2 py-1 text-xs font-bold text-emerald-600 hover:bg-emerald-500/20 disabled:opacity-50"
                          >
                            {statusMutation.isPending ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              "Confirm"
                            )}
                          </button>
                        )}
                        {(a.status === "Pending" || a.status === "Confirmed") && (
                          <button
                            onClick={() => statusMutation.mutate({ id: a.id, status: "Cancelled" })}
                            disabled={statusMutation.isPending}
                            className="inline-flex items-center gap-1 rounded-md bg-destructive/10 px-2 py-1 text-xs font-bold text-destructive hover:bg-destructive/20 disabled:opacity-50"
                          >
                            {statusMutation.isPending ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              "Cancel"
                            )}
                          </button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Count */}
        {!isLoading && appointments && (
          <p className="text-xs text-muted-foreground">
            Showing {list.length} of {appointments.length} appointments
          </p>
        )}
      </div>
    </AdminShell>
  );
}
