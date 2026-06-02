import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Save, RotateCcw, Plus, Trash2, ArrowUp, ArrowDown, ImageIcon } from "lucide-react";
import { AdminShell } from "@/layouts/AdminShell";
import {
  useContent,
  updateContent,
  resetSection,
  resetAll,
  type ContentShape,
  type Bilingual,
} from "@/services/contentStore";
import { useLanguage } from "@/context/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import { doctorsApi } from "@/api/doctors";
import { DoctorAvatar } from "@/components/common/DoctorAvatar";
import { ImageUploadModal } from "@/components/common/ImageUploadModal";
import { setDoctorImage, setReviewerImage, setTeamImage } from "@/services/imageStore";

export const Route = createFileRoute("/admin/content")({
  head: () => ({ meta: [{ title: "Content Management — ClinIQ Admin" }] }),
  component: AdminContentPage,
});

const TABS = [
  "hero",
  "stats",
  "howItWorks",
  "specialties",
  "topDoctors",
  "testimonials",
  "faq",
  "mobileApp",
  "footer",
  "contact",
  "doctorPhotos",
  "reviewerPhotos",
  "teamPhotos",
] as const;
type Tab = (typeof TABS)[number];

const TAB_LABELS: Record<Tab, { en: string; ar: string }> = {
  hero: { en: "Hero", ar: "الواجهة" },
  stats: { en: "Stats", ar: "الإحصائيات" },
  howItWorks: { en: "How It Works", ar: "كيف يعمل" },
  specialties: { en: "Specialties", ar: "التخصصات" },
  topDoctors: { en: "Top Doctors", ar: "أفضل الأطباء" },
  testimonials: { en: "Testimonials", ar: "آراء المرضى" },
  faq: { en: "FAQ", ar: "الأسئلة" },
  mobileApp: { en: "Mobile App", ar: "تطبيق الجوال" },
  footer: { en: "Footer", ar: "التذييل" },
  contact: { en: "Contact", ar: "التواصل" },
  doctorPhotos: { en: "Doctor Photos", ar: "صور الأطباء" },
  reviewerPhotos: { en: "Reviewer Photos", ar: "صور المراجعين" },
  teamPhotos: { en: "Team Photos", ar: "صور الفريق" },
};

