import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { motion } from "framer-motion";
import { DoctorShell } from "@/layouts/DoctorShell";
import { scheduleApi } from "@/api/schedule";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/doctor/schedule")({
  head: () => ({ meta: [{ title: "Schedule — ClinIQ Doctor" }] }),
  component: Schedule,
});

const TIME_SLOTS = [
  "09:00 AM",
  "09:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "12:00 PM",
  "12:30 PM",
  "01:00 PM",
  "01:30 PM",
  "02:00 PM",
  "02:30 PM",
  "03:00 PM",
  "03:30 PM",
  "04:00 PM",
  "04:30 PM",
];

function getNextDays(n: number): Date[] {
  return Array.from({ length: n }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d;
  });
}

function Schedule() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const days = getNextDays(7);

  // نحتاج doctor ID — بنجيبه من الـ user
  const doctorId = user?.userId;

  const { data, isLoading } = useQuery({
    queryKey: ["schedule", doctorId],
    queryFn: () => scheduleApi.getSlots(doctorId!, days[0].toISOString().split("T")[0]),
    enabled: !!doctorId,
    staleTime: 30_000,
  });

  const toggleMutation = useMutation({
    mutationFn: ({ date, time }: { date: string; time: string }) =>
      scheduleApi.toggleSlot(date, time),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedule", doctorId] });
    },
    onError: () => toast.error("Failed to update slot"),
  });

  const getSlotStatus = (date: Date, time: string): "available" | "booked" | "blocked" => {
    const dateStr = date.toISOString().split("T")[0];
    if (data?.bookedSlots.some((s) => s.date === dateStr && s.time === time)) return "booked";
    if (data?.blockedSlots.some((s) => s.date === dateStr && s.time === time)) return "blocked";
    return "available";
  };

  const handleToggle = (date: Date, time: string) => {
    const status = getSlotStatus(date, time);
    if (status === "booked") return;
    toggleMutation.mutate({
      date: date.toISOString().split("T")[0],
      time,
    });
  };

  return (
    <DoctorShell title="Schedule">
      <div className="mb-6">
        <h1 className="text-3xl font-black tracking-tight">Weekly Schedule</h1>
        <p className="mt-1 text-muted-foreground">
          Tap available slots to block them. Booked slots cannot be changed.
        </p>
      </div>

      <div className="mb-4 flex flex-wrap gap-3 text-xs">
        <Legend color="border-dashed border-border text-muted-foreground" label="Available" />
        <Legend color="bg-primary text-primary-foreground" label="Booked" />
        <Legend color="bg-destructive/20 text-destructive" label="Blocked" />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border bg-card p-4 shadow-card">
          <div className="min-w-[700px]">
            <div className="grid grid-cols-[60px_repeat(7,1fr)] gap-2 border-b border-border pb-2">
              <div />
              {days.map((d, i) => (
                <div key={i} className="text-center">
                  <p className="text-xs font-bold uppercase text-muted-foreground">
                    {d.toLocaleDateString("en", { weekday: "short" })}
                  </p>
                  <p className="text-lg font-black">{d.getDate()}</p>
                </div>
              ))}
            </div>

            {TIME_SLOTS.map((t) => (
              <div key={t} className="mt-1.5 grid grid-cols-[60px_repeat(7,1fr)] gap-2">
                <div className="flex items-center text-xs font-bold text-muted-foreground">{t}</div>
                {days.map((d, di) => {
                  const status = getSlotStatus(d, t);
                  return (
                    <motion.button
                      key={di}
                      whileHover={{ scale: status === "booked" ? 1 : 1.05 }}
                      onClick={() => handleToggle(d, t)}
                      disabled={status === "booked" || toggleMutation.isPending}
                      className={`h-9 rounded-md text-xs font-semibold transition-colors ${
                        status === "booked"
                          ? "bg-primary text-primary-foreground cursor-not-allowed"
                          : status === "blocked"
                            ? "bg-destructive/20 text-destructive"
                            : "border border-dashed border-border text-muted-foreground hover:bg-accent/10 hover:text-accent hover:border-accent"
                      }`}
                    >
                      {status === "booked" ? "✓" : status === "blocked" ? "✕" : ""}
                    </motion.button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      )}
    </DoctorShell>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-2">
      <span className={`h-4 w-4 rounded border ${color}`} /> {label}
    </span>
  );
}
