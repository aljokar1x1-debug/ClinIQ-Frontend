import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search, MessageSquare, FileText } from "lucide-react";
import { DoctorShell } from "@/layouts/DoctorShell";

const PATIENTS = [
  { id: 1, name: "Mariam Adel", age: 34, gender: "F", lastVisit: "2026-04-20", visits: 5, condition: "Hypertension" },
  { id: 2, name: "Hassan Ibrahim", age: 52, gender: "M", lastVisit: "2026-04-15", visits: 12, condition: "Diabetes T2" },
  { id: 3, name: "Yasmin Refaat", age: 28, gender: "F", lastVisit: "2026-04-10", visits: 3, condition: "Asthma" },
  { id: 4, name: "Karim Younes", age: 41, gender: "M", lastVisit: "2026-03-28", visits: 8, condition: "Cardiac follow-up" },
  { id: 5, name: "Nadia Saleh", age: 67, gender: "F", lastVisit: "2026-03-15", visits: 18, condition: "Arrhythmia" },
  { id: 6, name: "Tarek Zaki", age: 45, gender: "M", lastVisit: "2026-03-08", visits: 6, condition: "Annual checkups" },
  { id: 7, name: "Reem Salem", age: 31, gender: "F", lastVisit: "2026-02-22", visits: 4, condition: "Pre-natal" },
];

export const Route = createFileRoute("/doctor/patients")({
  head: () => ({ meta: [{ title: "Patients — ClinIQ Doctor" }] }),
  component: DoctorPatients,
});

function DoctorPatients() {
  const [q, setQ] = useState("");
  const filtered = PATIENTS.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()));

  return (
    <DoctorShell title="Patients">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-black tracking-tight">My Patients</h1>
          <p className="mt-1 text-muted-foreground">{PATIENTS.length} patients in your records.</p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search patients..." className="h-10 w-full rounded-md border border-border bg-card pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p) => (
          <div key={p.id} className="group rounded-xl border border-border bg-card p-5 shadow-card transition-shadow hover:shadow-glow">
            <div className="flex items-start gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary font-bold text-white">{p.name[0]}</div>
              <div className="flex-1">
                <p className="font-bold leading-tight">{p.name}</p>
                <p className="text-xs text-muted-foreground">{p.age}y · {p.gender === "F" ? "Female" : "Male"}</p>
              </div>
            </div>
            <div className="mt-4 space-y-1.5 text-xs">
              <Row label="Condition" value={p.condition} />
              <Row label="Last visit" value={p.lastVisit} />
              <Row label="Total visits" value={String(p.visits)} />
            </div>
            <div className="mt-4 flex gap-2 border-t border-border pt-3">
              <button className="flex flex-1 items-center justify-center gap-1 rounded-md border border-border py-2 text-xs font-semibold hover:bg-muted"><FileText className="h-3 w-3" /> Records</button>
              <button className="flex flex-1 items-center justify-center gap-1 rounded-md bg-primary py-2 text-xs font-bold text-primary-foreground"><MessageSquare className="h-3 w-3" /> Message</button>
            </div>
          </div>
        ))}
      </div>
    </DoctorShell>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return <div className="flex justify-between"><span className="text-muted-foreground">{label}</span><span className="font-semibold">{value}</span></div>;
}
