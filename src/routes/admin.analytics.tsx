import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "@/layouts/AdminShell";
import { LineChart, Line, BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Legend } from "recharts";

export const Route = createFileRoute("/admin/analytics")({
  head: () => ({ meta: [{ title: "Analytics — ClinIQ Admin" }] }),
  component: AdminAnalyticsPage,
});

const traffic = Array.from({ length: 14 }, (_, i) => ({
  day: `D${i + 1}`,
  visits: 800 + Math.round(Math.sin(i / 2) * 300 + i * 40),
  signups: 80 + Math.round(Math.cos(i / 3) * 30 + i * 4),
}));

const sources = [
  { src: "Organic", v: 4200 },
  { src: "Referral", v: 1800 },
  { src: "Social", v: 2400 },
  { src: "Direct", v: 1500 },
  { src: "Ads", v: 3100 },
];

const satisfaction = [
  { metric: "Wait Time", v: 78 },
  { metric: "Doctor", v: 92 },
  { metric: "Booking", v: 88 },
  { metric: "Price", v: 71 },
  { metric: "App UX", v: 85 },
  { metric: "Support", v: 80 },
];

function AdminAnalyticsPage() {
  return (
    <AdminShell title="Analytics">
      <div className="space-y-4">
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="mb-4 font-bold">Traffic & Sign-ups (14 days)</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={traffic}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="visits" stroke="#0ea5e9" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="signups" stroke="#10b981" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="mb-4 font-bold">Traffic Sources</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sources} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="src" />
                  <Tooltip />
                  <Bar dataKey="v" fill="#8b5cf6" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="mb-4 font-bold">Patient Satisfaction Index</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={satisfaction}>
                <PolarGrid />
                <PolarAngleAxis dataKey="metric" />
                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                <Radar dataKey="v" stroke="#0ea5e9" fill="#0ea5e9" fillOpacity={0.4} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
