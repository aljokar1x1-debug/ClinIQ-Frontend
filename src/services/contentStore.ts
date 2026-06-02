import { useSyncExternalStore } from "react";

export type Bilingual = { en: string; ar: string };
export type LinkItem = { id: string; label: Bilingual; url: string };
export type SpecialtyItem = { id: string; name: Bilingual; icon: string; color: string };
export type HowStep = { id: string; title: Bilingual; desc: Bilingual; icon: string };
export type StatItem = { id: string; value: string; label: Bilingual };
export type Testimonial = { id: string; name: Bilingual; text: Bilingual; rating: number; date: Bilingual };
export type FaqItem = { id: string; q: Bilingual; a: Bilingual };
export type TeamMember = { id: string; name: Bilingual; role: Bilingual };

export type ContentShape = {
  hero: {
    badge: Bilingual;
    title1: Bilingual;
    title2: Bilingual;
    subtitle: Bilingual;
    ctaPrimary: Bilingual;
    ctaSecondary: Bilingual;
    specialtyPh: Bilingual;
    locationPh: Bilingual;
    trust: Bilingual;
    popular: string[];
  };
  stats: StatItem[];
  howItWorks: HowStep[];
  specialties: SpecialtyItem[];
  topDoctorIds: string[];
  testimonials: Testimonial[];
  faq: FaqItem[];
  mobileApp: { title: Bilingual; desc: Bilingual; appStoreUrl: string; googlePlayUrl: string };
  footer: {
    tagline: Bilingual;
    support: LinkItem[];
    specialties: LinkItem[];
    company: LinkItem[];
    social: { instagram: string; linkedin: string; facebook: string; twitter: string };
    copyright: Bilingual;
  };
  contact: { phone: string; email: string; address: Bilingual; hours: Bilingual };
  team: TeamMember[];
  lastSavedAt: number | null;
};

const STORAGE_KEY = "cliniq_content";

