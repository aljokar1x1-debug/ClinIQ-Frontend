import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { Camera, Save, User, Phone, Mail, Calendar, Heart, Ruler, Weight } from "lucide-react";
import { PatientShell } from "@/layouts/PatientShell";
import { useAuth } from "@/context/AuthContext";
import api from "@/api/axios";
import { toast } from "sonner";

export const Route = createFileRoute("/patient/profile")({
  head: () => ({ meta: [{ title: "Profile — ClinIQ" }] }),
  component: PatientProfile,
});

function PatientProfile() {
  const { user, setProfileImage: setGlobalImage } = useAuth();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // جيب الصورة من localStorage لو موجودة
  useEffect(() => {
    const saved = localStorage.getItem(`profile_image_${user?.userId}`);
    if (saved) setProfileImage(saved);
  }, [user?.userId]);

  const handleImageChange = async (file: File) => {
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(file.type)) { toast.error("Only JPG, PNG, WebP allowed"); return; }
    if (file.size > 5 * 1024 * 1024) { toast.error("Max size is 5MB"); return; }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await api.post("/Auth/upload-image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const url = res.data.imageUrl;
      setProfileImage(url);
      localStorage.setItem(`profile_image_${user?.userId}`, url);
      setGlobalImage(url);
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

      <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
        {/* بطاقة الصورة */}
        <div className="rounded-2xl border border-border bg-card p-6 text-center shadow-card">
          <div className="relative mx-auto h-32 w-32">
            {profileImage ? (
              <img src={profileImage} alt="profile" className="h-32 w-32 rounded-full object-cover ring-4 ring-primary/20" />
            ) : (
              <div className="flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-5xl font-black text-white ring-4 ring-primary/20">
                {user?.fullName?.[0]?.toUpperCase() ?? "?"}
              </div>
            )}
            <button
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="absolute bottom-0 right-0 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white shadow-lg ring-4 ring-card transition hover:bg-primary/90 disabled:opacity-60"
            >
              {uploading ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> : <Camera className="h-4 w-4" />}
            </button>
            <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImageChange(f); }} />
          </div>
          <h2 className="mt-4 text-xl font-bold">{user?.fullName}</h2>
          <p className="text-sm text-muted-foreground">{user?.email}</p>
          <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            <User className="h-3 w-3" /> Patient
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2 border-t border-border pt-4 text-xs">
            <div><p className="font-black text-lg">12</p><p className="text-muted-foreground">Visits</p></div>
            <div><p className="font-black text-lg">5</p><p className="text-muted-foreground">Records</p></div>
            <div><p className="font-black text-lg text-accent">★ 5.0</p><p className="text-muted-foreground">Rating</p></div>
          </div>
        </div>

        <div className="space-y-6">
          {/* معلومات شخصية */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
            <h3 className="mb-4 text-lg font-bold flex items-center gap-2"><User className="h-5 w-5 text-primary" /> Personal Information</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Full Name" value={user?.fullName ?? ""} icon={<User className="h-4 w-4" />} />
              <Field label="Email" value={user?.email ?? ""} icon={<Mail className="h-4 w-4" />} />
              <Field label="Phone" value="+20 100 123 4567" icon={<Phone className="h-4 w-4" />} />
              <Field label="Date of Birth" value="1992-04-12" icon={<Calendar className="h-4 w-4" />} />
              <Field label="Gender" value="Female" />
              <Field label="Emergency Contact" value="John Doe — +20 100 999 1111" />
            </div>
          </div>

          {/* معلومات طبية */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
            <h3 className="mb-4 text-lg font-bold flex items-center gap-2"><Heart className="h-5 w-5 text-red-500" /> Medical Information</h3>
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Blood Type" value="O+" icon={<Heart className="h-4 w-4" />} />
              <Field label="Height (cm)" value="168" icon={<Ruler className="h-4 w-4" />} />
              <Field label="Weight (kg)" value="62" icon={<Weight className="h-4 w-4" />} />
              <Field label="Allergies" value="Penicillin" />
              <Field label="Conditions" value="None" />
            </div>
          </div>

          <button className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-bold text-primary-foreground shadow-button transition hover:opacity-90">
            <Save className="h-4 w-4" /> Save Changes
          </button>
        </div>
      </div>
    </PatientShell>
  );
}

function Field({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">
        {icon} {label}
      </label>
      <input value={value} readOnly className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
    </div>
  );
}
