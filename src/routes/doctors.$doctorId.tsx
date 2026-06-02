import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  Star, MapPin, Clock, GraduationCap, Shield, ArrowLeft,
  Calendar, Share2, Loader2, MessageSquare, CheckCircle,
  Banknote, Phone, Video, Home, Languages, Award,
} from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { doctorsApi } from "@/api/doctors";
import { reviewsApi } from "@/api/reviews";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";


export const Route = createFileRoute("/doctors/$doctorId")({
  head: () => ({ meta: [{ title: "Doctor Profile — ClinIQ" }] }),
  component: DoctorProfile,
});

/* ── helpers ── */
function StarRow({ value, size = "sm" }: { value: number; size?: "sm" | "lg" }) {
  const s = size === "lg" ? "h-5 w-5" : "h-3.5 w-3.5";
  return (
    <span className="flex">
      {Array.from({ length: 5 }).map((_, j) => (
        <Star key={j} className={`${s} ${j < Math.round(value) ? "fill-amber-400 text-amber-400" : "text-border"}`} />
      ))}
    </span>
  );
}

function Badge({ children, variant = "default" }: { children: React.ReactNode; variant?: "default" | "success" | "info" }) {
  const colors = {
    default: "bg-muted text-foreground",
    success: "bg-emerald-500/10 text-emerald-500",
    info:    "bg-primary/10 text-primary",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${colors[variant]}`}>
      {children}
    </span>
  );
}

function Card({ title, children, className = "" }: { title?: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-xl border border-border bg-card p-5 ${className}`}>
      {title && <h2 className="mb-4 font-bold text-base">{title}</h2>}
      {children}
    </div>
  );
}

