import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Video, MapPin, X } from "lucide-react";
import { PatientShell } from "@/layouts/PatientShell";
import { appointmentsApi, AppointmentResponse } from "@/api/appointments";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const Route = createFileRoute("/patient/appointments")({
  head: () => ({ meta: [{ title: "My Appointments — ClinIQ" }] }),
  component: PatientAppointments,
});

function PatientAppointments() {
  const [tab, setTab] = useState<"Pending" | "Confirmed" | "Completed" | "Cancelled">("Pending");
  const queryClient = useQueryClient();

  const { data: appointments = [], isLoading } = useQuery({
    queryKey: ["my-appointments"],
    queryFn: appointmentsApi.getMy,
    staleTime: 30_000,
  });

  const cancelMutation = useMutation({
    mutationFn: (id: number) => appointmentsApi.cancel(id),
    onSuccess: () => {
      toast.success("Appointment cancelled");
      queryClient.invalidateQueries({ queryKey: ["my-appointments"] });
    },
    onError: () => {
      toast.error("Failed to cancel appointment");
    },
  });

  const filtered = appointments.filter((a: AppointmentResponse) => a.status === tab);
  const count = (s: string) =>
    appointments.filter((a: AppointmentResponse) => a.status === s).length;

  return (
    <PatientShell title="Appointments">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-black tracking-tight">My Appointments</h1>
        <Link
          to="/search"
          search={{ specialty: "" }}
          className="rounded-md bg-primary px-4 py-2 text-sm font-bold text-primary-foreground shadow-button"
        >
          + Book Appointment
        </Link>
      </div>

      <div className="mb-4 inline-flex flex-wrap rounded-lg border border-border bg-card p-1 gap-1">
        {(["Pending", "Confirmed", "Completed", "Cancelled"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-md px-4 py-2 text-sm font-semibold capitalize transition-colors ${tab === t ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}
          >
            {t} ({count(t)})
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.length === 0 && (
            <div className="rounded-xl border border-dashed border-border p-12 text-center text-muted-foreground">
              No {tab.toLowerCase()} appointments.
            </div>
          )}
          {filtered.map((a: AppointmentResponse, i: number) => (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-xl border border-border bg-card p-5 shadow-card"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-2xl font-bold text-primary">
                  {a.doctorName.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <p className="font-bold">{a.doctorName}</p>
                      <p className="text-sm text-primary">{a.specialty}</p>
                    </div>
                    <StatusBadge status={a.status} />
                  </div>
                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(a.appointmentDate).toLocaleDateString()} · {a.timeSlot}
                    </span>
                    <span className="flex items-center gap-1">
                      {a.type === "Online" ? (
                        <Video className="h-3 w-3" />
                      ) : (
                        <MapPin className="h-3 w-3" />
                      )}
                      {a.type}
                    </span>
                    {a.notes && <span>· {a.notes}</span>}
                  </div>
                  <p className="mt-1 text-xs font-semibold text-primary">{a.fee} EGP</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(a.status === "Pending" || a.status === "Confirmed") && (
                    <>
                      {a.type === "Online" && (
                        <button className="rounded-md bg-secondary px-3 py-2 text-xs font-bold text-white">
                          Join Call
                        </button>
                      )}
                      <button
                        onClick={() => cancelMutation.mutate(a.id)}
                        disabled={cancelMutation.isPending}
                        className="flex items-center gap-1 rounded-md border border-destructive/50 px-3 py-2 text-xs font-semibold text-destructive hover:bg-destructive/10 disabled:opacity-50"
                      >
                        <X className="h-3 w-3" /> Cancel
                      </button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </PatientShell>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    Pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400",
    Confirmed: "bg-primary/10 text-primary",
    Completed: "bg-accent/10 text-accent",
    Cancelled: "bg-destructive/10 text-destructive",
  };
  return (
    <span
      className={`rounded-pill px-2.5 py-1 text-xs font-bold ${map[status] || "bg-muted text-muted-foreground"}`}
    >
      {status}
    </span>
  );
}
