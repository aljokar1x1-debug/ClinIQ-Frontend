import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export function AnnouncementBar() {
  const { t } = useLanguage();
  const [show, setShow] = useState(false);
  useEffect(() => {
    setShow(localStorage.getItem("cliniq-announce-dismissed") !== "1");
  }, []);
  const dismiss = () => {
    localStorage.setItem("cliniq-announce-dismissed", "1");
    setShow(false);
  };
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: "auto" }}
          exit={{ height: 0 }}
          className="overflow-hidden bg-accent text-accent-foreground"
        >
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2 text-sm font-medium">
            <span className="flex-1 text-center">{t("announcement")}</span>
            <button onClick={dismiss} aria-label="Dismiss" className="rounded p-1 hover:bg-white/20">
              <X className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