function AdminContentPage() {
  const { lang } = useLanguage();
  const ar = lang === "ar";
  const content = useContent();
  const [tab, setTab] = useState<Tab>("hero");

  const lastSaved = content.lastSavedAt
    ? new Date(content.lastSavedAt).toLocaleString(ar ? "ar-EG" : "en-US")
    : ar
      ? "لم يتم الحفظ بعد"
      : "Not saved yet";

  return (
    <AdminShell title={ar ? "إدارة المحتوى" : "Content Management"}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-muted-foreground">
          {ar ? "آخر حفظ" : "Last saved"}: <span className="font-semibold">{lastSaved}</span>
        </p>
        <button
          onClick={() => {
            resetAll();
            toast.success(ar ? "تم إعادة الضبط" : "Reset to defaults");
          }}
          className="flex items-center gap-2 rounded-md border border-border px-3 py-1.5 text-xs font-bold hover:bg-muted"
        >
          <RotateCcw className="h-3.5 w-3.5" /> {ar ? "إعادة ضبط الكل" : "Reset all"}
        </button>
      </div>

      <div className="grid gap-4 lg:grid-cols-[220px_1fr]">
        <aside className="rounded-xl border border-border bg-card p-2">
          {TABS.map((tk) => (
            <button
              key={tk}
              onClick={() => setTab(tk)}
              className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-start text-sm font-semibold ${tab === tk ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
            >
              {ar ? TAB_LABELS[tk].ar : TAB_LABELS[tk].en}
            </button>
          ))}
        </aside>

        <section className="rounded-xl border border-border bg-card p-6">
          {tab === "hero" && <HeroEditor c={content} />}
          {tab === "stats" && (
            <ListEditor
              section="stats"
              c={content}
              fields={[{ key: "value", label: "Value" }]}
              bilingualFields={[{ key: "label", label: "Label" }]}
            />
          )}
          {tab === "howItWorks" && (
            <ListEditor
              section="howItWorks"
              c={content}
              fields={[{ key: "icon", label: "Icon (Lucide name)" }]}
              bilingualFields={[
                { key: "title", label: "Title" },
                { key: "desc", label: "Description" },
              ]}
            />
          )}
          {tab === "specialties" && (
            <ListEditor
              section="specialties"
              c={content}
              fields={[
                { key: "icon", label: "Icon" },
                { key: "color", label: "Color" },
              ]}
              bilingualFields={[{ key: "name", label: "Name" }]}
            />
          )}
          {tab === "topDoctors" && <TopDoctorsEditor c={content} />}
          {tab === "testimonials" && (
            <ListEditor
              section="testimonials"
              c={content}
              fields={[{ key: "rating", label: "Rating (1-5)", numeric: true }]}
              bilingualFields={[
                { key: "name", label: "Name" },
                { key: "text", label: "Text" },
                { key: "date", label: "Date" },
              ]}
            />
          )}
          {tab === "faq" && (
            <ListEditor
              section="faq"
              c={content}
              fields={[]}
              bilingualFields={[
                { key: "q", label: "Question" },
                { key: "a", label: "Answer" },
              ]}
            />
          )}
          {tab === "mobileApp" && <MobileAppEditor c={content} />}
          {tab === "footer" && <FooterEditor c={content} />}
          {tab === "contact" && <ContactEditor c={content} />}
          {tab === "doctorPhotos" && <DoctorPhotos />}
          {tab === "reviewerPhotos" && <ReviewerPhotos c={content} />}
          {tab === "teamPhotos" && <TeamPhotos c={content} />}
        </section>
      </div>
    </AdminShell>
  );
}

function SaveBar({ onReset }: { onReset: () => void }) {
  const { lang } = useLanguage();
  const ar = lang === "ar";
  return (
    <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
      <button
        onClick={onReset}
        className="flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-destructive"
      >
        <RotateCcw className="h-3.5 w-3.5" /> {ar ? "استعادة الافتراضي" : "Reset to default"}
      </button>
      <p className="flex items-center gap-2 rounded-md bg-emerald-500/10 px-3 py-1.5 text-xs font-bold text-emerald-600">
        <Save className="h-3.5 w-3.5" />{" "}
        {ar ? "التغييرات تُحفظ تلقائياً" : "Changes save automatically"}
      </p>
    </div>
  );
}

function BilingualInput({
  value,
  onChange,
  label,
}: {
  value: Bilingual;
  onChange: (v: Bilingual) => void;
  label: string;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
        {label}
      </label>
      <div className="grid gap-2 sm:grid-cols-2">
        <input
          value={value.en}
          onChange={(e) => onChange({ ...value, en: e.target.value })}
          placeholder="English"
          className="rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
        />
        <input
          value={value.ar}
          onChange={(e) => onChange({ ...value, ar: e.target.value })}
          dir="rtl"
          placeholder="عربي"
          className="rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
        />
      </div>
    </div>
  );
}

function TextInput({
  value,
  onChange,
  label,
}: {
  value: string;
  onChange: (v: string) => void;
  label: string;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
        {label}
      </label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
      />
    </div>
  );
}

function HeroEditor({ c }: { c: ContentShape }) {
  const { lang } = useLanguage();
  const ar = lang === "ar";
  const h = c.hero;
  const update = (patch: Partial<ContentShape["hero"]>) =>
    updateContent((cur) => ({ ...cur, hero: { ...cur.hero, ...patch } }));
  return (
    <div className="space-y-4">
      <BilingualInput value={h.badge} onChange={(v) => update({ badge: v })} label="Badge" />
      <BilingualInput
        value={h.title1}
        onChange={(v) => update({ title1: v })}
        label="Title (line 1)"
      />
      <BilingualInput
        value={h.title2}
        onChange={(v) => update({ title2: v })}
        label="Title (line 2)"
      />
      <BilingualInput
        value={h.subtitle}
        onChange={(v) => update({ subtitle: v })}
        label="Subtitle"
      />
      <BilingualInput
        value={h.ctaPrimary}
        onChange={(v) => update({ ctaPrimary: v })}
        label="Primary CTA"
      />
      <BilingualInput
        value={h.ctaSecondary}
        onChange={(v) => update({ ctaSecondary: v })}
        label="Secondary CTA"
      />
      <BilingualInput
        value={h.specialtyPh}
        onChange={(v) => update({ specialtyPh: v })}
        label="Specialty placeholder"
      />
      <BilingualInput
        value={h.locationPh}
        onChange={(v) => update({ locationPh: v })}
        label="Location placeholder"
      />
      <BilingualInput value={h.trust} onChange={(v) => update({ trust: v })} label="Trust line" />
      <div>
        <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Popular tags (comma separated)
        </label>
        <input
          value={h.popular.join(", ")}
          onChange={(e) =>
            update({
              popular: e.target.value
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean),
            })
          }
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
        />
      </div>
      <SaveBar
        onReset={() => {
          resetSection("hero");
          toast.success(ar ? "تم إعادة الضبط" : "Reset");
        }}
      />
    </div>
  );
}

