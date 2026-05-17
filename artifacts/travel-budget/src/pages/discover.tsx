import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { useGenerateTrips, useSaveTrip, useGetPreferences, useGetUsage } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import {
  MapPin, Plane, Hotel, Check, X, RotateCcw, Info,
  Clock, Star, Navigation, Wifi, WifiOff, ArrowRight, SlidersHorizontal,
  Share2, MessageCircle, Facebook, Copy, TrainFront, ExternalLink, Dice6,
  Crown, Zap, Sparkles, RefreshCw,
} from "lucide-react";
import { useAuth } from "@clerk/react";
import { useLocation } from "wouter";
import { toast } from "sonner";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import type { TripSuggestion } from "@workspace/api-client-react";
import { useI18n } from "@/lib/i18n";
import {
  FilterBar,
  FilterSheet,
  DEFAULT_FILTERS,
  type TripFilters,
} from "@/components/filter-panel";

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
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);

  if (!trip) return null;

  const shareText = `✈️ ${trip.destination}, ${trip.country} — ${trip.durationDays} notti a €${trip.totalPrice}/persona! Scoperto su TravelBudget 🌍`;
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
}: {
  open: boolean;
  onClose: () => void;
  isGuest: boolean;
  t: ReturnType<typeof useI18n>["t"];
  onSignUp: () => void;
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
            <p className="text-[11px] text-muted-foreground mt-0.5">ricerche / mese</p>
          </div>
          <div className="flex-1 rounded-2xl border-2 border-primary bg-primary/5 p-3 text-center relative overflow-hidden">
            <div className="absolute top-1.5 right-1.5">
              <Crown className="w-3.5 h-3.5 text-primary" />
            </div>
            <p className="text-xs text-primary font-semibold uppercase tracking-wide mb-1">Premium</p>
            <p className="text-2xl font-black text-primary">80</p>
            <p className="text-[11px] text-primary/70 mt-0.5">ricerche / mese</p>
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
          onClick={() => {
            toast(t.premium.cta, { description: "Coming soon — we'll notify you!" });
            onClose();
          }}
          className="w-full bg-gradient-to-r from-primary to-orange-500 text-white font-bold py-4 rounded-2xl text-base shadow-[0_4px_20px_rgba(30,75,204,0.35)] hover:opacity-90 active:scale-95 transition-all mb-3"
        >
          {t.premium.cta} — {t.premium.price}
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
function PreSearchState({ onOpenFilters, t }: { onOpenFilters: () => void; t: ReturnType<typeof useI18n>["t"] }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
      <div className="flex items-center justify-center gap-4 mb-8">
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

      <h2 className="text-2xl font-black text-white mb-3">{t.discover.discoverTitle}</h2>
      <p className="text-white/75 text-sm mb-10 max-w-xs leading-relaxed">{t.discover.discoverSub}</p>

      <button
        onClick={onOpenFilters}
        className="flex items-center gap-2 bg-white text-primary font-bold px-8 py-4 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.25)] hover:bg-white/90 active:scale-95 transition-all"
      >
        <SlidersHorizontal className="w-5 h-5" />
        {t.discover.setFilters}
      </button>
    </div>
  );
}

const GUEST_SEARCH_LIMIT = 5;

