import { useUser } from "@clerk/react";
import { useGetPreferences, useGetTripStats } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Settings, Shield, Award, Map, FileText } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export default function Profile() {
  const { user, isLoaded } = useUser();
  const { data: prefs } = useGetPreferences();
  const { data: stats } = useGetTripStats();
  const { t } = useI18n();

  if (!isLoaded) return <div className="p-8 text-center text-muted-foreground">{t.profile.loading}</div>;

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto w-full">
      <h1 className="text-3xl font-bold mb-8">{t.profile.title}</h1>

      <div className="flex items-center gap-6 mb-10 p-6 bg-card border rounded-2xl">
        <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center text-2xl font-bold shrink-0">
          {user?.firstName?.[0] || user?.emailAddresses[0].emailAddress[0].toUpperCase()}
        </div>
        <div>
          <h2 className="text-2xl font-bold">{user?.firstName || t.profile.traveler}</h2>
          <p className="text-muted-foreground">{user?.emailAddresses[0].emailAddress}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-10">
        <div className="bg-card border rounded-xl p-5 flex flex-col items-center justify-center text-center">
          <Award className="w-8 h-8 text-accent mb-2" />
          <div className="text-3xl font-bold">{stats?.totalSaved || 0}</div>
          <div className="text-sm text-muted-foreground">{t.profile.tripsSaved}</div>
        </div>
        <div className="bg-card border rounded-xl p-5 flex flex-col items-center justify-center text-center">
          <Map className="w-8 h-8 text-secondary mb-2" />
          <div className="text-3xl font-bold">${stats?.averagePrice || 0}</div>
          <div className="text-sm text-muted-foreground">{t.profile.avgTripPrice}</div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-bold text-lg mb-2">{t.profile.settings}</h3>

        <Link href="/onboarding">
          <div className="flex items-center justify-between p-4 bg-card border rounded-xl hover:border-primary transition-colors cursor-pointer group">
            <div className="flex items-center gap-3">
              <Settings className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              <div className="font-medium">{t.profile.updatePreferences}</div>
            </div>
            <div className="text-sm text-muted-foreground">
              {prefs?.defaultDepartureLocation || t.profile.notSet} • ${prefs?.defaultBudget || 0}
            </div>
          </div>
        </Link>

        <Link href="/privacy">
          <div className="flex items-center justify-between p-4 bg-card border rounded-xl hover:border-primary transition-colors cursor-pointer group">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              <div className="font-medium">{t.profile.privacyPolicy}</div>
            </div>
          </div>
        </Link>

        <Link href="/terms">
          <div className="flex items-center justify-between p-4 bg-card border rounded-xl hover:border-primary transition-colors cursor-pointer group">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              <div className="font-medium">{t.profile.termsOfService}</div>
            </div>
          </div>
        </Link>
      </div>

      <div className="mt-8 pt-6 border-t flex gap-4 justify-center text-xs text-muted-foreground">
        <Link href="/privacy" className="hover:text-foreground transition-colors">{t.legal.privacyPolicy}</Link>
        <span>·</span>
        <Link href="/terms" className="hover:text-foreground transition-colors">{t.legal.termsOfService}</Link>
      </div>
    </div>
  );
}
