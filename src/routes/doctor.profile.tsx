import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { Camera, Save } from "lucide-react";
import { DoctorShell } from "@/layouts/DoctorShell";
import { useAuth } from "@/context/AuthContext";
import api from "@/api/axios";
import { toast } from "sonner";

export const Route = createFileRoute("/doctor/profile")({
  head: () => ({ meta: [{ title: "Profile — ClinIQ Doctor" }] }),
  component: DoctorProfile,
});

function DoctorProfile() {
  const { user } = useAuth();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [doctorId, setDoctorId] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);
  const [data, setData] = useState<any>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/Doctors");
        const all = res.data.items ?? res.data;
        const me = all.find((d: any) => d.email === user?.email);
        if (me) {
          setDoctorId(me.id);
          setProfileImage(me.profileImage);
          setData(me);
        }
      } catch {}
    };
    fetchProfile();
  }, [user]);

  const handleImageChange = async (file: File) => {
    if (!doctorId) return;
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(file.type)) {
      toast.error("Only JPG, PNG, WebP allowed");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Max size is 5MB");
      return;
    }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await api.post(`/Doctors/${doctorId}/upload-image`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setProfileImage(res.data.imageUrl);
      toast.success("Profile image updated!");
    } catch {
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  return (
    <DoctorShell title="Profile">
      <div className="mb-6">
        <h1 className="text-3xl font-black tracking-tight">Doctor Profile</h1>
        <p className="mt-1 text-muted-foreground">Manage your public profile and credentials.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <div className="rounded-2xl border border-border bg-card p-6 text-center shadow-card">
          <div className="relative mx-auto h-32 w-32">
            {profileImage ? (
              <img src={profileImage} alt="profile" className="h-32 w-32 rounded-full object-cover" />
            ) : (
              <div className="flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-5xl font-black text-white">
                {user?.fullName?.[0] ?? "D"}
              </div>
            )}
            <button
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="absolute bottom-0 right-0 flex h-9 w-9 items-center justify-center rounded-full bg-primary text-white ring-4 ring-card disabled:opacity-60"
            >
              <Camera className="h-4 w-4" />
            </button>
            <input
              ref={inputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleImageChange(f);
              }}
            />
          </div>
          <h2 className="mt-4 text-xl font-bold">{user?.fullName}</h2>
          <p className="text-sm text-muted-foreground">{data?.specialty}</p>
          {uploading && <p className="mt-2 text-xs text-primary">Uploading...</p>}
          {data?.isVerified && (
            <div className="mt-3 rounded-full bg-accent/10 px-3 py-1 text-xs font-bold text-accent">✓ License Verified</div>
          )}
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
            <h3 className="mb-4 text-lg font-bold">Professional Info</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { label: "Full Name", value: data?.fullName },
                { label: "Specialty", value: data?.specialty },
                { label: "License Number", value: data?.licenseNumber },
                { label: "Years of Experience", value: data?.yearsOfExperience },
                { label: "Languages", value: "English, Arabic" },
                { label: "Consultation Fee ($)", value: data?.consultationFee },
              ].map(({ label, value }) => (
                <div key={label}>
                  <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-muted-foreground">{label}</label>
                  <input value={value ?? ""} readOnly className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm" />
                </div>
              ))}
              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-muted-foreground">About / Bio</label>
                <textarea value={data?.bio ?? ""} readOnly rows={3} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </DoctorShell>
  );
}
