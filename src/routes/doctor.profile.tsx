import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Camera, Save, Star } from "lucide-react";
import { DoctorShell } from "@/layouts/DoctorShell";

export const Route = createFileRoute("/doctor/profile")({
  head: () => ({ meta: [{ title: "Profile — ClinIQ Doctor" }] }),
  component: DoctorProfile,
});

function DoctorProfile() {
  const [data, setData] = useState({
    name: "Dr. Sarah Hassan", specialty: "Cardiology", email: "sarah@cliniq.com",
    phone: "+20 100 555 0001", clinic: "Maadi Medical Center", city: "Cairo",
    fee: "350", experience: "12", about: "Board-certified cardiologist focused on preventive care and evidence-based treatment.",
    languages: "English, Arabic, French", licenseNo: "EG-MED-2018-44213",
  });

  return (
    <DoctorShell title="Profile">
      <div className="mb-6">
        <h1 className="text-3xl font-black tracking-tight">Doctor Profile</h1>
        <p className="mt-1 text-muted-foreground">Manage your public profile and credentials.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <div className="rounded-2xl border border-border bg-card p-6 text-center shadow-card">
          <div className="relative mx-auto h-32 w-32">
            <div className="flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-5xl font-black text-white">{data.name[3]}</div>
            <button className="absolute bottom-0 right-0 flex h-9 w-9 items-center justify-center rounded-full bg-primary text-white ring-4 ring-card"><Camera className="h-4 w-4" /></button>
          </div>
          <h2 className="mt-4 text-xl font-bold">{data.name}</h2>
          <p className="text-sm text-primary">{data.specialty}</p>
          <div className="mt-3 flex items-center justify-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-accent text-accent" />)}
            <span className="ml-2 text-sm font-bold">4.9</span>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2 border-t border-border pt-4 text-xs">
            <div><p className="font-black text-lg">320</p><p className="text-muted-foreground">Reviews</p></div>
            <div><p className="font-black text-lg">1.2k</p><p className="text-muted-foreground">Patients</p></div>
            <div><p className="font-black text-lg">{data.experience}y</p><p className="text-muted-foreground">Exp</p></div>
          </div>
          <div className="mt-4 rounded-lg bg-accent/10 p-3 text-xs font-bold text-accent">✓ License Verified</div>
        </div>

        <div className="space-y-6">
          <Section title="Professional Info">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Full Name" value={data.name} onChange={(v) => setData({ ...data, name: v })} />
              <Field label="Specialty" value={data.specialty} onChange={(v) => setData({ ...data, specialty: v })} />
              <Field label="License Number" value={data.licenseNo} onChange={(v) => setData({ ...data, licenseNo: v })} />
              <Field label="Years of Experience" value={data.experience} onChange={(v) => setData({ ...data, experience: v })} />
              <Field label="Languages" value={data.languages} onChange={(v) => setData({ ...data, languages: v })} />
              <Field label="Consultation Fee ($)" value={data.fee} onChange={(v) => setData({ ...data, fee: v })} />
            </div>
            <div className="mt-4">
              <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-muted-foreground">About / Bio</label>
              <textarea value={data.about} onChange={(e) => setData({ ...data, about: e.target.value })} rows={4} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
            </div>
          </Section>

          <Section title="Contact & Location">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Email" value={data.email} onChange={(v) => setData({ ...data, email: v })} />
              <Field label="Phone" value={data.phone} onChange={(v) => setData({ ...data, phone: v })} />
              <Field label="Clinic" value={data.clinic} onChange={(v) => setData({ ...data, clinic: v })} />
              <Field label="City" value={data.city} onChange={(v) => setData({ ...data, city: v })} />
            </div>
          </Section>

          <button className="flex items-center gap-2 rounded-md bg-primary px-6 py-2.5 font-bold text-primary-foreground shadow-button"><Save className="h-4 w-4" /> Save Changes</button>
        </div>
      </div>
    </DoctorShell>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return <div className="rounded-2xl border border-border bg-card p-6 shadow-card"><h3 className="mb-4 text-lg font-bold">{title}</h3>{children}</div>;
}
function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-muted-foreground">{label}</label>
      <input value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
    </div>
  );
}
