import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "@/layouts/AdminShell";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/settings")({
  head: () => ({ meta: [{ title: "Settings — ClinIQ Admin" }] }),
  component: AdminSettingsPage,
});

function Section({ title, fields }: { title: string; fields: string[] }) {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <h3 className="mb-4 font-bold">{title}</h3>
      <div className="grid gap-4 sm:grid-cols-2">
        {fields.map((f) => (
          <label key={f} className="block text-sm">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">{f}</span>
            <input className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm" defaultValue={f.includes("Email") ? "admin@cliniq.com" : ""} />
          </label>
        ))}
      </div>
    </div>
  );
}

function AdminSettingsPage() {
  return (
    <AdminShell title="Platform Settings">
      <div className="space-y-6">
        <Section title="Platform Settings" fields={["Platform Name", "Support Email", "Default Language", "Default Timezone"]} />
        <Section title="Email & SMS Settings" fields={["SMTP Host", "SMTP Port", "SMS Provider", "SMS API Key"]} />
        <Section title="Payment Settings" fields={["Currency", "Platform Fee %", "Payout Schedule", "Stripe Key"]} />
        <button onClick={() => toast.success("Settings saved")} className="rounded-md bg-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-button">
          Save All Settings
        </button>
      </div>
    </AdminShell>
  );
}
