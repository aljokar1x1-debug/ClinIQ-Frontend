import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import {
  Search,
  MapPin,
  ArrowRight,
  PlayCircle,
  CheckCircle2,
  Calendar,
  Heart,
  Star,
  Shield,
  Clock,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { Link, useNavigate } from "@tanstack/react-router";
import { useContent, pickByLang } from "@/services/contentStore";
 
export function HeroSection() {
  const { lang } = useLanguage();
  const content = useContent();
  const h = content.hero;
  const titleRef = useRef<HTMLHeadingElement>(null);
  const nav = useNavigate();
  const [q, setQ] = useState("");
  const [loc, setLoc] = useState("");
  const [searching, setSearching] = useState(false);
 
  useEffect(() => {
    if (!titleRef.current) return;
    const words = titleRef.current.querySelectorAll(".word");
    gsap.fromTo(
      words,
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.08, duration: 0.7, ease: "power3.out" },
    );
  }, []);
 
  const goSearch = (specialty?: string) => {
    setSearching(true);
    nav({
      to: "/search",
      search: {
        specialty: specialty || q || "",
      },
    });
  };
 
  const scrollHow = () => {
    document.querySelector("#how-it-works")?.scrollIntoView({ behavior: "smooth" });
  };
 
  const popularAr: Record<string, string> = {
    "Cardiology": "القلب",
    "Dental": "الأسنان",
    "Pediatrics": "الأطفال",
    "Dermatology": "الجلدية",
    "Neurology": "الأعصاب",
  };
 
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 -left-32 h-96 w-96 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute top-20 right-0 h-80 w-80 rounded-full bg-secondary/15 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />
      </div>
      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-5 lg:gap-8 lg:px-8 lg:py-24">
        {/* Left */}
        <div className="lg:col-span-3">
          <motion.span
            initial={{ opacity: 0, scale: 0.85, filter: "blur(6px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="inline-flex items-center gap-2 rounded-pill border border-accent/30 bg-accent/10 px-4 py-1.5 text-sm font-semibold text-accent"
          >
            {pickByLang(h.badge, lang)}
          </motion.span>
          <h1
            ref={titleRef}
            className="mt-6 text-5xl font-black leading-[1.05] tracking-tight sm:text-6xl lg:text-[64px]"
          >
            <span className="word inline-block">{pickByLang(h.title1, lang)}</span>{" "}
            <span className="word inline-block text-gradient">{pickByLang(h.title2, lang)}</span>
          </h1>
          <p className="mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
            {pickByLang(h.subtitle, lang)}
          </p>
          <motion.form
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            onSubmit={(e) => {
              e.preventDefault();
              goSearch();
            }}
            className="mt-8 flex flex-col gap-2 rounded-pill border border-border bg-surface p-2 shadow-card sm:flex-row sm:items-center"
          >
            <div className="flex flex-1 items-center gap-2 px-4">
              <Search className="h-5 w-5 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                className="w-full bg-transparent py-2 text-sm outline-none placeholder:text-muted-foreground"
                placeholder={pickByLang(h.specialtyPh, lang)}
              />
            </div>
            <div className="hidden h-8 w-px bg-border sm:block" />
            <div className="flex flex-1 items-center gap-2 px-4">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <input
                value={loc}
                onChange={(e) => setLoc(e.target.value)}
                className="w-full bg-transparent py-2 text-sm outline-none placeholder:text-muted-foreground"
                placeholder={pickByLang(h.locationPh, lang)}
              />
            </div>
            <button
              type="submit"
              disabled={searching}
              className="flex items-center justify-center gap-2 rounded-pill bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-button transition hover:opacity-90 disabled:opacity-70"
            >
              {searching ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <>
                  {lang === "ar" ? "ابحث" : "Search"} <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </motion.form>
          <div className="mt-5 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <span className="font-medium">{lang === "ar" ? "الأكثر بحثًا" : "Popular"}:</span>
            {h.popular.map((p, i) => (
              <motion.button
                key={p}
                initial={{ opacity: 0, scale: 0.8, filter: "blur(4px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                transition={{ delay: 0.6 + i * 0.08, type: "spring", stiffness: 200 }}
                onClick={() => goSearch(p)}
                className="rounded-pill border border-border px-3 py-1 text-xs transition hover:border-primary hover:text-primary"
              >
                {lang === "ar" ? (popularAr[p] ?? p) : p}
              </motion.button>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              to="/search"
              search={{ specialty: "" }}
              className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-button transition hover:opacity-90"
            >
              {pickByLang(h.ctaPrimary, lang)}
            </Link>
            <button
              onClick={scrollHow}
              className="inline-flex items-center gap-2 rounded-md border border-border px-6 py-3 text-sm font-semibold transition hover:border-primary hover:text-primary"
            >
              <PlayCircle className="h-5 w-5" /> {pickByLang(h.ctaSecondary, lang)}
            </button>
          </div>
          <p className="mt-5 text-xs text-muted-foreground">{pickByLang(h.trust, lang)}</p>
        </div>
        {/* Right — Doctor Image */}
        <div className="relative hidden lg:col-span-2 lg:flex lg:items-center lg:justify-center">
          <div className="absolute h-80 w-80 rounded-full bg-gradient-to-br from-primary/30 to-secondary/20 blur-3xl opacity-60" />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="relative z-10"
          >
            <div className="relative h-[420px] w-[300px]">
              {/* Doctor Image */}
              <div className="absolute inset-0 z-10 overflow-hidden rounded-[2rem] bg-gradient-to-b from-primary/20 to-secondary/10">
                <img
                  src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=600&h=800&fit=crop&crop=face,top"
                  alt="Doctor"
                  className="h-full w-full object-cover object-top"
                />
                <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background/80 to-transparent" />
              </div>
              {/* Verified badge */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="absolute -right-4 top-6 z-20 flex items-center gap-2 rounded-xl bg-surface px-3 py-2 shadow-card"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/10">
                  <Shield className="h-4 w-4 text-emerald-500" />
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground">{lang === "ar" ? "الحالة" : "Status"}</p>
                  <p className="text-xs font-bold text-emerald-500">{lang === "ar" ? "موثق ✓" : "Verified ✓"}</p>
                </div>
              </motion.div>
              {/* Rating badge */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -left-6 top-1/3 z-20 rounded-xl bg-surface px-3 py-2 shadow-card"
              >
                <div className="flex items-center gap-1.5">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <div>
                    <p className="text-xs font-black">4.9</p>
                    <p className="text-[9px] text-muted-foreground">{lang === "ar" ? "٣٢٠ تقييم" : "320 reviews"}</p>
                  </div>
                </div>
              </motion.div>
              {/* Appointment confirmed */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute -bottom-4 -left-8 z-20 w-56 rounded-xl bg-surface p-3 shadow-card"
              >
                <div className="flex items-start gap-2">
                  <div className="rounded-full bg-accent/15 p-1.5">
                    <CheckCircle2 className="h-4 w-4 text-accent" />
                  </div>
                  <div>
                    <p className="text-xs font-bold">
                      {lang === "ar" ? "تم تأكيد الموعد!" : "Appointment Confirmed!"}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {lang === "ar" ? "د. سارة أحمد · أمراض القلب" : "Dr. Sarah Ahmed · Cardiology"}
                    </p>
                    <p className="mt-1 inline-flex items-center gap-1 text-[10px] font-semibold text-primary">
                      <Calendar className="h-3 w-3" />
                      {lang === "ar" ? "غدًا، 10:30 صباحًا" : "Tomorrow, 10:30 AM"}
                    </p>
                  </div>
                </div>
              </motion.div>
              {/* Heart rate */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -right-6 bottom-16 z-20 rounded-xl bg-surface px-3 py-2 shadow-card"
              >
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-100 dark:bg-rose-500/20">
                    <Heart className="h-4 w-4 text-rose-500" />
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground">{lang === "ar" ? "معدل القلب" : "Heart Rate"}</p>
                    <p className="text-xs font-bold">72 bpm</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
          {/* Wait time */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute right-16 top-40 z-20"
          >
            <div className="flex items-center gap-2 rounded-xl bg-surface px-3 py-2 shadow-card">
              <Clock className="h-4 w-4 text-primary" />
              <div>
                <p className="text-[10px] text-muted-foreground">{lang === "ar" ? "وقت الانتظار" : "Wait Time"}</p>
                <p className="text-xs font-bold">~5 mins</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
