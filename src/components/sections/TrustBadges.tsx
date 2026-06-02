import { Lock, ShieldCheck, Hospital, CreditCard, Star, RefreshCw } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const items = [
  { icon: Lock, en: "SSL Secured", ar: "آمن بـ SSL" },
  { icon: ShieldCheck, en: "Verified Doctors", ar: "أطباء موثقون" },
  { icon: Hospital, en: "Licensed Clinics", ar: "عيادات مرخصة" },
  { icon: CreditCard, en: "Pay at Clinic", ar: "الدفع في العيادة" },
  { icon: Star, en: "4.9/5 Rating", ar: "تقييم 4.9/5" },
  { icon: RefreshCw, en: "Free Cancellation", ar: "إلغاء مجاني" },
];

export function TrustBadges() {
  const { lang } = useLanguage();
  const ar = lang === "ar";

  return (
    <section className="bg-muted/60">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 py-8 sm:grid-cols-3 sm:px-6 md:grid-cols-6 lg:px-8">
        {items.map((it) => (
          <div
            key={it.en}
            className="flex items-center gap-2 text-sm font-medium text-muted-foreground"
          >
            <it.icon className="h-5 w-5 text-primary" />
            <span>{ar ? it.ar : it.en}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
