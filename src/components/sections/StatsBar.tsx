import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { UserRound, CalendarDays, Star, Hospital } from "lucide-react";
import { useContent, pickByLang } from "@/services/contentStore";
import { useLanguage } from "@/context/LanguageContext";

const ICONS = [UserRound, CalendarDays, Star, Hospital];

function parseValue(s: string): { num: number; suffix: string; decimals: number } {
  const m = s.match(/^([\d.]+)(.*)$/);
  if (!m) return { num: 0, suffix: s, decimals: 0 };
  const num = parseFloat(m[1]);
  const decimals = (m[1].split(".")[1] || "").length;
  return { num, suffix: m[2] || "", decimals };
}

export function StatsBar() {
  const { lang } = useLanguage();
  const content = useContent();
  const ref = useRef<HTMLDivElement>(null);
  const counted = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    counted.current = false;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !counted.current) {
        counted.current = true;
        el.querySelectorAll<HTMLSpanElement>("[data-target]").forEach((span) => {
          const target = parseFloat(span.dataset.target!);
          const dec = parseInt(span.dataset.decimals || "0");
          const obj = { v: 0 };
          gsap.to(obj, { v: target, duration: 2, ease: "power2.out", onUpdate: () => { span.textContent = obj.v.toFixed(dec); } });
        });
      }
    }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [content.stats]);

  return (
    <section ref={ref} className="bg-primary text-primary-foreground">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 py-12 sm:px-6 md:grid-cols-4 lg:px-8">
        {content.stats.map((s, i) => {
          const { num, suffix, decimals } = parseValue(s.value);
          const Icon = ICONS[i % ICONS.length];
          return (
            <div key={s.id} className="text-center">
              <Icon className="mx-auto mb-2 h-7 w-7 opacity-90" />
              <p className="text-4xl font-black">
                <span data-target={num} data-decimals={decimals}>0</span>{suffix}
              </p>
              <p className="mt-1 text-sm font-medium opacity-90">{pickByLang(s.label, lang)}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
