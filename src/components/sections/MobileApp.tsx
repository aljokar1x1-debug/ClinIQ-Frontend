import { motion } from "framer-motion";
import { Apple, Play, Calendar, Star, Bell, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/context/LanguageContext";
import { useContent, pickByLang } from "@/services/contentStore";

const phoneCards = [
  {
    id: 1,
    icon: <CheckCircle2 className="h-4 w-4 text-emerald-500" />,
    title: "Appointment Confirmed",
    subtitle: "Dr. Sarah Ahmed · Tomorrow 10:30 AM",
    bg: "bg-emerald-500/10",
    delay: 0,
  },
  {
    id: 2,
    icon: <Star className="h-4 w-4 text-yellow-400" />,
    title: "Top Rated Doctor",
    subtitle: "Dr. Ahmed Hassan · ⭐ 4.9 · Cardiology",
    bg: "bg-yellow-500/10",
    delay: 0.15,
  },
  {
    id: 3,
    icon: <Bell className="h-4 w-4 text-primary" />,
    title: "Reminder",
    subtitle: "Your appointment is in 1 hour",
    bg: "bg-primary/10",
    delay: 0.3,
  },
  {
    id: 4,
    icon: <Calendar className="h-4 w-4 text-accent" />,
    title: "Book in Seconds",
    subtitle: "500+ doctors available today",
    bg: "bg-accent/10",
    delay: 0.45,
  },
];

export function MobileApp() {
  const { t, lang } = useLanguage();
  const ar = lang === "ar";
  const content = useContent();
  const m = content.mobileApp;

  const openOrSoon = (url: string, label: string) => {
    if (url && url !== "#") {
      window.open(url, "_blank", "noopener,noreferrer");
    } else {
      toast.info(ar ? `قريباً على ${label}` : `Coming soon on ${label}`);
    }
  };

  return (
    <section className="bg-muted/40">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 md:grid-cols-2 lg:px-8">
        {/* Left — Text */}
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-primary">
            {t("mobile.tag")}
          </span>
          <h2 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
            {pickByLang(m.title, lang)}
          </h2>
          <p className="mt-4 text-muted-foreground">{pickByLang(m.desc, lang)}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            {[
              { s: "App Store", Icon: Apple, url: m.appStoreUrl },
              { s: "Google Play", Icon: Play, url: m.googlePlayUrl },
            ].map(({ s, Icon, url }) => (
              <button
                key={s}
                onClick={() => openOrSoon(url, s)}
                className="relative flex items-center gap-3 rounded-md bg-foreground px-5 py-3 text-background transition hover:opacity-90"
              >
                <Icon className="h-6 w-6" />
                <div className="text-start">
                  <p className="text-[10px] opacity-70">Download on</p>
                  <p className="text-sm font-bold">{s}</p>
                </div>
                <span className="absolute -right-2 -top-2 rounded-pill bg-accent px-2 py-0.5 text-[9px] font-bold uppercase text-accent-foreground">
                  {t("mobile.soon")}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Right — Phone Mockup */}
        <div className="flex justify-center">
          <motion.div
            initial={{ rotate: -6, opacity: 0, y: 30 }}
            whileInView={{ rotate: -3, opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 80, damping: 18 }}
            className="relative h-[520px] w-[260px]"
          >
            {/* Phone Frame */}
            <div className="absolute inset-0 rounded-[42px] border-[10px] border-foreground bg-background shadow-glow overflow-hidden">
              {/* Notch */}
              <div className="absolute left-1/2 top-2 z-10 h-5 w-24 -translate-x-1/2 rounded-full bg-foreground" />

              {/* Status Bar */}
              <div className="flex items-center justify-between px-5 pt-10 pb-2">
                <span className="text-[10px] font-bold">9:41</span>
                <div className="flex items-center gap-1">
                  <div className="h-2 w-4 rounded-sm border border-current opacity-60" />
                </div>
              </div>

              {/* App Header */}
              <div className="px-4 pb-3">
                <div className="flex items-center justify-between rounded-xl bg-primary px-4 py-3">
                  <div>
                    <p className="text-[10px] text-primary-foreground/70">Good morning 👋</p>
                    <p className="text-xs font-bold text-primary-foreground">Find your Doctor</p>
                  </div>
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                    <span className="text-xs font-black text-white">CQ</span>
                  </div>
                </div>
              </div>

              {/* Cards */}
              <div className="space-y-2 px-4">
                {phoneCards.map((card) => (
                  <motion.div
                    key={card.id}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      delay: card.delay + 0.3,
                      type: "spring",
                      stiffness: 150,
                      damping: 18,
                    }}
                    className={`flex items-center gap-3 rounded-xl p-3 ${card.bg}`}
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-background shadow-sm">
                      {card.icon}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-[11px] font-bold">{card.title}</p>
                      <p className="truncate text-[9px] text-muted-foreground">{card.subtitle}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Bottom Nav */}
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-around border-t border-border bg-background/90 px-4 py-3 backdrop-blur-sm">
                {["🏠", "🔍", "📅", "👤"].map((emoji, i) => (
                  <motion.div
                    key={i}
                    whileTap={{ scale: 0.85 }}
                    className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm ${i === 0 ? "bg-primary/10" : ""}`}
                  >
                    {emoji}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Floating badge */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -right-8 top-16 rounded-xl bg-surface px-3 py-2 shadow-card"
            >
              <div className="flex items-center gap-1.5">
                <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                <div>
                  <p className="text-[10px] font-black">4.9 Rating</p>
                  <p className="text-[9px] text-muted-foreground">App Store</p>
                </div>
              </div>
            </motion.div>

            {/* Floating badge 2 */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute -left-10 bottom-24 rounded-xl bg-surface px-3 py-2 shadow-card"
            >
              <p className="text-[10px] font-black text-emerald-500">✓ 500+ Doctors</p>
              <p className="text-[9px] text-muted-foreground">Available now</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
