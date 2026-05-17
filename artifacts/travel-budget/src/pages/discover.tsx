import { useState, useRef, useCallback, useEffect } from "react";
import { formatCurrency, formatDistance } from "@/lib/currency";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import {
  useGenerateTrips, useSaveTrip, useGetPreferences, useGetUsage,
  useGetSearchHistory, useSaveSearchHistory, useUpgradeSubscription,
} from "@workspace/api-client-react";
import type { SearchHistoryEntry } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import {
  MapPin, Plane, Hotel, Check, X, RotateCcw, Info,
  Clock, Star, Navigation, Wifi, WifiOff, ArrowRight, SlidersHorizontal,
  Share2, MessageCircle, Facebook, Copy, TrainFront, ExternalLink, Dice6,
  Crown, Zap, Sparkles, RefreshCw, Lightbulb, ChevronLeft, ChevronRight,
  LayoutList, Layers, Users, Euro,
} from "lucide-react";
import { useAuth } from "@clerk/react";
import { useLocation } from "wouter";
import { toast } from "sonner";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import type { TripSuggestion } from "@workspace/api-client-react";
import { useI18n } from "@/lib/i18n";
import { useNotifications } from "@/lib/notifications";
import { getCachedSearch, setCachedSearch } from "@/lib/searchCache";
import {
  FilterBar,
  FilterSheet,
  DEFAULT_FILTERS,
  type TripFilters,
} from "@/components/filter-panel";

const FILTERS_STORAGE_KEY = "tb_discover_filters";

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

function getImgSrc(imageUrl: string) {
  const raw = imageUrl ?? "";
  const withSlash = raw.startsWith("/") ? raw : `/${raw}`;
  const fixed = withSlash.replace(/\.(jpg|jpeg)$/i, ".png");
  return `${basePath}${fixed}`;
}

function hashCaption(id: string, arr: string[]): string {
  if (!arr.length) return "";
  const hash = id.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return arr[hash % arr.length];
}

/* ─── Welcome splash ────────────────────────────────────────────────────── */
function WelcomeSplash({ onDismiss }: { onDismiss: () => void }) {
  const { t } = useI18n();
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-primary flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute w-80 h-80 rounded-full bg-white/10 -top-20 -left-20"
          animate={{ scale: [1, 1.15, 1], rotate: [0, 20, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute w-60 h-60 rounded-full bg-white/5 bottom-10 -right-16"
          animate={{ scale: [1.1, 1, 1.1], rotate: [0, -15, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Animated icons row */}
      <div className="flex items-end justify-center gap-6 mb-10">
        <motion.div
          initial={{ x: -120, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 120 }}
        >
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center shadow-lg"
          >
            <Plane className="w-8 h-8 text-white" />
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
        >
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="w-20 h-20 rounded-3xl bg-white/25 backdrop-blur flex items-center justify-center shadow-xl"
          >
            <Hotel className="w-10 h-10 text-white" />
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ x: 120, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 120 }}
        >
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
            className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center shadow-lg"
          >
            <TrainFront className="w-8 h-8 text-white" />
          </motion.div>
        </motion.div>
      </div>

      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="text-center px-8 mb-12"
      >
        <h1 className="text-4xl font-black text-white mb-3 tracking-tight">
          Travel<span className="text-[hsl(25,90%,70%)]">Budget</span>
        </h1>
        <p className="text-white/80 text-lg font-medium">{t.discover.welcomeSub}</p>
      </motion.div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.1 }}
      >
        <button
          onClick={onDismiss}
          className="bg-[hsl(25,90%,55%)] text-white font-bold text-lg px-10 py-4 rounded-2xl shadow-[0_8px_24px_rgba(0,0,0,0.25)] hover:bg-[hsl(25,90%,50%)] active:scale-95 transition-all"
        >
          {t.discover.welcomeStart} ✈
        </button>
      </motion.div>
    </motion.div>
  );
}

