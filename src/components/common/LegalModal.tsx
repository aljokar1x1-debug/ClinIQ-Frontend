import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const PRIVACY = {
  en: `ClinIQ respects your privacy. We collect only the data necessary to provide our booking service: your name, contact information, and appointment history. We use industry-standard encryption to protect this data, and we never sell or share your personal information with third parties without your consent. You may request access, correction, or deletion of your data at any time by contacting our support team. By using ClinIQ, you consent to this policy.`,
  ar: `تحترم ClinIQ خصوصيتك. نقوم بجمع البيانات الضرورية فقط لتقديم خدمة الحجز: اسمك ومعلومات الاتصال وسجل المواعيد. نستخدم تشفيراً بمستوى الصناعة لحماية هذه البيانات، ولا نبيع أو نشارك معلوماتك الشخصية مع أطراف ثالثة دون موافقتك. يمكنك طلب الوصول أو التصحيح أو الحذف في أي وقت بالتواصل مع فريق الدعم. باستخدامك ClinIQ فأنت توافق على هذه السياسة.`,
};

const TERMS = {
  en: `By using ClinIQ you agree to these terms. ClinIQ is a booking platform that connects patients with verified healthcare providers. We do not provide medical advice or treatment. Bookings are free but subject to clinic policies. You agree to provide accurate information and to attend your appointments on time. Free cancellation is available up to 24 hours before your visit. Repeated no-shows may result in account suspension. ClinIQ may update these terms at any time.`,
  ar: `باستخدامك ClinIQ فأنت توافق على هذه الشروط. ClinIQ منصة حجز تربط المرضى بمقدمي الرعاية الصحية الموثوقين. نحن لا نقدم استشارات أو علاجاً طبياً. الحجز مجاني لكنه يخضع لسياسات العيادات. توافق على تقديم معلومات صحيحة وحضور المواعيد في وقتها. الإلغاء المجاني متاح حتى 24 ساعة قبل الزيارة. تكرار عدم الحضور قد يؤدي إلى تعليق الحساب. يجوز لـ ClinIQ تحديث هذه الشروط في أي وقت.`,
};

export function LegalModal({
  open,
  kind,
  onClose,
}: {
  open: boolean;
  kind: "privacy" | "terms";
  onClose: () => void;
}) {
  const { lang } = useLanguage();
  const ar = lang === "ar";
  const title = kind === "privacy" ? (ar ? "سياسة الخصوصية" : "Privacy Policy") : ar ? "شروط الخدمة" : "Terms of Service";
  const body = kind === "privacy" ? (ar ? PRIVACY.ar : PRIVACY.en) : ar ? TERMS.ar : TERMS.en;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, y: 10, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[85vh] w-full max-w-2xl overflow-hidden rounded-2xl border border-border bg-card shadow-glow"
          >
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
              <h2 className="text-lg font-bold">{title}</h2>
              <button onClick={onClose} className="rounded-md p-1 hover:bg-muted" aria-label="Close">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="max-h-[60vh] overflow-y-auto px-6 py-5 text-sm leading-relaxed text-muted-foreground">
              {body.split("\n").map((p, i) => (
                <p key={i} className="mb-3">
                  {p}
                </p>
              ))}
            </div>
            <div className="flex justify-end border-t border-border px-6 py-3">
              <button
                onClick={onClose}
                className="rounded-md bg-primary px-5 py-2 text-sm font-bold text-primary-foreground shadow-button hover:opacity-90"
              >
                {ar ? "إغلاق" : "Close"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
