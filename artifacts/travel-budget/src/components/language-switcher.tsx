import { LANGUAGES, useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function LanguageSwitcher({ className }: { className?: string }) {
  const { lang, setLang } = useI18n();

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {LANGUAGES.map((l) => (
        <button
          key={l.code}
          onClick={() => setLang(l.code)}
          title={l.label}
          className={cn(
            "text-base leading-none px-1.5 py-1 rounded-md transition-all",
            lang === l.code
              ? "bg-primary/10 ring-1 ring-primary/30 scale-110"
              : "opacity-50 hover:opacity-80"
          )}
        >
          {l.flag}
        </button>
      ))}
    </div>
  );
}
