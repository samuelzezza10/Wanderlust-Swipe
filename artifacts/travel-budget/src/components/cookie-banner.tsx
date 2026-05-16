import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useSavePreferences } from "@workspace/api-client-react";
import { useAuth } from "@clerk/react";

export function CookieBanner() {
  const [show, setShow] = useState(false);
  const savePreferences = useSavePreferences();
  const { isSignedIn } = useAuth();

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
      <h3 className="font-bold text-sm">We value your privacy</h3>
      <p className="text-xs text-muted-foreground">
        We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our traffic. By clicking "Accept All", you consent to our use of cookies.
      </p>
      <div className="flex items-center gap-2 justify-end mt-2">
        <Button variant="outline" size="sm" onClick={() => handleConsent(false)} data-testid="button-cookie-decline">
          Decline
        </Button>
        <Button size="sm" onClick={() => handleConsent(true)} data-testid="button-cookie-accept">
          Accept All
        </Button>
      </div>
    </div>
  );
}
