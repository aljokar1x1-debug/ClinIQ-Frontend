# ClinIQ: CMS + Functional Buttons + About + Image Uploads

This is a large multi-area change. I'll ship it in one pass with these deliverables:

## 1. Content Store (`src/services/contentStore.ts`)
- `DEFAULT_CONTENT` with all editable strings (hero, stats, howItWorks, specialties, topDoctorIds, testimonials, faq, mobileApp, footer, contact, team) in EN+AR.
- `useContent()` hook backed by `localStorage["cliniq_content"]` with subscribe/notify so edits apply live.
- `resetSection(key)` and `saveContent(next)` helpers; `lastSavedAt` timestamp.
- Landing sections (Hero, StatsBar, HowItWorks, Specialties, TopDoctors, Testimonials, FAQ, MobileApp, Footer) read from `useContent()` instead of hardcoded strings — keeps current visuals.

## 2. Image Store (`src/services/imageStore.ts` + `DoctorAvatar`)
- Helpers: `getDoctorImage(id)`, `setDoctorImage(id, base64)`, `getReviewerImage(id)`, `getTeamImage(id)`, `getUserImage(userId)`.
- Stored as base64 under `cliniq_doctor_image_<id>` etc.
- New `<DoctorAvatar doctorId name size />` component: localStorage first → DiceBear `avataaars` fallback. Used in DoctorCard, TopDoctors, search, profile, booking, admin tables, navbar (for user).
- `<ImageUploadModal />` reusable: drag&drop + file picker, validates JPG/PNG/WebP, 5MB cap with AR/EN toast, preview, Save/Cancel.

## 3. Admin CMS (`/admin/content`)
- New route `src/routes/admin.content.tsx` with left tab list (Hero, Stats, How It Works, Specialties, Top Doctors, Testimonials, FAQ, Mobile App, Footer, Contact, Doctor Photos, Reviewer Photos, Team Photos).
- Each tab: EN+AR inputs, add/remove/reorder (simple up/down arrows — no dnd lib), Save + Reset buttons, "Last saved" relative time.
- Photo tabs: grid of avatars + "تغيير الصورة" opening `ImageUploadModal`.
- Add to `ADMIN_NAV` with `Layout` icon + AR/EN label "Content Management / إدارة المحتوى".

## 4. Admin Doctors photo button
- Add "تغيير الصورة" button per row → same `ImageUploadModal` → updates everywhere via `DoctorAvatar`.

## 5. Patient/Doctor settings avatar upload
- Add avatar + upload button in `patient.profile.tsx` and `doctor.profile.tsx` using `ImageUploadModal`, key `cliniq_user_image_<userId>`. Navbar reads it via `getUserImage`.

## 6. About page (`/about`)
- Hero + mission + StatsBar reuse + 3 team members (DiceBear personas, swappable via CMS) + contact card. Uses Navbar/Footer.

## 7. Privacy & Terms modals
- `<LegalModal kind="privacy"|"terms" />` opened from Footer links; AR/EN body text; Close button.

## 8. Functional buttons sweep
- Navbar: "About" link → `/about`; "Specialties" → smooth-scroll on `/`, else `/search`; user dropdown items already wired — verify.
- Hero CTAs, popular tags → `/search?specialty=...`.
- Footer: support/specialty/cliniq columns, social icons (`target="_blank" rel="noreferrer"`), Status toast, Privacy/Terms modals, FAQ scroll.
- MobileApp App Store/Play → AR/EN coming-soon toasts.
- CTA "Get Started" → `/register`.
- Specialty cards & "View all" → `/search?specialty=`.
- Doctor cards "احجز الآن"/"عرض" verified.
- Booking success modal: copy booking ID + nav buttons (already shipped, verify).
- Admin export CSV: generate blob + download.
- Patient/Doctor dashboard buttons: wire stat cards to nav, cancel modal (simple confirm), rating modal stub toast, video call link.

## 9. i18n
- Add new keys to `en.json` / `ar.json` for: cms.*, about.*, legal.*, upload.*, common.save/reset/cancel/changePhoto, nav.about, coming soon strings.

## Technical notes
- No drag-and-drop library — use up/down arrow buttons for reorder to keep bundle clean.
- All localStorage access guarded by `typeof window !== 'undefined'` for SSR safety.
- `useContent` uses `useSyncExternalStore` for cross-component live updates.
- DiceBear seed remains `name`; existing visual style preserved.
- No backend changes; mockAuthService untouched.

## Out of scope (will note to user)
- Real drag-and-drop reordering (using up/down arrows instead).
- Real file upload backend (localStorage base64 only, per spec).
- Rich text editing in CMS (plain text inputs/textareas).

After implementation I'll verify the build and report.