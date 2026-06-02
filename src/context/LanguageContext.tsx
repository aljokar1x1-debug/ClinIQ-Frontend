import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import en from "@/locales/en.json";
import ar from "@/locales/ar.json";

type Lang = "en" | "ar";
type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (key: string) => string; dir: "ltr" | "rtl" };

const dict = { en, ar } as const;
const LangCtx = createContext<Ctx | null>(null);

function getValue(obj: unknown, path: string): string {
  return path.split(".").reduce<unknown>((acc, k) => (acc && typeof acc === "object" ? (acc as Record<string, unknown>)[k] : undefined), obj) as string ?? path;
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const saved = (localStorage.getItem("cliniq-lang") as Lang) || "en";
    setLangState(saved);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    localStorage.setItem("cliniq-lang", lang);
  }, [lang]);

  const t = (key: string) => getValue(dict[lang], key);
  const dir = lang === "ar" ? "rtl" : "ltr";

  return <LangCtx.Provider value={{ lang, setLang: setLangState, t, dir }}>{children}</LangCtx.Provider>;
}

export const useLanguage = () => {
  const c = useContext(LangCtx);
  if (!c) throw new Error("useLanguage must be used within LanguageProvider");
  return c;
};
