import { useState } from "react";
import { useUser, useAuth, useClerk } from "@clerk/react";
import {
  useGetPreferences,
  useGetTripStats,
  useSavePreferences,
  useGetSearchHistory,
  useGetUsage,
} from "@workspace/api-client-react";
import type { SearchHistoryEntry, UserPreferences } from "@workspace/api-client-react";
import { Link, Redirect, useLocation } from "wouter";
import {
  Settings, Shield, Award, Map, FileText, LogOut,
  Pencil, Check, X, Clock, Search, Zap, ChevronRight,
  Plane, Calendar, Users, Banknote,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const FILTERS_STORAGE_KEY = "tb_discover_filters";
const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

/* ── Small helper to format a search entry label ── */
function searchLabel(entry: SearchHistoryEntry, t: ReturnType<typeof useI18n>["t"]) {
  const parts: string[] = [];
  if (entry.departureLocation) parts.push(`${t.profile.departureFrom} ${entry.departureLocation}`);
  if (entry.arrivalLocation && entry.arrivalLocation !== "Any") parts.push(`→ ${entry.arrivalLocation}`);
  if (entry.numberOfNights) {
    parts.push(`${entry.numberOfNights} ${entry.numberOfNights === 1 ? t.profile.night : t.profile.nights}`);
  }
  if (entry.numberOfPeople) parts.push(`${entry.numberOfPeople} ${t.profile.people}`);
  if (entry.budget) parts.push(`€${entry.budget}`);
  return parts.length ? parts.join(" · ") : "—";
}

/* ── Inline preference editor ── */
function PreferencesEditor({
  prefs,
  onDone,
  t,
}: {
  prefs: UserPreferences | undefined;
  onDone: () => void;
  t: ReturnType<typeof useI18n>["t"];
}) {
  const qc = useQueryClient();
  const save = useSavePreferences();

  const [budget, setBudget] = useState(String(prefs?.defaultBudget ?? ""));
  const [departure, setDeparture] = useState(prefs?.defaultDepartureLocation ?? "");
  const [people, setPeople] = useState(String(prefs?.defaultNumberOfPeople ?? ""));
  const [flight, setFlight] = useState(prefs?.defaultFlightPreference ?? "any");

  function submit() {
    const payload = {
      language: prefs?.language ?? "it",
      defaultBudget: budget ? Number(budget) : null,
      defaultDepartureLocation: departure || null,
      defaultNumberOfPeople: people ? Number(people) : null,
      defaultFlightPreference: flight || null,
    };
    save.mutate({ data: payload }, {
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: ["preferences"] });
        toast.success(t.profile.save);
        onDone();
      },
      onError: () => toast.error("Error saving preferences"),
    });
  }

  const inputCls =
    "w-full bg-muted border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40";

  return (
    <div className="space-y-3 mt-3">
      <div>
        <label className="text-xs text-muted-foreground font-medium mb-1 block flex items-center gap-1">
          <Banknote className="w-3 h-3" /> Budget (€)
        </label>
        <input
          type="number"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          placeholder={t.profile.notSet}
          className={inputCls}
        />
      </div>
      <div>
        <label className="text-xs text-muted-foreground font-medium mb-1 block flex items-center gap-1">
          <Plane className="w-3 h-3" /> {t.onboarding.departureCity}
        </label>
        <input
          type="text"
          value={departure}
          onChange={(e) => setDeparture(e.target.value)}
          placeholder={t.profile.notSet}
          className={inputCls}
        />
      </div>
      <div>
        <label className="text-xs text-muted-foreground font-medium mb-1 block flex items-center gap-1">
          <Users className="w-3 h-3" /> {t.onboarding.numberOfPeople}
        </label>
        <input
          type="number"
          min={1}
          max={20}
          value={people}
          onChange={(e) => setPeople(e.target.value)}
          placeholder={t.profile.notSet}
          className={inputCls}
        />
      </div>
      <div>
        <label className="text-xs text-muted-foreground font-medium mb-1 block flex items-center gap-1">
          <Plane className="w-3 h-3" /> {t.onboarding.flight}
        </label>
        <select value={flight} onChange={(e) => setFlight(e.target.value)} className={inputCls}>
          <option value="any">{t.onboarding.any}</option>
          <option value="direct">{t.onboarding.directOnly}</option>
          <option value="with_stops">{t.onboarding.withStops}</option>
        </select>
      </div>
      <div className="flex gap-2 pt-1">
        <Button
          size="sm"
          onClick={submit}
          disabled={save.isPending}
          className="flex-1 bg-primary text-white"
        >
          <Check className="w-3.5 h-3.5 mr-1" />
          {t.profile.save}
        </Button>
        <Button size="sm" variant="outline" onClick={onDone} className="flex-1">
          <X className="w-3.5 h-3.5 mr-1" />
          {t.profile.cancel}
        </Button>
      </div>
    </div>
  );
}

