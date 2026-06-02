import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, User, Calendar, Heart, Pill, Bell } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export const Route = createFileRoute("/onboarding")({
  head: () => ({ meta: [{ title: "Get Started — ClinIQ" }] }),
  component: Onboarding,
});

const STEPS = [
  { icon: <User className="h-6 w-6" />, title: "Personal Info", desc: "Tell us about yourself" },
  { icon: <Calendar className="h-6 w-6" />, title: "Date of Birth", desc: "Help us personalize your experience" },
  { icon: <Heart className="h-6 w-6" />, title: "Health Info", desc: "Basic medical info" },
  { icon: <Pill className="h-6 w-6" />, title: "Medications", desc: "Current medications & allergies" },
  { icon: <Bell className="h-6 w-6" />, title: "Notifications", desc: "Stay updated" },
];

function Onboarding() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    name: "", gender: "", dob: "", height: "", weight: "", bloodType: "",
    conditions: [] as string[], allergies: "", medications: "", reminders: true, marketing: false,
  });
  const navigate = useNavigate();
  const { login } = useAuth();

  const next = () => {
    if (step < STEPS.length - 1) setStep(step + 1);
    else {
      login({ name: data.name || "Patient", email: "user@cliniq.com", role: "patient" });
      navigate({ to: "/patient/dashboard" });
    }
  };

  const conditions = ["Diabetes", "Hypertension", "Asthma", "Heart Disease", "None"];
  const toggleCondition = (c: string) =>
    setData({ ...data, conditions: data.conditions.includes(c) ? data.conditions.filter((x) => x !== c) : [...data.conditions, c] });

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 px-4 py-8">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6 flex items-center gap-2">
          {STEPS.map((_, i) => (
            <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors ${i <= step ? "bg-primary" : "bg-border"}`} />
          ))}
        </div>
        <p className="mb-6 text-sm text-muted-foreground">Step {step + 1} of {STEPS.length}</p>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-border bg-card p-8 shadow-card">
          <div className="mb-6 flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">{STEPS[step].icon}</div>
            <div>
              <h1 className="text-2xl font-bold">{STEPS[step].title}</h1>
              <p className="text-sm text-muted-foreground">{STEPS[step].desc}</p>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
              {step === 0 && (
                <>
                  <Field label="Full Name" value={data.name} onChange={(v) => setData({ ...data, name: v })} placeholder="Jane Doe" />
                  <div>
                    <p className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">Gender</p>
                    <div className="grid grid-cols-3 gap-2">
                      {["Female", "Male", "Other"].map((g) => (
                        <button key={g} onClick={() => setData({ ...data, gender: g })} className={`rounded-lg border-2 py-3 font-semibold transition-colors ${data.gender === g ? "border-primary bg-primary/5 text-primary" : "border-border hover:bg-muted"}`}>{g}</button>
                      ))}
                    </div>
                  </div>
                </>
              )}
              {step === 1 && (
                <>
                  <Field label="Date of Birth" type="date" value={data.dob} onChange={(v) => setData({ ...data, dob: v })} />
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Height (cm)" type="number" value={data.height} onChange={(v) => setData({ ...data, height: v })} placeholder="170" />
                    <Field label="Weight (kg)" type="number" value={data.weight} onChange={(v) => setData({ ...data, weight: v })} placeholder="65" />
                  </div>
                </>
              )}
              {step === 2 && (
                <>
                  <div>
                    <p className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">Blood Type</p>
                    <div className="grid grid-cols-4 gap-2">
                      {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((t) => (
                        <button key={t} onClick={() => setData({ ...data, bloodType: t })} className={`rounded-lg border-2 py-2 text-sm font-bold ${data.bloodType === t ? "border-primary bg-primary/5 text-primary" : "border-border hover:bg-muted"}`}>{t}</button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">Existing Conditions</p>
                    <div className="flex flex-wrap gap-2">
                      {conditions.map((c) => (
                        <button key={c} onClick={() => toggleCondition(c)} className={`rounded-pill border-2 px-4 py-1.5 text-sm font-medium ${data.conditions.includes(c) ? "border-primary bg-primary/5 text-primary" : "border-border hover:bg-muted"}`}>{c}</button>
                      ))}
                    </div>
                  </div>
                </>
              )}
              {step === 3 && (
                <>
                  <Field label="Current Medications" value={data.medications} onChange={(v) => setData({ ...data, medications: v })} placeholder="e.g. Metformin 500mg" />
                  <Field label="Known Allergies" value={data.allergies} onChange={(v) => setData({ ...data, allergies: v })} placeholder="e.g. Penicillin, peanuts" />
                </>
              )}
              {step === 4 && (
                <div className="space-y-3">
                  <Toggle label="Appointment reminders" desc="Get notified before your visits" checked={data.reminders} onChange={(v) => setData({ ...data, reminders: v })} />
                  <Toggle label="Health tips & offers" desc="Occasional emails with tips and promotions" checked={data.marketing} onChange={(v) => setData({ ...data, marketing: v })} />
                  <div className="mt-6 rounded-xl bg-accent/10 p-4 text-sm text-accent">
                    🎉 You're all set! Your personalized dashboard is ready.
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="mt-8 flex justify-between border-t border-border pt-6">
            <button onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0} className="flex items-center gap-1 rounded-md px-4 py-2 text-sm font-semibold disabled:opacity-30 hover:bg-muted">
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
            <button onClick={next} className="flex items-center gap-1 rounded-md bg-primary px-6 py-2.5 text-sm font-bold text-primary-foreground shadow-button hover:opacity-90">
              {step === STEPS.length - 1 ? <>Finish <Check className="h-4 w-4" /></> : <>Continue <ArrowRight className="h-4 w-4" /></>}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, type = "text" }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-muted-foreground">{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
    </div>
  );
}

function Toggle({ label, desc, checked, onChange }: { label: string; desc: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-center justify-between rounded-lg border border-border p-4 hover:bg-muted/50">
      <div>
        <p className="font-semibold">{label}</p>
        <p className="text-xs text-muted-foreground">{desc}</p>
      </div>
      <button type="button" onClick={() => onChange(!checked)} className={`relative h-6 w-11 rounded-full transition-colors ${checked ? "bg-primary" : "bg-border"}`}>
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${checked ? "translate-x-5" : "translate-x-0.5"}`} />
      </button>
    </label>
  );
}
