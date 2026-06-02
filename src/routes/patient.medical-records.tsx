import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FileText, FlaskConical, Pill, Activity, Heart, Loader2, Trash2 } from "lucide-react";
import { PatientShell } from "@/layouts/PatientShell";
import { medicalRecordsApi } from "@/api/medical-records";
import { toast } from "sonner";
import { motion } from "framer-motion";

export const Route = createFileRoute("/patient/medical-records")({
  head: () => ({ meta: [{ title: "Medical Records — ClinIQ" }] }),
  component: MedicalRecords,
});

const TYPE_ICON: Record<string, { icon: React.ReactNode; bg: string }> = {
  "Lab Result": { icon: <FlaskConical className="h-5 w-5 text-primary" />, bg: "bg-primary/10" },
  Prescription: { icon: <Pill className="h-5 w-5 text-accent" />, bg: "bg-accent/10" },
  Imaging: { icon: <Activity className="h-5 w-5 text-secondary" />, bg: "bg-secondary/10" },
  Report: { icon: <FileText className="h-5 w-5 text-secondary" />, bg: "bg-secondary/10" },
};

function SkeletonRow() {
  return (
    <li className="flex items-center gap-4 p-4 animate-pulse">
      <div className="h-10 w-10 rounded-lg bg-muted shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-3 w-40 rounded bg-muted" />
        <div className="h-2 w-28 rounded bg-muted" />
      </div>
    </li>
  );
}

function MedicalRecords() {
  const queryClient = useQueryClient();

  const { data: records, isLoading } = useQuery({
    queryKey: ["medical-records"],
    queryFn: medicalRecordsApi.getMy,
    staleTime: 30_000,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => medicalRecordsApi.delete(id),
    onSuccess: (_, id) => {
      queryClient.setQueryData(["medical-records"], (old: typeof records) =>
        old?.filter((r) => r.id !== id),
      );
      toast.success("Record deleted");
    },
    onError: () => toast.error("Failed to delete record"),
  });

  return (
    <PatientShell title="Medical Records">
      <div className="mb-6">
        <h1 className="text-3xl font-black tracking-tight">Medical Records</h1>
        <p className="mt-1 text-muted-foreground">
          All your reports, prescriptions and lab results in one place.
        </p>
      </div>

      {/* Vitals — static للـ MVP */}
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        {[
          {
            label: "Blood Pressure",
            value: "118/76",
            note: "Normal",
            icon: <Heart className="h-5 w-5 text-destructive" />,
          },
          {
            label: "Blood Sugar",
            value: "94 mg/dL",
            note: "Fasting",
            icon: <FlaskConical className="h-5 w-5 text-secondary" />,
          },
          {
            label: "BMI",
            value: "22.4",
            note: "Healthy",
            icon: <Activity className="h-5 w-5 text-accent" />,
          },
        ].map((v) => (
          <div key={v.label} className="rounded-xl border border-border bg-card p-5 shadow-card">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{v.label}</p>
              {v.icon}
            </div>
            <p className="mt-2 text-2xl font-black">{v.value}</p>
            <p className="text-xs text-accent">{v.note}</p>
          </div>
        ))}
      </div>

      {/* Records List */}
      <div className="rounded-xl border border-border bg-card shadow-card">
        <div className="flex items-center justify-between border-b border-border p-5">
          <h2 className="font-bold">Documents {records && `(${records.length})`}</h2>
        </div>
        <ul className="divide-y divide-border">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => <SkeletonRow key={i} />)
          ) : !records?.length ? (
            <li className="py-12 text-center text-sm text-muted-foreground">
              No medical records yet
            </li>
          ) : (
            records.map((r, i) => {
              const typeConfig = TYPE_ICON[r.type] ?? TYPE_ICON["Report"];
              return (
                <motion.li
                  key={r.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="flex items-center gap-4 p-4 transition-colors hover:bg-muted/30"
                >
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${typeConfig.bg}`}
                  >
                    {typeConfig.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-bold">{r.title}</p>
                      <span className="rounded-pill bg-muted px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        {r.type}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {r.doctorName && `${r.doctorName} · `}
                      {new Date(r.date).toLocaleDateString()}
                    </p>
                    {r.notes && (
                      <p className="mt-1 text-xs text-muted-foreground line-clamp-1">{r.notes}</p>
                    )}
                  </div>
                  <button
                    onClick={() => deleteMutation.mutate(r.id)}
                    disabled={deleteMutation.isPending}
                    className="rounded-md p-2 hover:bg-destructive/10 hover:text-destructive transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </motion.li>
              );
            })
          )}
        </ul>
      </div>
    </PatientShell>
  );
}
