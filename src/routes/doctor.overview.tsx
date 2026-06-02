import { createFileRoute } from "@tanstack/react-router";
import { DoctorDashboard } from "./doctor.dashboard";

export const Route = createFileRoute("/doctor/overview")({
  head: () => ({ meta: [{ title: "Doctor Overview — ClinIQ" }] }),
  component: DoctorDashboard,
});
