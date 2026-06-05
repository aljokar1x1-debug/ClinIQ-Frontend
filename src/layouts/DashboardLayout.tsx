import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { ReactNode, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Moon, Sun, Bell, LogOut, Menu, X, Search, Stethoscope, Calendar, Pill, Star, MessageSquare } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";

export type NavItem = { to: string; label: string; icon: ReactNode };

export function DashboardLayout({
  items,
  title,
  children,
  user,
}: {
  items: NavItem[];
  title: string;
  children: ReactNode;
  user: { name: string; role: string; avatar?: string };
}) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const { resolved, toggle } = useTheme();
  const { lang, setLang } = useLanguage();
  const { logout, profileImage } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate({ to: "/" });
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Desktop Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col bg-sidebar text-sidebar-foreground lg:flex">
        <Link to="/" className="flex h-16 items-center gap-2 border-b border-sidebar-border px-6 font-black text-xl">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground"><Stethoscope className="h-4 w-4" /></span>
          ClinIQ
        </Link>
        <nav className="flex-1 space-y-1 px-3 py-6">
          {items.map((item) => {
            const active = path === item.to;
            return (
              <Link key={item.to} to={item.to} className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors ${active ? "bg-sidebar-primary text-sidebar-primary-foreground" : "text-sidebar-foreground/80 hover:bg-sidebar-accent"}`}>
                {item.icon} {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-sidebar-border p-4">
          <div className="flex items-center gap-3 rounded-lg p-2">
{profileImage
  ? <img src={profileImage} alt="avatar" className="h-9 w-9 rounded-full object-cover" />
  : <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">{user.name[0]}</div>
}
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-bold">{user.name}</p>
              <p className="truncate text-xs text-sidebar-foreground/60 capitalize">{user.role}</p>
            </div>
            <button onClick={handleLogout} className="rounded-md p-2 hover:bg-sidebar-accent" title="Logout"><LogOut className="h-4 w-4" /></button>
          </div>
        </div>
      </aside>

      {/* Mobile Top Bar */}
      <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-border bg-card px-4 lg:hidden">
        <Link to="/" className="flex items-center gap-2 font-black">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground"><Stethoscope className="h-4 w-4" /></span>
          ClinIQ
        </Link>
        <div className="flex items-center gap-1">
          <button onClick={() => setNotifOpen(true)} className="rounded-md p-2 hover:bg-muted"><Bell className="h-5 w-5" /></button>
          <button onClick={() => setOpen(true)} className="rounded-md p-2 hover:bg-muted"><Menu className="h-5 w-5" /></button>
        </div>
      </header>

      {/* Desktop Top Bar */}
      <header className="sticky top-0 z-20 hidden h-16 items-center justify-between border-b border-border bg-card px-6 lg:ml-64 lg:flex">
        <div>
          <h1 className="text-lg font-bold">{title}</h1>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input placeholder="Search..." className="h-9 w-64 rounded-md border border-border bg-background pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
          </div>
          <button onClick={() => setLang(lang === "en" ? "ar" : "en")} className="rounded-md border border-border px-3 py-1.5 text-xs font-bold">
            {lang === "en" ? "AR" : "EN"}
          </button>
          <button onClick={toggle} className="rounded-md border border-border p-2 hover:bg-muted">
            {resolved === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <button onClick={() => setNotifOpen(true)} className="relative rounded-md border border-border p-2 hover:bg-muted">
            <Bell className="h-4 w-4" />
            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-destructive" />
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setOpen(false)}>
            <motion.aside initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 30 }} className="absolute right-0 top-0 flex h-full w-72 flex-col bg-sidebar text-sidebar-foreground" onClick={(e) => e.stopPropagation()}>
              <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-6">
                <span className="font-black">Menu</span>
                <button onClick={() => setOpen(false)} className="rounded-md p-2 hover:bg-sidebar-accent"><X className="h-5 w-5" /></button>
              </div>
              <nav className="flex-1 space-y-1 px-3 py-4">
                {items.map((item) => {
                  const active = path === item.to;
                  return (
                    <Link key={item.to} to={item.to} onClick={() => setOpen(false)} className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold ${active ? "bg-sidebar-primary text-sidebar-primary-foreground" : "hover:bg-sidebar-accent"}`}>
                      {item.icon} {item.label}
                    </Link>
                  );
                })}
              </nav>
              <div className="border-t border-sidebar-border p-4 space-y-2">
                <div className="flex gap-2">
                  <button onClick={() => setLang(lang === "en" ? "ar" : "en")} className="flex-1 rounded-md border border-sidebar-border px-3 py-2 text-xs font-bold">{lang === "en" ? "العربية" : "English"}</button>
                  <button onClick={toggle} className="flex-1 rounded-md border border-sidebar-border px-3 py-2 text-xs font-bold flex items-center justify-center gap-1">
                    {resolved === "dark" ? <><Sun className="h-3 w-3" /> Light</> : <><Moon className="h-3 w-3" /> Dark</>}
                  </button>
                </div>
                <button onClick={handleLogout} className="flex w-full items-center justify-center gap-2 rounded-md bg-destructive px-3 py-2 text-sm font-bold text-white"><LogOut className="h-4 w-4" /> Logout</button>
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notification Drawer */}
      <AnimatePresence>
        {notifOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40 bg-black/50" onClick={() => setNotifOpen(false)}>
            <motion.aside initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 30 }} className="absolute right-0 top-0 flex h-full w-80 flex-col bg-card" onClick={(e) => e.stopPropagation()}>
              <div className="flex h-16 items-center justify-between border-b border-border px-6">
                <h3 className="font-bold">Notifications</h3>
                <button onClick={() => setNotifOpen(false)} className="rounded-md p-2 hover:bg-muted"><X className="h-5 w-5" /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {[
                  { icon: Calendar, tone: "text-primary bg-primary/10", title: "Appointment confirmed", desc: "Dr. Sarah Hassan at 10:30 AM tomorrow", time: "2m ago", unread: true },
                  { icon: Pill, tone: "text-emerald-600 bg-emerald-500/10", title: "Prescription ready", desc: "Your e-prescription has been issued", time: "1h ago", unread: true },
                  { icon: Star, tone: "text-amber-600 bg-amber-500/10", title: "Rate your visit", desc: "How was your last appointment?", time: "1d ago" },
                  { icon: MessageSquare, tone: "text-sky-600 bg-sky-500/10", title: "New message", desc: "Dr. Ahmed Mansour sent you a message", time: "2d ago" },
                ].map((n, i) => (
                  <div key={i} className={`flex gap-3 rounded-lg p-3 ${n.unread ? "bg-primary/5" : "bg-muted/40"}`}>
                    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${n.tone}`}>
                      <n.icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold">{n.title}</p>
                      <p className="text-xs text-muted-foreground">{n.desc}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{n.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main */}
      <main className="lg:ml-64">
        <div className="mx-auto max-w-7xl px-4 py-6 pb-24 sm:px-6 lg:px-8 lg:pb-6">{children}</div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="fixed inset-x-0 bottom-0 z-20 flex border-t border-border bg-card lg:hidden">
        {items.slice(0, 5).map((item) => {
          const active = path === item.to;
          return (
            <Link key={item.to} to={item.to} className={`flex flex-1 flex-col items-center gap-1 py-2 text-[10px] font-semibold ${active ? "text-primary" : "text-muted-foreground"}`}>
              <span className={`${active ? "scale-110" : ""} transition-transform`}>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
