import { useLanguage } from "@/context/LanguageContext";
import { Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { useState } from "react";
import { useContent, pickByLang } from "@/services/contentStore";
import { LegalModal } from "./LegalModal";

const TwitterIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const LinkedinIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const InstagramIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className="h-4 w-4"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

export function Footer() {
  const { t, lang } = useLanguage();
  const ar = lang === "ar";
  const content = useContent();
  const navigate = useNavigate();
  const [legal, setLegal] = useState<null | "privacy" | "terms">(null);

  const isValidUrl = (url: string) => url && url !== "#" && url.startsWith("http");

  const handleSupport = (id: string) => {
    if (id === "status") {
      toast.success(ar ? "جميع الأنظمة تعمل بشكل طبيعي ✅" : "All systems operational ✅");
      return;
    }
    if (id === "faq") {
      if (typeof window !== "undefined") {
        if (window.location.pathname !== "/") {
          window.location.href = "/#faq";
          return;
        }
        document.querySelector("[data-faq]")?.scrollIntoView({ behavior: "smooth" });
      }
      return;
    }
    if (id === "help") {
      toast.info(ar ? "مركز المساعدة قريباً" : "Help Center coming soon");
      return;
    }
  };

  const comingSoonCompany = (id: string) => {
    if (id === "about") return;
    toast.info(ar ? "قريباً" : "Coming soon");
  };

  const socials = [
    { Icon: TwitterIcon, url: content.footer.social.twitter },
    { Icon: FacebookIcon, url: content.footer.social.facebook },
    { Icon: LinkedinIcon, url: content.footer.social.linkedin },
    { Icon: InstagramIcon, url: content.footer.social.instagram },
  ];

  return (
    <footer className="bg-[#0F172A] text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-4 lg:px-8">
        <div>
          <Link to="/" className="text-2xl font-extrabold">
            ClinI<span className="relative text-primary">Q<span className="absolute -top-0.5 right-0 h-1.5 w-1.5 rounded-full bg-primary" /></span>
          </Link>
          <p className="mt-4 text-sm text-white/70">{pickByLang(content.footer.tagline, lang)}</p>
          <div className="mt-6 flex gap-3">
            {socials
              .filter(({ url }) => isValidUrl(url))
              .map(({ Icon, url }, i) => (
                <a
                  key={i}
                  href={url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition hover:bg-primary"
                >
                  <Icon />
                </a>
              ))}
          </div>
        </div>

        <div>
          <h4 className="font-semibold">ClinIQ</h4>
          <ul className="mt-4 space-y-2 text-sm text-white/70">
            {content.footer.company.map((item) =>
              item.url.startsWith("/") ? (
                <li key={item.id}>
                  <a href={item.url} className="transition hover:text-white">
                    {pickByLang(item.label, lang)}
                  </a>
                </li>
              ) : (
                <li key={item.id}>
                  <button
                    onClick={() => comingSoonCompany(item.id)}
                    className="transition hover:text-white"
                  >
                    {pickByLang(item.label, lang)}
                  </button>
                </li>
              ),
            )}
          </ul>
        </div>

        <div>
          <h4 className="font-semibold">{t("specialties.title")}</h4>
          <ul className="mt-4 space-y-2 text-sm text-white/70">
            {content.footer.specialties.map((s) => (
              <li key={s.id}>
                <button
                  onClick={() => navigate({ to: "/search", search: { specialty: s.id } })}
                  className="transition hover:text-white"
                >
                  {pickByLang(s.label, lang)}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-semibold">{t("footer.support")}</h4>
          <ul className="mt-4 space-y-2 text-sm text-white/70">
            {content.footer.support.map((s) =>
              s.url.startsWith("/") ? (
                <li key={s.id}>
                  <a href={s.url} className="transition hover:text-white">
                    {pickByLang(s.label, lang)}
                  </a>
                </li>
              ) : (
                <li key={s.id}>
                  <button
                    onClick={() => handleSupport(s.id)}
                    className="transition hover:text-white"
                  >
                    {pickByLang(s.label, lang)}
                  </button>
                </li>
              ),
            )}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-6 text-xs text-white/60 sm:flex-row sm:px-6 lg:px-8">
          <span>© {new Date().getFullYear()} ClinIQ. {pickByLang(content.footer.copyright, lang)}</span>
          <div className="flex gap-4">
            <button onClick={() => setLegal("privacy")} className="hover:text-white">
              {t("footer.privacy")}
            </button>
            <button onClick={() => setLegal("terms")} className="hover:text-white">
              {t("footer.terms")}
            </button>
          </div>
        </div>
      </div>
      <LegalModal open={legal !== null} kind={legal ?? "privacy"} onClose={() => setLegal(null)} />
    </footer>
  );
}