type ListSection = "stats" | "howItWorks" | "specialties" | "testimonials" | "faq";

function ListEditor({
  section,
  c,
  fields,
  bilingualFields,
}: {
  section: ListSection;
  c: ContentShape;
  fields: { key: string; label: string; numeric?: boolean }[];
  bilingualFields: { key: string; label: string }[];
}) {
  const { lang } = useLanguage();
  const ar = lang === "ar";
  const items = c[section] as Array<Record<string, unknown> & { id: string }>;
  const update = (next: typeof items) =>
    updateContent((cur) => ({ ...cur, [section]: next }) as ContentShape);
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const copy = [...items];
    [copy[i], copy[j]] = [copy[j], copy[i]];
    update(copy);
  };
  const remove = (i: number) => {
    update(items.filter((_, idx) => idx !== i));
    toast.success(ar ? "تم الحذف" : "Deleted");
  };
  const add = () => {
    const blank: Record<string, unknown> & { id: string } = { id: `${section}-${Date.now()}` };
    fields.forEach((f) => (blank[f.key] = f.numeric ? 5 : ""));
    bilingualFields.forEach((f) => (blank[f.key] = { en: "", ar: "" }));
    if (section === "specialties") {
      blank.icon = "Stethoscope";
      blank.color = "slate";
    }
    if (section === "howItWorks") blank.icon = "Circle";
    update([...items, blank]);
  };
  return (
    <div className="space-y-4">
      {items.map((it, i) => (
        <div key={it.id} className="rounded-xl border border-border p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground">#{i + 1}</span>
            <div className="flex gap-1">
              <button onClick={() => move(i, -1)} className="rounded-md p-1.5 hover:bg-muted">
                <ArrowUp className="h-3.5 w-3.5" />
              </button>
              <button onClick={() => move(i, 1)} className="rounded-md p-1.5 hover:bg-muted">
                <ArrowDown className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => remove(i)}
                className="rounded-md p-1.5 text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
          <div className="space-y-3">
            {fields.map((f) => (
              <TextInput
                key={f.key}
                label={f.label}
                value={String(it[f.key] ?? "")}
                onChange={(v) =>
                  update(
                    items.map((x, idx) =>
                      idx === i ? { ...x, [f.key]: f.numeric ? Number(v) || 0 : v } : x,
                    ),
                  )
                }
              />
            ))}
            {bilingualFields.map((f) => (
              <BilingualInput
                key={f.key}
                label={f.label}
                value={(it[f.key] as Bilingual) ?? { en: "", ar: "" }}
                onChange={(v) =>
                  update(items.map((x, idx) => (idx === i ? { ...x, [f.key]: v } : x)))
                }
              />
            ))}
          </div>
        </div>
      ))}
      <button
        onClick={add}
        className="flex items-center gap-2 rounded-md border border-dashed border-primary/40 bg-primary/5 px-4 py-2 text-sm font-bold text-primary hover:bg-primary/10"
      >
        <Plus className="h-4 w-4" /> {ar ? "إضافة" : "Add"}
      </button>
      <SaveBar
        onReset={() => {
          resetSection(section);
          toast.success(ar ? "تم إعادة الضبط" : "Reset");
        }}
      />
    </div>
  );
}

