import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { AuthLayout } from "@/layouts/AuthLayout";
import { Input } from "@/components/ui/FormInput";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { GoogleButton } from "@/components/common/GoogleButton";
import api from "@/api/axios";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Login — ClinIQ" },
      { name: "description", content: "Sign in to your ClinIQ account to manage appointments." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { t } = useLanguage();
  const { login, setAuthData } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    try {
      await login(email, password);
      toast.success(t("auth.loginSuccess"));
      nav({ to: "/" });
    } catch {
      toast.error("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title={t("auth.welcomeBack")}>
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
          icon={<Mail className="h-4 w-4" />}
          type="email"
          placeholder={t("auth.email")}
          value={email}
          onChange={setEmail}
        />
        <Input
          icon={<Lock className="h-4 w-4" />}
          password
          placeholder={t("auth.password")}
          value={password}
          onChange={setPassword}
        />

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="h-4 w-4 rounded border-border text-primary" />
            <span>{t("auth.remember")}</span>
          </label>
          <Link to="/forgot-password" className="font-medium text-primary hover:underline">
            {t("auth.forgot")}
          </Link>
        </div>

        <button
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-md bg-primary py-3 text-sm font-bold text-primary-foreground shadow-button transition hover:opacity-90 disabled:opacity-60"
        >
          {loading ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            <>
              {t("auth.signIn")} <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        {t("auth.noAccount")}{" "}
        <Link to="/register" className="font-semibold text-primary hover:underline">
          {t("auth.createOne")} →
        </Link>
      </p>
    </AuthLayout>
  );
}
