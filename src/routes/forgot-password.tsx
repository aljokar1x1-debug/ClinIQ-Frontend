import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Phone, KeyRound, Lock, ArrowLeft, ArrowRight } from "lucide-react";
import { AuthLayout } from "@/layouts/AuthLayout";
import { Input } from "@/components/ui/FormInput";
import { useLanguage } from "@/context/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({ meta: [{ title: "Reset password — ClinIQ" }, { name: "description", content: "Reset your ClinIQ password in three quick steps." }] }),
  component: Forgot,
});

function Forgot() {
  const { t } = useLanguage();
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [pw, setPw] = useState(""); const [pw2, setPw2] = useState("");
  const [countdown, setCountdown] = useState(45);
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (step !== 2) return;
    setCountdown(45);
    const id = setInterval(() => setCountdown((c) => (c > 0 ? c - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, [step]);

  const handleOtp = (i: number, v: string) => {
    if (!/^\d?$/.test(v)) return;
    const next = [...otp]; next[i] = v; setOtp(next);
    if (v && i < 5) refs.current[i + 1]?.focus();
  };

  const titles: Record<number, { t: string; d: string; icon: React.ReactNode }> = {
    1: { t: t("auth.forgotTitle"), d: t("auth.forgotDesc"), icon: <KeyRound className="h-7 w-7" /> },
    2: { t: t("auth.otpTitle"), d: `${t("auth.otpDesc")} ${phone || "+20 1•• ••• ••78"}`, icon: <Phone className="h-7 w-7" /> },
    3: { t: t("auth.newPwTitle"), d: t("auth.newPwDesc"), icon: <Lock className="h-7 w-7" /> },
  };
  const cur = titles[step];

  return (
    <AuthLayout title="">
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.3 }}
        >
          <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
            {cur.icon}
          </div>
          <h2 className="text-2xl font-black">{cur.t}</h2>
          <p className="mt-2 text-sm text-muted-foreground">{cur.d}</p>

          <div className="mt-6 space-y-4">
            {step === 1 && (
              <>
                <div className="flex items-center gap-2">
                  <select className="rounded-md border border-border bg-surface px-2 py-2.5 text-sm"><option>🇪🇬 +20</option></select>
                  <div className="flex-1"><Input icon={<Phone className="h-4 w-4" />} type="tel" placeholder={t("auth.phone")} value={phone} onChange={setPhone} /></div>
                </div>
                <button onClick={() => setStep(2)} className="flex w-full items-center justify-center gap-2 rounded-md bg-primary py-3 text-sm font-bold text-primary-foreground shadow-button">
                  {t("auth.sendCode")} <ArrowRight className="h-4 w-4" />
                </button>
                <Link to="/login" className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-primary">
                  <ArrowLeft className="h-4 w-4" /> {t("auth.backToLogin")}
                </Link>
              </>
            )}

            {step === 2 && (
              <>
                <div className="flex justify-center gap-2">
                  {otp.map((v, i) => (
                    <input
                      key={i}
                      ref={(el) => { refs.current[i] = el; }}
                      value={v}
                      onChange={(e) => handleOtp(i, e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Backspace" && !v && i > 0) refs.current[i - 1]?.focus(); }}
                      maxLength={1}
                      inputMode="numeric"
                      className="h-14 w-12 rounded-md border border-border bg-surface text-center text-xl font-bold outline-none focus:border-primary focus:ring-4 focus:ring-primary/20"
                    />
                  ))}
                </div>
                <p className="text-center text-sm text-muted-foreground">
                  {countdown > 0 ? `${t("auth.resend")} 00:${countdown.toString().padStart(2, "0")}` : (
                    <button onClick={() => setCountdown(45)} className="font-semibold text-primary hover:underline">Resend code</button>
                  )}
                </p>
                <button onClick={() => setStep(3)} className="flex w-full items-center justify-center gap-2 rounded-md bg-primary py-3 text-sm font-bold text-primary-foreground shadow-button">
                  {t("auth.verify")} <ArrowRight className="h-4 w-4" />
                </button>
              </>
            )}

            {step === 3 && (
              <>
                <Input icon={<Lock className="h-4 w-4" />} password placeholder={t("auth.password")} value={pw} onChange={setPw} />
                <Input icon={<Lock className="h-4 w-4" />} password placeholder={t("auth.confirmPassword")} value={pw2} onChange={setPw2}
                  error={pw2 && pw2 !== pw ? "Passwords don't match" : undefined}
                  success={!!pw2 && pw2 === pw}
                />
                <Link to="/login" className="flex w-full items-center justify-center gap-2 rounded-md bg-primary py-3 text-sm font-bold text-primary-foreground shadow-button">
                  {t("auth.reset")} <ArrowRight className="h-4 w-4" />
                </Link>
              </>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </AuthLayout>
  );
}
