import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PatientShell } from "@/layouts/PatientShell";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Calendar, AlertCircle, Check, Trash2, Loader2, CheckCheck } from "lucide-react";
import { notificationsApi, Notification } from "@/api/notifications";
import { toast } from "sonner";
import { useState } from "react";

export const Route = createFileRoute("/notifications")({
  head: () => ({ meta: [{ title: "Notifications — ClinIQ" }] }),
  component: NotificationsPage,
});

const TYPE_STYLE = {
  success: "bg-emerald-500/10 text-emerald-600",
  warning: "bg-amber-500/10 text-amber-600",
  info: "bg-primary/10 text-primary",
} as const;

const TYPE_ICON = {
  success: CheckCheck,
  warning: AlertCircle,
  info: Calendar,
} as const;

function SkeletonItem() {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-border bg-card p-4 animate-pulse">
      <div className="h-10 w-10 rounded-lg bg-muted shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-3 w-40 rounded bg-muted" />
        <div className="h-2 w-64 rounded bg-muted" />
        <div className="h-2 w-20 rounded bg-muted" />
      </div>
    </div>
  );
}

function NotificationsPage() {
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<"all" | "unread">("all");

  const { data: notifications, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: notificationsApi.getAll,
    staleTime: 30_000,
  });

  const markReadMutation = useMutation({
    mutationFn: (id: number) => notificationsApi.markAsRead(id),
    onSuccess: (_, id) => {
      queryClient.setQueryData(["notifications"], (old: Notification[] | undefined) =>
        old?.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
      );
    },
  });

  const markAllMutation = useMutation({
    mutationFn: notificationsApi.markAllAsRead,
    onSuccess: () => {
      queryClient.setQueryData(["notifications"], (old: Notification[] | undefined) =>
        old?.map((n) => ({ ...n, isRead: true })),
      );
      toast.success("All marked as read");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => notificationsApi.delete(id),
    onSuccess: (_, id) => {
      queryClient.setQueryData(["notifications"], (old: Notification[] | undefined) =>
        old?.filter((n) => n.id !== id),
      );
      toast.success("Notification deleted");
    },
  });

  const unreadCount = notifications?.filter((n) => !n.isRead).length ?? 0;

  const list = (notifications ?? []).filter((n) => (tab === "unread" ? !n.isRead : true));

  return (
    <PatientShell title="Notifications">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h2 className="flex items-center gap-2 text-2xl font-black">
              <Bell className="h-6 w-6" /> Notifications
            </h2>
            <p className="text-sm text-muted-foreground">
              Stay updated on appointments and activity.
            </p>
          </div>
          <button
            onClick={() => markAllMutation.mutate()}
            disabled={!unreadCount || markAllMutation.isPending}
            className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-xs font-bold hover:bg-muted disabled:opacity-50"
          >
            {markAllMutation.isPending ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <CheckCheck className="h-3 w-3" />
            )}
            Mark all as read
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 rounded-md border border-border bg-card p-1 w-fit">
          <button
            onClick={() => setTab("all")}
            className={`rounded px-3 py-1.5 text-xs font-bold ${tab === "all" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}
          >
            All ({notifications?.length ?? 0})
          </button>
          <button
            onClick={() => setTab("unread")}
            className={`rounded px-3 py-1.5 text-xs font-bold ${tab === "unread" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}
          >
            Unread {unreadCount > 0 && `(${unreadCount})`}
          </button>
        </div>

        {/* List */}
        <div className="space-y-2">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => <SkeletonItem key={i} />)
          ) : (
            <AnimatePresence initial={false}>
              {list.length === 0 ? (
                <div className="rounded-xl border border-dashed border-border bg-card p-12 text-center text-muted-foreground">
                  <Bell className="mx-auto h-10 w-10 opacity-40" />
                  <p className="mt-3 text-sm">You're all caught up 🎉</p>
                </div>
              ) : (
                list.map((n) => {
                  const Icon = TYPE_ICON[n.type] ?? Bell;
                  const style = TYPE_STYLE[n.type] ?? TYPE_STYLE.info;
                  return (
                    <motion.div
                      key={n.id}
                      layout
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className={`group flex items-start gap-3 rounded-xl border border-border p-4 transition-colors ${!n.isRead ? "bg-primary/5" : "bg-card"}`}
                    >
                      <span
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${style}`}
                      >
                        <Icon className="h-5 w-5" />
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-bold">{n.title}</p>
                          {!n.isRead && (
                            <span className="h-2 w-2 rounded-full bg-primary shrink-0" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{n.message}</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {new Date(n.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex flex-col gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                        {!n.isRead && (
                          <button
                            onClick={() => markReadMutation.mutate(n.id)}
                            className="rounded-md p-1.5 hover:bg-muted"
                            title="Mark as read"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          onClick={() => deleteMutation.mutate(n.id)}
                          className="rounded-md p-1.5 hover:bg-destructive/10 hover:text-destructive"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </AnimatePresence>
          )}
        </div>
      </div>
    </PatientShell>
  );
}
