import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Camera, Save } from "lucide-react";
import { PatientShell } from "@/layouts/PatientShell";

export const Route = createFileRoute("/patient/profile")({
  head: () => ({ meta: [{ title: "Profile — ClinIQ" }] }),
  component: PatientProfile,
});

function PatientProfile() {
  const [data, setData] = useState({
    name: "Jane Doe", email: "jane@cliniq.com", phone: "+20 100 123 4567",
    dob: "1992-04-12", gender: "Female", bloodType: "O+",
    height: "168", weight: "62", emergency: "John Doe — +20 100 999 1111",
    allergies: "Penicillin", conditions: "None",
  });

  return (
    <PatientShell title="Profile">
      <div className="mb-6">
        <h1 className="text-3xl font-black tracking-tight">My Profile</h1>
        <p className="mt-1 text-muted-foreground">Manage your personal and medical information.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <div className="rounded-2xl border border-border bg-card p-6 text-center shadow-card">
          <div className="relative mx-auto h-32 w-32">
            <div className="flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-5xl font-black text-white">{data.name[0]}</div>
            <button className="absolute bottom-0 right-0 flex h-9 w-9 items-center justify-center rounded-full bg-primary text-white ring-4 ring-card"><Camera className="h-4 w-4" /></button>
          </div>
          <h2 className="mt-4 text-xl font-bold">{data.name}</h2>
          <p className="text-sm text-muted-foreground">{data.email}</p>
          <div className="mt-4 grid grid-cols-3 gap-2 border-t border-border pt-4 text-xs">
            <div><p className="font-black text-lg">12</p><p className="text-muted-foreground">Visits</p></div>
            <div><p className="font-black text-lg">5</p><p className="text-muted-foreground">Records</p></div>
            <div><p className="font-black text-lg text-accent">★ 5.0</p><p className="text-muted-foreground">Rating</p></div>
          </div>
        </div>

        <div className="space-y-6">
          <Section title="Personal Information">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Full Name" value={data.name} onChange={(v) => setData({ ...data, name: v })} />
              <Field label="Email" value={data.email} onChange={(v) => setData({ ...data, email: v })} />
              <Field label="Phone" value={data.phone} onChange={(v) => setData({ ...data, phone: v })} />
              <Field label="Date of Birth" type="date" value={data.dob} onChange={(v) => setData({ ...data, dob: v })} />
              <Field label="Gender" value={data.gender} onChange={(v) => setData({ ...data, gender: v })} />
              <Field label="Emergency Contact" value={data.emergency} onChange={(v) => setData({ ...data, emergency: v })} />
            </div>
          </Section>

          <Section title="Medical Information">
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Blood Type" value={data.bloodType} onChange={(v) => setData({ ...data, bloodType: v })} />
              <Field label="Height (cm)" value={data.height} onChange={(v) => setData({ ...data, height: v })} />
              <Field label="Weight (kg)" value={data.weight} onChange={(v) => setData({ ...data, weight: v })} />
              <Field label="Allergies" value={data.allergies} onChange={(v) => setData({ ...data, allergies: v })} />
              <Field label="Conditions" value={data.conditions} onChange={(v) => setData({ ...data, conditions: v })} />
            </div>
          </Section>

          <button className="flex items-center gap-2 rounded-md bg-primary px-6 py-2.5 font-bold text-primary-foreground shadow-button"><Save className="h-4 w-4" /> Save Changes</button>
        </div>
      </div>
    </PatientShell>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
      <h3 className="mb-4 text-lg font-bold">{title}</h3>
      {children}
    </div>
  );
}

function Field({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-muted-foreground">{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
    </div>
  );
}