/* ─── Share modal ───────────────────────────────────────────────────────── */
function ShareModal({
  trip,
  onClose,
}: {
  trip: TripSuggestion | null;
  onClose: () => void;
}) {
  const { t, lang } = useI18n();
  const [copied, setCopied] = useState(false);

  if (!trip) return null;

  const shareText = `✈️ ${trip.destination}, ${trip.country} — ${trip.durationDays} notti a ${formatCurrency(trip.totalPrice, lang)}/persona! Scoperto su TravelBudget 🌍`;
  const waUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
  const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.origin)}&quote=${encodeURIComponent(shareText)}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Sheet open={!!trip} onOpenChange={(open) => { if (!open) onClose(); }}>
      <SheetContent side="bottom" className="rounded-t-3xl p-0 overflow-hidden">
        <div className="px-5 pt-5 pb-8">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-base">{t.discover.shareTrip}</h3>
            <button onClick={onClose} className="w-7 h-7 rounded-full bg-muted flex items-center justify-center">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Trip preview */}
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-2xl mb-5">
            <img src={getImgSrc(trip.imageUrl)} alt={trip.destination} className="w-14 h-14 rounded-xl object-cover shrink-0" />
            <div className="min-w-0">
              <p className="font-bold text-sm">{trip.destination}</p>
              <p className="text-xs text-muted-foreground">{trip.country} · €{trip.totalPrice}/p</p>
            </div>
          </div>

          {/* Share buttons */}
          <div className="grid grid-cols-3 gap-3">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-[#25D366]/10 hover:bg-[#25D366]/20 transition-colors"
            >
              <MessageCircle className="w-7 h-7 text-[#25D366]" />
              <span className="text-xs font-semibold text-[#25D366]">{t.discover.shareWhatsapp}</span>
            </a>
            <a
              href={fbUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-[#1877F2]/10 hover:bg-[#1877F2]/20 transition-colors"
            >
              <Facebook className="w-7 h-7 text-[#1877F2]" />
              <span className="text-xs font-semibold text-[#1877F2]">{t.discover.shareFacebook}</span>
            </a>
            <button
              onClick={handleCopy}
              className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-muted hover:bg-muted/70 transition-colors"
            >
              <Copy className="w-7 h-7 text-foreground" />
              <span className="text-xs font-semibold">
                {copied ? t.discover.copied : t.discover.shareCopy}
              </span>
            </button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

/* ─── Premium Upgrade Modal ─────────────────────────────────────────────── */
function PremiumUpgradeModal({
  open,
  onClose,
  isGuest,
  t,
  onSignUp,
  onUpgrade,
  isUpgrading,
}: {
  open: boolean;
  onClose: () => void;
  isGuest: boolean;
  t: ReturnType<typeof useI18n>["t"];
  onSignUp: () => void;
  onUpgrade: () => void;
  isUpgrading?: boolean;
}) {
  if (!open) return null;
  const benefits = [t.premium.benefit1, t.premium.benefit2, t.premium.benefit3];

  return (
    <div className="fixed inset-0 z-[200] flex flex-col justify-end">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 28, stiffness: 300 }}
        className="relative bg-background rounded-t-3xl px-6 pb-10 pt-6 shadow-2xl"
      >
        {/* Handle bar */}
        <div className="w-10 h-1 rounded-full bg-muted-foreground/30 mx-auto mb-6" />

        {/* Crown icon */}
        <div className="flex justify-center mb-4">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 via-orange-500 to-primary flex items-center justify-center shadow-lg">
            <Crown className="w-10 h-10 text-white" />
          </div>
        </div>

        <h2 className="text-2xl font-black text-center mb-1">{t.premium.title}</h2>
        <p className="text-sm text-muted-foreground text-center mb-6">
          {isGuest ? t.premium.guestSubtitle : t.premium.subtitle}
        </p>

        {/* Free vs Premium comparison */}
        <div className="flex gap-3 mb-5">
          <div className="flex-1 rounded-2xl border border-border bg-muted/40 p-3 text-center">
            <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide mb-1">Free</p>
            <p className="text-2xl font-black text-foreground">20</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">{t.premium.perDay}</p>
          </div>
          <div className="flex-1 rounded-2xl border-2 border-primary bg-primary/5 p-3 text-center relative overflow-hidden">
            <div className="absolute top-1.5 right-1.5">
              <Crown className="w-3.5 h-3.5 text-primary" />
            </div>
            <p className="text-xs text-primary font-semibold uppercase tracking-wide mb-1">Premium</p>
            <p className="text-2xl font-black text-primary">80</p>
            <p className="text-[11px] text-primary/70 mt-0.5">{t.premium.perDay}</p>
          </div>
        </div>

        {/* Benefits */}
        <div className="space-y-3 mb-6">
          {benefits.map((b, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                {i === 0 ? <Zap className="w-3.5 h-3.5 text-primary" /> :
                 i === 1 ? <SlidersHorizontal className="w-3.5 h-3.5 text-primary" /> :
                           <Sparkles className="w-3.5 h-3.5 text-primary" />}
              </div>
              <span className="text-sm font-medium">{b}</span>
            </div>
          ))}
        </div>

        {/* Price CTA */}
        <button
          onClick={onUpgrade}
          disabled={isUpgrading}
          className="w-full bg-gradient-to-r from-primary to-orange-500 text-white font-bold py-4 rounded-2xl text-base shadow-[0_4px_20px_rgba(30,75,204,0.35)] hover:opacity-90 active:scale-95 transition-all mb-3 disabled:opacity-60"
        >
          {isUpgrading ? "..." : `${t.premium.cta} — ${t.premium.price}`}
        </button>
        <p className="text-center text-xs text-muted-foreground mb-4">{t.premium.ctaSub}</p>

        {/* Guest: also show sign up option */}
        {isGuest && (
          <button
            onClick={onSignUp}
            className="w-full border border-border text-foreground font-semibold py-3 rounded-2xl text-sm hover:bg-muted/50 active:scale-95 transition-all"
          >
            {t.premium.orSignUp}
          </button>
        )}

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-muted flex items-center justify-center"
        >
          <X className="w-4 h-4 text-muted-foreground" />
        </button>
      </motion.div>
    </div>
  );
}

/* ─── Pre-search state ──────────────────────────────────────────────────── */
function PreSearchState({
  onOpenFilters,
  t,
  recentSearches,
  onRepeat,
}: {
  onOpenFilters: () => void;
  t: ReturnType<typeof useI18n>["t"];
  recentSearches?: SearchHistoryEntry[];
  onRepeat?: (entry: SearchHistoryEntry) => void;
}) {
  const { lang } = useI18n();
  const recent = recentSearches?.slice(0, 3) ?? [];

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
      <div className="flex items-center justify-center gap-4 mb-7">
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center"
        >
          <Plane className="w-7 h-7 text-white" />
        </motion.div>
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
          className="w-16 h-16 rounded-2xl bg-white/25 flex items-center justify-center"
        >
          <Hotel className="w-8 h-8 text-[hsl(25,90%,70%)]" />
        </motion.div>
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
          className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center"
        >
          <TrainFront className="w-7 h-7 text-white" />
        </motion.div>
      </div>

      <h2 className="text-2xl font-black text-white mb-2">{t.discover.discoverTitle}</h2>
      <p className="text-white/75 text-sm mb-7 max-w-xs leading-relaxed">{t.discover.discoverSub}</p>

      <button
        onClick={onOpenFilters}
        className="flex items-center gap-2 bg-white text-primary font-bold px-8 py-4 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.25)] hover:bg-white/90 active:scale-95 transition-all mb-6"
      >
        <SlidersHorizontal className="w-5 h-5" />
        {t.discover.setFilters}
      </button>

      {/* Recent searches */}
      {recent.length > 0 && onRepeat && (
        <div className="w-full max-w-sm">
          <p className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-3">
            {t.profile.recentSearches}
          </p>
          <div className="space-y-2">
            {recent.map((entry) => {
              const parts: string[] = [];
              if (entry.departureLocation) parts.push(`${t.profile.departureFrom} ${entry.departureLocation}`);
              if (entry.arrivalLocation && entry.arrivalLocation !== "Any")
                parts.push(`→ ${entry.arrivalLocation}`);
              if (entry.numberOfNights)
                parts.push(`${entry.numberOfNights} ${entry.numberOfNights === 1 ? t.profile.night : t.profile.nights}`);
              if (entry.budget) parts.push(formatCurrency(entry.budget, lang));
              const label = parts.join(" · ") || "—";

              return (
                <button
                  key={entry.id}
                  onClick={() => onRepeat(entry)}
                  className="w-full flex items-center justify-between gap-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl px-4 py-3 text-left transition-colors active:scale-[0.98]"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{label}</p>
                    {entry.tripType && (
                      <p className="text-xs text-white/60 mt-0.5">
                        {entry.tripType === "one_way" ? "→ one way" : "⇌ round trip"}
                      </p>
                    )}
                  </div>
                  <RotateCcw className="w-4 h-4 shrink-0 text-white/60" />
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

const GUEST_SEARCH_LIMIT = 5;

/* ─── Main page ─────────────────────────────────────────────────────────── */
export default function Discover() {
  const { isSignedIn } = useAuth();
  const [, setLocation] = useLocation();
  const { t, lang } = useI18n();

  const [trips, setTrips] = useState<TripSuggestion[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [apiError, setApiError] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [history, setHistory] = useState<number[]>([]);
  const [detailTrip, setDetailTrip] = useState<TripSuggestion | null>(null);
  const [shareTrip, setShareTrip] = useState<TripSuggestion | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState<TripFilters>(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(FILTERS_STORAGE_KEY) ?? "null") as TripFilters | null;
      return stored ?? DEFAULT_FILTERS;
    } catch {
      return DEFAULT_FILTERS;
    }
  });
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [guestCount, setGuestCount] = useState(() =>
    parseInt(localStorage.getItem("guestSearchCount") ?? "0")
  );
  const [viewMode, setViewMode] = useState<"swipe" | "list">("swipe");
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [loadMoreExhausted, setLoadMoreExhausted] = useState(false);
  const seenHotelNamesRef = useRef<Set<string>>(new Set());

  // Welcome splash — show once per session
  const [showSplash, setShowSplash] = useState(() => {
    return !sessionStorage.getItem("splashSeen");
  });

  const dismissSplash = useCallback(() => {
    sessionStorage.setItem("splashSeen", "1");
    setShowSplash(false);
  }, []);

  // ── Race-condition guard: only accept results from the latest search ──
  const searchGenRef = useRef(0);

  // ── Non-repeating random message picker ──
  const lastLoadingMsgRef = useRef<string | null>(null);
  const lastNoResultsMsgRef = useRef<string | null>(null);
  const lastSuccessMsgRef = useRef<string | null>(null);
  const lastLowBudgetMsgRef = useRef<string | null>(null);
  const loadingMsgRef = useRef<string>("");
  const noResultsMsgRef = useRef<string>("");
  const lowBudgetMsgRef = useRef<string>("");

  function pickRandom(msgs: string[], last: string | null): string {
    if (msgs.length === 1) return msgs[0];
    const pool = msgs.filter((m) => m !== last);
    return pool[Math.floor(Math.random() * pool.length)];
  }

  if (!loadingMsgRef.current) {
    loadingMsgRef.current = pickRandom(t.fun.loadingMessages, null);
    lastLoadingMsgRef.current = loadingMsgRef.current;
  }
  if (!noResultsMsgRef.current) {
    noResultsMsgRef.current = pickRandom(t.fun.noResultsMessages, null);
    lastNoResultsMsgRef.current = noResultsMsgRef.current;
  }
  if (!lowBudgetMsgRef.current) {
    lowBudgetMsgRef.current = pickRandom(t.fun.lowBudgetMessages, null);
    lastLowBudgetMsgRef.current = lowBudgetMsgRef.current;
  }

  const { data: prefs } = useGetPreferences({
    query: { enabled: !!isSignedIn, queryKey: ["preferences"] },
  });

  const { data: usage, refetch: refetchUsage } = useGetUsage({
    query: { enabled: !!isSignedIn, queryKey: ["usage"] },
  });

  const upgradeSubscription = useUpgradeSubscription();
  const handleUpgrade = () => {
    upgradeSubscription.mutate(undefined, {
      onSuccess: () => {
        void refetchUsage();
        toast(t.premium.planPremium, { description: t.premium.premiumPlanDesc });
        setShowPremiumModal(false);
      },
    });
  };

  const { data: recentSearches, refetch: refetchHistory } = useGetSearchHistory({
    query: { enabled: !!isSignedIn, queryKey: ["search-history"] },
  });

  const saveToHistory = useSaveSearchHistory();

  // Initialise filter state from saved user preferences (runs once when prefs first load)
  const prefsInitializedRef = useRef(false);
  useEffect(() => {
    if (prefs && !prefsInitializedRef.current) {
      prefsInitializedRef.current = true;
      setFilters(f => ({
        ...f,
        ...(prefs.defaultBudget != null ? { budget: prefs.defaultBudget } : {}),
        ...(prefs.defaultNumberOfPeople != null ? { numberOfPeople: prefs.defaultNumberOfPeople } : {}),
        ...(prefs.defaultDepartureLocation ? { departureAirport: prefs.defaultDepartureLocation } : {}),
        ...(prefs.defaultFlightPreference
          ? { flightPreference: prefs.defaultFlightPreference as TripFilters["flightPreference"] }
          : {}),
      }));
    }
  }, [prefs]);

  const { addNotification } = useNotifications();

  // Persist filters to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(FILTERS_STORAGE_KEY, JSON.stringify(filters));
    } catch {}
  }, [filters]);

  function handleRepeatSearch(entry: SearchHistoryEntry) {
    const updated: Partial<TripFilters> = {
      ...(entry.budget != null ? { budget: entry.budget } : {}),
      ...(entry.numberOfPeople != null ? { numberOfPeople: entry.numberOfPeople } : {}),
      ...(entry.numberOfNights != null ? { numberOfNights: entry.numberOfNights } : {}),
      ...(entry.departureLocation ? { departureAirport: entry.departureLocation } : {}),
      ...(entry.arrivalLocation && entry.arrivalLocation !== "Any"
        ? { arrivalAirport: entry.arrivalLocation }
        : {}),
      ...(entry.tripType ? { tripType: entry.tripType as TripFilters["tripType"] } : {}),
      ...(entry.departureDate ? { departureDate: entry.departureDate } : {}),
      ...(entry.returnDate ? { returnDate: entry.returnDate } : {}),
    };
    const merged = { ...filters, ...updated };
    setFilters(merged);
    loadTrips(merged);
  }

  const { isOnline, checkConnectivity } = useOnlineStatus();

  const generateTrips = useGenerateTrips();
  const saveTrip = useSaveTrip();

  function loadTrips(f: TripFilters) {
    setApiError(false);
    // ── Offline gate ───────────────────────────────────────────────
    if (!isOnline) {
      toast.error(t.offline.searchDisabled);
      return;
    }

    // ── Freemium gate ──────────────────────────────────────────────
    if (!isSignedIn) {
      const currentGuestCount = parseInt(localStorage.getItem("guestSearchCount") ?? "0");
      if (currentGuestCount >= GUEST_SEARCH_LIMIT) {
        setShowPremiumModal(true);
        return;
      }
    } else if (usage && !usage.isPremium && usage.searchCount >= usage.freeLimit) {
      setShowPremiumModal(true);
      return;
    }

    // ── Check client-side cache first ─────────────────────────────
    const cached = getCachedSearch<TripSuggestion>(f as unknown as Record<string, unknown>);
    if (cached && cached.length > 0) {
      setTrips(cached);
      setCurrentIndex(0);
      setHistory([]);
      setHasSearched(true);
      return;
    }

    // ── Stamp this search so stale responses are discarded ────────
    const thisGen = ++searchGenRef.current;
    // Clear stale results immediately — prevents old data surviving a trip-type switch
    setTrips([]);
    seenHotelNamesRef.current.clear();
    setLoadMoreExhausted(false);
    setIsLoadingMore(false);

    const effectiveBudget = f.budget || prefs?.defaultBudget || 2000;
    const depLocation = f.departureAirport || f.departureStation || prefs?.defaultDepartureLocation || "Any";
    const arrLocation = f.arrivalAirport || f.arrivalStation || "Any";
    // tripType is always explicitly set — no fallback to avoid accidental mode mixing
    const tripType = f.tripType;
    // Rotate loading message — never the same as last time
    const newLoadingMsg = pickRandom(t.fun.loadingMessages, lastLoadingMsgRef.current);
    loadingMsgRef.current = newLoadingMsg;
    lastLoadingMsgRef.current = newLoadingMsg;
    // Rotate low-budget message pre-emptively
    const newLowBudgetMsg = pickRandom(t.fun.lowBudgetMessages, lastLowBudgetMsgRef.current);
    lowBudgetMsgRef.current = newLowBudgetMsg;
    lastLowBudgetMsgRef.current = newLowBudgetMsg;
    generateTrips.mutate(
      {
        data: {
          budget: effectiveBudget,
          numberOfPeople: f.numberOfPeople,
          numberOfChildren: f.numberOfChildren > 0 ? f.numberOfChildren : null,
          numberOfPets: f.numberOfPets > 0 ? f.numberOfPets : null,
          departureDate: f.departureDate || new Date().toISOString(),
          // ONE-WAY: returnDate is explicitly null — never send a date for one-way trips
          // ROUND-TRIP: send the user-selected returnDate (or null if not set yet)
          returnDate: tripType === "one_way" ? null : (f.returnDate || null),
          departureLocation: depLocation,
          arrivalLocation: arrLocation,
          numberOfNights: f.numberOfNights,
          flightPreference: f.flightPreference,
          trainPreference: f.trainPreference,
          hotelDistanceKm: f.maxHotelDistanceFromCenterKm,
          maxDistanceFromAirportKm: f.maxDistanceFromAirportKm,
          accommodationType: f.accommodationType,
          propertyType: f.propertyType !== "any" ? f.propertyType : null,
          minHotelRating: f.minHotelRating,
          hotelStarsMin: f.hotelStarsMin !== 1 ? f.hotelStarsMin : null,
          hotelStarsMax: f.hotelStarsMax !== 5 ? f.hotelStarsMax : null,
          tripType,
          hotelAmenities: [
            ...(f.freeCancellation ? ["free_cancellation"] : []),
            ...(f.breakfastIncluded ? ["breakfast"] : []),
            ...(f.parkingAvailable ? ["parking"] : []),
            ...(f.privateBathroom ? ["private_bathroom"] : []),
            ...(f.elevator ? ["elevator"] : []),
            ...(f.petFriendly ? ["pet_friendly"] : []),
            ...(f.onlinePayment ? ["online_payment"] : []),
          ],
          sortBy: f.sortBy,
          maxTravelTimeHours: f.maxTravelTimeHours,
          departureTimeSlot: f.departureTimeSlot !== "any" ? f.departureTimeSlot : undefined,
        },
      },
      {
        onSuccess: (data) => {
          // ── Discard stale response if a newer search was already fired ──
          if (thisGen !== searchGenRef.current) return;

          // ── Final safety strip: guarantee no returnTransport leaks into one-way results ──
          const cleaned = tripType === "one_way"
            ? data.map((trip) => {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { returnTransport: _rt, ...rest } = trip as typeof trip & { returnTransport?: unknown };
                return rest as typeof trip;
              })
            : data;

          setTrips(cleaned);
          setCurrentIndex(0);
          setHistory([]);
          setHasSearched(true);
          // Populate seen hotel names for cross-batch dedup
          cleaned.forEach(t => seenHotelNamesRef.current.add(t.hotel.name));
          // Save results to client-side cache
          setCachedSearch(f as unknown as Record<string, unknown>, cleaned);
          // ── Success toast with rotating message ──
          if (cleaned.length > 0) {
            const successMsg = pickRandom(t.fun.successMessages, lastSuccessMsgRef.current);
            lastSuccessMsgRef.current = successMsg;
            toast.success(successMsg, { duration: 3000 });
          } else {
            // Pre-rotate the no-results message for the empty state
            const newNoResults = pickRandom(t.fun.noResultsMessages, lastNoResultsMsgRef.current);
            noResultsMsgRef.current = newNoResults;
            lastNoResultsMsgRef.current = newNoResults;
          }
          // Track guest searches / save to history
          if (!isSignedIn) {
            const newCount = parseInt(localStorage.getItem("guestSearchCount") ?? "0") + 1;
            localStorage.setItem("guestSearchCount", String(newCount));
            setGuestCount(newCount);
          } else {
            refetchUsage();
            // Save search to history (fire-and-forget)
            saveToHistory.mutate(
              {
                data: {
                  departureLocation: depLocation !== "Any" ? depLocation : null,
                  arrivalLocation: arrLocation !== "Any" ? arrLocation : null,
                  departureDate: f.departureDate || null,
                  returnDate: tripType === "one_way" ? null : (f.returnDate || null),
                  budget: effectiveBudget,
                  numberOfPeople: f.numberOfPeople,
                  numberOfNights: f.numberOfNights,
                  tripType: tripType,
                },
              },
              { onSuccess: () => refetchHistory() }
            );
          }
        },
        onError: (err: unknown) => {
          const status = (err as { status?: number })?.status ?? (err as { response?: { status?: number } })?.response?.status;
          if (status === 403) {
            setShowPremiumModal(true);
          } else if (status === 429) {
            toast.error(t.discover.rateLimitError, {
              description: t.discover.rateLimitHint,
              duration: 8000,
            });
          } else {
            setApiError(true);
            toast.error(t.discover.searchError, {
              description: t.discover.searchErrorHint,
              duration: 6000,
            });
          }
        },
      }
    );
  }

  const handleApplyFilters = (newFilters: TripFilters) => {
    // If the trip type changed, wipe ALL existing trip data from memory
    // before the new search fires — prevents any round-trip data from
    // surviving in state when the user switches to one-way (or vice versa).
    if (newFilters.tripType !== filters.tripType) {
      setTrips([]);
      setCurrentIndex(0);
      setHistory([]);
      setHasSearched(false);
    }
    setFilters(newFilters);
    loadTrips(newFilters);
  };

  // ── Load next batch (append, dedup by hotel name) ──────────────
  function loadMore(f: TripFilters) {
    if (isLoadingMore || loadMoreExhausted || !isOnline || generateTrips.isPending) return;
    setIsLoadingMore(true);
    const effectiveBudget = f.budget || prefs?.defaultBudget || 2000;
    const depLocation = f.departureAirport || f.departureStation || prefs?.defaultDepartureLocation || "Any";
    const arrLocation = f.arrivalAirport || f.arrivalStation || "Any";
    const tripType = f.tripType;
    generateTrips.mutate(
      {
        data: {
          budget: effectiveBudget,
          numberOfPeople: f.numberOfPeople,
          numberOfChildren: f.numberOfChildren > 0 ? f.numberOfChildren : null,
          numberOfPets: f.numberOfPets > 0 ? f.numberOfPets : null,
          departureDate: f.departureDate || new Date().toISOString(),
          returnDate: tripType === "one_way" ? null : (f.returnDate || null),
          departureLocation: depLocation,
          arrivalLocation: arrLocation,
          numberOfNights: f.numberOfNights,
          flightPreference: f.flightPreference,
          trainPreference: f.trainPreference,
          hotelDistanceKm: f.maxHotelDistanceFromCenterKm,
          maxDistanceFromAirportKm: f.maxDistanceFromAirportKm,
          accommodationType: f.accommodationType,
          propertyType: f.propertyType !== "any" ? f.propertyType : null,
          minHotelRating: f.minHotelRating,
          hotelStarsMin: f.hotelStarsMin !== 1 ? f.hotelStarsMin : null,
          hotelStarsMax: f.hotelStarsMax !== 5 ? f.hotelStarsMax : null,
          tripType,
          hotelAmenities: [
            ...(f.freeCancellation ? ["free_cancellation"] : []),
            ...(f.breakfastIncluded ? ["breakfast"] : []),
            ...(f.parkingAvailable ? ["parking"] : []),
            ...(f.privateBathroom ? ["private_bathroom"] : []),
            ...(f.elevator ? ["elevator"] : []),
            ...(f.petFriendly ? ["pet_friendly"] : []),
            ...(f.onlinePayment ? ["online_payment"] : []),
          ],
          sortBy: f.sortBy,
          maxTravelTimeHours: f.maxTravelTimeHours,
          departureTimeSlot: f.departureTimeSlot !== "any" ? f.departureTimeSlot : undefined,
        },
      },
      {
        onSuccess: (data) => {
          const cleaned = tripType === "one_way"
            ? data.map((trip) => {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { returnTransport: _rt, ...rest } = trip as typeof trip & { returnTransport?: unknown };
                return rest as typeof trip;
              })
            : data;
          const newTrips = cleaned.filter(trip => !seenHotelNamesRef.current.has(trip.hotel.name));
          newTrips.forEach(trip => seenHotelNamesRef.current.add(trip.hotel.name));
          if (newTrips.length === 0) {
            setLoadMoreExhausted(true);
          } else {
            setTrips(prev => [...prev, ...newTrips]);
          }
          setIsLoadingMore(false);
        },
        onError: () => setIsLoadingMore(false),
      }
    );
  }

  // Auto-load next batch when near the end of the deck
  useEffect(() => {
    if (
      hasSearched &&
      trips.length > 0 &&
      currentIndex >= trips.length - 3 &&
      !isLoadingMore &&
      !loadMoreExhausted &&
      !generateTrips.isPending
    ) {
      loadMore(filters);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, trips.length, hasSearched]);

  const handleSwipe = (direction: "left" | "right") => {
    if (currentIndex >= trips.length) return;
    const trip = trips[currentIndex];
    if (direction === "right") {
      if (isSignedIn) {
        saveTrip.mutate({ data: { tripData: trip, destination: trip.destination, totalPrice: trip.totalPrice, imageUrl: trip.imageUrl } });
        addNotification(t.notifications.tripSaved, "trip_saved");
      } else {
        toast(t.discover.signUpToSave, {
          action: { label: t.landing.getStarted, onClick: () => setLocation("/sign-up") },
        });
      }
    }
    setHistory([...history, currentIndex]);
    setCurrentIndex(currentIndex + 1);
  };

  const handleUndo = () => {
    if (history.length > 0) {
      const prev = history[history.length - 1];
      setHistory(history.slice(0, -1));
      setCurrentIndex(prev);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const handleNext = () => {
    if (currentIndex < trips.length - 1) setCurrentIndex(currentIndex + 1);
  };

  /* ── Welcome splash ── */
  if (showSplash) {
    return (
      <AnimatePresence>
        <WelcomeSplash onDismiss={dismissSplash} />
      </AnimatePresence>
    );
  }

  /* ── Loading ── */
  if (generateTrips.isPending) {
    const isLowBudget = (filters.budget || prefs?.defaultBudget || 2000) < 600;
    return (
      <div className="flex-1 flex flex-col bg-primary">
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3 px-8 text-center">
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Plane className="w-14 h-14 text-white mb-1" />
            </motion.div>
            <p className="text-white font-semibold text-lg">{loadingMsgRef.current}</p>
            {isLowBudget && (
              <p className="text-xs text-white/70 italic mt-1 max-w-xs">{lowBudgetMsgRef.current}</p>
            )}
            <p className="text-xs text-white font-semibold mt-3 bg-white/15 px-4 py-1.5 rounded-full">
              {filters.tripType === "one_way" ? t.filters.oneWayHint : t.filters.roundTripHint}
            </p>
          </div>
        </div>
        <FilterSheet open={filterOpen} filters={filters} onClose={() => setFilterOpen(false)} onApply={handleApplyFilters} />
      </div>
    );
  }

  /* ── Usage badge (shared across branches) ── */
  const usageSearchCount = isSignedIn
    ? (usage && !usage.isPremium && usage.searchCount > 0 ? usage.searchCount : null)
    : (guestCount > 0 ? guestCount : null);

  const UsageBadge = usageSearchCount !== null ? (
    <div className="flex justify-center mt-1 mb-0.5 px-4">
      <div className="flex items-center gap-1.5 bg-primary/8 border border-primary/15 rounded-full px-3 py-1 text-xs text-primary font-medium">
        <Sparkles className="w-3 h-3 shrink-0" />
        <span>{usageSearchCount} {t.premium.searchesLeft}</span>
      </div>
    </div>
  ) : null;

  /* ── API error state ── */
  if (apiError && !generateTrips.isPending) {
    return (
      <div className="flex-1 flex flex-col bg-primary">
        {UsageBadge}
        <div className="flex-1 flex items-center justify-center flex-col p-6 text-center">
          <div className="text-6xl mb-4">😵</div>
          <h2 className="text-xl font-bold text-white mb-2">{t.discover.searchError}</h2>
          <p className="text-sm text-white/70 mb-8 max-w-xs leading-relaxed">{t.discover.searchErrorHint}</p>
          <Button
            onClick={() => { setApiError(false); loadTrips(filters); }}
            className="gap-2 bg-white text-primary hover:bg-white/90 mb-3"
          >
            <RefreshCw className="w-4 h-4" />
            {t.discover.searchErrorRetry}
          </Button>
          <Button
            onClick={() => setFilterOpen(true)}
            variant="outline"
            size="sm"
            className="gap-2 border-white/40 text-white hover:bg-white/10"
          >
            <SlidersHorizontal className="w-4 h-4" />
            {t.filters.edit}
          </Button>
        </div>
        <FilterSheet open={filterOpen} filters={filters} onClose={() => setFilterOpen(false)} onApply={handleApplyFilters} />
      </div>
    );
  }

  /* ── Pre-search (no filters applied yet) ── */
  if (!hasSearched) {
    return (
      <div className="flex-1 flex flex-col bg-primary">
        {UsageBadge}
        {isOnline ? (
          <>
            <SurpriseBanner onPress={() => setLocation("/surprise")} t={t} />
            <PreSearchState
              onOpenFilters={() => setFilterOpen(true)}
              t={t}
              recentSearches={recentSearches ?? []}
              onRepeat={handleRepeatSearch}
            />
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <motion.div
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              className="w-20 h-20 rounded-full bg-orange-100 flex items-center justify-center mb-6"
            >
              <WifiOff className="w-10 h-10 text-orange-500" />
            </motion.div>
            <h2 className="text-xl font-bold mb-2">{t.offline.title}</h2>
            <p className="text-sm text-muted-foreground mb-8 max-w-xs leading-relaxed">{t.offline.noCache}</p>
            <button
              onClick={checkConnectivity}
              className="flex items-center gap-2 bg-primary text-white font-semibold px-6 py-3 rounded-xl hover:bg-primary/90 active:scale-95 transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              {t.offline.reconnected.replace("! 🚀", "?")}
            </button>
          </div>
        )}
        <FilterSheet open={filterOpen} filters={filters} onClose={() => setFilterOpen(false)} onApply={handleApplyFilters} />
        <AnimatePresence>
          <PremiumUpgradeModal open={showPremiumModal} onClose={() => setShowPremiumModal(false)} isGuest={!isSignedIn} t={t} onSignUp={() => setLocation("/sign-up")} onUpgrade={handleUpgrade} isUpgrading={upgradeSubscription.isPending} />
        </AnimatePresence>
      </div>
    );
  }

  /* ── No results ── */
  if (trips.length === 0) {
    const isNoDirectTrain = filters.trainPreference === "direct" && !!filters.departureStation;

    // Build smart suggestions based on current filters
    interface Suggestion { label: string; apply: () => void }
    const suggestions: Suggestion[] = [];
    if (!isNoDirectTrain) {
      if (filters.budget && filters.budget < 3000) {
        const higher = Math.round(filters.budget * 1.25 / 100) * 100;
        suggestions.push({
          label: t.smartSuggestions.increaseBudget.replace("{amount}", String(higher)),
          apply: () => { const u = { ...filters, budget: higher }; setFilters(u); loadTrips(u); },
        });
      }
      if (filters.flightPreference === "direct") {
        suggestions.push({
          label: t.smartSuggestions.allowFlightStops,
          apply: () => { const u = { ...filters, flightPreference: "any" as const }; setFilters(u); loadTrips(u); },
        });
      }
      if (filters.trainPreference === "direct") {
        suggestions.push({
          label: t.smartSuggestions.allowTrainStops,
          apply: () => { const u = { ...filters, trainPreference: "any" as const }; setFilters(u); loadTrips(u); },
        });
      }
      if (filters.numberOfNights > 5) {
        const fewer = Math.max(3, filters.numberOfNights - 2);
        suggestions.push({
          label: t.smartSuggestions.fewerNights.replace("{n}", String(fewer)),
          apply: () => { const u = { ...filters, numberOfNights: fewer }; setFilters(u); loadTrips(u); },
        });
      }
      if (filters.accommodationType && filters.accommodationType !== "standard") {
        suggestions.push({
          label: t.smartSuggestions.removeAccFilter,
          apply: () => { const u = { ...filters, accommodationType: null }; setFilters(u); loadTrips(u); },
        });
      }
      suggestions.push({
        label: t.smartSuggestions.changeDates,
        apply: () => setFilterOpen(true),
      });
      const hasAdvancedFilters =
        filters.maxTravelTimeHours !== null ||
        filters.departureTimeSlot !== "any" ||
        filters.minHotelRating !== null ||
        filters.propertyType !== "any" ||
        filters.hotelStarsMin !== 1 ||
        filters.hotelStarsMax !== 5;
      if (hasAdvancedFilters) {
        suggestions.push({
          label: t.smartSuggestions.removeFilters,
          apply: () => {
            const u = {
              ...filters,
              maxTravelTimeHours: null,
              departureTimeSlot: "any" as const,
              minHotelRating: null,
              propertyType: "any" as const,
              accommodationType: null,
              hotelStarsMin: 1,
              hotelStarsMax: 5,
            };
            setFilters(u);
            loadTrips(u);
          },
        });
      }
    }

    return (
      <div className="flex-1 flex flex-col bg-primary">
        {UsageBadge}
        <div className="flex-1 flex items-center justify-center flex-col p-6 text-center">
          {isNoDirectTrain ? (
            <>
              <div className="text-6xl mb-4">🚂</div>
              <h2 className="text-xl font-bold text-white mb-3">{t.discover.noDirectTrainTitle}</h2>
              <p className="text-sm text-white/75 mb-8 max-w-xs leading-relaxed">
                {t.discover.noDirectTrain}
              </p>
              <Button
                onClick={() => {
                  const updated = { ...filters, trainPreference: "with_stops" as const };
                  setFilters(updated);
                  loadTrips(updated);
                }}
                className="gap-2 mb-3 bg-white text-primary hover:bg-white/90"
              >
                <TrainFront className="w-4 h-4" />
                {t.filters.trainWithChanges}
              </Button>
              <Button onClick={() => setFilterOpen(true)} variant="outline" size="sm" className="border-white/40 text-white hover:bg-white/10">
                {t.filters.edit}
              </Button>
            </>
          ) : (
            <>
              <div className="text-6xl mb-4">😭</div>
              <h2 className="text-xl font-bold text-white mb-2">{t.filters.noResults}</h2>
              <p className="text-base text-white/75 mb-2 max-w-xs">{noResultsMsgRef.current}</p>
              <p className="text-sm text-white/55 mb-6 max-w-xs">{t.filters.noResultsSub}</p>

              {suggestions.length > 0 && (
                <div className="w-full max-w-xs mb-6">
                  <div className="flex items-center gap-2 mb-3 justify-center">
                    <Lightbulb className="w-4 h-4 text-[hsl(25,90%,70%)]" />
                    <p className="text-sm font-semibold text-white/90">{t.smartSuggestions.title}</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    {suggestions.slice(0, 3).map((s, i) => (
                      <button
                        key={i}
                        onClick={s.apply}
                        className="w-full py-2.5 px-4 bg-white/15 hover:bg-white/25 border border-white/25 rounded-xl text-sm font-medium text-white transition-colors text-left"
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <Button onClick={() => setFilterOpen(true)} variant="outline" className="gap-2 border-white/40 text-white hover:bg-white/10">
                <SlidersHorizontal className="w-4 h-4" />{t.filters.edit}
              </Button>
            </>
          )}
        </div>
        <FilterSheet open={filterOpen} filters={filters} onClose={() => setFilterOpen(false)} onApply={handleApplyFilters} />
        <AnimatePresence>
          <PremiumUpgradeModal open={showPremiumModal} onClose={() => setShowPremiumModal(false)} isGuest={!isSignedIn} t={t} onSignUp={() => setLocation("/sign-up")} onUpgrade={handleUpgrade} isUpgrading={upgradeSubscription.isPending} />
        </AnimatePresence>
      </div>
    );
  }

  /* ── Seen all (only when exhausted AND no more can be loaded) ── */
  if (currentIndex >= trips.length && !isLoadingMore) {
    return (
      <div className="flex-1 flex flex-col bg-primary">
        {UsageBadge}
        <div className="flex-1 flex items-center justify-center flex-col p-4 text-center">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-6">
            <MapPin className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">{t.discover.seenAll}</h2>
          <p className="text-white/75 mb-8 max-w-sm">{t.discover.seenAllSub}</p>
          {!isOnline ? (
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-2 text-sm text-orange-300 font-medium mb-2">
                <WifiOff className="w-4 h-4" />
                <span>{t.offline.searchDisabled}</span>
              </div>
              <Button onClick={checkConnectivity} variant="outline" size="lg" className="gap-2 border-white/40 text-white hover:bg-white/10">
                <RefreshCw className="w-4 h-4" />
                {t.offline.banner}
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {!loadMoreExhausted && (
                <Button onClick={() => loadMore(filters)} size="lg" disabled={generateTrips.isPending || isLoadingMore} className="bg-white text-primary hover:bg-white/90 gap-2">
                  <RefreshCw className={`w-4 h-4 ${isLoadingMore ? "animate-spin" : ""}`} />
                  {t.discover.generateMore}
                </Button>
              )}
              <Button onClick={() => loadTrips(filters)} size="lg" variant="outline" disabled={generateTrips.isPending} className="border-white/40 text-white hover:bg-white/10">
                {t.discover.generateMore} (reset)
              </Button>
            </div>
          )}
        </div>
        <FilterSheet open={filterOpen} filters={filters} onClose={() => setFilterOpen(false)} onApply={handleApplyFilters} />
        <AnimatePresence>
          <PremiumUpgradeModal open={showPremiumModal} onClose={() => setShowPremiumModal(false)} isGuest={!isSignedIn} t={t} onSignUp={() => setLocation("/sign-up")} onUpgrade={handleUpgrade} isUpgrading={upgradeSubscription.isPending} />
        </AnimatePresence>
      </div>
    );
  }

  /* ── Main swipe / list deck ── */
  return (
    <>
      <div className="flex-1 flex flex-col bg-primary overflow-hidden">
        <SurpriseBanner onPress={() => setLocation("/surprise")} t={t} compact />

        {/* ── Top bar: counter + view toggle ── */}
        <div className="flex items-center justify-between px-4 pt-2 pb-1">
          {viewMode === "swipe" ? (
            <div className="flex items-center gap-2">
              <button onClick={handlePrev} disabled={currentIndex === 0} className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-white disabled:opacity-30 active:scale-95 transition-transform">
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <span className="text-white/80 text-sm font-semibold tabular-nums">
                {currentIndex + 1} / {trips.length}{isLoadingMore ? "+" : ""}
              </span>
              <button onClick={handleNext} disabled={currentIndex >= trips.length - 1} className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-white disabled:opacity-30 active:scale-95 transition-transform">
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <span className="text-white/80 text-sm font-semibold">
              {trips.length}{isLoadingMore ? "+" : ""} risultati
            </span>
          )}
          {/* Mode toggle */}
          <div className="flex items-center bg-white/15 rounded-xl p-0.5 gap-0.5">
            <button
              onClick={() => setViewMode("swipe")}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-[10px] text-xs font-semibold transition-all ${viewMode === "swipe" ? "bg-white text-primary shadow-sm" : "text-white/70 hover:text-white"}`}
            >
              <Layers className="w-3.5 h-3.5" /> Swipe
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-[10px] text-xs font-semibold transition-all ${viewMode === "list" ? "bg-white text-primary shadow-sm" : "text-white/70 hover:text-white"}`}
            >
              <LayoutList className="w-3.5 h-3.5" /> Lista
            </button>
          </div>
        </div>

        {viewMode === "swipe" ? (
          /* ── SWIPE DECK ── */
          <div className="flex-1 flex flex-col items-center justify-center p-4 overflow-hidden">
            <div className="relative w-full max-w-sm aspect-[3/4]">
              <AnimatePresence>
                {trips.slice(currentIndex, currentIndex + 3).reverse().map((trip, i) => {
                  const stack = trips.slice(currentIndex, currentIndex + 3);
                  const isTop = i === stack.length - 1;
                  return (
                    <TripCard
                      key={trip.id}
                      trip={trip}
                      isTop={isTop}
                      index={i}
                      onSwipe={handleSwipe}
                      onInfo={() => setDetailTrip(trip)}
                      onShare={() => setShareTrip(trip)}
                      likeLabel={t.discover.like}
                      nopeLabel={t.discover.nope}
                      totalLabel={t.discover.total}
                      caption={hashCaption(trip.id, t.fun.captions)}
                      departureFrom={filters.departureAirport || filters.departureStation}
                      budget={filters.budget}
                      numberOfPeople={filters.numberOfPeople}
                    />
                  );
                })}
              </AnimatePresence>
            </div>
            {/* Loading more indicator below deck */}
            {isLoadingMore && (
              <div className="flex items-center gap-2 mt-3 text-white/60 text-xs">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Caricamento nuovi risultati…</span>
              </div>
            )}
            {/* Action buttons: ❌ ↩ ✓ + Filtri */}
            <div className="flex items-center gap-4 mt-6">
              <button onClick={() => handleSwipe("left")} className="rounded-full bg-red-500 shadow-[0_4px_20px_rgba(239,68,68,0.5)] flex items-center justify-center text-white hover:scale-110 active:scale-95 transition-transform" style={{ width: 68, height: 68 }}>
                <X className="w-8 h-8 stroke-[2.5]" />
              </button>
              <button onClick={handleUndo} disabled={history.length === 0} className="w-11 h-11 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center text-gray-500 disabled:opacity-30 disabled:cursor-not-allowed hover:scale-110 active:scale-95 transition-transform" title="Torna indietro">
                <RotateCcw className="w-4.5 h-4.5" />
              </button>
              <button onClick={() => handleSwipe("right")} className="rounded-full bg-green-500 shadow-[0_4px_20px_rgba(34,197,94,0.5)] flex items-center justify-center text-white hover:scale-110 active:scale-95 transition-transform" style={{ width: 68, height: 68 }}>
                <Check className="w-8 h-8 stroke-[2.5]" />
              </button>
              <button onClick={() => setFilterOpen(true)} className="w-11 h-11 rounded-full bg-white/20 shadow-md border border-white/30 flex items-center justify-center text-white hover:scale-110 active:scale-95 transition-transform" title="Filtri">
                <SlidersHorizontal className="w-4.5 h-4.5" />
              </button>
            </div>
          </div>
        ) : (
          /* ── LIST VIEW ── */
          <div className="flex-1 overflow-y-auto px-3 pt-2 pb-24">
            <div className="space-y-3 max-w-lg mx-auto">
              {trips.map((trip, idx) => (
                <TripListCard
                  key={trip.id}
                  trip={trip}
                  index={idx}
                  t={t}
                  lang={lang}
                  budget={filters.budget}
                  numberOfPeople={filters.numberOfPeople}
                  departureFrom={filters.departureAirport || filters.departureStation || ""}
                  onSave={() => {
                    if (isSignedIn) {
                      saveTrip.mutate({ data: { tripData: trip, destination: trip.destination, totalPrice: trip.totalPrice, imageUrl: trip.imageUrl } });
                      addNotification(t.notifications.tripSaved, "trip_saved");
                    } else {
                      toast(t.discover.signUpToSave, { action: { label: t.landing.getStarted, onClick: () => setLocation("/sign-up") } });
                    }
                  }}
                  onInfo={() => setDetailTrip(trip)}
                />
              ))}
              {/* Load more at bottom of list */}
              <div className="py-4 flex justify-center">
                {isLoadingMore ? (
                  <div className="flex items-center gap-2 text-white/60 text-sm">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Caricamento…</span>
                  </div>
                ) : !loadMoreExhausted ? (
                  <button
                    onClick={() => loadMore(filters)}
                    disabled={generateTrips.isPending}
                    className="px-6 py-2.5 bg-white/20 hover:bg-white/30 border border-white/30 rounded-xl text-white text-sm font-semibold transition-colors flex items-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    {t.discover.generateMore}
                  </button>
                ) : (
                  <p className="text-white/50 text-sm">{t.discover.seenAll}</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <FilterSheet open={filterOpen} filters={filters} onClose={() => setFilterOpen(false)} onApply={handleApplyFilters} />

      <TripDetailSheet
        trip={detailTrip}
        onClose={() => setDetailTrip(null)}
        isSignedIn={!!isSignedIn}
        budget={filters.budget}
        numberOfPeople={filters.numberOfPeople}
        onSave={() => {
          if (detailTrip) {
            if (isSignedIn) {
              saveTrip.mutate({ data: { tripData: detailTrip, destination: detailTrip.destination, totalPrice: detailTrip.totalPrice, imageUrl: detailTrip.imageUrl } });
              setDetailTrip(null);
            } else {
              setLocation("/sign-up");
            }
          }
        }}
        onShare={() => { setShareTrip(detailTrip); }}
      />

      <ShareModal trip={shareTrip} onClose={() => setShareTrip(null)} />

      <AnimatePresence>
        <PremiumUpgradeModal open={showPremiumModal} onClose={() => setShowPremiumModal(false)} isGuest={!isSignedIn} t={t} onSignUp={() => setLocation("/sign-up")} onUpgrade={handleUpgrade} isUpgrading={upgradeSubscription.isPending} />
      </AnimatePresence>
    </>
  );
}

/* ─── Trip List Card (compact, for list mode) ───────────────────────────── */
function TripListCard({
  trip, index, t, lang, budget, numberOfPeople, departureFrom, onSave, onInfo,
}: {
  trip: TripSuggestion;
  index: number;
  t: ReturnType<typeof useI18n>["t"];
  lang: string;
  budget: number;
  numberOfPeople: number;
  departureFrom: string;
  onSave: () => void;
  onInfo: () => void;
}) {
  const totalForAll = trip.totalPrice * numberOfPeople;
  const savings = budget > 0 ? budget - totalForAll : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.25 }}
      className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl overflow-hidden"
    >
      <div className="flex gap-3 p-3">
        {/* Thumbnail */}
        <div className="relative shrink-0">
          <img
            src={getImgSrc(trip.imageUrl)}
            alt={trip.destination}
            className="w-24 h-24 rounded-xl object-cover"
          />
          <div className="absolute bottom-1 left-1 bg-black/60 backdrop-blur-sm rounded-lg px-1.5 py-0.5">
            <span className="text-white text-[10px] font-bold">{formatCurrency(totalForAll, lang)}</span>
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-1 mb-1">
              <div>
                <p className="text-white font-bold text-base leading-tight">{trip.destination}</p>
                <p className="text-white/60 text-xs">{trip.country}</p>
              </div>
              {savings > 0 && (
                <span className="text-emerald-400 text-[10px] font-semibold shrink-0 mt-0.5">
                  -{formatCurrency(savings, lang)}
                </span>
              )}
            </div>

            {/* Pills row */}
            <div className="flex flex-wrap gap-1 mb-1.5">
              <span className="flex items-center gap-0.5 bg-white/15 text-white text-[11px] px-2 py-0.5 rounded-full">
                <Clock className="w-3 h-3" />{trip.transport.duration}
              </span>
              <span className="flex items-center gap-0.5 bg-white/15 text-white text-[11px] px-2 py-0.5 rounded-full">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                {trip.hotel.rating != null ? trip.hotel.rating.toFixed(1) : "–"}
              </span>
              <span className="flex items-center gap-0.5 bg-white/15 text-white text-[11px] px-2 py-0.5 rounded-full">
                <MapPin className="w-3 h-3" />{formatDistance(trip.hotel.distanceFromCenter, lang)}
              </span>
              {departureFrom && (
                <span className="flex items-center gap-0.5 bg-white/15 text-white text-[11px] px-2 py-0.5 rounded-full">
                  <Plane className="w-3 h-3" />{departureFrom.split(" (")[0].split(" ")[0]}
                </span>
              )}
            </div>

            <p className="text-white/50 text-[11px] truncate">{trip.hotel.name} · {trip.durationDays}n</p>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 mt-2">
            <button
              onClick={onInfo}
              className="flex-1 h-8 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
            >
              <Info className="w-3.5 h-3.5" /> Info
            </button>
            <button
              onClick={onSave}
              className="flex-1 h-8 rounded-xl bg-green-500/80 hover:bg-green-500 text-white text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
            >
              <Check className="w-3.5 h-3.5" /> Save
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Trip Card ─────────────────────────────────────────────────────────── */
function TripCard({
  trip, isTop, index, onSwipe, onInfo, onShare,
  likeLabel, nopeLabel, totalLabel, caption, departureFrom, budget, numberOfPeople,
}: {
  trip: TripSuggestion;
  isTop: boolean;
  index: number;
  onSwipe: (dir: "left" | "right") => void;
  onInfo: () => void;
  onShare: () => void;
  likeLabel: string;
  nopeLabel: string;
  totalLabel: string;
  caption: string;
  departureFrom?: string;
  budget?: number;
  numberOfPeople?: number;
}) {
  const { t, lang } = useI18n();
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-10, 10]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);
  const likeOpacity = useTransform(x, [0, 100], [0, 1]);
  const nopeOpacity = useTransform(x, [0, -100], [0, 1]);

  const roundTripTransport = trip.transport.price + (trip.returnTransport?.price ?? 0);
  // Total for ALL people (trip.totalPrice is per person)
  const totalForAll = (numberOfPeople ?? 1) * trip.totalPrice;
  const savings = budget && budget > 0 ? budget - totalForAll : 0;
  const savingsMsg = savings > 10
    ? t.fun.savingsMessages[trip.id.charCodeAt(trip.id.length - 1) % t.fun.savingsMessages.length]
      .replace("{amount}", formatCurrency(savings, lang))
    : null;

  return (
    <motion.div
      className="absolute inset-0 w-full h-full bg-card rounded-3xl shadow-xl overflow-hidden border border-border"
      style={{
        x: isTop ? x : 0,
        rotate: isTop ? rotate : 0,
        opacity: isTop ? opacity : 1,
        zIndex: index,
        scale: 1 - (2 - index) * 0.05,
        y: (2 - index) * 10,
      }}
      drag={isTop ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={(_: unknown, info: { offset: { x: number } }) => {
        if (info.offset.x > 100) onSwipe("right");
        else if (info.offset.x < -100) onSwipe("left");
      }}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1 - (2 - index) * 0.05, opacity: 1 }}
      exit={{ x: x.get() > 0 ? 300 : -300, opacity: 0, transition: { duration: 0.2 } }}
    >
      <div className="relative h-full w-full">
        <img
          src={getImgSrc(trip.imageUrl)}
          alt={trip.destination}
          className="w-full h-full object-cover pointer-events-none"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/85 pointer-events-none" />

        {isTop && (
          <>
            {/* Fun caption */}
            <div className="absolute top-4 left-4 bg-black/55 backdrop-blur-md text-white text-xs font-semibold px-3 py-1.5 rounded-full pointer-events-none max-w-[55%] truncate">
              {caption}
            </div>
            {/* Top-right buttons: share + info */}
            <div className="absolute top-4 right-4 flex gap-2">
              <button
                onClick={(e) => { e.stopPropagation(); onShare(); }}
                className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/60 transition-colors z-10"
              >
                <Share2 className="w-4 h-4" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onInfo(); }}
                className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/60 transition-colors z-10"
              >
                <Info className="w-4 h-4" />
              </button>
            </div>
          </>
        )}

        {isTop && (
          <>
            <motion.div style={{ opacity: likeOpacity }} className="absolute top-16 left-6 border-4 border-green-400 text-green-400 font-black text-3xl px-4 py-2 rounded-xl rotate-[-15deg] pointer-events-none">
              {likeLabel}
            </motion.div>
            <motion.div style={{ opacity: nopeOpacity }} className="absolute top-16 right-6 border-4 border-red-400 text-red-400 font-black text-3xl px-4 py-2 rounded-xl rotate-[15deg] pointer-events-none">
              {nopeLabel}
            </motion.div>
          </>
        )}

        <div className="absolute bottom-0 left-0 right-0 p-4 pb-5 text-white pointer-events-none">
          <h2 className="text-3xl font-bold mb-0.5">{trip.destination}</h2>
          <p className="text-white/80 font-medium mb-2">{trip.country}</p>

          {/* Row 1: flight route + duration + hotel price */}
          <div className="flex gap-2 mb-2 flex-wrap">
            <div className="flex items-center gap-1.5 bg-black/45 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-medium">
              <Plane className="w-3.5 h-3.5 shrink-0" />
              {departureFrom ? (
                <span className="max-w-[90px] truncate">{departureFrom.split(" (")[0].split(" ")[0]} → {trip.destination}</span>
              ) : (
                <span>{trip.tripType === "one_way" ? "→" : "↕"} {formatCurrency(trip.tripType === "one_way" ? trip.transport.price : roundTripTransport, lang)}</span>
              )}
            </div>
            <div className="flex items-center gap-1.5 bg-black/45 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-medium">
              <Clock className="w-3.5 h-3.5 shrink-0" />
              <span>{trip.transport.duration}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-black/45 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-medium">
              <Hotel className="w-3.5 h-3.5 shrink-0" />
              <span>{formatCurrency(trip.hotel.pricePerNight, lang)}/nt</span>
            </div>
          </div>

          {/* Row 2: hotel name + distance + rating */}
          <div className="flex gap-2 mb-3 flex-wrap">
            <div className="flex items-center gap-1.5 bg-black/45 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-medium max-w-[180px]">
              <MapPin className="w-3 h-3 shrink-0" />
              <span className="truncate">{trip.hotel.name.split(" ").slice(0, 3).join(" ")}</span>
              <span className="opacity-70 shrink-0">· {formatDistance(trip.hotel.distanceFromCenter, lang)}</span>
            </div>
            <div className="flex items-center gap-1 bg-black/45 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-medium">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400 shrink-0" />
              <span>{trip.hotel.rating != null ? trip.hotel.rating.toFixed(1) : "–"}</span>
              <span className="opacity-60">({trip.hotel.stars}★)</span>
            </div>
          </div>

          {/* Row 3: total only */}
          <div className="flex items-end justify-between">
            <p className="text-[10px] text-white/50">{trip.durationDays}n · {trip.tripType === "one_way" ? "→" : "↕"}</p>
            <div className="text-right shrink-0">
              <p className="text-[10px] text-white/60 uppercase tracking-widest font-bold mb-0.5">{totalLabel}</p>
              <p className="text-2xl font-black">{formatCurrency(totalForAll, lang)}</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Transport block ────────────────────────────────────────────────────── */
function TransportBlock({ label, transport, t, lang }: { label?: string; transport: NonNullable<TripSuggestion["returnTransport"]>; t: ReturnType<typeof useI18n>["t"]; lang: string }) {
  return (
    <div>
      {label && <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">{label}</p>}
      <div className="space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <span className="font-semibold">{transport.company}</span>
          <span className="font-medium">{formatCurrency(transport.price, lang)}<span className="text-muted-foreground text-xs"> /p</span></span>
        </div>
        <div className="flex items-center">
          <div className="text-center min-w-[56px]">
            <p className="text-xs text-muted-foreground">{t.tripDetail.departure}</p>
            <p className="font-bold text-base">{transport.departureTime}</p>
          </div>
          <div className="flex flex-col items-center gap-0.5 flex-1 px-2">
            <p className="text-xs text-muted-foreground">{transport.duration}</p>
            <div className="flex items-center gap-1 w-full">
              <div className="h-px flex-1 bg-border" />
              <ArrowRight className="w-3 h-3 text-muted-foreground shrink-0" />
            </div>
            <Badge variant={transport.isDirect ? "default" : "outline"} className="text-[10px] px-2 py-0">
              {transport.isDirect ? t.tripDetail.direct : t.tripDetail.withStops}
            </Badge>
          </div>
          <div className="text-center min-w-[56px]">
            <p className="text-xs text-muted-foreground">{t.tripDetail.arrival}</p>
            <p className="font-bold text-base">{transport.arrivalTime}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Trip Detail Sheet ──────────────────────────────────────────────────── */
function TripDetailSheet({
  trip, onClose, isSignedIn, onSave, onShare, budget, numberOfPeople,
}: {
  trip: TripSuggestion | null;
  onClose: () => void;
  isSignedIn: boolean;
  onSave: () => void;
  onShare: () => void;
  budget?: number;
  numberOfPeople?: number;
}) {
  const { t, lang } = useI18n();

  return (
    <Sheet open={!!trip} onOpenChange={(open) => { if (!open) onClose(); }}>
      <SheetContent side="bottom" className="h-[90dvh] p-0 rounded-t-3xl overflow-hidden flex flex-col">
        {trip && (
          <>
            <div className="relative h-52 shrink-0">
              <img src={getImgSrc(trip.imageUrl)} alt={trip.destination} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/75" />
              <div className="absolute bottom-4 left-5 right-5 text-white">
                <div className="flex items-end justify-between">
                  <div>
                    <h2 className="text-3xl font-bold">{trip.destination}</h2>
                    <p className="text-white/80 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5" /> {trip.country}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-white/70 uppercase tracking-wider font-semibold">{t.tripDetail.totalCost}</p>
                    <p className="text-2xl font-bold">{formatCurrency((numberOfPeople ?? 1) * trip.totalPrice, lang)}</p>
                    {(numberOfPeople ?? 1) > 1 && (
                      <p className="text-xs text-white/60">{numberOfPeople} {t.tripDetail.perPerson}</p>
                    )}
                  </div>
                </div>
              </div>
              {/* Share button on hero */}
              <button
                onClick={onShare}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/60 transition-colors"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-5 space-y-6">
              <section>
                <h3 className="font-bold text-base mb-2">{t.tripDetail.overview}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{trip.description}</p>
              </section>

              {trip.highlights && trip.highlights.length > 0 && (
                <section>
                  <h3 className="font-bold text-base mb-3">{t.tripDetail.highlights}</h3>
                  <div className="flex flex-wrap gap-2">
                    {trip.highlights.map((h, i) => (
                      <Badge key={i} variant="secondary" className="text-xs px-3 py-1">{h}</Badge>
                    ))}
                  </div>
                </section>
              )}

              <section className="bg-muted/40 rounded-2xl p-4 space-y-4">
                <h3 className="font-bold text-base flex items-center gap-2">
                  <Plane className="w-4 h-4 text-primary" />
                  {trip.transport.type === "train" ? t.tripDetail.train : t.tripDetail.flight}
                  <span className="ml-auto text-xs font-normal text-muted-foreground">
                    {trip.tripType === "one_way" ? "→ Solo andata" : "↕ Andata e ritorno"}
                  </span>
                </h3>
                <TransportBlock
                  transport={trip.transport}
                  t={t}
                  lang={lang}
                />
                {trip.transport.type === "train" && !trip.transport.isDirect && (
                  <div className="flex items-start gap-2 bg-orange-500/10 border border-orange-400/20 rounded-xl px-3 py-2 text-xs text-orange-700">
                    <span className="text-base shrink-0">🚂</span>
                    <p>{t.fun.trainNotDirectMessages[trip.destination.length % t.fun.trainNotDirectMessages.length]}</p>
                  </div>
                )}
              </section>

              {/* Hotel with full stars */}
              <section className="bg-muted/40 rounded-2xl p-4">
                <h3 className="font-bold text-base mb-3 flex items-center gap-2">
                  <Hotel className="w-4 h-4 text-primary" />
                  {t.tripDetail.hotel}
                </h3>
                <div className="space-y-2.5 text-sm">
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-semibold">{trip.hotel.name}</span>
                    <div className="text-right shrink-0">
                      <p className="font-medium">{formatCurrency(trip.hotel.pricePerNight, lang)}{t.tripDetail.perNight}</p>
                      {trip.hotelTotalCost != null && (
                        <p className="text-xs text-muted-foreground">{t.tripDetail.totalHotel}: {formatCurrency(trip.hotelTotalCost, lang)}</p>
                      )}
                    </div>
                  </div>
                  {/* Clickable star display (1-5, full stars) */}
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-5 h-5 ${s <= trip.hotel.stars ? "fill-amber-400 text-amber-400" : "text-muted-foreground/20"}`}
                      />
                    ))}
                    <span className="text-xs text-muted-foreground ml-1">({trip.hotel.stars}/5)</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-muted-foreground">
                    <span className="flex items-center gap-1.5 flex-wrap">
                      <Navigation className="w-3.5 h-3.5 shrink-0" />
                      {formatDistance(trip.hotel.distanceFromCenter, lang)}
                      <span className="text-[10px] bg-primary/10 text-primary rounded-full px-2 py-0.5 font-medium">
                        {trip.hotel.distanceFromCenter <= 1 ? t.tripDetail.cityCenter
                          : trip.hotel.distanceFromCenter <= 3 ? t.tripDetail.centralArea
                          : trip.hotel.distanceFromCenter <= 8 ? t.tripDetail.connectedArea
                          : t.tripDetail.outskirts}
                      </span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5" />
                      {trip.hotel.rating}/5
                    </span>
                  </div>
                  {trip.hotel.amenities && trip.hotel.amenities.length > 0 && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-1.5">{t.tripDetail.amenities}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {trip.hotel.amenities.map((a, i) => (
                          <span key={i} className="text-xs bg-background border rounded-full px-2.5 py-0.5 flex items-center gap-1">
                            <Wifi className="w-3 h-3" /> {a}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </section>

              <section className="flex gap-3">
                <div className="flex-1 bg-muted/40 rounded-xl p-3 text-center">
                  <Clock className="w-4 h-4 mx-auto text-muted-foreground mb-1" />
                  <p className="text-lg font-bold">{trip.durationDays}</p>
                  <p className="text-xs text-muted-foreground">{t.tripDetail.nights}</p>
                </div>
                <div className="flex-1 bg-muted/40 rounded-xl p-3 text-center">
                  <Users className="w-4 h-4 mx-auto text-muted-foreground mb-1" />
                  <p className="text-lg font-bold">{numberOfPeople ?? 1}</p>
                  <p className="text-xs text-muted-foreground">{t.tripDetail.perPerson.replace("a ", "").replace("per ", "").replace("pro ", "").replace("par ", "").replace("por ", "").trim() || "persone"}</p>
                </div>
                <div className="flex-1 bg-primary/10 border border-primary/20 rounded-xl p-3 text-center">
                  <Euro className="w-4 h-4 mx-auto text-primary mb-1" />
                  <p className="text-lg font-bold text-primary">{formatCurrency((numberOfPeople ?? 1) * trip.totalPrice, lang)}</p>
                  <p className="text-xs text-primary/70 font-semibold">{t.tripDetail.totalCost}</p>
                </div>
              </section>

              {/* Price disclaimer */}
              <p className="text-[11px] text-muted-foreground/70 leading-relaxed px-1">
                ⚠️ {t.legal.priceDisclaimer}
              </p>

              {/* Booking links */}
              <section className="bg-muted/40 rounded-2xl p-4">
                <p className="font-bold text-base mb-1">{t.tripDetail.bookTitle}</p>
                <p className="text-xs text-muted-foreground mb-3">{t.tripDetail.bookSubtitle}</p>
                <div className="flex flex-col gap-2">
                  <a
                    href={`https://www.booking.com/searchresults.html?aid=travelbudget_fake001&ss=${encodeURIComponent(trip.destination)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between gap-3 bg-[#003580] text-white rounded-xl px-4 py-3 font-semibold text-sm hover:bg-[#00245a] transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <Hotel className="w-4 h-4" />
                      {t.tripDetail.bookHotel}
                    </span>
                    <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                  </a>
                  {trip.transport.type === "train" ? (
                    <a
                      href={`https://www.omio.com/?utm_source=travelbudget&utm_campaign=aff_fake001&destination=${encodeURIComponent(trip.destination)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between gap-3 bg-[#00a861] text-white rounded-xl px-4 py-3 font-semibold text-sm hover:bg-[#008a4f] transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <TrainFront className="w-4 h-4" />
                        {t.tripDetail.bookTransport}
                      </span>
                      <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                    </a>
                  ) : (
                    <a
                      href={`https://www.skyscanner.it/transport/flights/results/?utm_source=travelbudget&affiliateId=fake001&destination=${encodeURIComponent(trip.destination)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between gap-3 bg-[#0770e3] text-white rounded-xl px-4 py-3 font-semibold text-sm hover:bg-[#0558b0] transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <Plane className="w-4 h-4" />
                        {t.tripDetail.bookFlight}
                      </span>
                      <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                    </a>
                  )}
                </div>
              </section>

              {/* Share + Save */}
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1 gap-2" onClick={onShare}>
                  <Share2 className="w-4 h-4" />
                  {t.discover.shareTrip}
                </Button>
                <Button size="lg" className="flex-1" onClick={onSave}>
                  {isSignedIn ? (
                    <><Check className="w-4 h-4 mr-2" />{t.tripDetail.saveTrip}</>
                  ) : (
                    <>{t.tripDetail.signUpCta} <ArrowRight className="w-4 h-4 ml-2" /></>
                  )}
                </Button>
              </div>

              <div className="h-4" />
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

/* ─── Surprise Banner ───────────────────────────────────────────────────── */
function SurpriseBanner({
  onPress, t, compact = false,
}: {
  onPress: () => void;
  t: ReturnType<typeof useI18n>["t"];
  compact?: boolean;
}) {
  if (compact) {
    return (
      <button
        onClick={onPress}
        className="mx-3 my-1.5 flex items-center gap-2 bg-gradient-to-r from-primary/10 to-orange-400/10 border border-primary/20 rounded-xl px-3 py-2 hover:opacity-80 active:scale-98 transition-all text-left"
      >
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-orange-400 flex items-center justify-center shrink-0">
          <Dice6 className="w-3.5 h-3.5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-foreground truncate">{t.surprise.title}</p>
          <p className="text-[10px] text-muted-foreground truncate">{t.surprise.buttonSub}</p>
        </div>
        <ArrowRight className="w-3.5 h-3.5 text-primary shrink-0" />
      </button>
    );
  }

  return (
    <button
      onClick={onPress}
      className="mx-4 my-2 flex items-center gap-3 bg-gradient-to-r from-primary/10 via-violet-500/10 to-orange-400/10 border border-primary/25 rounded-2xl px-4 py-3 hover:opacity-80 active:scale-98 transition-all text-left"
    >
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-orange-400 flex items-center justify-center shrink-0 shadow-sm">
        <Dice6 className="w-5 h-5 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-sm text-foreground">{t.surprise.title}</p>
        <p className="text-xs text-muted-foreground">{t.surprise.buttonSub}</p>
      </div>
      <ArrowRight className="w-4 h-4 text-primary shrink-0" />
    </button>
  );
}
