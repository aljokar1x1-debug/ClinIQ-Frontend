import { useState, ReactNode } from "react";
import { Eye, EyeOff } from "lucide-react";

type Props = {
  type?: string;
  placeholder?: string;
  icon?: ReactNode;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  success?: boolean;
  password?: boolean;
};

export function Input({ type = "text", placeholder, icon, value, onChange, error, success, password }: Props) {
  const [show, setShow] = useState(false);
  const inputType = password ? (show ? "text" : "password") : type;
  const ringClass = error
    ? "border-destructive focus-within:ring-destructive/30"
    : success
    ? "border-accent focus-within:ring-accent/30"
    : "border-border focus-within:border-primary focus-within:ring-primary/20";

  return (
    <div>
      <div className={`flex items-center gap-2 rounded-md border bg-surface px-3 py-2.5 transition focus-within:ring-4 ${ringClass}`}>
        {icon && <span className="text-muted-foreground">{icon}</span>}
        <input
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
        {password && (
          <button type="button" onClick={() => setShow(!show)} className="text-muted-foreground hover:text-foreground">
            {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        )}
        {success && !password && <span className="text-accent">✓</span>}
      </div>
      {error && <p className="mt-1.5 text-xs text-destructive">{error}</p>}
    </div>
  );
}
