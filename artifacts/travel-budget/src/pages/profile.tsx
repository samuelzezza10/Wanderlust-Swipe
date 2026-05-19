import { useState } from "react";
import { useUser, useAuth, useClerk } from "@clerk/react";
import {
  useGetPreferences,
  useGetTripStats,
  useSavePreferences,
  useGetSearchHistory,
  useGetUsage,
  useUpgradeSubscription,
  useDowngradeSubscription,
} from "@workspace/api-client-react";
import type { SearchHistoryEntry, UserPreferences } from "@workspace/api-client-react";
import { Link, Redirect, useLocation } from "wouter";
import {
  Shield, FileText, LogOut,
  Pencil, Check, X, Clock, Search, Zap, ChevronRight,
  Plane, Calendar, Users, Banknote, Crown, Star, Heart,
  MapPin, Settings, Lock, CreditCard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const FILTERS_STORAGE_KEY = "tb_discover_filters";
const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

function searchLabel(entry: SearchHistoryEntry, t: ReturnType<typeof useI18n>["t"]) {
  const parts: string[] = [];
  if (entry.departureLocation) parts.push(`${entry.departureLocation}`);
  if (entry.arrivalLocation && entry.arrivalLocation !== "Any") parts.push(`→ ${entry.arrivalLocation}`);
  if (entry.numberOfNights) parts.push(`${entry.numberOfNights}n`);
  if (entry.numberOfPeople) parts.push(`${entry.numberOfPeople} ${t.profile.people}`);
  if (entry.budget) parts.push(`€${entry.budget}`);
  return parts.length ? parts.join(" · ") : "—";
}

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
      onError: () => toast.error("Errore nel salvataggio"),
    });
  }

  const inputCls =
    "w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40";

  return (
    <div className="px-4 pb-4 space-y-3">
      <div>
        <label className="text-xs text-muted-foreground font-medium mb-1 block flex items-center gap-1">
          <Banknote className="w-3 h-3" /> Budget (€)
        </label>
        <input type="number" value={budget} onChange={(e) => setBudget(e.target.value)} placeholder={t.profile.notSet} className={inputCls} />
      </div>
      <div>
        <label className="text-xs text-muted-foreground font-medium mb-1 block flex items-center gap-1">
          <MapPin className="w-3 h-3" /> {t.onboarding.departureCity}
        </label>
        <input type="text" value={departure} onChange={(e) => setDeparture(e.target.value)} placeholder={t.profile.notSet} className={inputCls} />
      </div>
      <div>
        <label className="text-xs text-muted-foreground font-medium mb-1 block flex items-center gap-1">
          <Users className="w-3 h-3" /> {t.onboarding.numberOfPeople}
        </label>
        <input type="number" min={1} max={20} value={people} onChange={(e) => setPeople(e.target.value)} placeholder={t.profile.notSet} className={inputCls} />
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
        <Button size="sm" onClick={submit} disabled={save.isPending} className="flex-1 bg-primary text-white">
          <Check className="w-3.5 h-3.5 mr-1" />{t.profile.save}
        </Button>
        <Button size="sm" variant="outline" onClick={onDone} className="flex-1">
          <X className="w-3.5 h-3.5 mr-1" />{t.profile.cancel}
        </Button>
      </div>
    </div>
  );
}

function SectionCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-card border border-border rounded-2xl overflow-hidden ${className}`}>
      {children}
    </div>
  );
}

function SectionHeader({ label }: { label: string }) {
  return (
    <div className="px-4 pt-4 pb-2">
      <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">{label}</p>
    </div>
  );
}

function Row({
  icon: Icon,
  label,
  value,
  onClick,
  destructive = false,
  last = false,
}: {
  icon: React.ElementType;
  label: string;
  value?: string;
  onClick?: () => void;
  destructive?: boolean;
  last?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-muted/50 active:bg-muted ${!last ? "border-b border-border/60" : ""}`}
    >
      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${destructive ? "bg-red-100" : "bg-primary/10"}`}>
        <Icon className={`w-4 h-4 ${destructive ? "text-red-500" : "text-primary"}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-semibold ${destructive ? "text-red-500" : "text-foreground"}`}>{label}</p>
        {value && <p className="text-xs text-muted-foreground mt-0.5 truncate">{value}</p>}
      </div>
      <ChevronRight className={`w-4 h-4 shrink-0 ${destructive ? "text-red-400" : "text-muted-foreground"}`} />
    </button>
  );
}

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

  /* ALL hooks before any conditional return */
  const upgradeSubscription = useUpgradeSubscription();
  const downgradeSubscription = useDowngradeSubscription();
  const queryClient = useQueryClient();

  if (!authLoaded || !isLoaded)
    return <div className="p-8 text-center text-muted-foreground">{t.profile.loading}</div>;
  if (!isSignedIn) return <Redirect to="/sign-in" />;

  const email = user?.emailAddresses?.[0]?.emailAddress ?? "";
  const initials = (user?.firstName?.[0] ?? email[0] ?? "?").toUpperCase();
  const displayName = [user?.firstName, user?.lastName].filter(Boolean).join(" ") || t.profile.traveler;

  const freeLimit = usage?.freeLimit ?? 20;
  const premiumLimit = usage?.premiumLimit ?? 80;
  const searchCount = usage?.searchCount ?? 0;
  const isPremium = usage?.isPremium ?? false;

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

  const limitVal = isPremium ? premiumLimit : freeLimit;
  const usagePct = Math.min(100, (searchCount / limitVal) * 100);

  return (
    <div className="min-h-[100dvh] bg-muted/30 pb-28">

      {/* ── Blue Booking-style header ─────────────────────── */}
      <div className="bg-[hsl(215,85%,48%)] pt-6 pb-10 px-5">
        <div className="flex items-center gap-4">
          {user?.imageUrl ? (
            <img src={user.imageUrl} alt={displayName} className="w-16 h-16 rounded-full object-cover ring-2 ring-white/40 shrink-0" />
          ) : (
            <div className="w-16 h-16 bg-white/20 text-white rounded-full flex items-center justify-center text-2xl font-black shrink-0">
              {initials}
            </div>
          )}
          <div className="min-w-0">
            <h1 className="text-xl font-black text-white truncate">{displayName}</h1>
            <p className="text-white/70 text-sm truncate">{email}</p>
            {isPremium ? (
              <span className="inline-flex items-center gap-1 mt-1.5 bg-amber-400/20 text-amber-200 text-[11px] font-bold px-2 py-0.5 rounded-full">
                <Crown className="w-3 h-3" /> Premium
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 mt-1.5 bg-white/15 text-white/80 text-[11px] font-bold px-2 py-0.5 rounded-full">
                <Star className="w-3 h-3" /> Free
              </span>
            )}
          </div>
        </div>

        {/* ── Mini stats row ── */}
        <div className="grid grid-cols-3 gap-2 mt-5">
          {[
            { icon: Heart, value: String(stats?.totalSaved ?? 0), label: t.profile.tripsSaved },
            { icon: Search, value: String(searchCount), label: t.profile.searchesUsed },
            { icon: MapPin, value: `€${Math.round(stats?.averagePrice ?? 0)}`, label: t.profile.avgTripPrice },
          ].map(({ icon: Icon, value, label }) => (
            <div key={label} className="bg-white/15 backdrop-blur-sm rounded-2xl p-3 text-center">
              <Icon className="w-4 h-4 text-white/70 mx-auto mb-1" />
              <p className="text-white font-black text-lg leading-none">{value}</p>
              <p className="text-white/60 text-[10px] mt-0.5 leading-tight">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Cards sit on top of header with negative margin ── */}
      <div className="px-4 -mt-4 space-y-3">

        {/* ── Piano ─────────────────────────────────────────── */}
        <SectionCard>
          <SectionHeader label={t.premium.currentPlan} />
          <div className="px-4 pb-4 space-y-3">
            <div className="flex gap-2">
              <div className={`flex-1 rounded-xl border p-3 text-center ${!isPremium ? "border-primary bg-primary/5" : "border-border bg-muted/30"}`}>
                <p className={`text-[10px] font-bold uppercase tracking-wide mb-1 ${!isPremium ? "text-primary" : "text-muted-foreground"}`}>Free</p>
                <p className={`text-2xl font-black ${!isPremium ? "text-primary" : "text-foreground"}`}>20</p>
                <p className="text-[10px] text-muted-foreground">{t.premium.perDay}</p>
              </div>
              <div className={`flex-1 rounded-xl border p-3 text-center relative ${isPremium ? "border-amber-400 bg-amber-50 dark:bg-amber-950/20" : "border-border bg-muted/30"}`}>
                {isPremium && <Crown className="absolute top-2 right-2 w-3 h-3 text-amber-500" />}
                <p className={`text-[10px] font-bold uppercase tracking-wide mb-1 ${isPremium ? "text-amber-600" : "text-muted-foreground"}`}>Premium</p>
                <p className={`text-2xl font-black ${isPremium ? "text-amber-600" : "text-foreground"}`}>80</p>
                <p className="text-[10px] text-muted-foreground">{t.premium.perDay}</p>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
                <span>{searchCount}/{limitVal} {t.premium.perDay}</span>
                {!isPremium && searchCount >= freeLimit && (
                  <span className="text-destructive font-semibold">{t.premium.limitReachedTitle}</span>
                )}
              </div>
              <div className="w-full bg-muted rounded-full h-1.5">
                <div
                  className={`h-1.5 rounded-full transition-all ${!isPremium && searchCount >= freeLimit ? "bg-destructive" : isPremium ? "bg-amber-400" : "bg-primary"}`}
                  style={{ width: `${usagePct}%` }}
                />
              </div>
            </div>

            {!isPremium ? (
              <button
                onClick={() => upgradeSubscription.mutate(undefined, {
                  onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: ["usage"] });
                    queryClient.invalidateQueries({ queryKey: ["getUsage"] });
                    toast(t.premium.planPremium, { description: t.premium.premiumPlanDesc });
                  },
                })}
                disabled={upgradeSubscription.isPending}
                className="w-full bg-gradient-to-r from-primary to-orange-500 text-white font-bold py-3 rounded-xl text-sm shadow-md hover:opacity-90 active:scale-95 transition-all disabled:opacity-60"
              >
                {upgradeSubscription.isPending ? "..." : `${t.premium.upgradeNow} — ${t.premium.price}`}
              </button>
            ) : (
              <div className="flex items-center justify-between py-1">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-500" />
                  <span className="text-sm font-semibold text-amber-600">{t.premium.planPremium}</span>
                </div>
                <button
                  onClick={() => downgradeSubscription.mutate(undefined, {
                    onSuccess: () => {
                      queryClient.invalidateQueries({ queryKey: ["usage"] });
                      queryClient.invalidateQueries({ queryKey: ["getUsage"] });
                      toast(t.premium.planFree);
                    },
                  })}
                  disabled={downgradeSubscription.isPending}
                  className="text-xs text-muted-foreground hover:text-foreground underline disabled:opacity-60"
                >
                  {t.premium.downgrade}
                </button>
              </div>
            )}
          </div>
        </SectionCard>

        {/* ── Le tue informazioni ───────────────────────────── */}
        <SectionCard>
          <SectionHeader label={t.profile.yourInfo} />
          <Row icon={Banknote} label={t.profile.defaultBudget} value={prefs?.defaultBudget ? `€${prefs.defaultBudget}` : t.profile.notSet} onClick={() => setEditingPrefs(!editingPrefs)} />
          <Row icon={MapPin} label={t.profile.defaultDeparture} value={prefs?.defaultDepartureLocation ?? t.profile.notSet} onClick={() => setEditingPrefs(!editingPrefs)} />
          <Row icon={Users} label={t.profile.defaultPeople} value={prefs?.defaultNumberOfPeople ? `${prefs.defaultNumberOfPeople} ${t.profile.people}` : t.profile.notSet} onClick={() => setEditingPrefs(!editingPrefs)} />
          <Row icon={Plane} label={t.profile.flightPref} value={prefs?.defaultFlightPreference ?? t.profile.notSet} onClick={() => setEditingPrefs(!editingPrefs)} last={!editingPrefs} />
          {editingPrefs && (
            <div className="border-t border-border/60">
              <PreferencesEditor prefs={prefs} onDone={() => setEditingPrefs(false)} t={t} />
            </div>
          )}
        </SectionCard>

        {/* ── Impostazioni account ──────────────────────────── */}
        <SectionCard>
          <SectionHeader label={t.profile.accountSettings} />
          <Row icon={Settings} label={t.profile.personalData} value={displayName} onClick={() => {}} />
          <Row icon={Lock} label={t.profile.security} onClick={() => {}} />
          <Row icon={CreditCard} label={t.profile.paymentMethods} onClick={() => {}} last />
        </SectionCard>

        {/* ── Ricerche recenti ──────────────────────────────── */}
        <SectionCard>
          <SectionHeader label={t.profile.recentSearches} />
          {!history || history.length === 0 ? (
            <div className="px-4 pb-4 pt-1">
              <div className="flex flex-col items-center gap-2 py-6 text-muted-foreground">
                <Clock className="w-8 h-8 opacity-40" />
                <p className="text-sm">{t.profile.noRecentSearches}</p>
              </div>
            </div>
          ) : (
            <div>
              {history.map((entry, idx) => (
                <button
                  key={entry.id}
                  onClick={() => repeatSearch(entry)}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-muted/50 transition-colors ${idx < history.length - 1 ? "border-b border-border/60" : ""}`}
                >
                  <div className="w-8 h-8 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                    <Search className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{searchLabel(entry, t)}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <Calendar className="w-3 h-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        {new Date(entry.createdAt).toLocaleDateString("it-IT", { month: "short", day: "numeric" })}
                      </span>
                      {entry.tripType && (
                        <span className="px-1.5 py-0.5 bg-primary/10 text-primary text-[10px] rounded-full font-medium">
                          {entry.tripType === "one_way" ? "→" : "⇌"}
                        </span>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                </button>
              ))}
            </div>
          )}
        </SectionCard>

        {/* ── Link rapidi stile Booking ─────────────────────── */}
        <SectionCard>
          <SectionHeader label={t.profile.tripsSection} />
          <Row icon={Heart} label={t.nav.saved} value={`${stats?.totalSaved ?? 0} ${t.profile.tripsSaved}`} onClick={() => setLocation("/saved")} />
          <Row icon={MapPin} label={t.profile.discoverNew} onClick={() => setLocation("/discover")} last />
        </SectionCard>

        {/* ── Legale ───────────────────────────────────────── */}
        <SectionCard>
          <SectionHeader label={t.profile.legalSection} />
          <Link href="/privacy" className="block">
            <Row icon={Shield} label={t.profile.privacyPolicy} />
          </Link>
          <Link href="/terms" className="block">
            <Row icon={FileText} label={t.profile.termsOfService} last />
          </Link>
        </SectionCard>

        {/* ── Esci ─────────────────────────────────────────── */}
        <SectionCard>
          <Row
            icon={LogOut}
            label={t.profile.signOut}
            destructive
            last
            onClick={() => signOut({ redirectUrl: basePath || "/" })}
          />
        </SectionCard>

        <p className="text-center text-[11px] text-muted-foreground py-2">TravelBudget · v1.0</p>
      </div>
    </div>
  );
}