/* ─── Main page ─────────────────────────────────────────────────────────── */
export default function Discover() {
  const { isSignedIn } = useAuth();
  const [, setLocation] = useLocation();
  const { t } = useI18n();

  const [trips, setTrips] = useState<TripSuggestion[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [history, setHistory] = useState<number[]>([]);
  const [detailTrip, setDetailTrip] = useState<TripSuggestion | null>(null);
  const [shareTrip, setShareTrip] = useState<TripSuggestion | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState<TripFilters>(DEFAULT_FILTERS);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [guestCount, setGuestCount] = useState(() =>
    parseInt(localStorage.getItem("guestSearchCount") ?? "0")
  );

  // Welcome splash — show once per session
  const [showSplash, setShowSplash] = useState(() => {
    return !sessionStorage.getItem("splashSeen");
  });

  const dismissSplash = useCallback(() => {
    sessionStorage.setItem("splashSeen", "1");
    setShowSplash(false);
  }, []);

  const loadingMsgRef = useRef<string | null>(null);
  const noResultsMsgRef = useRef<string | null>(null);
  // ── Race-condition guard: only accept results from the latest search ──
  const searchGenRef = useRef(0);
  if (!loadingMsgRef.current) {
    const msgs = t.fun.loadingMessages;
    loadingMsgRef.current = msgs[Math.floor(Math.random() * msgs.length)];
  }
  if (!noResultsMsgRef.current) {
    const msgs = t.fun.noResultsMessages;
    noResultsMsgRef.current = msgs[Math.floor(Math.random() * msgs.length)];
  }

  const { data: prefs } = useGetPreferences({
    query: { enabled: !!isSignedIn, queryKey: ["preferences"] },
  });

  const { data: usage, refetch: refetchUsage } = useGetUsage({
    query: { enabled: !!isSignedIn, queryKey: ["usage"] },
  });

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

  const { isOnline, checkConnectivity } = useOnlineStatus();

  const generateTrips = useGenerateTrips();
  const saveTrip = useSaveTrip();

  function loadTrips(f: TripFilters) {
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

    // ── Stamp this search so stale responses are discarded ────────
    const thisGen = ++searchGenRef.current;
    // Clear stale results immediately — prevents old data surviving a trip-type switch
    setTrips([]);

    const effectiveBudget = f.budget || prefs?.defaultBudget || 2000;
    const depLocation = f.departureAirport || f.departureStation || prefs?.defaultDepartureLocation || "Any";
    const arrLocation = f.arrivalAirport || f.arrivalStation || "Any";
    // tripType is always explicitly set — no fallback to avoid accidental mode mixing
    const tripType = f.tripType;
    loadingMsgRef.current = t.fun.loadingMessages[Math.floor(Math.random() * t.fun.loadingMessages.length)];
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
          // Track guest searches
          if (!isSignedIn) {
            const newCount = parseInt(localStorage.getItem("guestSearchCount") ?? "0") + 1;
            localStorage.setItem("guestSearchCount", String(newCount));
            setGuestCount(newCount);
          } else {
            refetchUsage();
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

  const handleSwipe = (direction: "left" | "right") => {
    if (currentIndex >= trips.length) return;
    const trip = trips[currentIndex];
    if (direction === "right") {
      if (isSignedIn) {
        saveTrip.mutate({ data: { tripData: trip, destination: trip.destination, totalPrice: trip.totalPrice, imageUrl: trip.imageUrl } });
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
    return (
      <div className="flex-1 flex flex-col bg-primary">
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3 px-8 text-center">
            <Plane className="w-14 h-14 text-white mb-1 animate-bounce" />
            <p className="text-white/80 font-medium">{loadingMsgRef.current}</p>
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

  /* ── Pre-search (no filters applied yet) ── */
  if (!hasSearched) {
    return (
      <div className="flex-1 flex flex-col bg-primary">
        {UsageBadge}
        {isOnline ? (
          <>
            <SurpriseBanner onPress={() => setLocation("/surprise")} t={t} />
            <PreSearchState onOpenFilters={() => setFilterOpen(true)} t={t} />
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
          <PremiumUpgradeModal open={showPremiumModal} onClose={() => setShowPremiumModal(false)} isGuest={!isSignedIn} t={t} onSignUp={() => setLocation("/sign-up")} />
        </AnimatePresence>
      </div>
    );
  }

  /* ── No results ── */
  if (trips.length === 0) {
    const isNoDirectTrain =
      filters.trainPreference === "direct" && !!filters.departureStation;
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
              <p className="text-sm text-white/55 mb-8 max-w-xs">{t.filters.noResultsSub}</p>
              <Button onClick={() => setFilterOpen(true)} variant="outline" className="gap-2 border-white/40 text-white hover:bg-white/10">
                <SlidersHorizontal className="w-4 h-4" />{t.filters.edit}
              </Button>
            </>
          )}
        </div>
        <FilterSheet open={filterOpen} filters={filters} onClose={() => setFilterOpen(false)} onApply={handleApplyFilters} />
        <AnimatePresence>
          <PremiumUpgradeModal open={showPremiumModal} onClose={() => setShowPremiumModal(false)} isGuest={!isSignedIn} t={t} onSignUp={() => setLocation("/sign-up")} />
        </AnimatePresence>
      </div>
    );
  }

  /* ── Seen all ── */
  if (currentIndex >= trips.length) {
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
            <Button onClick={() => loadTrips(filters)} size="lg" disabled={generateTrips.isPending} className="bg-white text-primary hover:bg-white/90">
              {t.discover.generateMore}
            </Button>
          )}
        </div>
        <FilterSheet open={filterOpen} filters={filters} onClose={() => setFilterOpen(false)} onApply={handleApplyFilters} />
        <AnimatePresence>
          <PremiumUpgradeModal open={showPremiumModal} onClose={() => setShowPremiumModal(false)} isGuest={!isSignedIn} t={t} onSignUp={() => setLocation("/sign-up")} />
        </AnimatePresence>
      </div>
    );
  }

  /* ── Main swipe deck ── */
  return (
    <>
      <div className="flex-1 flex flex-col bg-primary">
        <SurpriseBanner onPress={() => setLocation("/surprise")} t={t} compact />

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

          {/* Action buttons: ❌ ↩ ✓ + Filtri */}
          <div className="flex items-center gap-4 mt-8">
            <button
              onClick={() => handleSwipe("left")}
              className="rounded-full bg-red-500 shadow-[0_4px_20px_rgba(239,68,68,0.5)] flex items-center justify-center text-white hover:scale-110 active:scale-95 transition-transform"
              style={{ width: 68, height: 68 }}
            >
              <X className="w-8 h-8 stroke-[2.5]" />
            </button>
            <button
              onClick={handleUndo}
              disabled={history.length === 0}
              className="w-11 h-11 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center text-gray-500 disabled:opacity-30 disabled:cursor-not-allowed hover:scale-110 active:scale-95 transition-transform"
              title="Torna indietro"
            >
              <RotateCcw className="w-4.5 h-4.5" />
            </button>
            <button
              onClick={() => handleSwipe("right")}
              className="rounded-full bg-green-500 shadow-[0_4px_20px_rgba(34,197,94,0.5)] flex items-center justify-center text-white hover:scale-110 active:scale-95 transition-transform"
              style={{ width: 68, height: 68 }}
            >
              <Check className="w-8 h-8 stroke-[2.5]" />
            </button>
            <button
              onClick={() => setFilterOpen(true)}
              className="w-11 h-11 rounded-full bg-white/20 shadow-md border border-white/30 flex items-center justify-center text-white hover:scale-110 active:scale-95 transition-transform"
              title="Filtri"
            >
              <SlidersHorizontal className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>
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
        <PremiumUpgradeModal open={showPremiumModal} onClose={() => setShowPremiumModal(false)} isGuest={!isSignedIn} t={t} onSignUp={() => setLocation("/sign-up")} />
      </AnimatePresence>
    </>
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
  const { t } = useI18n();
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
      .replace("{amount}", `€${savings}`)
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

        <div className="absolute bottom-0 left-0 right-0 p-5 text-white pointer-events-none">
          <div className="mb-2.5" />
          <h2 className="text-3xl font-bold mb-0.5">{trip.destination}</h2>
          <p className="text-white/80 font-medium mb-3">{trip.country}</p>
          <div className="flex gap-2.5 mb-3">
            <div className="flex items-center gap-1.5 bg-black/45 backdrop-blur-md px-3 py-1.5 rounded-full text-sm">
              <Plane className="w-3.5 h-3.5 shrink-0" />
              {departureFrom ? (
                <span className="text-xs max-w-[100px] truncate">{departureFrom.split(" (")[0].split(" ")[0]} → {trip.destination}</span>
              ) : (
                <>
                  <span className="text-[11px] opacity-80">{trip.tripType === "one_way" ? "→" : "↕"}</span>
                  <span>€{trip.tripType === "one_way" ? trip.transport.price : roundTripTransport}</span>
                </>
              )}
            </div>
            <div className="flex items-center gap-1.5 bg-black/45 backdrop-blur-md px-3 py-1.5 rounded-full text-sm">
              <Hotel className="w-3.5 h-3.5 shrink-0" />
              <span>${trip.hotel.pricePerNight}/nt</span>
            </div>
            <div className="flex items-center gap-0.5 bg-black/45 backdrop-blur-md px-3 py-1.5 rounded-full text-sm">
              {"★".repeat(trip.hotel.stars)}{"☆".repeat(5 - trip.hotel.stars)}
            </div>
          </div>
          <div className="flex items-end justify-between">
            <p className="text-sm text-white/80 line-clamp-2 pr-4 leading-relaxed">{trip.description}</p>
            <div className="text-right shrink-0">
              <p className="text-[10px] text-white/60 uppercase tracking-widest font-bold mb-0.5">{totalLabel}</p>
              <p className="text-2xl font-black">€{totalForAll}</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Transport block ────────────────────────────────────────────────────── */
function TransportBlock({ label, transport, t }: { label?: string; transport: NonNullable<TripSuggestion["returnTransport"]>; t: ReturnType<typeof useI18n>["t"] }) {
  return (
    <div>
      {label && <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">{label}</p>}
      <div className="space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <span className="font-semibold">{transport.company}</span>
          <span className="font-medium">${transport.price}<span className="text-muted-foreground text-xs"> /p</span></span>
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
  const { t } = useI18n();

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
                    <p className="text-xs text-white/70 uppercase tracking-wider">{t.tripDetail.totalCost}</p>
                    <p className="text-2xl font-bold">€{(numberOfPeople ?? 1) * trip.totalPrice}</p>
                    {numberOfPeople && numberOfPeople > 1 && (
                      <p className="text-xs text-white/60">{numberOfPeople} {t.tripDetail.perPerson.includes("person") ? "people" : "persone"}</p>
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
                </h3>
                {/* ONE-WAY: single leg, no sub-label needed (no return implied)
                    ROUND-TRIP: "Andata" + "Ritorno" labels clarify both legs */}
                <TransportBlock
                  label={trip.tripType === "round_trip" ? t.tripDetail.outbound : undefined}
                  transport={trip.transport}
                  t={t}
                />
                {trip.tripType === "round_trip" && trip.returnTransport && (
                  <>
                    <div className="border-t border-border" />
                    <TransportBlock label={t.tripDetail.returnJourney} transport={trip.returnTransport} t={t} />
                  </>
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
                      <p className="font-medium">${trip.hotel.pricePerNight}{t.tripDetail.perNight}</p>
                      {trip.hotelTotalCost != null && (
                        <p className="text-xs text-muted-foreground">{t.tripDetail.totalHotel}: ${trip.hotelTotalCost}</p>
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
                    <span className="flex items-center gap-1">
                      <Navigation className="w-3.5 h-3.5" />
                      {trip.hotel.distanceFromCenter} {t.tripDetail.kmFromCenter}
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
                  <Plane className="w-4 h-4 mx-auto text-muted-foreground mb-1" />
                  <p className="text-lg font-bold">
                    €{trip.tripType === "one_way"
                      ? trip.transport.price
                      : trip.transport.price + (trip.returnTransport?.price ?? 0)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {trip.tripType === "one_way" ? `${t.tripDetail.flight} →` : `${t.tripDetail.flight} ↕`}
                  </p>
                </div>
                <div className="flex-1 bg-muted/40 rounded-xl p-3 text-center">
                  <Hotel className="w-4 h-4 mx-auto text-muted-foreground mb-1" />
                  <p className="text-lg font-bold">${trip.hotelTotalCost ?? trip.hotel.pricePerNight}</p>
                  <p className="text-xs text-muted-foreground">{t.tripDetail.totalHotel}</p>
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