/* ── Main page ── */
export default function Profile() {
  const { isSignedIn, isLoaded: authLoaded } = useAuth();
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const [, setLocation] = useLocation();
  const { t } = useI18n();

  const { data: prefs } = useGetPreferences({
    query: { enabled: !!isSignedIn, queryKey: ["preferences"] },
  });
  const { data: stats } = useGetTripStats({
    query: { enabled: !!isSignedIn, queryKey: ["trip-stats"] },
  });
  const { data: history } = useGetSearchHistory({
    query: { enabled: !!isSignedIn, queryKey: ["search-history"] },
  });
  const { data: usage } = useGetUsage({
    query: { enabled: !!isSignedIn, queryKey: ["usage"] },
  });

  const [editingPrefs, setEditingPrefs] = useState(false);

  if (!authLoaded || !isLoaded)
    return <div className="p-8 text-center text-muted-foreground">{t.profile.loading}</div>;
  if (!isSignedIn) return <Redirect to="/sign-in" />;

  const email = user?.emailAddresses?.[0]?.emailAddress ?? "";
  const initials = (user?.firstName?.[0] ?? email[0] ?? "?").toUpperCase();

  function repeatSearch(entry: SearchHistoryEntry) {
    try {
      const current = JSON.parse(localStorage.getItem(FILTERS_STORAGE_KEY) ?? "null") ?? {};
      const updated = {
        ...current,
        ...(entry.budget != null ? { budget: entry.budget } : {}),
        ...(entry.numberOfPeople != null ? { numberOfPeople: entry.numberOfPeople } : {}),
        ...(entry.numberOfNights != null ? { numberOfNights: entry.numberOfNights } : {}),
        ...(entry.departureLocation ? { departureAirport: entry.departureLocation } : {}),
        ...(entry.arrivalLocation && entry.arrivalLocation !== "Any"
          ? { arrivalAirport: entry.arrivalLocation }
          : {}),
        ...(entry.tripType ? { tripType: entry.tripType } : {}),
        ...(entry.departureDate ? { departureDate: entry.departureDate } : {}),
        ...(entry.returnDate ? { returnDate: entry.returnDate } : {}),
      };
      localStorage.setItem(FILTERS_STORAGE_KEY, JSON.stringify(updated));
    } catch {}
    setLocation("/discover");
  }

  const freeLimit = usage?.freeLimit ?? 5;
  const searchCount = usage?.searchCount ?? 0;
  const isPremium = usage?.isPremium ?? false;

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto w-full pb-24">
      <h1 className="text-3xl font-bold mb-6">{t.profile.title}</h1>

      {/* ── Avatar card ── */}
      <div className="flex items-center gap-5 mb-6 p-5 bg-card border rounded-2xl">
        {user?.imageUrl ? (
          <img
            src={user.imageUrl}
            alt={user.firstName ?? ""}
            className="w-16 h-16 rounded-full object-cover shrink-0"
          />
        ) : (
          <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center text-2xl font-bold shrink-0">
            {initials}
          </div>
        )}
        <div className="min-w-0">
          <h2 className="text-xl font-bold truncate">{user?.firstName || t.profile.traveler}</h2>
          <p className="text-sm text-muted-foreground truncate">{email}</p>
          {isPremium && (
            <span className="inline-flex items-center gap-1 mt-1 text-xs font-semibold text-amber-500">
              <Zap className="w-3 h-3" /> Premium
            </span>
          )}
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-card border rounded-xl p-4 flex flex-col items-center text-center">
          <Award className="w-6 h-6 text-accent mb-1.5" />
          <div className="text-2xl font-bold">{stats?.totalSaved ?? 0}</div>
          <div className="text-xs text-muted-foreground leading-tight">{t.profile.tripsSaved}</div>
        </div>
        <div className="bg-card border rounded-xl p-4 flex flex-col items-center text-center">
          <Map className="w-6 h-6 text-secondary mb-1.5" />
          <div className="text-2xl font-bold">€{Math.round(stats?.averagePrice ?? 0)}</div>
          <div className="text-xs text-muted-foreground leading-tight">{t.profile.avgTripPrice}</div>
        </div>
        <div className="bg-card border rounded-xl p-4 flex flex-col items-center text-center">
          <Search className="w-6 h-6 text-primary mb-1.5" />
          <div className="text-2xl font-bold">{searchCount}</div>
          <div className="text-xs text-muted-foreground leading-tight">{t.profile.searchesUsed}</div>
        </div>
      </div>

      {/* ── My Preferences (inline edit) ── */}
      <div className="bg-card border rounded-2xl p-5 mb-4">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-bold text-base flex items-center gap-2">
            <Settings className="w-4 h-4 text-muted-foreground" />
            {t.profile.preferences}
          </h3>
          {!editingPrefs && (
            <button
              onClick={() => setEditingPrefs(true)}
              className="text-xs text-primary font-medium flex items-center gap-1 hover:opacity-80"
            >
              <Pencil className="w-3 h-3" />
              {t.profile.editPreferences}
            </button>
          )}
        </div>

        {!editingPrefs ? (
          <div className="mt-3 space-y-2 text-sm text-muted-foreground">
            <div className="flex justify-between">
              <span className="flex items-center gap-1.5"><Banknote className="w-3.5 h-3.5" /> Budget</span>
              <span className="font-medium text-foreground">
                {prefs?.defaultBudget ? `€${prefs.defaultBudget}` : t.profile.notSet}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="flex items-center gap-1.5"><Plane className="w-3.5 h-3.5" /> {t.onboarding.departureCity}</span>
              <span className="font-medium text-foreground">
                {prefs?.defaultDepartureLocation || t.profile.notSet}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> {t.onboarding.numberOfPeople}</span>
              <span className="font-medium text-foreground">
                {prefs?.defaultNumberOfPeople ?? t.profile.notSet}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="flex items-center gap-1.5"><Plane className="w-3.5 h-3.5" /> {t.onboarding.flight}</span>
              <span className="font-medium text-foreground">
                {prefs?.defaultFlightPreference === "direct"
                  ? t.onboarding.directOnly
                  : prefs?.defaultFlightPreference === "with_stops"
                  ? t.onboarding.withStops
                  : t.onboarding.any}
              </span>
            </div>
          </div>
        ) : (
          <PreferencesEditor prefs={prefs} onDone={() => setEditingPrefs(false)} t={t} />
        )}
      </div>

      {/* ── Recent searches ── */}
      <div className="bg-card border rounded-2xl p-5 mb-4">
        <h3 className="font-bold text-base flex items-center gap-2 mb-3">
          <Clock className="w-4 h-4 text-muted-foreground" />
          {t.profile.recentSearches}
        </h3>

        {!history || history.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t.profile.noRecentSearches}</p>
        ) : (
          <div className="space-y-2">
            {history.map((entry) => (
              <div
                key={entry.id}
                className="flex items-center justify-between gap-3 p-3 bg-muted/40 rounded-xl"
              >
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium truncate">{searchLabel(entry, t)}</div>
                  <div className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(entry.createdAt).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                    })}
                    {entry.tripType && (
                      <span className="ml-1 px-1.5 py-0.5 bg-primary/10 text-primary text-[10px] rounded-full font-medium">
                        {entry.tripType === "one_way" ? "→" : "⇌"}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => repeatSearch(entry)}
                  className="shrink-0 text-xs font-semibold text-primary flex items-center gap-1 hover:opacity-80 transition-opacity"
                >
                  {t.profile.repeatSearch}
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Legal ── */}
      <div className="bg-card border rounded-2xl overflow-hidden mb-4">
        <h3 className="font-bold text-sm px-5 pt-4 pb-2 text-muted-foreground uppercase tracking-wide">
          {t.profile.legalSection}
        </h3>
        <Link href="/privacy">
          <div className="flex items-center justify-between px-5 py-3.5 hover:bg-muted/40 cursor-pointer transition-colors border-t">
            <div className="flex items-center gap-3">
              <Shield className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">{t.profile.privacyPolicy}</span>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </div>
        </Link>
        <Link href="/terms">
          <div className="flex items-center justify-between px-5 py-3.5 hover:bg-muted/40 cursor-pointer transition-colors border-t">
            <div className="flex items-center gap-3">
              <FileText className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">{t.profile.termsOfService}</span>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </div>
        </Link>
      </div>

      {/* ── Sign out (mobile only) ── */}
      <div className="md:hidden">
        <Button
          variant="outline"
          className="w-full text-muted-foreground"
          onClick={() => signOut({ redirectUrl: basePath || "/" })}
        >
          <LogOut className="w-4 h-4 mr-2" />
          {t.profile.signOut}
        </Button>
      </div>

      <div className="mt-6 pt-4 border-t flex gap-4 justify-center text-xs text-muted-foreground">
        <Link href="/privacy" className="hover:text-foreground transition-colors">
          {t.legal.privacyPolicy}
        </Link>
        <span>·</span>
        <Link href="/terms" className="hover:text-foreground transition-colors">
          {t.legal.termsOfService}
        </Link>
      </div>
    </div>
  );
}
