import { useLanguage } from "@/context/LanguageContext";
import { Link } from "@tanstack/react-router";

export function CTASection() {
  const { t } = useLanguage();
  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-3xl gradient-primary px-8 py-16 text-center text-white shadow-glow">
        <h2 className="text-4xl font-black tracking-tight sm:text-5xl">{t("cta.title")}</h2>
        <p className="mx-auto mt-3 max-w-xl text-base opacity-90">{t("cta.subtitle")}</p>
        <Link to="/register" className="mt-8 inline-flex rounded-md bg-white px-8 py-4 text-sm font-bold text-primary shadow-card transition hover:scale-105">
          {t("cta.btn")}
        </Link>
      </div>
    </section>
  );
}
