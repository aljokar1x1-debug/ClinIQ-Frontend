import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, SlidersHorizontal, MapPin, X, List,
  Map as MapIcon, Star, ChevronDown, Clock,
  Heart, Smile, Baby, Sparkles, Bone, Eye,
  Brain, Users, Ear, Pill,
} from "lucide-react";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { DoctorCard } from "@/components/common/DoctorCard";
import { useLanguage } from "@/context/LanguageContext";
import { doctorsApi, DoctorProfile } from "@/api/doctors";
import { SPECIALTY_LIST, CITY_LIST, DOCTORS } from "@/data/doctors";

export const Route = createFileRoute("/search")({
  validateSearch: (search: Record<string, unknown>) => ({
    specialty: (search.specialty as string) ?? "",
  }),
  head: () => ({
    meta: [
      { title: "Find Doctors — ClinIQ" },
      { name: "description", content: "Search verified doctors by specialty, location, availability and insurance." },
    ],
  }),
  component: SearchPage,
});

type Sort = "relevance" | "rating" | "fee_asc" | "fee_desc" | "experience";

/* ─── Debounce ─── */
function useDebounce<T>(value: T, delay: number): T {
  const [d, setD] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setD(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return d;
}

/* ─── Recent searches ─── */
const LS_KEY = "cliniq_recent_searches";
function getRecent(): string[] {
  try { return JSON.parse(localStorage.getItem(LS_KEY) ?? "[]"); } catch { return []; }
}
function saveRecent(q: string) {
  if (!q.trim()) return;
  const prev = getRecent().filter((s) => s !== q).slice(0, 4);
  localStorage.setItem(LS_KEY, JSON.stringify([q, ...prev]));
}
function clearRecent() { localStorage.removeItem(LS_KEY); }

/* ─── Specialty config with Lucide icons + doctor count ─── */
const SPECIALTY_CONFIG = [
  { en: "Cardiology",    ar: "أمراض القلب",       Icon: Heart,    color: "text-red-400",    bg: "bg-red-400/10"    },
  { en: "Dentistry",     ar: "طب الأسنان",         Icon: Smile,    color: "text-blue-400",   bg: "bg-blue-400/10"   },
  { en: "Pediatrics",    ar: "طب الأطفال",         Icon: Baby,     color: "text-yellow-400", bg: "bg-yellow-400/10" },
  { en: "Dermatology",   ar: "الأمراض الجلدية",    Icon: Sparkles, color: "text-pink-400",   bg: "bg-pink-400/10"   },
  { en: "Orthopedics",   ar: "العظام",              Icon: Bone,     color: "text-slate-400",  bg: "bg-slate-400/10"  },
  { en: "Ophthalmology", ar: "طب العيون",           Icon: Eye,      color: "text-cyan-400",   bg: "bg-cyan-400/10"   },
  { en: "Neurology",     ar: "طب الأعصاب",         Icon: Brain,    color: "text-purple-400", bg: "bg-purple-400/10" },
  { en: "Gynecology",    ar: "أمراض النساء",       Icon: Users,    color: "text-rose-400",   bg: "bg-rose-400/10"   },
  { en: "ENT",           ar: "أنف وأذن وحنجرة",    Icon: Ear,      color: "text-orange-400", bg: "bg-orange-400/10" },
  { en: "Psychiatry",    ar: "الطب النفسي",        Icon: Pill,     color: "text-indigo-400", bg: "bg-indigo-400/10" },
] as const;

/* count doctors per specialty from local mock data */
function getDoctorCount(specialty: string): number {
  return DOCTORS.filter((d) => d.specialty === specialty).length;
}

/* ─── Skeleton ─── */
function DoctorCardSkeleton() {
  return (
    <div className="flex gap-4 rounded-xl border border-border bg-card p-5 animate-pulse">
      <div className="h-24 w-24 shrink-0 rounded-xl bg-muted" />
      <div className="flex-1 space-y-3">
        <div className="flex justify-between">
          <div className="space-y-2">
            <div className="h-4 w-36 rounded bg-muted" />
            <div className="h-3 w-24 rounded bg-muted" />
          </div>
          <div className="h-6 w-20 rounded bg-muted" />
        </div>
        <div className="h-3 w-48 rounded bg-muted" />
        <div className="flex gap-2">
          <div className="h-5 w-16 rounded-full bg-muted" />
          <div className="h-5 w-20 rounded-full bg-muted" />
        </div>
        <div className="flex gap-2 border-t border-border pt-3">
          <div className="h-8 w-24 rounded-md bg-muted" />
          <div className="h-8 w-24 rounded-md bg-muted" />
        </div>
      </div>
    </div>
  );
}

/* ─── Specialty autocomplete ─── */
function SpecialtyInput({ value, onChange, ar }: { value: string; onChange: (v: string) => void; ar: boolean }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const filtered = SPECIALTY_LIST.filter(
    (s) => s.en.toLowerCase().includes(value.toLowerCase()) || s.ar.includes(value)
  );
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  return (
    <div ref={ref} className="relative">
      <input
        value={value}
        onChange={(e) => { onChange(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        placeholder={ar ? "مثال: القلب" : "e.g. Cardiology"}
        className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
      />
      <AnimatePresence>
        {open && filtered.length > 0 && (
          <motion.ul
            initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.12 }}
            className="absolute z-50 mt-1 max-h-52 w-full overflow-auto rounded-md border border-border bg-card shadow-lg"
          >
            {filtered.map((s) => (
              <li key={s.en}>
                <button
                  onMouseDown={() => { onChange(ar ? s.ar : s.en); setOpen(false); }}
                  className="flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-muted"
                >
                  <span>{ar ? s.ar : s.en}</span>
                  <span className="text-xs text-muted-foreground">{ar ? s.en : s.ar}</span>
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── City select ─── */
function CitySelect({ value, onChange, ar }: { value: string; onChange: (v: string) => void; ar: boolean }) {
  return (
    <div className="relative">
      <select
        value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
      >
        <option value="">{ar ? "كل المدن" : "All cities"}</option>
        {CITY_LIST.map((c) => <option key={c.en} value={c.en}>{ar ? c.ar : c.en}</option>)}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
    </div>
  );
}

/* ─── Fee slider ─── */
function FeeSlider({ max, value, onChange, ar }: { max: number; value: number; onChange: (v: number) => void; ar: boolean }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{ar ? "الحد الأقصى" : "Max fee"}</span>
        <span className="font-bold text-foreground">
          {value >= max ? (ar ? "الكل" : "Any") : `${value} ${ar ? "ج.م" : "EGP"}`}
        </span>
      </div>
      <input type="range" min={100} max={max} step={50} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-primary" />
      <div className="flex justify-between text-[10px] text-muted-foreground"><span>100</span><span>{max}</span></div>
    </div>
  );
}

/* ─── Filter group ─── */
function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">{title}</h3>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

/* ─── Landing: recent + specialty grid ─── */
function LandingState({
  ar, recentSearches, onSpecialty, onRecent, onClearRecent,
}: {
  ar: boolean;
  recentSearches: string[];
  onSpecialty: (s: string) => void;
  onRecent: (s: string) => void;
  onClearRecent: () => void;
}) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      {/* Recent */}
      {recentSearches.length > 0 && (
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              {ar ? "بحث سابق" : "Recent searches"}
            </h2>
            <button onClick={onClearRecent} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              {ar ? "مسح الكل" : "Clear all"}
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {recentSearches.map((s) => (
              <button key={s} onClick={() => onRecent(s)}
                className="flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-sm hover:border-primary hover:text-primary transition-colors">
                <Clock className="h-3 w-3" />{s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Specialty grid */}
      <div>
        <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-muted-foreground">
          {ar ? "التخصصات الأكثر طلباً" : "Browse by specialty"}
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
          {SPECIALTY_CONFIG.map((sp) => {
            const count = getDoctorCount(sp.en);
            const { Icon } = sp;
            return (
              <motion.button
                key={sp.en}
                whileHover={{ y: -3, scale: 1.01 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => onSpecialty(sp.en)}
                className="group flex items-center gap-3 rounded-xl border border-border bg-card p-4 text-left transition-all hover:border-primary/40 hover:shadow-md"
              >
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${sp.bg} transition-transform group-hover:scale-110`}>
                  <Icon className={`h-5 w-5 ${sp.color}`} />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold leading-tight">{ar ? sp.ar : sp.en}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {count} {ar ? "طبيب" : "doctors"}
                  </p>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Empty results ─── */
function EmptySearch({ onReset, ar }: { onReset: () => void; ar: boolean }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-20 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
        <Search className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-bold">{ar ? "لا يوجد أطباء مطابقون" : "No doctors found"}</h3>
      <p className="mt-1 max-w-xs text-sm text-muted-foreground">
        {ar ? "جرّب توسيع البحث أو إزالة بعض الفلاتر." : "Try widening your search or removing some filters."}
      </p>
      <button onClick={onReset}
        className="mt-5 rounded-lg border border-border px-5 py-2 text-sm font-semibold hover:bg-muted transition-colors">
        {ar ? "إعادة ضبط" : "Reset filters"}
      </button>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════ */
function SearchPage() {
  const { lang } = useLanguage();
  const ar = lang === "ar";
  const { specialty: specialtyParam } = Route.useSearch();

  const [query, setQuery]                   = useState("");
  const [city, setCity]                     = useState("");
  const [specialty, setSpecialty]           = useState(specialtyParam ?? "");
  const [minRating, setMinRating]           = useState(0);
  const [maxFee, setMaxFee]                 = useState(1000);
  const [availableOnly, setAvailableOnly]   = useState(false);
  const [verifiedOnly, setVerifiedOnly]     = useState(false);
  const [sort, setSort]                     = useState<Sort>("relevance");
  const [view, setView]                     = useState<"list" | "map">("list");
  const [filterOpen, setFilterOpen]         = useState(false);
  const [doctors, setDoctors]               = useState<DoctorProfile[]>([]);
  const [loading, setLoading]               = useState(false);
  const [hasSearched, setHasSearched]       = useState(!!specialtyParam);
  const [recentSearches, setRecentSearches] = useState<string[]>(getRecent());

  const dQuery     = useDebounce(query, 400);
  const dCity      = useDebounce(city, 400);
  const dSpecialty = useDebounce(specialty, 400);

  const fetchDoctors = useCallback(async () => {
    const active = dQuery || dCity || dSpecialty || availableOnly;
    if (!active) { setHasSearched(false); setDoctors([]); return; }
    setHasSearched(true);
    setLoading(true);
    try {
      const data = await doctorsApi.getAll({
        name:        dQuery     || undefined,
        city:        dCity      || undefined,
        specialty:   dSpecialty || undefined,
        isAvailable: availableOnly || undefined,
      });
      setDoctors(data);
      if (dQuery) saveRecent(dQuery);
    } catch {
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  }, [dQuery, dCity, dSpecialty, availableOnly]);

  useEffect(() => { fetchDoctors(); }, [fetchDoctors]);

  /* if specialtyParam given on mount, trigger fetch */
  useEffect(() => {
    if (specialtyParam) setSpecialty(specialtyParam);
  }, [specialtyParam]);

  const sorted = [...doctors]
    .filter((d) => {
      if (verifiedOnly && !d.isVerified) return false;
      if (minRating > 0 && d.rating < minRating) return false;
      if (maxFee < 1000 && d.consultationFee > maxFee) return false;
      return true;
    })
    .sort((a, b) => {
      if (sort === "rating")     return b.rating - a.rating;
      if (sort === "fee_asc")    return a.consultationFee - b.consultationFee;
      if (sort === "fee_desc")   return b.consultationFee - a.consultationFee;
      if (sort === "experience") return b.yearsOfExperience - a.yearsOfExperience;
      return 0;
    });

  const resetFilters = () => {
    setQuery(""); setCity(""); setSpecialty("");
    setMinRating(0); setMaxFee(1000);
    setAvailableOnly(false); setVerifiedOnly(false);
  };

  const activeFilters = [
    specialty     && { label: specialty,            clear: () => setSpecialty("") },
    city          && { label: city,                 clear: () => setCity("") },
    minRating > 0 && { label: `${minRating}+ ★`,   clear: () => setMinRating(0) },
    maxFee < 1000 && { label: `≤${maxFee} EGP`,    clear: () => setMaxFee(1000) },
    availableOnly && { label: ar ? "متاح اليوم" : "Available today", clear: () => setAvailableOnly(false) },
    verifiedOnly  && { label: ar ? "موثق فقط"  : "Verified only",   clear: () => setVerifiedOnly(false) },
  ].filter(Boolean) as { label: string; clear: () => void }[];

  /* ── Specialty chips — top bar, NO emojis ── */
  const SpecialtyChips = (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
      {SPECIALTY_CONFIG.map(({ en, ar: arLabel, Icon, color, bg }) => {
        const active = specialty === en;
        return (
          <button key={en}
            onClick={() => setSpecialty(active ? "" : en)}
            className={`flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all ${
              active
                ? "border-primary bg-primary/10 text-primary"
                : "border-border bg-card hover:border-primary/40 hover:bg-muted"
            }`}
          >
            <Icon className={`h-3 w-3 ${active ? "text-primary" : color}`} />
            {lang === "ar" ? arLabel : en}
          </button>
        );
      })}
    </div>
  );

  /* ── Filters panel ── */
  const FiltersPanel = (
    <div className="space-y-5">
      <FilterGroup title={ar ? "التخصص" : "Specialty"}>
        <SpecialtyInput value={specialty} onChange={setSpecialty} ar={ar} />
      </FilterGroup>
      <FilterGroup title={ar ? "المدينة" : "City"}>
        <CitySelect value={city} onChange={setCity} ar={ar} />
      </FilterGroup>
      <FilterGroup title={ar ? "أقل تقييم" : "Minimum rating"}>
        <div className="flex gap-2">
          {[0, 3, 4, 4.5].map((r) => (
            <button key={r} onClick={() => setMinRating(r)}
              className={`flex items-center gap-1 rounded-md border px-2.5 py-1.5 text-xs font-semibold transition-colors ${
                minRating === r ? "border-primary bg-primary/10 text-primary" : "border-border hover:bg-muted"
              }`}
            >
              {r === 0 ? (ar ? "الكل" : "Any") : <><Star className="h-3 w-3 fill-amber-400 text-amber-400" />{r}+</>}
            </button>
          ))}
        </div>
      </FilterGroup>
      <FilterGroup title={ar ? "الرسوم" : "Fee"}>
        <FeeSlider max={1000} value={maxFee} onChange={setMaxFee} ar={ar} />
      </FilterGroup>
      <FilterGroup title={ar ? "الإتاحة" : "Availability"}>
        {[
          { label: ar ? "متاح اليوم" : "Available today", val: availableOnly, set: setAvailableOnly },
          { label: ar ? "موثق فقط"   : "Verified only",   val: verifiedOnly,  set: setVerifiedOnly  },
        ].map(({ label, val, set }) => (
          <label key={label} className="flex cursor-pointer items-center justify-between rounded-md border border-border px-3 py-2 hover:bg-muted transition-colors">
            <span className="text-sm">{label}</span>
            <div onClick={() => set(!val)}
              className={`relative h-5 w-9 rounded-full transition-colors ${val ? "bg-primary" : "bg-muted-foreground/30"}`}>
              <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${val ? "translate-x-4" : "translate-x-0.5"}`} />
            </div>
          </label>
        ))}
      </FilterGroup>
      <button onClick={resetFilters}
        className="w-full rounded-md border border-border py-2 text-sm font-semibold transition-colors hover:bg-muted">
        {ar ? "إعادة ضبط" : "Reset filters"}
      </button>
    </div>
  );

  /* ════════════════ RENDER ════════════════ */
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* ── Hero search bar ── */}
      <div className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8 space-y-3">
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={ar ? "ابحث عن طبيب أو تخصص…" : "Search doctor, specialty…"}
                className="h-11 w-full rounded-md border border-border bg-background pl-9 pr-9 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
              {query && (
                <button onClick={() => setQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
            <div className="relative sm:w-52">
              <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input value={city} onChange={(e) => setCity(e.target.value)}
                placeholder={ar ? "المدينة" : "City"}
                className="h-11 w-full rounded-md border border-border bg-background pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
            <button onClick={() => setFilterOpen(true)}
              className="flex h-11 items-center justify-center gap-2 rounded-md border border-border px-4 text-sm font-semibold lg:hidden">
              <SlidersHorizontal className="h-4 w-4" />
              {ar ? "فلاتر" : "Filters"}
              {activeFilters.length > 0 && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                  {activeFilters.length}
                </span>
              )}
            </button>
          </div>
          {SpecialtyChips}
        </div>
      </div>

      {/* ── Main layout ── */}
      <main className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[280px_1fr] lg:px-8">
        {/* Sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 rounded-xl border border-border bg-card p-5">
            <h2 className="mb-4 text-sm font-bold uppercase tracking-wider">{ar ? "الفلاتر" : "Filters"}</h2>
            {FiltersPanel}
          </div>
        </aside>

        {/* Content */}
        <section>
          {/* Active filter chips */}
          <AnimatePresence>
            {activeFilters.length > 0 && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                className="mb-4 flex flex-wrap gap-2">
                {activeFilters.map((f) => (
                  <motion.span key={f.label}
                    initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
                    className="flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                    {f.label}
                    <button onClick={f.clear} className="hover:text-destructive"><X className="h-3 w-3" /></button>
                  </motion.span>
                ))}
                <button onClick={resetFilters}
                  className="rounded-full border border-border px-3 py-1 text-xs font-semibold hover:bg-muted">
                  {ar ? "مسح الكل" : "Clear all"}
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Count + sort + view toggle */}
          {hasSearched && !loading && (
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-muted-foreground">
                <span className="font-bold text-foreground">{sorted.length}</span>{" "}
                {ar ? "طبيب متاح" : "doctors found"}
                {specialty && (
                  <span className="ml-1 text-primary font-medium">
                    · {ar ? SPECIALTY_CONFIG.find(s=>s.en===specialty)?.ar ?? specialty : specialty}
                  </span>
                )}
              </p>
              <div className="flex items-center gap-2">
                <select value={sort} onChange={(e) => setSort(e.target.value as Sort)}
                  className="rounded-md border border-border bg-background px-3 py-2 text-xs font-medium">
                  <option value="relevance">{ar ? "الأكثر صلة"    : "Relevance"}</option>
                  <option value="rating">   {ar ? "الأعلى تقييماً": "Top rated"}</option>
                  <option value="fee_asc">  {ar ? "أقل رسوم"      : "Lowest fee"}</option>
                  <option value="fee_desc"> {ar ? "أعلى رسوم"     : "Highest fee"}</option>
                  <option value="experience">{ar ? "الأكثر خبرة"  : "Most experienced"}</option>
                </select>
                <div className="hidden rounded-md border border-border p-0.5 sm:flex">
                  {(["list", "map"] as const).map((v) => (
                    <button key={v} onClick={() => setView(v)}
                      className={`flex items-center gap-1 rounded px-3 py-1.5 text-xs font-semibold ${
                        view === v ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                      }`}
                    >
                      {v === "list"
                        ? <><List className="h-3 w-3" /> {ar ? "قائمة" : "List"}</>
                        : <><MapIcon className="h-3 w-3" /> {ar ? "خريطة" : "Map"}</>}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Main content switcher */}
          {!hasSearched ? (
            <LandingState
              ar={ar}
              recentSearches={recentSearches}
              onSpecialty={(s) => setSpecialty(s)}
              onRecent={(s) => { setQuery(s); setRecentSearches(getRecent()); }}
              onClearRecent={() => { clearRecent(); setRecentSearches([]); }}
            />
          ) : loading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => <DoctorCardSkeleton key={i} />)}
            </div>
          ) : sorted.length === 0 ? (
            <EmptySearch onReset={resetFilters} ar={ar} />
          ) : view === "map" ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-20 text-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <MapIcon className="h-8 w-8 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-base font-bold">{ar ? "عرض الخريطة قريباً" : "Map view coming soon"}</h3>
                <p className="mt-1 text-sm text-muted-foreground max-w-xs">
                  {ar ? `${sorted.length} طبيب متاح — جرّب عرض القائمة الآن` : `${sorted.length} doctors available — try list view for now`}
                </p>
              </div>
              <button onClick={() => setView("list")}
                className="rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity">
                {ar ? "عرض القائمة" : "Switch to list"}
              </button>
            </motion.div>
          ) : (
            <motion.div
              key={`${dQuery}-${dSpecialty}-${dCity}`}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="space-y-4"
            >
              {sorted.map((d, i) => <DoctorCard key={d.id} doctor={d} index={i} />)}
            </motion.div>
          )}
        </section>
      </main>

      {/* ── Mobile filter sheet ── */}
      <AnimatePresence>
        {filterOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 lg:hidden"
            onClick={() => setFilterOpen(false)}>
            <motion.div
              initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30 }}
              className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-3xl bg-card p-6"
              onClick={(e) => e.stopPropagation()}>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-bold">{ar ? "الفلاتر" : "Filters"}</h2>
                <button onClick={() => setFilterOpen(false)} className="rounded-full p-2 hover:bg-muted">
                  <X className="h-4 w-4" />
                </button>
              </div>
              {FiltersPanel}
              <button onClick={() => setFilterOpen(false)}
                className="mt-6 w-full rounded-md bg-primary py-3 font-bold text-primary-foreground">
                {ar ? `عرض ${sorted.length} نتيجة` : `Show ${sorted.length} results`}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