function TopDoctorsEditor({ c }: { c: ContentShape }) {
  const { lang } = useLanguage();
  const ar = lang === "ar";
  const ids = c.topDoctorIds;

  const { data: doctors, isLoading } = useQuery({
    queryKey: ["admin-doctors-content"],
    queryFn: () => doctorsApi.getAll(),
    staleTime: 60_000,
  });

  const toggle = (id: string) => {
    const next = ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id];
    updateContent((cur) => ({ ...cur, topDoctorIds: next }));
  };

  if (isLoading)
    return (
      <div className="flex items-center justify-center py-8">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        {ar
          ? "اختر الأطباء الظاهرين في قسم 'أفضل الأطباء'"
          : "Select doctors to feature on the landing page."}
      </p>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {(doctors ?? []).map((d) => {
          const on = ids.includes(String(d.id));
          return (
            <button
              key={d.id}
              onClick={() => toggle(String(d.id))}
              className={`flex items-center gap-3 rounded-md border p-2 text-start text-sm transition ${on ? "border-primary bg-primary/10" : "border-border hover:bg-muted"}`}
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                {d.fullName
                  .split(" ")
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join("")}
              </div>
              <div className="flex-1 truncate">
                <p className="truncate font-semibold">{d.fullName}</p>
                <p className="truncate text-xs text-muted-foreground">{d.specialty}</p>
              </div>
              {on && <span className="text-xs font-bold text-primary">✓</span>}
            </button>
          );
        })}
      </div>
      <SaveBar
        onReset={() => {
          resetSection("topDoctorIds");
          toast.success(ar ? "تم إعادة الضبط" : "Reset");
        }}
      />
    </div>
  );
}

function MobileAppEditor({ c }: { c: ContentShape }) {
  const { lang } = useLanguage();
  const ar = lang === "ar";
  const m = c.mobileApp;
  const update = (patch: Partial<typeof m>) =>
    updateContent((cur) => ({ ...cur, mobileApp: { ...cur.mobileApp, ...patch } }));
  return (
    <div className="space-y-4">
      <BilingualInput value={m.title} onChange={(v) => update({ title: v })} label="Title" />
      <BilingualInput value={m.desc} onChange={(v) => update({ desc: v })} label="Description" />
      <TextInput
        value={m.appStoreUrl}
        onChange={(v) => update({ appStoreUrl: v })}
        label="App Store URL"
      />
      <TextInput
        value={m.googlePlayUrl}
        onChange={(v) => update({ googlePlayUrl: v })}
        label="Google Play URL"
      />
      <SaveBar
        onReset={() => {
          resetSection("mobileApp");
          toast.success(ar ? "تم إعادة الضبط" : "Reset");
        }}
      />
    </div>
  );
}

