import { useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { ALLOWED_IMAGE_TYPES, MAX_IMAGE_BYTES, fileToBase64 } from "@/services/imageStore";
import { useLanguage } from "@/context/LanguageContext";

export function ImageUploadModal({
  open,
  title,
  currentSrc,
  onClose,
  onSave,
}: {
  open: boolean;
  title?: string;
  currentSrc?: string | null;
  onClose: () => void;
  onSave: (base64: string) => void;
}) {
  const { lang } = useLanguage();
  const ar = lang === "ar";
  const [preview, setPreview] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handle = useCallback(
    async (file: File) => {
      if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        toast.error(ar ? "صيغة غير مدعومة. استخدم JPG أو PNG أو WebP" : "Unsupported format. Use JPG, PNG or WebP");
        return;
      }
      if (file.size > MAX_IMAGE_BYTES) {
        toast.error(ar ? "حجم الصورة كبير جداً، الحد الأقصى 5MB" : "Image too large, max 5MB");
        return;
      }
      setBusy(true);
      try {
        const b64 = await fileToBase64(file);
        setPreview(b64);
      } finally {
        setBusy(false);
      }
    },
    [ar],
  );

  const reset = () => {
    setPreview(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const close = () => {
    reset();
    onClose();
  };

  const save = () => {
    if (!preview) return;
    onSave(preview);
    reset();
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={close}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md overflow-hidden rounded-2xl border border-border bg-card shadow-glow"
          >
            <div className="flex items-center justify-between border-b border-border px-5 py-3">
              <h3 className="font-bold">{title ?? (ar ? "رفع الصورة" : "Upload Image")}</h3>
              <button onClick={close} className="rounded-md p-1 hover:bg-muted" aria-label="Close">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-5">
              {preview || currentSrc ? (
                <div className="mb-4 flex justify-center">
                  <img
                    src={preview ?? currentSrc!}
                    alt="preview"
                    className="h-32 w-32 rounded-full border-4 border-border object-cover"
                  />
                </div>
              ) : null}

              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragOver(false);
                  const f = e.dataTransfer.files?.[0];
                  if (f) handle(f);
                }}
                onClick={() => inputRef.current?.click()}
                className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-8 text-center transition ${
                  dragOver ? "border-primary bg-primary/5" : "border-border hover:border-primary/60"
                }`}
              >
                {busy ? (
                  <div className="text-sm text-muted-foreground">{ar ? "جارٍ المعالجة..." : "Processing..."}</div>
                ) : (
                  <>
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                      {preview ? <ImageIcon className="h-6 w-6" /> : <Upload className="h-6 w-6" />}
                    </div>
                    <p className="text-sm font-semibold">
                      {ar ? "اسحب وأفلت الصورة هنا أو انقر للاختيار" : "Drag & drop image here, or click to browse"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {ar ? "JPG, PNG, WebP · حتى 5MB" : "JPG, PNG, WebP · up to 5MB"}
                    </p>
                  </>
                )}
                <input
                  ref={inputRef}
                  type="file"
                  accept={ALLOWED_IMAGE_TYPES.join(",")}
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handle(f);
                  }}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t border-border px-5 py-3">
              <button onClick={close} className="rounded-md border border-border px-4 py-2 text-sm font-semibold hover:bg-muted">
                {ar ? "إلغاء" : "Cancel"}
              </button>
              <button
                onClick={save}
                disabled={!preview}
                className="rounded-md bg-primary px-4 py-2 text-sm font-bold text-primary-foreground shadow-button transition hover:opacity-90 disabled:opacity-50"
              >
                {ar ? "حفظ الصورة" : "Save Image"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
