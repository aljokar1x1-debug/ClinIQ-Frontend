import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AdminShell } from "@/layouts/AdminShell";
import { adminApi } from "@/api/admin";
import { useState } from "react";
import { Search, CheckCircle2, Star, Loader2, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/doctors")({
  head: () => ({ meta: [{ title: "Manage Doctors — ClinIQ Admin" }] }),
  component: AdminDoctorsPage,
});

// Skeleton row
function SkeletonRow() {
  return (
    <tr className="border-t border-border animate-pulse">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-muted" />
          <div className="space-y-1">
            <div className="h-3 w-28 rounded bg-muted" />
            <div className="h-2 w-16 rounded bg-muted" />
          </div>
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="h-3 w-20 rounded bg-muted" />
      </td>
      <td className="px-4 py-3">
        <div className="h-3 w-10 rounded bg-muted" />
      </td>
      <td className="px-4 py-3">
        <div className="h-3 w-14 rounded bg-muted" />
      </td>
      <td className="px-4 py-3">
        <div className="h-5 w-16 rounded-full bg-muted" />
      </td>
      <td className="px-4 py-3">
        <div className="h-7 w-20 rounded bg-muted ml-auto" />
      </td>
    </tr>
  );
}

function AdminDoctorsPage() {
  const queryClient = useQueryClient();
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<"all" | "verified" | "pending">("all");

  const {
    data: doctors,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["admin-doctors"],
    queryFn: adminApi.getAllDoctors,
    staleTime: 30_000,
  });

  const verifyMutation = useMutation({
    mutationFn: (id: number) => adminApi.verifyDoctor(id),
    onSuccess: (_, id) => {
      toast.success("Doctor verified successfully");
      // بنعمل update للداتا محلياً بدون ما نعمل refetch كامل
      queryClient.setQueryData(["admin-doctors"], (old: typeof doctors) =>
        old?.map((d) => (d.id === id ? { ...d, isVerified: true } : d)),
      );
    },
    onError: () => toast.error("Failed to verify doctor"),
  });

  const list = (doctors ?? []).filter((d) => {
    if (
      q &&
      !d.fullName.toLowerCase().includes(q.toLowerCase()) &&
      !d.specialty.toLowerCase().includes(q.toLowerCase())
    )
      return false;
    if (filter === "verified" && !d.isVerified) return false;
    if (filter === "pending" && d.isVerified) return false;
    return true;
  });

  return (
    <AdminShell title="Doctor Management">
      <div className="space-y-4">
        {/* Search + Filter */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search doctors or specialty..."
              className="h-10 w-full rounded-md border border-border bg-card pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>
          <div className="flex gap-1 rounded-md border border-border bg-card p-1">
            {(["all", "verified", "pending"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded px-3 py-1.5 text-xs font-bold capitalize ${
                  filter === f
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Error */}
        {isError && (
          <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-center text-sm text-destructive">
            فشل تحميل الدكاترة — تأكد إن الـ API شغال
          </div>
        )}

        {/* Table */}
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Doctor</th>
                <th className="px-4 py-3">Specialty</th>
                <th className="px-4 py-3">Rating</th>
                <th className="px-4 py-3">Fee</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)
              ) : list.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-sm text-muted-foreground">
                    No doctors found
                  </td>
                </tr>
              ) : (
                list.map((d, i) => (
                  <motion.tr
                    key={d.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.02 }}
                    className="border-t border-border hover:bg-muted/30 transition-colors"
                  >
                    {/* Doctor info */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                          {d.fullName
                            .split(" ")
                            .map((n) => n[0])
                            .slice(0, 2)
                            .join("")}
                        </div>
                        <div>
                          <p className="font-bold">{d.fullName}</p>
                          <p className="text-xs text-muted-foreground">{d.city ?? "—"}</p>
                        </div>
                      </div>
                    </td>

                    {/* Specialty */}
                    <td className="px-4 py-3 text-muted-foreground">{d.specialty}</td>

                    {/* Rating */}
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1 font-semibold">
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                        {d.rating?.toFixed(1) ?? "0.0"}
                      </span>
                    </td>

                    {/* Fee */}
                    <td className="px-4 py-3 font-semibold">{d.consultationFee} EGP</td>

                    {/* Status */}
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-bold ${
                          d.isVerified
                            ? "bg-emerald-500/10 text-emerald-600"
                            : "bg-amber-500/10 text-amber-600"
                        }`}
                      >
                        {d.isVerified ? (
                          <>
                            <ShieldCheck className="h-3 w-3" /> Verified
                          </>
                        ) : (
                          "Pending"
                        )}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        {!d.isVerified && (
                          <button
                            onClick={() => verifyMutation.mutate(d.id)}
                            disabled={verifyMutation.isPending}
                            className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 px-3 py-1.5 text-xs font-bold text-emerald-600 hover:bg-emerald-500/20 disabled:opacity-50 transition-colors"
                          >
                            {verifyMutation.isPending ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <CheckCircle2 className="h-3 w-3" />
                            )}
                            Verify
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
        {!isLoading && doctors && (
          <p className="text-xs text-muted-foreground">
            Showing {list.length} of {doctors.length} doctors
            {" · "}
            {doctors.filter((d) => d.isVerified).length} verified
            {" · "}
            {doctors.filter((d) => !d.isVerified).length} pending
          </p>
        )}
      </div>
    </AdminShell>
  );
}
