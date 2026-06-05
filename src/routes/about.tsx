import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Clock, Target, Heart, Sparkles } from "lucide-react";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { StatsBar } from "@/components/sections/StatsBar";
import { useContent, pickByLang } from "@/services/contentStore";
import { useLanguage } from "@/context/LanguageContext";
import { DoctorAvatar } from "@/components/common/DoctorAvatar";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About ClinIQ — Healthcare, Simplified" },
      { name: "description", content: "Learn about ClinIQ — our mission to make booking verified doctors fast, free, and frustration-free." },
      { property: "og:title", content: "About ClinIQ" },
      { property: "og:description", content: "Our mission, our team, and how we built the modern healthcare booking experience." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  const { lang } = useLanguage();
  const ar = lang === "ar";
  const content = useContent();

  const heroTitle = ar ? "من نحن" : "About ClinIQ";
  const heroDesc = ar
    ? "ClinIQ هي منصة الرعاية الصحية الحديثة التي تربط المرضى بأفضل الأطباء الموثقين في ثوانٍ — بدون رسوم، بدون متاعب."
    : "ClinIQ is the modern healthcare platform that connects patients with verified top doctors in seconds — no fees, no hassle.";
  const missionTitle = ar ? "مهمتنا" : "Our Mission";
  const missionDesc = ar
    ? "نؤمن أن كل شخص يستحق رعاية صحية ميسّرة وموثوقة. نزيل الاحتكاك من تجربة الحجز التقليدية، نحقق من بيانات كل طبيب، ونمنح المرضى الشفافية الكاملة قبل اتخاذ القرار."
    : "We believe everyone deserves accessible, trustworthy healthcare. We remove friction from the traditional booking experience, verify every doctor on the platform, and give patients full transparency before they choose.";

  const values = [
    { Icon: Heart, t: ar ? "رعاية بالمريض أولاً" : "Patient-first care", d: ar ? "كل قرار نتخذه ينطلق من المريض." : "Every decision starts with the patient." },
    { Icon: Target, t: ar ? "موثوقية مُتحقق منها" : "Verified trust", d: ar ? "نتحقق يدوياً من ترخيص كل طبيب." : "We manually verify every doctor's license." },
    { Icon: Sparkles, t: ar ? "تجربة بسيطة" : "Effortless experience", d: ar ? "حجزك في أقل من 60 ثانية." : "Book in under 60 seconds." },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-40 -left-32 h-96 w-96 rounded-full bg-primary/15 blur-3xl" />
          <div className="absolute top-20 right-0 h-80 w-80 rounded-full bg-secondary/15 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 lg:px-8 lg:py-28">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-5xl font-black tracking-tight sm:text-6xl">
            {heroTitle}
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground">
            {heroDesc}
          </motion.p>
        </div>
      </section>

      <StatsBar />

      <section className="mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-black tracking-tight sm:text-4xl">{missionTitle}</h2>
        <p className="mt-4 text-base text-muted-foreground">{missionDesc}</p>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {values.map((v) => (
            <div key={v.t} className="rounded-2xl border border-border bg-card p-6 shadow-card">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <v.Icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-bold">{v.t}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{v.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-muted/40">
        <div className="mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-black tracking-tight sm:text-4xl">{ar ? "فريقنا" : "Our Team"}</h2>
          <p className="mt-3 text-center text-muted-foreground">{ar ? "أشخاص متحمسون لبناء صحة أفضل" : "People passionate about better health."}</p>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {content.team.map((m, i) => {
              const bios: Record<string, { en: string; ar: string }> = {
                tm1: { en: "Medical doctor turned entrepreneur. Building the future of healthcare access in Egypt.", ar: "طبيب حوّل شغفه لمشروع — يبني مستقبل الرعاية الصحية في مصر." },
                tm2: { en: "Doctor specialized in internal medicine with a passion for digital health innovation.", ar: "طبيب متخصص في الطب الباطني بشغف بالابتكار الرقمي في الرعاية الصحية." },
                tm3: { en: "Cardiologist and clinical advisor ensuring ClinIQ meets the highest medical standards.", ar: "طبيبة قلب ومستشارة طبية تضمن أعلى معايير الجودة." },
              };
              const bio = bios[m.id] ?? { en: "", ar: "" };
              return (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group rounded-2xl border border-border bg-card p-6 text-center shadow-card hover:border-primary/30 hover:shadow-lg transition-all"
                >
                  <div className="relative mx-auto h-24 w-24">
                    <DoctorAvatar doctorId={m.id} name={m.name.en} kind="team" className="h-24 w-24 rounded-full object-cover ring-4 ring-primary/20 group-hover:ring-primary/50 transition-all" />
                    <span className="absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-card bg-green-500" title="Active" />
                  </div>
                  <h3 className="mt-4 text-base font-bold">{pickByLang(m.name, lang)}</h3>
                  <p className="text-sm font-medium text-primary">{pickByLang(m.role, lang)}</p>
                  <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{lang === "ar" ? bio.ar : bio.en}</p>
                  <div className="mt-4 flex justify-center gap-2">
                    <a href="#" aria-label="LinkedIn"
                      className="flex h-7 w-7 items-center justify-center rounded-full border border-border hover:border-primary hover:text-primary transition-colors text-muted-foreground text-xs font-bold">
                      in
                    </a>
                    <a href="#" aria-label="Twitter/X"
                      className="flex h-7 w-7 items-center justify-center rounded-full border border-border hover:border-primary hover:text-primary transition-colors text-muted-foreground text-xs font-bold">
                      𝕏
                    </a>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="contact" className="mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-black tracking-tight sm:text-4xl">{ar ? "تواصل معنا" : "Contact Us"}</h2>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <ContactCard Icon={Phone} title={ar ? "الهاتف" : "Phone"} value={content.contact.phone} href={`tel:${content.contact.phone}`} />
          <ContactCard Icon={Mail} title={ar ? "البريد" : "Email"} value={content.contact.email} href={`mailto:${content.contact.email}`} />
          <ContactCard Icon={MapPin} title={ar ? "العنوان" : "Address"} value={pickByLang(content.contact.address, lang)} />
          <ContactCard Icon={Clock} title={ar ? "ساعات العمل" : "Working Hours"} value={pickByLang(content.contact.hours, lang)} />
        </div>
        <div className="mt-10 text-center">
          <Link to="/search" className="inline-flex rounded-md bg-primary px-8 py-3 text-sm font-bold text-primary-foreground shadow-button hover:opacity-90">
            {ar ? "ابدأ الحجز" : "Start Booking"}
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function ContactCard({ Icon, title, value, href }: { Icon: React.ComponentType<{ className?: string }>; title: string; value: string; href?: string }) {
  const Body = (
    <>
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon className="h-5 w-5" />
      </div>
      <p className="mt-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">{title}</p>
      <p className="mt-1 text-sm font-semibold" dir="ltr">{value}</p>
    </>
  );
  if (href) {
    return (
      <a href={href} className="block rounded-2xl border border-border bg-card p-5 shadow-card transition hover:border-primary/50">
        {Body}
      </a>
    );
  }
  return <div className="rounded-2xl border border-border bg-card p-5 shadow-card">{Body}</div>;
}
