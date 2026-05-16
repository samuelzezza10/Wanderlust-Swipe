import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Plane } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { LanguageSwitcher } from "@/components/language-switcher";

export default function LandingPage() {
  const { t } = useI18n();

  return (
    <div className="min-h-[100dvh] flex flex-col justify-center items-center px-4 text-center">
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>

      <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-8">
        <Plane className="w-10 h-10 text-primary" />
      </div>

      <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
        {t.landing.title}
      </h1>

      <p className="text-lg text-muted-foreground max-w-md mx-auto mb-10">
        {t.landing.subtitle}
      </p>

      <div className="flex flex-col sm:flex-row w-full max-w-sm gap-4">
        <Button asChild size="lg" className="w-full text-md font-medium" data-testid="button-get-started">
          <Link href="/sign-up">{t.landing.getStarted}</Link>
        </Button>
        <Button asChild variant="outline" size="lg" className="w-full text-md font-medium" data-testid="button-login">
          <Link href="/sign-in">{t.landing.logIn}</Link>
        </Button>
      </div>

      <div className="mt-8">
        <Button asChild variant="link" data-testid="button-guest-mode">
          <Link href="/discover">{t.landing.continueAsGuest}</Link>
        </Button>
      </div>

      <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-4 text-xs text-muted-foreground/60">
        <Link href="/privacy" className="hover:text-muted-foreground transition-colors">{t.legal.privacyPolicy}</Link>
        <span>·</span>
        <Link href="/terms" className="hover:text-muted-foreground transition-colors">{t.legal.termsOfService}</Link>
      </div>
    </div>
  );
}
