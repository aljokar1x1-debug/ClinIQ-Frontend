import { motion } from "framer-motion";
import * as LucideIcons from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useContent, pickByLang } from "@/services/contentStore";

export function HowItWorks() {
  const { t, lang } = useLanguage();
  const content = useContent();

  return (
    <section id="how-it-works" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h2 className="text-4xl font-black tracking-tight sm:text-5xl">{t("how.title")}</h2>
        <p className="mt-3 text-muted-foreground">{t("how.subtitle")}</p>
      </motion.div>

      <div className="relative mt-16 grid gap-10 md:grid-cols-3">
        <div
          className="absolute left-0 right-0 top-12 hidden h-px md:block"
          style={{
            backgroundImage:
              "repeating-linear-gradient(to right, var(--color-border) 0 8px, transparent 8px 16px)",
          }}
        />
        {content.howItWorks.map((s, i) => {
          const IconComp =
            (LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[
              s.icon
            ] ?? LucideIcons.Circle;
          return (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.12, type: "spring", stiffness: 120, damping: 14 }}
              className="relative text-center"
            >
              <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-[120px] font-black leading-none text-primary/5 select-none">
                {i + 1}
              </span>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="relative mx-auto flex h-24 w-24 items-center justify-center rounded-full border border-border bg-surface shadow-card"
              >
                <IconComp className="h-10 w-10 text-primary" />
              </motion.div>
              <h3 className="mt-6 text-xl font-bold">{pickByLang(s.title, lang)}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{pickByLang(s.desc, lang)}</p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
