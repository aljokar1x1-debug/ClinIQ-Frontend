import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect } from "react";
import appCss from "../styles.css?url";
import { ThemeProvider } from "@/context/ThemeContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "@/components/ui/sonner";
import { GoogleOAuthProvider } from "@react-oauth/google";

function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
      <h1 className="text-[10rem] font-black leading-none text-primary/10 select-none">404</h1>
      <h2 className="mt-6 text-2xl font-bold">Page Not Found</h2>
      <p className="mt-2 max-w-md text-muted-foreground">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          to="/"
          className="rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground shadow-button transition hover:opacity-90"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}

function ErrorComp({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold">Something went wrong</h1>
        <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
        <button
          onClick={() => {
            router.invalidate();
            reset();
          }}
          className="mt-6 rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

function SplashScreen() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="flex flex-col items-center gap-4"
      >
       <div className="flex items-center gap-1 text-4xl font-extrabold text-primary" dir="ltr">
  ClinI
  <span className="relative">
    Q
            <span className="absolute -top-1 right-0 h-2 w-2 rounded-full bg-accent" />
          </span>
        </div>
        <div className="mt-4 h-1 w-40 overflow-hidden rounded-full bg-muted">
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{ duration: 0.8, ease: "easeInOut", repeat: 1 }}
            className="h-full w-full rounded-full bg-primary"
          />
        </div>
        <p className="text-xs text-muted-foreground">Healthcare, simplified.</p>
      </motion.div>
    </motion.div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "ClinIQ — Find & Book Your Doctor in Seconds" },
      {
        name: "description",
        content:
          "ClinIQ is the modern way to discover verified doctors and book medical appointments instantly. Free booking, pay at the clinic.",
      },
      { property: "og:title", content: "ClinIQ — Find & Book Your Doctor in Seconds" },
      { name: "twitter:title", content: "ClinIQ — Find & Book Your Doctor in Seconds" },
      {
        property: "og:description",
        content:
          "ClinIQ is the modern way to discover verified doctors and book medical appointments instantly.",
      },
      {
        name: "twitter:description",
        content:
          "ClinIQ is the modern way to discover verified doctors and book medical appointments instantly.",
      },
      { property: "og:image", content: "/og-image.png" },
      { name: "twitter:image", content: "/og-image.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:type", content: "website" },
    ],
    links: [
     { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Cairo:wght@400;500;600;700;800&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFound,
  errorComponent: ErrorComp,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const location = useRouterState({ select: (s) => s.location.pathname });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <GoogleOAuthProvider clientId="759082771946-f9nksjt3dhj2mf36c6qmgnukn4fqg5av.apps.googleusercontent.com">
      {" "}
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <LanguageProvider>
            <AuthProvider>
              <AnimatePresence mode="wait">
                {loading ? (
                  <SplashScreen key="splash" />
                ) : (
                  <motion.div
                    key={location}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.22, ease: "easeInOut" }}
                  >
                    <Outlet />
                  </motion.div>
                )}
              </AnimatePresence>
              <Toaster position="bottom-right" richColors />
            </AuthProvider>
          </LanguageProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </GoogleOAuthProvider>
  );
}