function FooterEditor({ c }: { c: ContentShape }) {
  const { lang } = useLanguage();
  const ar = lang === "ar";
  const f = c.footer;
  const update = (patch: Partial<typeof f>) =>
    updateContent((cur) => ({ ...cur, footer: { ...cur.footer, ...patch } }));
  const editLinks = (group: "support" | "specialties" | "company") => {
    const list = f[group];
    return (
      <div className="space-y-3">
        <h4 className="font-bold capitalize">{group}</h4>
        {list.map((l, i) => (
          <div
            key={l.id}
            className="grid gap-2 rounded-md border border-border p-3 sm:grid-cols-[1fr_1fr_auto]"
          >
            <input
              value={l.label.en}
              onChange={(e) =>
                update({
                  [group]: list.map((x, idx) =>
                    idx === i ? { ...x, label: { ...x.label, en: e.target.value } } : x,
                  ),
                } as never)
              }
              placeholder="EN label"
              className="rounded-md border border-border bg-background px-3 py-2 text-sm"
            />
            <input
              value={l.label.ar}
              onChange={(e) =>
                update({
                  [group]: list.map((x, idx) =>
                    idx === i ? { ...x, label: { ...x.label, ar: e.target.value } } : x,
                  ),
                } as never)
              }
              dir="rtl"
              placeholder="AR label"
              className="rounded-md border border-border bg-background px-3 py-2 text-sm"
            />
            <input
              value={l.url}
              onChange={(e) =>
                update({
                  [group]: list.map((x, idx) => (idx === i ? { ...x, url: e.target.value } : x)),
                } as never)
              }
              placeholder="URL"
              className="rounded-md border border-border bg-background px-3 py-2 text-sm sm:col-span-2"
            />
            <button
              onClick={() => update({ [group]: list.filter((_, idx) => idx !== i) } as never)}
              className="rounded-md p-2 text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
        <button
          onClick={() =>
            update({
              [group]: [
                ...list,
                { id: `${group}-${Date.now()}`, label: { en: "", ar: "" }, url: "#" },
              ],
            } as never)
          }
          className="flex items-center gap-1 text-xs font-bold text-primary"
        >
          <Plus className="h-3 w-3" /> {ar ? "إضافة رابط" : "Add link"}
        </button>
      </div>
    );
  };
  return (
    <div className="space-y-6">
      <BilingualInput value={f.tagline} onChange={(v) => update({ tagline: v })} label="Tagline" />
      <BilingualInput
        value={f.copyright}
        onChange={(v) => update({ copyright: v })}
        label="Copyright"
      />
      <div className="grid gap-2 sm:grid-cols-2">
        <TextInput
          value={f.social.instagram}
          onChange={(v) => update({ social: { ...f.social, instagram: v } })}
          label="Instagram URL"
        />
        <TextInput
          value={f.social.linkedin}
          onChange={(v) => update({ social: { ...f.social, linkedin: v } })}
          label="LinkedIn URL"
        />
        <TextInput
          value={f.social.facebook}
          onChange={(v) => update({ social: { ...f.social, facebook: v } })}
          label="Facebook URL"
        />
        <TextInput
          value={f.social.twitter}
          onChange={(v) => update({ social: { ...f.social, twitter: v } })}
          label="X (Twitter) URL"
        />
      </div>
      {editLinks("support")}
      {editLinks("specialties")}
      {editLinks("company")}
      <SaveBar
        onReset={() => {
          resetSection("footer");
          toast.success(ar ? "تم إعادة الضبط" : "Reset");
        }}
      />
    </div>
  );
}

function ContactEditor({ c }: { c: ContentShape }) {
  const { lang } = useLanguage();
  const ar = lang === "ar";
  const k = c.contact;
  const update = (patch: Partial<typeof k>) =>
    updateContent((cur) => ({ ...cur, contact: { ...cur.contact, ...patch } }));
  return (
    <div className="space-y-4">
      <TextInput value={k.phone} onChange={(v) => update({ phone: v })} label="Phone" />
      <TextInput value={k.email} onChange={(v) => update({ email: v })} label="Email" />
      <BilingualInput value={k.address} onChange={(v) => update({ address: v })} label="Address" />
      <BilingualInput
        value={k.hours}
        onChange={(v) => update({ hours: v })}
        label="Working hours"
      />
      <SaveBar
        onReset={() => {
          resetSection("contact");
          toast.success(ar ? "تم إعادة الضبط" : "Reset");
        }}
      />
    </div>
  );
}

function PhotoGrid({
  items,
  save,
}: {
  items: { id: string; name: string }[];
  save: (id: string, b64: string) => void;
}) {
  const { lang } = useLanguage();
  const ar = lang === "ar";
  const [target, setTarget] = useState<{ id: string; name: string } | null>(null);
  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((it) => (
          <div key={it.id} className="flex items-center gap-3 rounded-xl border border-border p-3">
            <DoctorAvatar doctorId={it.id} name={it.name} className="h-12 w-12 rounded-full" />
            <div className="flex-1 truncate">
              <p className="truncate text-sm font-semibold">{it.name}</p>
            </div>
            <button
              onClick={() => setTarget(it)}
              className="flex items-center gap-1 rounded-md border border-border px-2.5 py-1.5 text-xs font-bold hover:bg-muted"
            >
              <ImageIcon className="h-3.5 w-3.5" /> {ar ? "تغيير الصورة" : "Change Photo"}
            </button>
          </div>
        ))}
      </div>
      <ImageUploadModal
        open={target !== null}
        title={target ? (ar ? `تغيير صورة ${target.name}` : `Change photo: ${target.name}`) : ""}
        onClose={() => setTarget(null)}
        onSave={(b64) => {
          if (!target) return;
          save(target.id, b64);
          toast.success(ar ? "تم تحديث الصورة بنجاح" : "Photo updated successfully");
        }}
      />
    </div>
  );
}

function DoctorPhotos() {
  const { data: doctors } = useQuery({
    queryKey: ["admin-doctors-content"],
    queryFn: () => doctorsApi.getAll(),
    staleTime: 60_000,
  });
  return (
    <PhotoGrid
      items={(doctors ?? []).map((d) => ({ id: String(d.id), name: d.fullName }))}
      save={(id, b64) => setDoctorImage(id, b64)}
    />
  );
}

function ReviewerPhotos({ c }: { c: ContentShape }) {
  return (
    <PhotoGrid
      items={c.testimonials.map((t) => ({ id: t.id, name: t.name.en }))}
      save={(id, b64) => setReviewerImage(id, b64)}
    />
  );
}

function TeamPhotos({ c }: { c: ContentShape }) {
  return (
    <PhotoGrid
      items={c.team.map((t) => ({ id: t.id, name: t.name.en }))}
      save={(id, b64) => setTeamImage(id, b64)}
    />
  );
}
