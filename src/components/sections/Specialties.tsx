import { motion } from "framer-motion";
import * as LucideIcons from "lucide-react";
import { ArrowRight } from "lucide-react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useLanguage } from "@/context/LanguageContext";
import { useContent, pickByLang } from "@/services/contentStore";

const COLOR_MAP: Record<string, { bg: string; color: string }> = {
  rose: { bg: "bg-rose-100 dark:bg-rose-500/15", color: "text-rose-600" },
  violet: { bg: "bg-violet-100 dark:bg-violet-500/15", color: "text-violet-600" },
  blue: { bg: "bg-blue-100 dark:bg-blue-500/15", color: "text-blue-600" },
  cyan: { bg: "bg-cyan-100 dark:bg-cyan-500/15", color: "text-cyan-600" },
  orange: { bg: "bg-orange-100 dark:bg-orange-500/15", color: "text-orange-600" },
  pink: { bg: "bg-pink-100 dark:bg-pink-500/15", color: "text-pink-600" },
  emerald: { bg: "bg-emerald-100 dark:bg-emerald-500/15", color: "text-emerald-600" },
  slate: { bg: "bg-slate-100 dark:bg-slate-500/15", color: "text-slate-600" },
};

export function Specialties() {
  const { t, lang } = useLanguage();
  const content = useContent();
  const nav = useNavigate();

  return (
    <section className="bg-muted/40" id="specialties">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-4xl font-black tracking-tight sm:text-5xl">{t("specialties.title")}</h2>
            <p className="mt-3 text-muted-foreground">{t("specialties.subtitle")}</p>
          </div>
        </div>
        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {content.specialties.map((s, i) => {
            const IconComp = (LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[s.icon] ?? LucideIcons.Stethoscope;
            const colors = COLOR_MAP[s.color] ?? COLOR_MAP.slate;
            return (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ scale: 1.04 }}
              >
                <button
                  onClick={() => nav({ to: "/search", search: { specialty: s.name.en } as never })}
                  className="group flex w-full flex-col items-center gap-3 rounded-xl border border-border bg-surface p-6 text-start transition hover:border-primary hover:bg-primary/5"
                >
                  <span className={`flex h-12 w-12 items-center justify-center rounded-xl ${colors.bg}`}>
                    <IconComp className={`h-6 w-6 ${colors.color}`} />
                  </span>
                  <span className="font-semibold group-hover:text-primary">{pickByLang(s.name, lang)}</span>
                </button>
              </motion.div>
            );
          })}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: content.specialties.length * 0.05 }}>
            <Link to="/search" className="group flex h-full flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-primary/40 bg-primary/5 p-6 text-primary transition hover:bg-primary/10">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-500/15">
                <ArrowRight className="h-6 w-6 transition group-hover:translate-x-1" />
              </span>
              <span className="font-semibold">{t("specialties.viewAll")}</span>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