/* ── Skeleton ── */
function ProfileSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-64 rounded-2xl bg-muted" />
      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        <div className="space-y-4">
          <div className="h-40 rounded-xl bg-muted" />
          <div className="h-32 rounded-xl bg-muted" />
          <div className="h-48 rounded-xl bg-muted" />
        </div>
        <div className="space-y-4">
          <div className="h-52 rounded-xl bg-muted" />
          <div className="h-28 rounded-xl bg-muted" />
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   MAIN
══════════════════════════════════════════════ */
function DoctorProfile() {
  const { doctorId } = Route.useParams();
  const { user } = useAuth();
  const { lang } = useLanguage();
  const ar = lang === "ar";
  const queryClient = useQueryClient();
  const id = parseInt(doctorId);

  const { data: doctor, isLoading: docLoading, isError } = useQuery({
    queryKey: ["doctor", id],
    queryFn: () => doctorsApi.getById(id),
    enabled: !isNaN(id),
  });

  const { data: reviews, isLoading: revLoading } = useQuery({
    queryKey: ["reviews", id],
    queryFn: () => reviewsApi.getDoctorReviews(id),
    enabled: !isNaN(id),
  });

  const [rating, setRating]   = useState(0);
  const [comment, setComment] = useState("");
  const [hovered, setHovered] = useState(0);

  const reviewMutation = useMutation({
    mutationFn: () => reviewsApi.addReview({ doctorId: id, rating, comment }),
    onSuccess: () => {
      toast.success("Review added!");
      setRating(0); setComment("");
      queryClient.invalidateQueries({ queryKey: ["reviews", id] });
      queryClient.invalidateQueries({ queryKey: ["doctor", id] });
    },
    onError: (err: any) => toast.error(err?.response?.data?.message ?? "Failed to add review"),
  });

  /* ── States ── */
  if (docLoading) return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 h-5 w-32 rounded bg-muted animate-pulse" />
        <ProfileSkeleton />
      </main>
    </div>
  );

  if (isError || !doctor) return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex flex-col items-center justify-center py-40 gap-4">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
          <MapPin className="h-8 w-8 text-muted-foreground" />
        </div>
        <p className="text-lg font-bold">{ar ? "لم يتم العثور على الطبيب" : "Doctor not found"}</p>
        <Link to="/search" className="rounded-md bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground">
          {ar ? "← العودة للبحث" : "← Back to search"}
        </Link>
      </div>
    </div>
  );

  const avatar = (doctor as any).profileImage || (doctor as any).avatar || "";
  const initials = doctor.fullName.split(" ").map((n: string) => n[0]).slice(0, 2).join("").toUpperCase();

  /* next available slots (mock — replace with real API when ready) */
  const slots = ["9:00 AM", "10:30 AM", "2:00 PM", "4:30 PM"];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">

        {/* Back */}
        <Link to="/search"
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft className="h-4 w-4" />
          {ar ? "العودة للنتائج" : "Back to results"}
        </Link>

        {/* ── Hero Card ── */}
        <motion.section
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          className="overflow-hidden rounded-2xl border border-border bg-card shadow-card mb-6"
        >
          {/* subtle header band */}
          <div className="h-3 bg-primary" />

          <div className="p-6 sm:p-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start">

              {/* Avatar */}
              <div className="relative shrink-0">
                {avatar ? (
                  <img src={avatar} alt={doctor.fullName}
                    className="h-28 w-28 rounded-2xl object-cover ring-4 ring-border sm:h-32 sm:w-32" />
                ) : (
                  <div className="flex h-28 w-28 items-center justify-center rounded-2xl bg-primary/10 text-3xl font-black text-primary ring-4 ring-border sm:h-32 sm:w-32">
                    {initials}
                  </div>
                )}
                {doctor.isVerified && (
                  <div className="absolute -bottom-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-card"
                    title="Verified">
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-black tracking-tight sm:text-3xl">{doctor.fullName}</h1>
                    <p className="mt-0.5 font-semibold text-primary">{doctor.specialty}</p>
                    {(doctor.area || doctor.city) && (
                      <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5" />
                        {[doctor.area, doctor.city].filter(Boolean).join(", ")}
                      </p>
                    )}
                  </div>
                  <Link to="/book/$doctorId" params={{ doctorId }}
                    className="shrink-0 rounded-lg bg-primary px-6 py-3 font-bold text-primary-foreground shadow-button hover:opacity-90 transition-opacity">
                    {ar ? "احجز موعد" : "Book Appointment"}
                  </Link>
                </div>

                {/* Stats badges */}
                <div className="mt-4 flex flex-wrap gap-2">
                  <Badge>
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    {doctor.rating.toFixed(1)} ({doctor.reviewsCount} {ar ? "تقييم" : "reviews"})
                  </Badge>
                  {doctor.yearsOfExperience > 0 && (
                    <Badge><Clock className="h-3.5 w-3.5" />{doctor.yearsOfExperience}+ {ar ? "سنة خبرة" : "yrs exp"}</Badge>
                  )}
                  {doctor.isVerified && (
                    <Badge variant="success"><Shield className="h-3.5 w-3.5" />{ar ? "موثق" : "Verified"}</Badge>
                  )}
                  {(doctor as any).videoConsult && (
                    <Badge variant="info"><Video className="h-3.5 w-3.5" />{ar ? "كشف أونلاين" : "Video consult"}</Badge>
                  )}
                  {(doctor as any).homeVisit && (
                    <Badge variant="info"><Home className="h-3.5 w-3.5" />{ar ? "زيارة منزلية" : "Home visit"}</Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        <div className="grid gap-6 lg:grid-cols-[1fr_300px]">

          {/* ── Left column ── */}
          <div className="space-y-6">

            {/* About */}
            {doctor.bio && (
              <Card title={ar ? "عن الطبيب" : "About"}>
                <p className="text-sm leading-relaxed text-muted-foreground">{doctor.bio}</p>
              </Card>
            )}

            {/* Education */}
            {doctor.university && (
              <Card title={ar ? "التعليم والتدريب" : "Education & Training"}>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <GraduationCap className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold">{doctor.university}</p>
                      <p className="text-sm text-muted-foreground">{ar ? "دكتوراه في الطب" : "Doctor of Medicine (MD)"}</p>
                    </div>
                  </div>
                  {doctor.licenseNumber && (
                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10">
                        <Award className="h-5 w-5 text-emerald-500" />
                      </div>
                      <div>
                        <p className="font-semibold">{ar ? "ترخيص طبي" : "Medical License"}</p>
                        <p className="text-sm font-mono text-muted-foreground">{doctor.licenseNumber}</p>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            )}

            {/* Languages */}
            {(doctor as any).languages?.length > 0 && (
              <Card title={ar ? "اللغات" : "Languages"}>
                <div className="flex flex-wrap gap-2">
                  {(doctor as any).languages.map((l: string) => (
                    <span key={l} className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-xs font-semibold">
                      <Languages className="h-3.5 w-3.5 text-primary" />{l}
                    </span>
                  ))}
                </div>
              </Card>
            )}

            {/* Reviews */}
            <Card title={`${ar ? "التقييمات" : "Reviews"} (${doctor.reviewsCount})`}>
              {revLoading ? (
                <div className="flex justify-center py-6">
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                </div>
              ) : reviews && reviews.length > 0 ? (
                <div className="space-y-4">
                  {reviews.map((r: any) => (
                    <div key={r.id} className="rounded-lg border border-border p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                            {r.patientName?.[0] ?? "P"}
                          </div>
                          <p className="font-semibold text-sm">{r.patientName}</p>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {new Date(r.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <StarRow value={r.rating} />
                      <p className="mt-2 text-sm text-muted-foreground">{r.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center py-8 gap-2">
                  <Star className="h-10 w-10 text-border" />
                  <p className="text-sm text-muted-foreground">
                    {ar ? "لا توجد تقييمات بعد — كن الأول!" : "No reviews yet — be the first!"}
                  </p>
                </div>
              )}

              {/* Add review */}
              {user?.role === "Patient" && (
                <div className="mt-6 border-t border-border pt-6">
                  <h3 className="mb-3 font-bold text-sm">{ar ? "أضف تقييمك" : "Leave a Review"}</h3>
                  <div className="flex gap-1 mb-3">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <button key={j} onMouseEnter={() => setHovered(j+1)} onMouseLeave={() => setHovered(0)} onClick={() => setRating(j+1)}>
                        <Star className={`h-6 w-6 transition-colors ${j < (hovered||rating) ? "fill-amber-400 text-amber-400" : "text-border"}`} />
                      </button>
                    ))}
                    {rating > 0 && <span className="ml-2 text-sm text-muted-foreground">{rating}/5</span>}
                  </div>
                  <textarea value={comment} onChange={(e) => setComment(e.target.value)}
                    placeholder={ar ? "شاركنا تجربتك..." : "Share your experience..."}
                    rows={3}
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none" />
                  <button onClick={() => reviewMutation.mutate()}
                    disabled={rating === 0 || !comment.trim() || reviewMutation.isPending}
                    className="mt-2 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-bold text-primary-foreground hover:opacity-90 disabled:opacity-50">
                    {reviewMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                    {ar ? "إرسال التقييم" : "Submit Review"}
                  </button>
                </div>
              )}
            </Card>
          </div>

          {/* ── Sidebar ── */}
          <aside className="space-y-4">

            {/* Fee + Book */}
            <Card>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-muted-foreground">{ar ? "رسوم الكشف" : "Consultation Fee"}</span>
                {doctor.isAvailable && (
                  <span className="flex items-center gap-1 text-xs font-semibold text-emerald-500">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    {ar ? "متاح" : "Available"}
                  </span>
                )}
              </div>
              <div className="text-3xl font-black text-primary mb-1">
                {doctor.consultationFee} <span className="text-base font-semibold text-muted-foreground">EGP</span>
              </div>
              <p className="text-xs text-muted-foreground mb-4">
                <Banknote className="inline h-3.5 w-3.5 mr-1" />
                {ar ? "الدفع في العيادة" : "Pay at the clinic"}
              </p>
              <Link to="/book/$doctorId" params={{ doctorId }}
                className="flex items-center justify-center gap-2 w-full rounded-lg bg-primary py-3 font-bold text-primary-foreground shadow-button hover:opacity-90 transition-opacity">
                <Calendar className="h-4 w-4" />
                {ar ? "احجز الآن" : "Book Now"}
              </Link>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <button onClick={() => toast.info(ar ? "قريباً" : "Coming soon")}
                  className="flex items-center justify-center gap-1.5 rounded-lg border border-border py-2 text-xs font-semibold hover:bg-muted transition-colors">
                  <MessageSquare className="h-3.5 w-3.5" />{ar ? "رسالة" : "Message"}
                </button>
                <button onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success(ar ? "تم نسخ الرابط" : "Link copied!"); }}
                  className="flex items-center justify-center gap-1.5 rounded-lg border border-border py-2 text-xs font-semibold hover:bg-muted transition-colors">
                  <Share2 className="h-3.5 w-3.5" />{ar ? "مشاركة" : "Share"}
                </button>
              </div>
            </Card>

            {/* Next available slots */}
            <Card title={ar ? "أقرب مواعيد متاحة" : "Next available slots"}>
              <div className="grid grid-cols-2 gap-2">
                {slots.map((s) => (
                  <Link key={s} to="/book/$doctorId" params={{ doctorId }}
                    className="flex items-center justify-center gap-1 rounded-lg border border-border py-2 text-xs font-semibold hover:border-primary hover:bg-primary/5 transition-all">
                    <Clock className="h-3 w-3 text-primary" />{s}
                  </Link>
                ))}
              </div>
              <p className="mt-2 text-center text-xs text-muted-foreground">
                {ar ? "اليوم" : "Today"} · {slots.length} {ar ? "مواعيد" : "slots left"}
              </p>
            </Card>

            {/* Contact */}
            {(doctor as any).phone && (
              <Card title={ar ? "التواصل" : "Contact"}>
                <a href={`tel:${(doctor as any).phone}`}
                  className="flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
                  <Phone className="h-4 w-4" />{(doctor as any).phone}
                </a>
              </Card>
            )}

            {/* Verification */}
            {doctor.isVerified && (
              <Card>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-500/10">
                    <Shield className="h-5 w-5 text-emerald-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{ar ? "موثق من ClinIQ" : "Verified by ClinIQ"}</p>
                    <p className="text-xs text-muted-foreground">{ar ? "تم التحقق من الوثائق الطبية" : "Medical credentials verified"}</p>
                  </div>
                </div>
              </Card>
            )}
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  );
}
