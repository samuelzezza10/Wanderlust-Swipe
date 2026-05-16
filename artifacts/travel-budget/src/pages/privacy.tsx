import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export default function PrivacyPolicy() {
  const { t } = useI18n();

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto w-full">
      <Link href="/profile" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        {t.profile.title}
      </Link>

      <div className="prose prose-gray dark:prose-invert max-w-none">
        <h1 className="text-3xl font-bold mb-2">{t.legal.privacyPolicy}</h1>
        <p className="text-muted-foreground mb-8 text-sm">{t.legal.lastUpdated}: {new Date().toLocaleDateString()}</p>

        <section className="mb-8">
          <h2 className="text-xl font-bold mb-3">1. {t.legal.privacy.collectTitle}</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">{t.legal.privacy.collect}</p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold mb-3">2. {t.legal.privacy.useTitle}</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">{t.legal.privacy.use}</p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold mb-3">3. {t.legal.privacy.cookiesTitle}</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">{t.legal.privacy.cookies}</p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold mb-3">4. {t.legal.privacy.thirdPartyTitle}</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">{t.legal.privacy.thirdParty}</p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold mb-3">5. {t.legal.privacy.securityTitle}</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">{t.legal.privacy.security}</p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold mb-3">6. {t.legal.privacy.rightsTitle}</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">{t.legal.privacy.rights}</p>
        </section>

        <section className="mb-8 bg-muted/40 rounded-2xl p-5">
          <h2 className="text-xl font-bold mb-3">7. {t.legal.privacy.liabilityTitle}</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">{t.legal.privacy.liability}</p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold mb-3">8. {t.legal.privacy.changesTitle}</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">{t.legal.privacy.changes}</p>
        </section>

        <div className="border-t pt-6 mt-8 flex gap-4 text-xs text-muted-foreground">
          <Link href="/privacy" className="hover:text-foreground transition-colors">{t.legal.privacyPolicy}</Link>
          <Link href="/terms" className="hover:text-foreground transition-colors">{t.legal.termsOfService}</Link>
        </div>
      </div>
    </div>
  );
}
