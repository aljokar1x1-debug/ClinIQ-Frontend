import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AdminShell } from "@/layouts/AdminShell";
import { adminApi, AdminUser } from "@/api/admin";
import { useState } from "react";
import { Search, Mail, Phone, UserCheck, UserX, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

export const Route = createFileRoute("/admin/patients")({
  head: () => ({ meta: [{ title: "Patients — ClinIQ Admin" }] }),
  component: AdminPatientsPage,
});

// Skeleton card
function SkeletonCard() {
  return (
    <div className="rounded-xl border border-border bg-card p-4 animate-pulse">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-muted" />
          <div className="space-y-2">
            <div className="h-3 w-28 rounded bg-muted" />
            <div className="h-2 w-20 rounded bg-muted" />
          </div>
        </div>
        <div className="h-5 w-14 rounded-full bg-muted" />
      </div>
      <div className="mt-3 space-y-2">
        <div className="h-2 w-40 rounded bg-muted" />
        <div className="h-2 w-32 rounded bg-muted" />
      </div>
      <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
        <div className="h-2 w-16 rounded bg-muted" />
        <div className="h-6 w-20 rounded bg-muted" />
      </div>
    </div>
  );
}

function AdminPatientsPage() {
  const queryClient = useQueryClient();
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "inactive">("all");

  const {
    data: users,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["admin-users"],
    queryFn: adminApi.getUsers,
    staleTime: 30_000,
  });

  const toggleMutation = useMutation({
    mutationFn: (id: number) => adminApi.toggleUser(id),
    onSuccess: (_, id) => {
      queryClient.setQueryData(["admin-users"], (old: AdminUser[] | undefined) =>
        old?.map((u) => (u.id === id ? { ...u, isActive: !u.isActive } : u)),
      );
      toast.success("User status updated");
    },
    onError: () => toast.error("Failed to update user status"),
  });

  // فلتر Patients بس (مش Admins أو Doctors)
  const patients = (users ?? []).filter((u) => u.role === "Patient");

  const list = patients.filter((p) => {
    if (
      q &&
      !p.fullName.toLowerCase().includes(q.toLowerCase()) &&
      !p.email.toLowerCase().includes(q.toLowerCase())
    )
      return false;
    if (filter === "active" && !p.isActive) return false;
    if (filter === "inactive" && p.isActive) return false;
    return true;
  });

  return (
    <AdminShell title="Patient Directory">
      <div className="space-y-4">
        {/* Search + Filter */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by name or email..."
              className="h-10 w-full rounded-md border border-border bg-card pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>
          <div className="flex gap-1 rounded-md border border-border bg-card p-1">
            {(["all", "active", "inactive"] as const).map((f) => (
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
            فشل تحميل المرضى — تأكد إن الـ API شغال
          </div>
        )}

        {/* Cards Grid */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
          ) : list.length === 0 ? (
            <div className="col-span-3 py-12 text-center text-sm text-muted-foreground">
              No patients found
            </div>
          ) : (
            list.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="rounded-xl border border-border bg-card p-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-bold text-primary text-sm">
                      {p.fullName
                        .split(" ")
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join("")}
                    </div>
                    <div>
                      <p className="font-bold">{p.fullName}</p>
                      <p className="text-xs text-muted-foreground">
                        Joined {new Date(p.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      p.isActive
                        ? "bg-emerald-500/10 text-emerald-600"
                        : "bg-destructive/10 text-destructive"
                    }`}
                  >
                    {p.isActive ? "Active" : "Inactive"}
                  </span>
                </div>

                <div className="mt-3 space-y-1 text-xs text-muted-foreground">
                  <p className="flex items-center gap-2">
                    <Mail className="h-3 w-3 shrink-0" />
                    <span className="truncate">{p.email}</span>
                  </p>
                  {p.phone && (
                    <p className="flex items-center gap-2">
                      <Phone className="h-3 w-3 shrink-0" /> {p.phone}
                    </p>
                  )}
                </div>

                <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
                  <span className="text-xs text-muted-foreground capitalize">{p.role}</span>
                  <button
                    onClick={() => toggleMutation.mutate(p.id)}
                    disabled={toggleMutation.isPending}
                    className={`inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-xs font-bold transition-colors disabled:opacity-50 ${
                      p.isActive
                        ? "bg-destructive/10 text-destructive hover:bg-destructive/20"
                        : "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20"
                    }`}
                  >
                    {toggleMutation.isPending ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : p.isActive ? (
                      <>
                        <UserX className="h-3 w-3" /> Deactivate
                      </>
                    ) : (
                      <>
                        <UserCheck className="h-3 w-3" /> Activate
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Count */}
        {!isLoading && patients.length > 0 && (
          <p className="text-xs text-muted-foreground">
            Showing {list.length} of {patients.length} patients
            {" · "}
            {patients.filter((p) => p.isActive).length} active
            {" · "}
            {patients.filter((p) => !p.isActive).length} inactive
          </p>
        )}
      </div>
    </AdminShell>
  );
}