export const DEFAULT_CONTENT: ContentShape = {
  hero: {
    badge: { en: "Trusted by +10,000 patients", ar: "موثوق من أكثر من 10,000 مريض" },
    title1: { en: "Find & Book Your Doctor in", ar: "احجز طبيبك في" },
    title2: { en: "Seconds.", ar: "ثوانٍ." },
    subtitle: {
      en: "Skip the wait. Discover verified doctors near you and confirm your appointment instantly — no fees, no hassle.",
      ar: "تخطّ الانتظار. اكتشف أطباء موثوقين بالقرب منك وأكّد موعدك فورًا — بدون رسوم، بدون متاعب.",
    },
    ctaPrimary: { en: "Book Appointment", ar: "احجز موعد" },
    ctaSecondary: { en: "How it works", ar: "كيف يعمل" },
    specialtyPh: { en: "Specialty", ar: "التخصص" },
    locationPh: { en: "Location", ar: "الموقع" },
    trust: { en: "Free cancellation · Instant confirmation", ar: "إلغاء مجاني · تأكيد فوري" },
    popular: ["Cardiology", "Dental", "Pediatrics", "Dermatology", "Neurology"],
  },
  stats: [
    { id: "doctors", value: "500+", label: { en: "Doctors", ar: "طبيب" } },
    { id: "bookings", value: "50K+", label: { en: "Bookings", ar: "حجز" } },
    { id: "rating", value: "4.9", label: { en: "Rating", ar: "تقييم" } },
    { id: "clinics", value: "100+", label: { en: "Clinics", ar: "عيادة" } },
  ],
  howItWorks: [
    { id: "s1", icon: "Search", title: { en: "Search", ar: "ابحث" }, desc: { en: "Find specialists by name, specialty or location.", ar: "ابحث عن المتخصصين بالاسم أو التخصص أو الموقع." } },
    { id: "s2", icon: "CalendarCheck", title: { en: "Choose", ar: "اختر" }, desc: { en: "Pick a doctor, time slot and visit type that fit you.", ar: "اختر الطبيب والوقت ونوع الزيارة المناسب لك." } },
    { id: "s3", icon: "CheckCircle2", title: { en: "Confirm", ar: "أكّد" }, desc: { en: "Get instant confirmation. Pay only at the clinic.", ar: "احصل على تأكيد فوري. ادفع فقط في العيادة." } },
  ],
  specialties: [
    { id: "cardiology", icon: "Heart", color: "rose", name: { en: "Cardiology", ar: "أمراض القلب" } },
    { id: "neurology", icon: "Brain", color: "violet", name: { en: "Neurology", ar: "طب الأعصاب" } },
    { id: "dental", icon: "Smile", color: "blue", name: { en: "Dental", ar: "طب الأسنان" } },
    { id: "eye", icon: "Eye", color: "cyan", name: { en: "Eye", ar: "طب العيون" } },
    { id: "orthopedics", icon: "Bone", color: "orange", name: { en: "Orthopedics", ar: "العظام" } },
    { id: "pediatrics", icon: "Baby", color: "pink", name: { en: "Pediatrics", ar: "طب الأطفال" } },
    { id: "general", icon: "Stethoscope", color: "emerald", name: { en: "General", ar: "طب عام" } },
  ],
  topDoctorIds: ["doc-1", "doc-2", "doc-3"],
  testimonials: [
    { id: "t1", rating: 5, name: { en: "Sarah Mohamed", ar: "سارة محمد" }, text: { en: "Excellent service — I booked an appointment in two minutes!", ar: "خدمة ممتازة، حجزت موعد في دقيقتين!" }, date: { en: "2 days ago", ar: "منذ يومين" } },
    { id: "t2", rating: 5, name: { en: "Ahmed Ali", ar: "أحمد علي" }, text: { en: "The best medical booking app in Egypt.", ar: "أفضل تطبيق للحجز الطبي في مصر." }, date: { en: "1 week ago", ar: "منذ أسبوع" } },
    { id: "t3", rating: 5, name: { en: "Fatma Hassan", ar: "فاطمة حسن" }, text: { en: "Made it so easy to find the right doctor for me.", ar: "سهّل عليّ جداً إيجاد الدكتور المناسب." }, date: { en: "1 month ago", ar: "منذ شهر" } },
  ],
  faq: [
    { id: "f1", q: { en: "Is booking on ClinIQ free?", ar: "هل الحجز عبر ClinIQ مجاني؟" }, a: { en: "Yes — booking is 100% free. You only pay the clinic fee at your visit.", ar: "نعم — الحجز مجاني 100%. تدفع فقط رسوم العيادة عند زيارتك." } },
    { id: "f2", q: { en: "How do I cancel my appointment?", ar: "كيف ألغي موعدي؟" }, a: { en: "Open My Appointments and tap Cancel. Free cancellation up to 24 hours before.", ar: "افتح مواعيدي واضغط إلغاء. إلغاء مجاني حتى 24 ساعة قبل الموعد." } },
    { id: "f3", q: { en: "Are the doctors verified?", ar: "هل الأطباء موثوقون؟" }, a: { en: "Every doctor is manually reviewed and license-verified by our admin team.", ar: "كل طبيب يتم مراجعته يدويًا والتحقق من ترخيصه من قبل فريق الإدارة." } },
    { id: "f4", q: { en: "Can I book same-day appointments?", ar: "هل يمكنني الحجز في نفس اليوم؟" }, a: { en: "Absolutely. Many doctors keep same-day slots open.", ar: "بالتأكيد. العديد من الأطباء يحتفظون بمواعيد لنفس اليوم." } },
    { id: "f5", q: { en: "Is my personal data secure?", ar: "هل بياناتي الشخصية آمنة؟" }, a: { en: "Yes. We use bank-grade encryption and never share your data.", ar: "نعم. نستخدم تشفيرًا بمستوى البنوك ولا نشارك بياناتك أبدًا." } },
  ],
  mobileApp: {
    title: { en: "ClinIQ in your pocket", ar: "ClinIQ في جيبك" },
    desc: { en: "Book, reschedule and chat with your doctor — anywhere, anytime.", ar: "احجز وأعد الجدولة وتحدث مع طبيبك — في أي مكان، في أي وقت." },
    appStoreUrl: "#",
    googlePlayUrl: "#",
  },
  footer: {
    tagline: { en: "Healthcare, simplified.", ar: "الرعاية الصحية، بكل بساطة." },
    support: [
      { id: "help", label: { en: "Help Center", ar: "مركز المساعدة" }, url: "#help" },
      { id: "contact", label: { en: "Contact", ar: "اتصل بنا" }, url: "/about#contact" },
      { id: "faq", label: { en: "FAQ", ar: "الأسئلة الشائعة" }, url: "/#faq" },
      { id: "status", label: { en: "Status", ar: "حالة الخدمة" }, url: "#status" },
    ],
    specialties: [
      { id: "Cardiology", label: { en: "Cardiology", ar: "أمراض القلب" }, url: "/search?specialty=Cardiology" },
      { id: "Dentistry", label: { en: "Dentistry", ar: "طب الأسنان" }, url: "/search?specialty=Dentistry" },
      { id: "Pediatrics", label: { en: "Pediatrics", ar: "طب الأطفال" }, url: "/search?specialty=Pediatrics" },
      { id: "Neurology", label: { en: "Neurology", ar: "طب الأعصاب" }, url: "/search?specialty=Neurology" },
    ],
    company: [
      { id: "about", label: { en: "About", ar: "من نحن" }, url: "/about" },
      { id: "careers", label: { en: "Careers", ar: "وظائف" }, url: "#careers" },
      { id: "press", label: { en: "Press", ar: "الصحافة" }, url: "#press" },
      { id: "blog", label: { en: "Blog", ar: "المدونة" }, url: "#blog" },
    ],
    social: {
      instagram: "https://instagram.com",
      linkedin: "https://linkedin.com",
      facebook: "https://facebook.com",
      twitter: "https://x.com",
    },
    copyright: { en: "All rights reserved.", ar: "جميع الحقوق محفوظة." },
  },
  contact: {
    phone: "+20 100 123 4567",
    email: "hello@cliniq.health",
    address: { en: "Smart Village, 6th of October, Egypt", ar: "القرية الذكية، السادس من أكتوبر، مصر" },
    hours: { en: "Sun–Thu · 9:00 AM – 6:00 PM", ar: "الأحد–الخميس · 9 ص – 6 م" },
  },
  team: [
    { id: "tm1", name: { en: "Dr. Mohamed Adel", ar: "د. محمد عادل" }, role: { en: "Co-founder & CEO", ar: "الشريك المؤسس والرئيس التنفيذي" } },
    { id: "tm2", name: { en: "Eng. Nour Khaled", ar: "م. نور خالد" }, role: { en: "CTO", ar: "المدير التقني" } },
    { id: "tm3", name: { en: "Dr. Salma Ibrahim", ar: "د. سلمى إبراهيم" }, role: { en: "Chief Medical Officer", ar: "المسؤول الطبي" } },
  ],
  lastSavedAt: null,
};

