import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useSavePreferences } from "@workspace/api-client-react";
import { useAuth } from "@clerk/react";
import { useI18n } from "@/lib/i18n";

export function CookieBanner() {
  const [show, setShow] = useState(false);
  const savePreferences = useSavePreferences();
  const { isSignedIn } = useAuth();
  const { t } = useI18n();

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) {
      setShow(true);
    }
  }, []);

  const handleConsent = (accepted: boolean) => {
    localStorage.setItem("cookieConsent", accepted ? "accepted" : "declined");
    setShow(false);

    if (isSignedIn) {
      savePreferences.mutate({ data: { cookieConsent: accepted } });
    }
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-[72px] md:bottom-4 left-4 right-4 md:left-auto md:right-8 md:w-96 bg-card p-4 rounded-xl shadow-xl border border-border z-50 flex flex-col gap-3">
      <h3 className="font-bold text-sm">{t.cookie.title}</h3>
      <p className="text-xs text-muted-foreground">{t.cookie.description}</p>
      <div className="flex gap-3 text-xs text-muted-foreground">
        <Link href="/privacy" className="hover:text-foreground underline underline-offset-2 transition-colors">{t.legal.privacyPolicy}</Link>
        <Link href="/terms" className="hover:text-foreground underline underline-offset-2 transition-colors">{t.legal.termsOfService}</Link>
      </div>
      <div className="flex items-center gap-2 justify-end">
        <Button variant="outline" size="sm" onClick={() => handleConsent(false)} data-testid="button-cookie-decline">
          {t.cookie.decline}
        </Button>
        <Button size="sm" onClick={() => handleConsent(true)} data-testid="button-cookie-accept">
          {t.cookie.acceptAll}
        </Button>
      </div>
    </div>
  );
}
