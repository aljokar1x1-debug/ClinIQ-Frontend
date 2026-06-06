import { ReactNode, useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import { Moon, Sun, Shield, Clock, Star, Users } from "lucide-react";

function useCounter(target: number, duration: number = 1500, start: boolean = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [start, target, duration]);
  return count;
}

function AnimatedStat({
  icon,
  value,
  label,
  delay,
  started,
}: {
  icon: ReactNode;
  value: string;
  label: string;
  delay: number;
  started: boolean;
}) {
  const numericValue = parseInt(value.replace(/[^0-9]/g, ""));
  const prefix = value.startsWith("<") ? "< " : "";
  const suffix = value.includes("+") ? "+" : "";
  const isDecimal = value.includes(".");
  const count = useCounter(isDecimal ? parseFloat(value) * 10 : numericValue, 1800, started);
  const displayValue = isDecimal ? (count / 10).toFixed(1) : count.toLocaleString();

  return (
    <motion.div
      dir="ltr"
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, type: "spring", stiffness: 120, damping: 14 }}
      className="flex items-center gap-3 rounded-xl bg-white/10 p-4 backdrop-blur-sm border border-white/10 hover:bg-white/15 transition-colors"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-cyan-400/20 text-cyan-400">
        {icon}
      </div>
      <div>
        <p className="text-lg font-black tabular-nums">
          {prefix}
          {displayValue}
          {suffix}
        </p>
        <p className="text-xs text-white/60">{label}</p>
      </div>
    </motion.div>
  );
}

export function AuthLayout({ children, title }: { children: ReactNode; title: string }) {
  const { t, lang, setLang } = useLanguage();
  const { resolved, toggle } = useTheme();
  const [started, setStarted] = useState(false);

  const stats = [
    { icon: <Users className="h-5 w-5" />, value: "10000+", label: t("auth.statPatients") },
    { icon: <Shield className="h-5 w-5" />, value: "500+", label: t("auth.statDoctors") },
    { icon: <Star className="h-5 w-5" />, value: "4.9", label: t("auth.statRating") },
    { icon: <Clock className="h-5 w-5" />, value: "< 60s", label: t("auth.statBooking") },
  ];

  useEffect(() => {
    const timer = setTimeout(() => setStarted(true), 400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Left brand panel */}
      <div
        className="relative hidden overflow-hidden lg:flex lg:flex-col lg:justify-between p-12 text-white"
        style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #1d4ed8 100%)" }}
      >
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-cyan-400/20 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/10 blur-2xl" />
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link to="/" className="relative text-3xl font-extrabold" dir="ltr">
            ClinI<span className="relative text-primary">Q<span className="absolute -top-0.5 right-0 h-1.5 w-1.5 rounded-full bg-primary" /></span>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative space-y-8"
        >
          <div dir="ltr" className="text-right" style={{ direction: "ltr" }}>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl font-black leading-tight text-left"
            >
              "{t("auth.quote")}"
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-3 text-sm text-white/60 text-left"
            >
              — ClinIQ Team
            </motion.p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {stats.map((s, i) => (
              <AnimatedStat
                key={i}
                icon={s.icon}
                value={s.value}
                label={s.label}
                delay={0.4 + i * 0.1}
                started={started}
              />
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="flex flex-wrap gap-2"
          >
            {[t("auth.trust1"), t("auth.trust2"), t("auth.trust3")].map((trust, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1 + i * 0.1, type: "spring" }}
                className="flex items-center gap-1.5 rounded-pill bg-white/10 px-3 py-1.5 text-xs font-medium backdrop-blur-sm border border-white/10"
              >
                <span className="text-cyan-400">✓</span> {trust}
              </motion.span>
            ))}
          </motion.div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="relative text-xs text-white/40"
          dir="ltr"
        >
          © {new Date().getFullYear()} ClinIQ
        </motion.p>
      </div>

      {/* Right form panel */}
      <div className="relative flex flex-col bg-background">
        <div className="flex items-center justify-between p-6">
          <Link to="/" className="text-xl font-extrabold text-primary lg:hidden" dir="ltr">
            ClinI<span className="relative text-primary">Q<span className="absolute -top-0.5 right-0 h-1.5 w-1.5 rounded-full bg-primary" /></span>
          </Link>
          <div className="ms-auto flex items-center gap-2">
            <button
              onClick={() => setLang(lang === "en" ? "ar" : "en")}
              className="rounded-pill border border-border px-3 py-1.5 text-xs font-semibold transition hover:border-primary hover:text-primary"
            >
              {lang === "en" ? "عربي" : "EN"}
            </button>
            <button
              onClick={toggle}
              className="rounded-full border border-border p-2 transition hover:border-primary hover:text-primary"
              aria-label="Theme"
            >
              {resolved === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div className="flex flex-1 items-center justify-center px-6 pb-12 sm:px-12">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md"
          >
            <h1 className="text-3xl font-black tracking-tight">{title}</h1>
            <div className="mt-8">{children}</div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
