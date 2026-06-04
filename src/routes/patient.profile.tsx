import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { Camera, Save } from "lucide-react";
import { PatientShell } from "@/layouts/PatientShell";
import { useAuth } from "@/context/AuthContext";
import api from "@/api/axios";
import { toast } from "sonner";

export const Route = createFileRoute("/patient/profile")({
  head: () => ({ meta: [{ title: "Profile — ClinIQ" }] }),
  component: PatientProfile,
});

function PatientProfile() {
  const { user } = useAuth();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = async (file: File) => {
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
      const res = await api.post("/Auth/upload-image", formData, {
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
    <PatientShell title="Profile">
      <div className="mb-6">
        <h1 className="text-3xl font-black tracking-tight">My Profile</h1>
        <p className="mt-1 text-muted-foreground">Manage your personal and medical information.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <div className="rounded-2xl border border-border bg-card p-6 text-center shadow-card">
          <div className="relative mx-auto h-32 w-32">
            {profileImage ? (
              <img src={profileImage} alt="profile" className="h-32 w-32 rounded-full object-cover" />
            ) : (
              <div className="flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-5xl font-black text-white">
                {user?.fullName?.[0] ?? "?"}
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
          <p className="text-sm text-muted-foreground">{user?.email}</p>
          {uploading && <p className="mt-2 text-xs text-primary">Uploading...</p>}
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
            <h3 className="mb-4 text-lg font-bold">Personal Information</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-muted-foreground">Full Name</label>
                <input value={user?.fullName ?? ""} readOnly className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-muted-foreground">Email</label>
                <input value={user?.email ?? ""} readOnly className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </PatientShell>
  );
}
