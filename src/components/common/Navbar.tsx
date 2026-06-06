import { useTheme } from "@/context/ThemeContext";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  Moon, Sun, Menu, X, Bell, LogOut,
  User as UserIcon, LayoutDashboard, Settings,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { notificationsApi } from "@/api/notifications";
import { toast } from "sonner";

export function Navbar() {
  const { resolved, toggle } = useTheme();
  const { lang, setLang, t } = useLanguage();
  const { user, logout, profileImage } = useAuth();
  const nav = useNavigate();
  const [scrolled, setScrolled]       = useState(false);
  const [mobileOpen, setMobileOpen]   = useState(false);
  const [menuOpen, setMenuOpen]       = useState(false);
  const [notifOpen, setNotifOpen]     = useState(false);
  const [contactActive, setContactActive] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });
  const menuRef  = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const { data: notifications } = useQuery({
    queryKey: ["notifications"],
    queryFn: notificationsApi.getAll,
    enabled: !!user,
    staleTime: 30_000,
  });

  const unreadCount = notifications?.filter((n) => !n.isRead).length ?? 0;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current  && !menuRef.current.contains(e.target as Node))  setMenuOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* reset contactActive when navigating away from /about */
  useEffect(() => {
    if (path !== "/about") setContactActive(false);
  }, [path]);

  const handleContactClick = () => {
    setContactActive(true);
    const section = document.getElementById("contact");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    } else {
      nav({ to: "/about" }).then(() => {
        setTimeout(() => {
          document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
        }, 350);
      });
    }
  };

  const navLinks = [
    { to: "/",       label: t("nav.home"),                              active: path === "/" },
    { to: "/search", label: t("nav.doctors"),                           active: path.startsWith("/search") || path.startsWith("/doctors") },
    { to: "/about",  label: lang === "ar" ? "من نحن"    : "About",     active: path === "/about" && !contactActive },
  ];

  const getDashboard = (role: string) => {
    if (role === "Admin")  return "/admin/dashboard";
    if (role === "Doctor") return "/doctor/dashboard";
    return "/patient/dashboard";
  };

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    toast.success(t("auth.logoutSuccess"));
    nav({ to: "/" });
  };

  const initials =
    user?.fullName?.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase() || "U";

  return (
    <header className={`sticky top-0 z-40 transition-all duration-300 ${scrolled ? "border-b border-border bg-background/80 backdrop-blur-xl" : "bg-transparent"}`}>
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-1 text-2xl font-extrabold text-primary" dir="ltr">
  ClinI<span className="relative">Q<span className="absolute -top-0.5 right-0 h-1.5 w-1.5 rounded-full bg-primary" /></span>
</Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((l) => (
            <Link
              key={l.to + l.label}
              to={l.to}
              onClick={() => setContactActive(false)}
              className={`relative text-sm font-medium transition hover:text-primary ${l.active ? "text-primary" : "text-foreground/80"}`}
            >
              {l.label}
              {l.active && <span className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full bg-primary" />}
            </Link>
          ))}

          {/* Contact — scroll button with same underline style */}
          <button
            onClick={handleContactClick}
            className={`relative text-sm font-medium transition hover:text-primary ${contactActive ? "text-primary" : "text-foreground/80"}`}
          >
            {lang === "ar" ? "تواصل معنا" : "Contact"}
            {contactActive && <span className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full bg-primary" />}
          </button>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => setLang(lang === "en" ? "ar" : "en")}
            className="hidden rounded-pill border border-border px-3 py-1.5 text-xs font-semibold transition hover:border-primary hover:text-primary sm:block"
          >
            {lang === "en" ? "عربي" : "EN"}
          </button>
          <button onClick={toggle} aria-label="Toggle theme"
            className="rounded-full border border-border p-2 transition hover:border-primary hover:text-primary">
            {resolved === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          {user ? (
            <div className="relative flex items-center gap-2">
              {/* Notifications */}
              <div className="relative" ref={notifRef}>
                <button onClick={() => setNotifOpen((o) => !o)}
                  className="relative rounded-full border border-border p-2 transition hover:border-primary hover:text-primary"
                  aria-label="Notifications">
                  <Bell className="h-4 w-4" />
                  {unreadCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[9px] font-bold text-white">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </button>
                <AnimatePresence>
                  {notifOpen && (
                    <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                      className="absolute end-0 top-12 w-80 overflow-hidden rounded-xl border border-border bg-card shadow-glow z-50">
                      <div className="flex items-center justify-between border-b border-border p-3">
                        <p className="text-sm font-bold">Notifications</p>
                        <Link to="/notifications" onClick={() => setNotifOpen(false)} className="text-xs text-primary hover:underline">View all</Link>
                      </div>
                      <div className="max-h-72 overflow-y-auto">
                        {!notifications || notifications.length === 0 ? (
                          <p className="py-8 text-center text-xs text-muted-foreground">No notifications yet</p>
                        ) : (
                          notifications.slice(0, 5).map((n) => (
                            <div key={n.id} className={`flex items-start gap-3 border-b border-border p-3 last:border-0 ${!n.isRead ? "bg-primary/5" : ""}`}>
                              <div className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${!n.isRead ? "bg-primary" : "bg-transparent"}`} />
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold">{n.title}</p>
                                <p className="text-xs text-muted-foreground line-clamp-2">{n.message}</p>
                                <p className="mt-0.5 text-[10px] text-muted-foreground">{new Date(n.createdAt).toLocaleString()}</p>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Account menu */}
              <div className="relative" ref={menuRef}>
                <button onClick={() => setMenuOpen((o) => !o)}
                className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-primary text-xs font-bold text-primary-foreground ring-2 ring-primary/20 transition hover:opacity-90"
                  aria-label="Account">
                  {profileImage
                    ? <img src={profileImage} alt="avatar" className="h-9 w-9 object-cover" />
                    : initials}
                </button>
                <AnimatePresence>
                  {menuOpen && (
                    <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                      className="absolute end-0 top-12 w-56 overflow-hidden rounded-xl border border-border bg-card shadow-glow z-50">
                      <div className="border-b border-border p-3">
                        <p className="text-sm font-bold">{user.fullName}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                        <span className="mt-1 inline-block rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase text-primary">{user.role}</span>
                      </div>
                      <Link to={getDashboard(user.role)} onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted">
                        <LayoutDashboard className="h-4 w-4" /> {t("nav.dashboard")}
                      </Link>
                      <Link to="/patient/profile" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted">
                        <UserIcon className="h-4 w-4" /> {t("nav.profile")}
                      </Link>
                      <Link to="/patient/profile" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted">
                        <Settings className="h-4 w-4" /> {t("nav.settings")}
                      </Link>
                      <button onClick={handleLogout} className="flex w-full items-center gap-2 border-t border-border px-3 py-2 text-start text-sm text-destructive hover:bg-destructive/10">
                        <LogOut className="h-4 w-4" /> {t("nav.logout")}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          ) : (
            <>
              <Link to="/login" className="hidden rounded-md px-3 py-2 text-sm font-medium text-foreground/80 hover:text-primary sm:block">
                {t("nav.login")}
              </Link>
              <Link to="/register" className="hidden rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-button transition hover:opacity-90 sm:block">
                {t("nav.bookNow")}
              </Link>
            </>
          )}

          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden">
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-border bg-background md:hidden">
            <div className="flex flex-col gap-1 p-4">
              {navLinks.map((l) => (
                <Link key={l.to + l.label} to={l.to} onClick={() => { setMobileOpen(false); setContactActive(false); }}
                  className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted">
                  {l.label}
                </Link>
              ))}
              <button onClick={() => { handleContactClick(); setMobileOpen(false); }}
                className="rounded-lg px-3 py-2 text-start text-sm font-medium hover:bg-muted">
                {lang === "ar" ? "تواصل معنا" : "Contact"}
              </button>
              <button onClick={() => setLang(lang === "en" ? "ar" : "en")}
                className="rounded-lg px-3 py-2 text-start text-sm font-medium hover:bg-muted">
                {lang === "en" ? "عربي" : "English"}
              </button>
              {user ? (
                <>
                  <Link to={getDashboard(user.role)} onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted">
                    {t("nav.dashboard")}
                  </Link>
                  <button onClick={handleLogout} className="rounded-lg px-3 py-2 text-start text-sm font-medium text-destructive hover:bg-destructive/10">
                    {t("nav.logout")}
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted">
                    {t("nav.login")}
                  </Link>
                  <Link to="/register" onClick={() => setMobileOpen(false)} className="mt-2 rounded-lg bg-primary px-3 py-2.5 text-center text-sm font-semibold text-primary-foreground">
                    {t("nav.bookNow")}
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
