import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Mail, Lock, User, Phone, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { AuthLayout } from "@/layouts/AuthLayout";
import { Input } from "@/components/ui/FormInput";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { GoogleButton } from "@/components/common/GoogleButton";
import api from "@/api/axios";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Create your ClinIQ account" },
      { name: "description", content: "Join ClinIQ and book verified doctors in seconds." },
    ],
  }),
  component: RegisterPage,
});

function strength(pw: string) {
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  if (pw.length >= 12) s++;
  return s;
}

const colors = ["bg-destructive", "bg-yellow-500", "bg-orange-500", "bg-emerald-500", "bg-accent"];
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function RegisterPage() {
  const { t } = useLanguage();
  const { register, setAuthData } = useAuth();
  const nav = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState(false);

  const s = useMemo(() => strength(pw), [pw]);
  const labels = t("auth.strength") as unknown as string[];

  const errors = {
    name: !name.trim() ? "Full name is required" : "",
    email: !email.trim() ? "Email is required" : !emailRegex.test(email) ? "Please enter a valid email address" : "",
    pw: pw.length < 8 ? "Password must be at least 8 characters" : "",
    pw2: pw2 && pw2 !== pw ? "Passwords don't match" : !pw2 ? "Please confirm your password" : "",
  };

  const isValid = !errors.name && !errors.email && !errors.pw && !errors.pw2 && agree;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!isValid) return;
    setLoading(true);
    try {
      await register(name, email, pw, "Patient");
      toast.success(t("auth.loginSuccess"));
      nav({ to: "/" });
    } catch {
      toast.error("Registration failed. Email may already be in use.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title={t("auth.createAccount")}>
      <GoogleButton
        onSuccess={async (idToken) => {
          try {
            const res = await api.post("/Auth/google", { idToken });
            setAuthData(res.data);
            toast.success(t("auth.loginSuccess"));
            nav({ to: "/" });
          } catch {
            toast.error("Google login failed");
          }
        }}
        onError={() => toast.error("Google login failed")}
      />

      <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
        <div className="h-px flex-1 bg-border" />
        {t("auth.or")}
        <div className="h-px flex-1 bg-border" />
      </div>

      <form onSubmit={submit} className="space-y-4">
        <Input
          icon={<User className="h-4 w-4" />}
          placeholder={t("auth.fullName")}
          value={name}
          onChange={setName}
          error={touched ? errors.name : ""}
        />
        <Input
          icon={<Mail className="h-4 w-4" />}
          type="email"
          placeholder={t("auth.email")}
          value={email}
          onChange={setEmail}
          error={touched ? errors.email : ""}
        />
        <div className="flex items-center gap-2">
          <select className="rounded-md border border-border bg-surface px-2 py-2.5 text-sm">
            <option>🇪🇬 +20</option>
            <option>🇸🇦 +966</option>
            <option>🇦🇪 +971</option>
          </select>
          <div className="flex-1">
            <Input
              icon={<Phone className="h-4 w-4" />}
              type="tel"
              placeholder={t("auth.phone")}
              value={phone}
              onChange={setPhone}
            />
          </div>
        </div>
        <Input
          icon={<Lock className="h-4 w-4" />}
          password
          placeholder={t("auth.password")}
          value={pw}
          onChange={setPw}
          error={touched ? errors.pw : ""}
        />

        {pw && (
          <div>
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={false}
                  animate={{ backgroundColor: i < s ? undefined : "" }}
                  className={`h-1.5 flex-1 rounded-full transition-colors ${i < s ? colors[s - 1] : "bg-border"}`}
                />
              ))}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">{s > 0 && labels[s - 1]}</p>
          </div>
        )}

        <Input
          icon={<Lock className="h-4 w-4" />}
          password
          placeholder={t("auth.confirmPassword")}
          value={pw2}
          onChange={setPw2}
          error={touched ? errors.pw2 : ""}
          success={!!pw2 && pw2 === pw}
        />

        <label className="flex items-start gap-2 text-sm text-muted-foreground">
          <input
            type="checkbox"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
            className="mt-1 h-4 w-4 rounded border-border text-primary"
          />
          <span>{t("auth.agree")}</span>
        </label>
        {touched && !agree && (
          <p className="text-xs text-destructive">You must agree to the terms to continue</p>
        )}

        <button
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-md bg-primary py-3 text-sm font-bold text-primary-foreground shadow-button transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "..." : <>{t("auth.register")} <ArrowRight className="h-4 w-4" /></>}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        {t("auth.hasAccount")}{" "}
        <Link to="/login" className="font-semibold text-primary hover:underline">
          {t("auth.signInLink")} →
        </Link>
      </p>
    </AuthLayout>
  );
}
