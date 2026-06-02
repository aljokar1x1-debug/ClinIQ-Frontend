import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Star, MapPin, Clock, Shield, CheckCircle2 } from "lucide-react";
import { DoctorProfile } from "@/api/doctors";
import { useLanguage } from "@/context/LanguageContext";



export function DoctorCard({ doctor, index = 0 }: { doctor: DoctorProfile; index?: number }) {
  const { lang } = useLanguage();
  const ar = lang === "ar";
  const img = (doctor as any).profileImage || (doctor as any).avatar || "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.04 }}
      whileHover={{
        y: -4,
        boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
        borderColor: "hsl(var(--primary) / 0.4)",
        transition: { duration: 0.2, ease: "easeOut" },
      }}
      className="group relative rounded-xl border border-border bg-card shadow-card overflow-hidden"
    >
      <div className="flex gap-4 p-5">
        {/* صورة الدكتور */}
        <div className="relative shrink-0">
          <img
            src={img}
            alt={doctor.fullName}
            loading="lazy"
            className="h-24 w-24 rounded-xl object-cover"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = "";
              e.currentTarget.style.display = "none";
            }}
          />
          {doctor.isAvailable && (
            <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-card">
              <CheckCircle2 className="h-3.5 w-3.5 text-white" />
            </span>
          )}
        </div>

        {/* المعلومات */}
        <div className="flex flex-1 flex-col gap-1.5 min-w-0">
          {/* اسم + rating */}
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h3 className="font-bold text-base leading-tight truncate">{doctor.fullName}</h3>
                {doctor.isVerified && <Shield className="h-3.5 w-3.5 shrink-0 text-emerald-500" />}
              </div>
              <p className="text-sm font-medium text-primary">
                {ar ? doctor.specialtyAr || doctor.specialty : doctor.specialty}
              </p>
            </div>
            <div className="flex items-center gap-1 shrink-0 rounded-full bg-amber-400/10 px-2 py-0.5">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              <span className="text-xs font-bold">{doctor.rating.toFixed(1)}</span>
              <span className="text-xs text-muted-foreground">({doctor.reviewsCount})</span>
            </div>
          </div>

          {/* التفاصيل */}
          <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
            {doctor.city && (
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3 shrink-0" />
                {doctor.area ? `${doctor.area}, ` : ""}
                {ar ? doctor.cityAr || doctor.city : doctor.city}
              </span>
            )}
            {doctor.yearsOfExperience > 0 && (
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3 shrink-0" />
                {doctor.yearsOfExperience}+ yrs exp
              </span>
            )}
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-1.5">
            {doctor.isVerified && (
              <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-600">
                ✓ Verified
              </span>
            )}
            {doctor.isAvailable && (
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
                ● Available Today
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Footer — Fee + Buttons */}
      <div className="flex items-center justify-between border-t border-border bg-muted/30 px-5 py-3">
        <div>
          <p className="text-[11px] text-muted-foreground">
            {ar ? "رسوم الكشف" : "Consultation fee"}
          </p>
          <p className="text-lg font-black text-primary">
            {doctor.consultationFee} <span className="text-sm font-normal">EGP</span>
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            to="/doctors/$doctorId"
            params={{ doctorId: String(doctor.id) }}
            className="rounded-lg border border-border px-4 py-2 text-xs font-semibold transition-colors duration-150 hover:bg-muted active:scale-95"
          >
            {ar ? "عرض" : "View"}
          </Link>
          <Link
            to="/book/$doctorId"
            params={{ doctorId: String(doctor.id) }}
            className="rounded-lg bg-primary px-5 py-2 text-xs font-bold text-primary-foreground shadow-button transition-all duration-150 hover:opacity-90 active:scale-95"
          >
            {ar ? "احجز الآن" : "Book Now"}
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
