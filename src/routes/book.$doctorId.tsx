import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  ArrowLeft,
  ArrowRight,
  Calendar,
  Clock,
  User,
  FileText,
  CheckCircle2,
  Building2,
  Video,
  Home,
  Copy,
  LayoutDashboard,
} from "lucide-react";
import { toast } from "sonner";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { useLanguage } from "@/context/LanguageContext";
import { doctorsApi, DoctorProfile } from "@/api/doctors";
import { appointmentsApi } from "@/api/appointments";
import { useAuth } from "@/context/AuthContext";

export const Route = createFileRoute("/book/$doctorId")({
  component: BookingFlow,
});

const TIME_SLOTS = [
  "09:00 AM",
  "09:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "12:00 PM",
  "12:30 PM",
  "01:00 PM",
  "01:30 PM",
  "02:00 PM",
  "02:30 PM",
  "03:00 PM",
  "03:30 PM",
  "04:00 PM",
  "04:30 PM",
];

function getNextDays(n: number): Date[] {
  const days: Date[] = [];
  for (let i = 0; i < n; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i + 1);
    days.push(d);
  }
  return days;
}

type VisitType = "clinic" | "video" | "home";

function BookingFlow() {
  const { doctorId } = Route.useParams();
  const { t, lang } = useLanguage();
  const ar = lang === "ar";
  const navigate = useNavigate();
  const { user } = useAuth();
  const [doctor, setDoctor] = useState<DoctorProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(0);
  const [visitType, setVisitType] = useState<VisitType>("clinic");
  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState<string>("");
  const [info, setInfo] = useState({
    name: user?.fullName || "",
    phone: "",
    email: user?.email || "",
    reason: "",
  });
  const [success, setSuccess] = useState(false);
  const [bookingId, setBookingId] = useState("");

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const data = await doctorsApi.getById(parseInt(doctorId));
        setDoctor(data);
      } catch {
        toast.error("Doctor not found");
        navigate({ to: "/search", search: { specialty: "" } });
      } finally {
        setLoading(false);
      }
    };
    fetchDoctor();
  }, [doctorId, navigate]);
  const days = getNextDays(7);
  const STEPS = [
    t("booking.chooseVisit"),
    t("booking.pickDate"),
    t("booking.yourInfo"),
    t("booking.confirm"),
  ];
  const canNext = [
    !!visitType,
    !!date && !!time,
    info.name.length > 1 && info.phone.length > 5,
    true,
  ][step];

  const visitLabel =
    visitType === "clinic"
      ? t("booking.clinic")
      : visitType === "video"
        ? t("booking.video")
        : t("booking.home");
  const docName = doctor ? (ar ? doctor.fullName : doctor.fullName) : "";
  const locale = ar ? "ar-EG" : "en-US";

  const next = async () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      try {
        if (!user) {
          toast.error("Please login first");
          navigate({ to: "/login" });
          return;
        }
        const result = await appointmentsApi.create({
          doctorId: parseInt(doctorId),
          appointmentDate: date!.toISOString(),
          timeSlot: time,
          type: visitType === "clinic" ? "InPerson" : visitType === "video" ? "Online" : "Home",
          notes: info.reason,
        });
        setBookingId("CQ-" + result.appointmentId);
        setSuccess(true);
        toast.success(t("booking.successToast"));
      } catch {
        toast.error("Booking failed, please try again");
      }
    }
  };

  const back = () => setStep(Math.max(0, step - 1));
  const copyId = () => {
    navigator.clipboard.writeText(bookingId);
    toast.success(t("booking.copied"));
  };

  if (loading)
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );

  if (!doctor) return null;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <Link
          to="/search"
          search={{ specialty: "" }}
          className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" /> {t("booking.backProfile")}
        </Link>

        <Stepper step={step} steps={STEPS} />

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_300px]">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-card sm:p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                {step === 0 && (
                  <div>
                    <h2 className="text-2xl font-bold">{t("booking.chooseVisit")}</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {t("booking.chooseVisitDesc").replace("{name}", docName)}
                    </p>
                    <div className="mt-6 grid gap-3 sm:grid-cols-3">
                      <VisitOption
                        active={visitType === "clinic"}
                        onClick={() => setVisitType("clinic")}
                        icon={<Building2 className="h-6 w-6" />}
                        title={t("booking.clinic")}
                        desc={t("booking.clinicDesc")}
                      />
                      <VisitOption
                        active={visitType === "video"}
                        onClick={() => setVisitType("video")}
                        icon={<Video className="h-6 w-6" />}
                        title={t("booking.video")}
                        desc={t("booking.videoDesc")}
                      />
                      <VisitOption
                        active={visitType === "home"}
                        onClick={() => setVisitType("home")}
                        icon={<Home className="h-6 w-6" />}
                        title={t("booking.home")}
                        desc={t("booking.homeDesc")}
                      />
                    </div>
                  </div>
                )}

                {step === 1 && (
                  <div>
                    <h2 className="text-2xl font-bold">{t("booking.pickDate")}</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {t("booking.pickDateDesc")}
                    </p>
                    <div className="mt-6 flex gap-2 overflow-x-auto pb-2">
                      {days.map((d) => {
                        const sel = date && d.toDateString() === date.toDateString();
                        return (
                          <button
                            key={d.toISOString()}
                            onClick={() => {
                              setDate(d);
                              setTime("");
                            }}
                            className={`flex min-w-[72px] flex-col items-center rounded-xl border px-3 py-2 transition-colors ${sel ? "border-primary bg-primary text-primary-foreground" : "border-border hover:bg-muted"}`}
                          >
                            <span className="text-xs font-medium">
                              {d.toLocaleDateString(locale, { weekday: "short" })}
                            </span>
                            <span className="text-lg font-bold">{d.getDate()}</span>
                            <span className="text-xs">
                              {d.toLocaleDateString(locale, { month: "short" })}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                    <div className="mt-6">
                      <p className="mb-2 text-sm font-semibold">{t("booking.availableTimes")}</p>
                      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                        {TIME_SLOTS.map((tm) => (
                          <button
                            key={tm}
                            disabled={!date}
                            onClick={() => setTime(tm)}
                            className={`rounded-md border py-2 text-sm font-semibold transition-colors disabled:opacity-30 ${time === tm ? "border-primary bg-primary text-primary-foreground" : "border-border hover:bg-muted"}`}
                          >
                            {tm}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div>
                    <h2 className="text-2xl font-bold">{t("booking.yourInfo")}</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {t("booking.yourInfoDesc")}
                    </p>
                    <div className="mt-6 grid gap-4 sm:grid-cols-2">
                      <Field
                        label={t("booking.fullName")}
                        value={info.name}
                        onChange={(v) => setInfo({ ...info, name: v })}
                        placeholder={ar ? "محمد علي" : "Jane Doe"}
                      />
                      <Field
                        label={t("booking.phone")}
                        value={info.phone}
                        onChange={(v) => setInfo({ ...info, phone: v })}
                        placeholder="+20 100 000 0000"
                      />
                      <Field
                        label={t("booking.email")}
                        value={info.email}
                        onChange={(v) => setInfo({ ...info, email: v })}
                        placeholder="you@example.com"
                      />
                      <div className="sm:col-span-2">
                        <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          {t("booking.reason")}
                        </label>
                        <textarea
                          value={info.reason}
                          onChange={(e) => setInfo({ ...info, reason: e.target.value })}
                          rows={3}
                          placeholder={t("booking.reasonPlaceholder")}
                          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div>
                    <h2 className="text-2xl font-bold">{t("booking.confirm")}</h2>
                    <p className="mt-1 text-sm text-muted-foreground">{t("booking.confirmDesc")}</p>
                    <div className="mt-6 space-y-3 rounded-xl border border-border bg-muted/40 p-4">
                      <Row label={t("booking.doctor")} value={docName} />
                      <Row
                        label={t("booking.specialty")}
                        value={ar ? doctor.specialtyAr || doctor.specialty : doctor.specialty}
                      />
                      <Row label={t("booking.visitType")} value={visitLabel} />
                      <Row
                        label={t("booking.date")}
                        value={
                          date
                            ? date.toLocaleDateString(locale, {
                                weekday: "long",
                                month: "long",
                                day: "numeric",
                              })
                            : "—"
                        }
                      />
                      <Row label={t("booking.time")} value={time || "—"} />
                      <Row label={t("booking.patient")} value={info.name} />
                      <Row label={t("booking.phone")} value={info.phone} />
                      <div className="border-t border-border pt-3">
                        <Row
                          label={t("booking.total")}
                          value={`${doctor.consultationFee} ${t("currency")}`}
                          highlight
                        />
                        <p className="mt-1 text-xs text-muted-foreground">{t("booking.payNote")}</p>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            <div className="mt-8 flex items-center justify-between border-t border-border pt-6">
              <button
                onClick={back}
                disabled={step === 0}
                className="flex items-center gap-1 rounded-md px-4 py-2 text-sm font-semibold text-muted-foreground disabled:opacity-30 hover:bg-muted"
              >
                <ArrowLeft className="h-4 w-4" /> {t("booking.back")}
              </button>
              <button
                onClick={next}
                disabled={!canNext}
                className="flex items-center gap-1 rounded-md bg-primary px-6 py-2.5 text-sm font-bold text-primary-foreground shadow-button transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {step === 3 ? t("booking.confirmBtn") : t("booking.continue")}{" "}
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <aside className="rounded-2xl border border-border bg-card p-5 shadow-card lg:sticky lg:top-24 lg:self-start">
            <div className="flex gap-3">
            {doctor.profileImage ? (
  <img src={doctor.profileImage} alt={doctor.fullName} className="h-16 w-16 shrink-0 rounded-xl object-cover" />
) : (
  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-2xl font-bold text-primary">
    {doctor.fullName.charAt(0)}
  </div>
)}
              <div>
                <p className="font-bold">{docName}</p>
                <p className="text-xs text-primary">
                  {ar ? doctor.specialtyAr || doctor.specialty : doctor.specialty}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {doctor.area}, {ar ? doctor.cityAr || doctor.city : doctor.city}
                </p>
              </div>
            </div>
            <div className="mt-4 space-y-2 border-t border-border pt-4 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("booking.consultation")}</span>
                <span className="font-bold">
                  {doctor.consultationFee} {t("currency")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("booking.bookingFee")}</span>
                <span className="font-bold text-accent">{t("booking.free")}</span>
              </div>
              <div className="flex justify-between border-t border-border pt-2">
                <span className="font-bold">{t("booking.total")}</span>
                <span className="font-bold text-primary">
                  {doctor.consultationFee} {t("currency")}
                </span>
              </div>
            </div>
            <p className="mt-4 flex items-center gap-2 rounded-md bg-accent/10 px-3 py-2 text-xs font-medium text-accent">
              <CheckCircle2 className="h-3.5 w-3.5" /> {t("booking.freeCancel")}
            </p>
          </aside>
        </div>
      </main>

      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 30 }}
              className="w-full max-w-md rounded-2xl bg-card p-8 text-center shadow-glow"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.1 }}
                className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-accent text-white"
              >
                <CheckCircle2 className="h-10 w-10" />
              </motion.div>
              <h3 className="mt-4 text-2xl font-black">{t("booking.success")}</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {docName} ·{" "}
                {date?.toLocaleDateString(locale, {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}{" "}
                · {time}
              </p>
              <button
                onClick={copyId}
                className="mx-auto mt-4 flex items-center gap-2 rounded-pill border border-dashed border-primary/40 bg-primary/5 px-4 py-2 text-xs font-bold text-primary hover:bg-primary/10"
              >
                {t("booking.bookingId")}: {bookingId} <Copy className="h-3 w-3" />
              </button>
              <div className="mt-6 flex flex-col gap-2">
                <button
                  onClick={() => navigate({ to: "/patient/appointments" })}
                  className="flex items-center justify-center gap-2 rounded-md bg-primary py-3 font-bold text-primary-foreground shadow-button"
                >
                  <LayoutDashboard className="h-4 w-4" /> {t("booking.goDashboard")}
                </button>
                <button
                  onClick={() => {
                    setSuccess(false);
                    setStep(0);
                  }}
                  className="rounded-md border border-border py-3 text-sm font-semibold hover:bg-muted"
                >
                  {t("booking.bookAnother")}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}

function Stepper({ step, steps }: { step: number; steps: string[] }) {
  const icons = [
    <Calendar key="0" className="h-4 w-4" />,
    <Clock key="1" className="h-4 w-4" />,
    <User key="2" className="h-4 w-4" />,
    <FileText key="3" className="h-4 w-4" />,
  ];
  return (
    <div className="flex items-center gap-2">
      {steps.map((s, i) => (
        <div key={s} className="flex flex-1 items-center gap-2">
          <div
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${i < step ? "border-accent bg-accent text-white" : i === step ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground"}`}
          >
            {i < step ? <Check className="h-4 w-4" /> : icons[i]}
          </div>
          <span
            className={`hidden text-xs font-semibold sm:inline ${i === step ? "text-foreground" : "text-muted-foreground"}`}
          >
            {s}
          </span>
          {i < steps.length - 1 && (
            <div
              className={`h-0.5 flex-1 transition-colors ${i < step ? "bg-accent" : "bg-border"}`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

function VisitOption({
  active,
  onClick,
  icon,
  title,
  desc,
  disabled,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  title: string;
  desc: string;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex flex-col items-start gap-2 rounded-xl border-2 p-4 text-start transition-all disabled:cursor-not-allowed disabled:opacity-40 ${active ? "border-primary bg-primary/5 shadow-button" : "border-border hover:border-primary/50"}`}
    >
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-lg ${active ? "bg-primary text-primary-foreground" : "bg-muted"}`}
      >
        {icon}
      </div>
      <div>
        <p className="font-bold">{title}</p>
        <p className="text-xs text-muted-foreground">{desc}</p>
      </div>
    </button>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
      />
    </div>
  );
}

function Row({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className={highlight ? "text-lg font-black text-primary" : "font-semibold"}>
        {value}
      </span>
    </div>
  );
}