let cached: ContentShape | null = null;
const subs = new Set<() => void>();

function deepMerge<T>(base: T, override: unknown): T {
  if (!override || typeof override !== "object") return base;
  if (Array.isArray(base)) return (override as unknown as T) ?? base;
  const o = override as Record<string, unknown>;
  const result: Record<string, unknown> = { ...(base as Record<string, unknown>) };
  for (const k of Object.keys(base as Record<string, unknown>)) {
    if (k in o) result[k] = deepMerge((base as Record<string, unknown>)[k] as never, o[k]);
  }
  return result as T;
}

function load(): ContentShape {
  if (cached) return cached;
  if (typeof window === "undefined") {
    cached = DEFAULT_CONTENT;
    return cached;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      cached = DEFAULT_CONTENT;
      return cached;
    }
    cached = deepMerge(DEFAULT_CONTENT, JSON.parse(raw));
    return cached;
  } catch {
    cached = DEFAULT_CONTENT;
    return cached;
  }
}

function notify() {
  subs.forEach((fn) => fn());
}

export function getContent(): ContentShape {
  return load();
}

export function saveContent(next: ContentShape) {
  const stamped = { ...next, lastSavedAt: Date.now() };
  cached = stamped;
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stamped));
    } catch {
      // quota
    }
  }
  notify();
}

export function updateContent(updater: (c: ContentShape) => ContentShape) {
  saveContent(updater(load()));
}

export function resetSection<K extends keyof ContentShape>(section: K) {
  const cur = load();
  saveContent({ ...cur, [section]: DEFAULT_CONTENT[section] });
}

export function resetAll() {
  cached = { ...DEFAULT_CONTENT };
  if (typeof window !== "undefined") localStorage.removeItem(STORAGE_KEY);
  notify();
}

function subscribe(cb: () => void) {
  subs.add(cb);
  return () => subs.delete(cb);
}

export function useContent(): ContentShape {
  return useSyncExternalStore(subscribe, getContent, () => DEFAULT_CONTENT);
}

export function pickByLang<T>(b: { en: T; ar: T }, lang: "en" | "ar"): T {
  return lang === "ar" ? b.ar : b.en;
}
