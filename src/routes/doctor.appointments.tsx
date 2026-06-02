import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Video, MapPin, Phone, FileText, Check, X } from "lucide-react";
import { DoctorShell } from "@/layouts/DoctorShell";

export const Route = createFileRoute("/doctor/appointments")({
  head: () => ({ meta: [{ title: "Appointments — ClinIQ Doctor" }] }),
  component: DoctorAppts,
});

const APPTS = [
  { id: "1", patient: "Mariam Adel", date: "2026-05-15", time: "09:00", type: "clinic", status: "confirmed", reason: "Follow-up" },
  { id: "2", patient: "Hassan Ibrahim", date: "2026-05-15", time: "09:30", type: "video", status: "confirmed", reason: "Consultation" },
  { id: "3", patient: "Yasmin Refaat", date: "2026-05-15", time: "10:30", type: "clinic", status: "confirmed", reason: "Annual checkup" },
  { id: "4", patient: "Karim Younes", date: "2026-05-16", time: "11:00", type: "video", status: "pending", reason: "New patient" },
  { id: "5", patient: "Nadia Saleh", date: "2026-05-16", time: "14:00", type: "clinic", status: "pending", reason: "Lab review" },
  { id: "6", patient: "Tarek Zaki", date: "2026-05-12", time: "10:00", type: "clinic", status: "completed", reason: "Annual" },
];

function DoctorAppts() {
  const [tab, setTab] = useState<"all" | "confirmed" | "pending" | "completed">("all");
  const filtered = tab === "all" ? APPTS : APPTS.filter((a) => a.status === tab);

  return (
    <DoctorShell title="Appointments">
      <div className="mb-6">
        <h1 className="text-3xl font-black tracking-tight">Appointments</h1>
        <p className="mt-1 text-muted-foreground">Manage your upcoming and past appointments.</p>
      </div>

      <div className="mb-4 inline-flex rounded-lg border border-border bg-card p-1">
        {(["all", "confirmed", "pending", "completed"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`rounded-md px-4 py-2 text-sm font-semibold capitalize ${tab === t ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}>
            {t}
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-card">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-4 py-3 text-left">Patient</th>
              <th className="px-4 py-3 text-left">Date & Time</th>
              <th className="hidden px-4 py-3 text-left md:table-cell">Type</th>
              <th className="hidden px-4 py-3 text-left lg:table-cell">Reason</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map((a, i) => (
              <motion.tr key={a.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className="transition-colors hover:bg-muted/30">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">{a.patient[0]}</div>
                    <span className="font-semibold">{a.patient}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{a.date}<br /><span className="text-xs">{a.time}</span></td>
                <td className="hidden px-4 py-3 md:table-cell">
                  <span className="flex items-center gap-1 text-xs">
                    {a.type === "video" ? <Video className="h-3 w-3 text-secondary" /> : <MapPin className="h-3 w-3" />} {a.type}
                  </span>
                </td>
                <td className="hidden px-4 py-3 text-xs text-muted-foreground lg:table-cell">{a.reason}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-pill px-2 py-1 text-xs font-bold capitalize ${a.status === "confirmed" ? "bg-accent/10 text-accent" : a.status === "pending" ? "bg-[oklch(0.78_0.18_70)]/10 text-[oklch(0.78_0.18_70)]" : "bg-muted text-muted-foreground"}`}>{a.status}</span>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-1">
                    {a.status === "pending" && (
                      <>
                        <button className="rounded-md bg-accent p-1.5 text-white" title="Approve"><Check className="h-3.5 w-3.5" /></button>
                        <button className="rounded-md bg-destructive p-1.5 text-white" title="Decline"><X className="h-3.5 w-3.5" /></button>
                      </>
                    )}
                    {a.status === "confirmed" && (
                      <>
                        {a.type === "video" && <button className="rounded-md bg-secondary p-1.5 text-white" title="Call"><Phone className="h-3.5 w-3.5" /></button>}
                        <button className="rounded-md border border-border p-1.5" title="Notes"><FileText className="h-3.5 w-3.5" /></button>
                      </>
                    )}
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </DoctorShell>
  );
}
