import { createFileRoute } from "@tanstack/react-router";
import { AdminDashboardPage } from "./admin.dashboard";

export const Route = createFileRoute("/admin/overview")({
  head: () => ({ meta: [{ title: "Admin Overview — ClinIQ" }] }),
  component: AdminDashboardPage,
});
