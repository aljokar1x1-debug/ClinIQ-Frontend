import { useRef, useState } from "react";
import { Upload, X, CheckCircle, AlertCircle, Camera } from "lucide-react";
import { doctorsApi } from "@/api/doctors";
import { useLanguage } from "@/context/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";

interface DoctorImageUploadProps {
  doctorId: number;
  currentImage?: string;
  onSuccess?: (imageUrl: string) => void;
}

export function DoctorImageUpload({ doctorId, currentImage, onSuccess }: DoctorImageUploadProps) {
  const { lang } = useLanguage();
  const ar = lang === "ar";
  const inputRef = useRef<HTMLInputElement>(null);

  const [preview, setPreview]   = useState<string | null>(currentImage ?? null);
  const [loading, setLoading]   = useState(false);
  const [status, setStatus]     = useState<"idle" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [dragOver, setDragOver] = useState(false);

  const handleFile = async (file: File) => {
    // client-side validation
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(file.type)) {
      setStatus("error");
      setErrorMsg(ar ? "فقط JPEG أو PNG أو WebP" : "Only JPEG, PNG, or WebP allowed");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setStatus("error");
      setErrorMsg(ar ? "الحجم الأقصى 5 ميجا" : "Max file size is 5MB");
      return;
    }

    // show preview immediately
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);

    setLoading(true);
    setStatus("idle");
    try {
      const { imageUrl } = await doctorsApi.uploadImage(doctorId, file);
      setStatus("success");
      onSuccess?.(imageUrl);
    } catch {
      setStatus("error");
      setErrorMsg(ar ? "فشل رفع الصورة، حاول مجدداً" : "Upload failed, please try again");
      setPreview(currentImage ?? null);
    } finally {
      setLoading(false);
    }
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const clearImage = () => {
    setPreview(null);
    setStatus("idle");
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="space-y-3">
      <p className="text-sm font-semibold text-foreground">
        {ar ? "صورة الطبيب" : "Profile Photo"}
      </p>

      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        onClick={() => !loading && inputRef.current?.click()}
        className={`relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 transition-all ${
          dragOver
            ? "border-primary bg-primary/5"
            : "border-border bg-muted/30 hover:border-primary/50 hover:bg-muted/50"
        } ${loading ? "pointer-events-none opacity-60" : ""}`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={onInputChange}
          className="hidden"
        />

        {/* Preview */}
        {preview ? (
          <div className="relative">
            <img
              src={preview}
              alt="Doctor"
              className="h-28 w-28 rounded-full object-cover ring-2 ring-primary/30"
            />
            {/* Camera overlay */}
            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 hover:opacity-100 transition-opacity">
              <Camera className="h-6 w-6 text-white" />
            </div>
            {/* Remove button */}
            {!loading && (
              <button
                onClick={(e) => { e.stopPropagation(); clearImage(); }}
                className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-white shadow"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
              <Upload className="h-6 w-6 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">
                {ar ? "اسحب الصورة هنا أو" : "Drag photo here or"}
                {" "}
                <span className="text-primary">{ar ? "اختر ملف" : "browse"}</span>
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {ar ? "PNG أو JPEG أو WebP · حتى 5 ميجا" : "PNG, JPEG or WebP · up to 5MB"}
              </p>
            </div>
          </div>
        )}

        {/* Loading overlay */}
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center rounded-xl bg-background/70 backdrop-blur-sm">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <p className="mt-2 text-xs text-muted-foreground">{ar ? "جاري الرفع…" : "Uploading…"}</p>
          </div>
        )}
      </div>

      {/* Status messages */}
      <AnimatePresence>
        {status === "success" && (
          <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="flex items-center gap-2 rounded-md bg-green-500/10 px-3 py-2 text-sm text-green-500">
            <CheckCircle className="h-4 w-4 shrink-0" />
            {ar ? "تم رفع الصورة بنجاح ✓" : "Photo uploaded successfully ✓"}
          </motion.div>
        )}
        {status === "error" && (
          <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="flex items-center gap-2 rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {errorMsg}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
