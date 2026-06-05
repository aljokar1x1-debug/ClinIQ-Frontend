import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { Camera, Save, Star, MapPin, Phone, Mail, Award, Clock } from "lucide-react";
import { DoctorShell } from "@/layouts/DoctorShell";
import { useAuth } from "@/context/AuthContext";
import { doctorsApi } from "@/api/doctors";
import api from "@/api/axios";
import { toast } from "sonner";

export const Route = createFileRoute("/doctor/profile")({
  head: () => ({ meta: [{ title: "Profile — ClinIQ Doctor" }] }),
  component: DoctorProfile,
});

function DoctorProfile() {
  const { user, setProfileImage: setGlobalImage } = useAuth();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [doctorId, setDoctorId] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);
  const [data, setData] = useState<any>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem(`profile_image_${user?.userId}`);
    if (saved) setProfileImage(saved);

    const fetchProfile = async () => {
      try {
        const doctors = await doctorsApi.getAll();
        const me = doctors.find((d) => d.email === user?.email);
        if (me) {
          setDoctorId(me.id);
          setData(me);
          if (me.profileImage && !saved) setProfileImage(me.profileImage);
        }
      } catch {}
    };
    fetchProfile();
  }, [user]);

  const handleImageChange = async (file: File) => {
    if (!doctorId) return;
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(file.type)) { toast.error("Only JPG, PNG, WebP allowed"); return; }
    if (file.size > 5 * 1024 * 1024) { toast.error("Max size is 5MB"); return; }
    setUploading(true);
    try {
      const res = await doctorsApi.uploadImage(doctorId, file);
      setProfileImage(res.imageUrl);
      localStorage.setItem(`profile_image_${user?.userId}`, res.imageUrl);
      setGlobalImage(res.imageUrl);
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

      <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
        {/* بطاقة الصورة */}
        <div className="rounded-2xl border border-border bg-card p-6 text-center shadow-card">
          <div className="relative mx-auto h-32 w-32">
            {profileImage ? (
              <img src={profileImage} alt="profile" className="h-32 w-32 rounded-full object-cover ring-4 ring-primary/20" />
            ) : (
              <div className="flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-5xl font-black text-white ring-4 ring-primary/20">
                {user?.fullName?.[0]?.toUpperCase() ?? "D"}
              </div>
            )}
            <button
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="absolute bottom-0 right-0 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white shadow-lg ring-4 ring-card transition hover:bg-primary/90 disabled:opacity-60"
            >
              {uploading
                ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                : <Camera className="h-4 w-4" />}
            </button>
            <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImageChange(f); }} />
          </div>

          <h2 className="mt-4 text-xl font-bold">{user?.fullName}</h2>
          <p className="text-sm text-primary font-semibold">{data?.specialty}</p>

          <div className="mt-2 flex items-center justify-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-accent text-accent" />
            ))}
            <span className="ml-1 text-sm font-bold">{data?.rating?.toFixed(1) ?? "4.9"}</span>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2 border-t border-border pt-4 text-xs">
            <div><p className="font-black text-lg">{data?.reviewsCount ?? 0}</p><p className="text-muted-foreground">Reviews</p></div>
            <div><p className="font-black text-lg">1.2k</p><p className="text-muted-foreground">Patients</p></div>
            <div><p className="font-black text-lg">{data?.yearsOfExperience ?? 0}y</p><p className="text-muted-foreground">Exp</p></div>
          </div>

          {data?.isVerified && (
            <div className="mt-4 rounded-xl bg-accent/10 px-3 py-2 text-xs font-bold text-accent">
              ✓ License Verified
            </div>
          )}
        </div>

        <div className="space-y-6">
          {/* معلومات مهنية */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-bold">
              <Award className="h-5 w-5 text-primary" /> Professional Info
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Full Name" value={data?.fullName ?? user?.fullName ?? ""} />
              <Field label="Specialty" value={data?.specialty ?? ""} />
              <Field label="License Number" value={data?.licenseNumber ?? ""} />
              <Field label="Years of Experience" value={String(data?.yearsOfExperience ?? "")} icon={<Clock className="h-4 w-4" />} />
              <Field label="University" value={data?.university ?? ""} />
              <Field label="Consultation Fee (EGP)" value={String(data?.consultationFee ?? "")} />
            </div>
            <div className="mt-4">
              <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-muted-foreground">About / Bio</label>
              <textarea value={data?.bio ?? ""} readOnly rows={3}
                className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
            </div>
          </div>

          {/* معلومات التواصل */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-bold">
              <MapPin className="h-5 w-5 text-primary" /> Contact & Location
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Email" value={data?.email ?? user?.email ?? ""} icon={<Mail className="h-4 w-4" />} />
              <Field label="Phone" value={data?.phone ?? ""} icon={<Phone className="h-4 w-4" />} />
              <Field label="City" value={data?.city ?? ""} icon={<MapPin className="h-4 w-4" />} />
              <Field label="Area" value={data?.area ?? ""} />
            </div>
          </div>

          <button className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-bold text-primary-foreground shadow-button transition hover:opacity-90">
            <Save className="h-4 w-4" /> Save Changes
          </button>
        </div>
      </div>
    </DoctorShell>
  );
}

function Field({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">
        {icon} {label}
      </label>
      <input value={value} readOnly
        className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
    </div>
  );
}
