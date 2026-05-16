import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export default function TermsOfService() {
  const { t } = useI18n();

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto w-full">
      <Link href="/profile" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        {t.profile.title}
      </Link>

      <div className="prose prose-gray dark:prose-invert max-w-none">
        <h1 className="text-3xl font-bold mb-2">{t.legal.termsOfService}</h1>
        <p className="text-muted-foreground mb-8 text-sm">{t.legal.lastUpdated}: {new Date().toLocaleDateString()}</p>

        <section className="mb-8">
          <h2 className="text-xl font-bold mb-3">1. {t.legal.terms.acceptanceTitle}</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">{t.legal.terms.acceptance}</p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold mb-3">2. {t.legal.terms.serviceTitle}</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">{t.legal.terms.service}</p>
        </section>

        <section className="mb-8 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-2xl p-5">
          <h2 className="text-xl font-bold mb-3">3. {t.legal.terms.pricesTitle}</h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-2">{t.legal.terms.prices1}</p>
          <p className="text-sm text-muted-foreground leading-relaxed mb-2">{t.legal.terms.prices2}</p>
          <p className="text-sm text-muted-foreground leading-relaxed">{t.legal.terms.prices3}</p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold mb-3">4. {t.legal.terms.thirdPartyTitle}</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">{t.legal.terms.thirdParty}</p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold mb-3">5. {t.legal.terms.bookingTitle}</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">{t.legal.terms.booking}</p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold mb-3">6. {t.legal.terms.accountTitle}</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">{t.legal.terms.account}</p>
        </section>

        <section className="mb-8 bg-muted/40 rounded-2xl p-5">
          <h2 className="text-xl font-bold mb-3">7. {t.legal.terms.liabilityTitle}</h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-2">{t.legal.terms.liability1}</p>
          <p className="text-sm text-muted-foreground leading-relaxed">{t.legal.terms.liability2}</p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold mb-3">8. {t.legal.terms.changesTitle}</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">{t.legal.terms.changes}</p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold mb-3">9. {t.legal.terms.contactTitle}</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">{t.legal.terms.contact}</p>
        </section>

        <div className="border-t pt-6 mt-8 flex gap-4 text-xs text-muted-foreground">
          <Link href="/privacy" className="hover:text-foreground transition-colors">{t.legal.privacyPolicy}</Link>
          <Link href="/terms" className="hover:text-foreground transition-colors">{t.legal.termsOfService}</Link>
        </div>
      </div>
    </div>
  );
}
