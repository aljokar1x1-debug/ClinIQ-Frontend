import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quote, Star } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useContent, pickByLang } from "@/services/contentStore";
import { DoctorAvatar } from "@/components/common/DoctorAvatar";

export function Testimonials() {
  const { t, lang } = useLanguage();
  const content = useContent();
  const reviews = content.testimonials;
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (reviews.length === 0 || paused) return;
    const id = setInterval(() => setI((p) => (p + 1) % reviews.length), 5000);
    return () => clearInterval(id);
  }, [reviews.length, paused]);

  if (reviews.length === 0) return null;
  const safeI = i % reviews.length;
  const r = reviews[safeI];
  const name = pickByLang(r.name, lang);
  const date = pickByLang(r.date, lang);
  const text = pickByLang(r.text, lang);

  return (
    <section className="bg-muted/40">
      <div className="mx-auto max-w-5xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl font-black tracking-tight sm:text-5xl">
            {t("testimonials.title")}
          </h2>
          <p className="mt-3 text-muted-foreground">{t("testimonials.subtitle")}</p>
        </motion.div>

        <div
          className="relative mt-12 overflow-hidden"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <Quote className="pointer-events-none absolute -top-2 left-1/2 h-40 w-40 -translate-x-1/2 text-primary/5" />
          <AnimatePresence mode="wait">
            <motion.div
              key={safeI}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="relative mx-auto max-w-2xl"
            >
              <div className="flex justify-center gap-1">
                {Array.from({ length: 5 }).map((_, k) => (
                  <Star
                    key={k}
                    className={`h-5 w-5 ${k < r.rating ? "fill-yellow-400 text-yellow-400" : "text-border"}`}
                  />
                ))}
              </div>
              <p className="mt-6 text-xl font-medium leading-relaxed">"{text}"</p>
              <div className="mt-8 flex items-center justify-center gap-3">
                <DoctorAvatar
                  doctorId={r.id}
                  name={r.name.en}
                  kind="reviewer"
                  className="h-12 w-12 rounded-full bg-primary"
                />
                <div className="text-start">
                  <p className="font-semibold">{name}</p>
                  <p className="text-xs text-muted-foreground">{date}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
          <div className="mt-8 flex justify-center gap-2">
            {reviews.map((_, k) => (
              <button
                key={k}
                onClick={() => setI(k)}
                className={`h-1.5 rounded-full transition-all ${k === safeI ? "w-8 bg-primary" : "w-1.5 bg-border"}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
