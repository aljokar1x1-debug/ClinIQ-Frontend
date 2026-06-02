import { motion } from "framer-motion";
import { MapPin, Star, ArrowRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { doctorsApi, DoctorProfile } from "@/api/doctors";

import { DOCTORS } from "@/data/doctors";

// fallback لو الصورة مش موجودة
const FALLBACK_IMAGE = "https://i.pinimg.com/736x/4a/de/6d/4ade6d2a43e9bdf4cb20cf1dc05def79.jpg";

function DoctorSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-surface p-6 shadow-card animate-pulse">
      <div className="flex items-start gap-4">
        <div className="h-20 w-20 shrink-0 rounded-full bg-muted" />
        <div className="flex-1 space-y-2 pt-1">
          <div className="h-5 w-16 rounded-full bg-muted" />
          <div className="h-4 w-32 rounded bg-muted" />
          <div className="h-3 w-24 rounded bg-muted" />
        </div>
      </div>
      <div className="mt-4 h-3 w-28 rounded bg-muted" />
      <div className="mt-2 h-3 w-20 rounded bg-muted" />
      <div className="mt-5 h-10 w-full rounded-md bg-muted" />
    </div>
  );
}

export function TopDoctors() {
  const { t, lang } = useLanguage();
  const ar = lang === "ar";

  const { data, isLoading } = useQuery({
    queryKey: ["top-doctors"],
    queryFn: () => doctorsApi.getAll({ isAvailable: true }),
    staleTime: 60_000,
    select: (data) => data.slice(0, 3),
  });

  const doctors = data ?? [];

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center"
      >
        <h2 className="text-4xl font-black tracking-tight sm:text-5xl">{t("doctors.title")}</h2>
        <p className="mt-3 text-muted-foreground">{t("doctors.subtitle")}</p>
      </motion.div>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => <DoctorSkeleton key={i} />)
          : doctors.map((d, i) => (
              <motion.div
                key={d.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -6 }}
                className="rounded-xl border border-border bg-surface p-6 shadow-card transition-shadow hover:shadow-glow"
              >
                <div className="flex items-start gap-4">
                  <img
                    src={
                      d.profileImage ||
                      DOCTORS.find((m) => m.name.toLowerCase() === d.fullName?.toLowerCase())?.avatar ||
                      FALLBACK_IMAGE
                    }
                    alt={d.fullName}
                    loading="lazy"
                    className="h-20 w-20 shrink-0 rounded-full object-cover ring-4 ring-primary/20"
                  />
                  <div className="flex-1">
                    <span className="inline-flex items-center gap-1 rounded-pill bg-accent/15 px-2.5 py-0.5 text-xs font-semibold text-accent">
                      ● {t("doctors.available")}
                    </span>
                    <h3 className="mt-2 font-bold">{d.fullName}</h3>
                    <p className="text-sm text-primary">
                      {ar ? d.specialtyAr || d.specialty : d.specialty}
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  {d.area && `${d.area}, `}
                  {ar ? d.cityAr || d.city : d.city}
                </div>
                <div className="mt-2 flex items-center gap-2 text-sm font-medium">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  {d.rating.toFixed(1)}
                  <span className="text-muted-foreground">({d.reviewsCount} reviews)</span>
                </div>
                <div className="mt-5 flex gap-2">
                  <Link
                    to="/doctors/$doctorId"
                    params={{ doctorId: String(d.id) }}
                    className="flex flex-1 items-center justify-center gap-1 rounded-md border border-border py-2.5 text-sm font-semibold hover:bg-muted transition"
                  >
                    Profile
                  </Link>
                  <Link
                    to="/book/$doctorId"
                    params={{ doctorId: String(d.id) }}
                    className="flex flex-1 items-center justify-center gap-2 rounded-md bg-primary py-2.5 text-sm font-semibold text-primary-foreground shadow-button transition hover:opacity-90"
                  >
                    {t("doctors.bookNow")} <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </motion.div>
            ))}
      </div>
    </section>
  );
}
