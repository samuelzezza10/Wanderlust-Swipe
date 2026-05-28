import { useState, useRef, useCallback, useEffect, useMemo, useTransition } from "react";
import { useQuery } from "@tanstack/react-query";
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
  Share2, MessageCircle, Facebook, Copy, ExternalLink, Dice6,
  Crown, Zap, Sparkles, RefreshCw, Lightbulb, ChevronLeft, ChevronRight,
  LayoutList, Layers, Users, Euro, AlertCircle, Heart, User,
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

/** Extract a 3-letter IATA code from a filter string like "Roma (FCO)" or "Barcelona BCN" */
function extractIata(s: string): string | null {
  const m = s.match(/\b([A-Z]{3})\b/);
  return m?.[1] ?? null;
}

/* ─── Trip Variation Generator (fallback demo mode) ────────────────────── */
// Expands 1-N base trips into `targetCount` realistic deterministic variants.
function generateTripVariations(baseTrips: TripSuggestion[], targetCount: number): TripSuggestion[] {
  if (!baseTrips.length) return [];
  const result: TripSuggestion[] = [...baseTrips];

  const flightCos = ['Ryanair','easyJet','Vueling','Iberia','Air Europa','Volotea','Wizz Air','Jet2','Transavia','Norwegian'];
  const depTimes  = ['06:00','07:15','08:30','09:45','11:00','12:30','14:00','15:30','17:00','18:45','20:00','21:30','06:45','08:00','10:15','13:00','16:15','19:30'];
  const hotelSfx  = ['Grand','Boutique','Plaza','Palace','Suites','Central','Classic','Premium','Riviera','Prestige','Lux','Garden','View','Select','Elite'];
  const mults     = [0.82,0.88,0.93,0.97,1.00,1.03,1.07,1.12,1.17,1.22,0.85,0.91,0.96,1.01,1.06,1.10,1.15,1.20,0.87,0.94];

  while (result.length < targetCount) {
    const vi   = result.length;
    const base = baseTrips[vi % baseTrips.length];
    const mult = mults[vi % mults.length];
    const dep  = depTimes[vi % depTimes.length];

    const durStr = base.transport.duration || '2h 00m';
    const durH   = parseInt(durStr.split('h')[0]) || 2;
    const durM   = parseInt((durStr.split('h')[1] ?? '00').replace(/\D/g,'')) || 0;
    const [dH, dM] = dep.split(':').map(Number);
    const arrMins  = dH*60 + dM + durH*60 + durM;
    const arrTime  = `${String(Math.floor(arrMins/60)%24).padStart(2,'0')}:${String(arrMins%60).padStart(2,'0')}`;

    const isFlight = true;
    const company  = flightCos[vi % flightCos.length];
    const isDirect = (vi % 3) !== 1;
    const stopCities = isDirect ? [] : [["MXP","CDG","MAD","FCO","AMS"][vi % 5]];
    const starsDelta = vi % 3 === 0 ? 1 : vi % 3 === 1 ? -1 : 0;
    const stars      = Math.max(1, Math.min(5, base.hotel.stars + starsDelta));
    const rating     = Math.min(9.8, Math.max(6.5, parseFloat(((base.hotel.rating ?? 8.0) + (vi%5-2)*0.15).toFixed(1))));

    result.push({
      ...base,
      id: `${base.id}-v${vi}`,
      totalPrice: Math.round(base.totalPrice * mult / 10) * 10,
      transport: {
        ...base.transport,
        company,
        departureTime: dep,
        arrivalTime: arrTime,
        isDirect,
        stops: isDirect ? 0 : 1,
        stopCities: isDirect ? [] : stopCities,
        price: Math.round(base.transport.price * mult / 5) * 5,
      },
      hotel: {
        ...base.hotel,
        name: `${base.destination} ${hotelSfx[vi % hotelSfx.length]}`,
        stars,
        rating,
        pricePerNight: Math.round(base.hotel.pricePerNight * mult),
      },
    });
  }
  return result;
}

/* ─── Client-side filtering applied to any trip list ───────────────────── */
function applyClientSideFilters(trips: TripSuggestion[], f: TripFilters): TripSuggestion[] {
  let out = [...trips];

  // ── STEP 1: Destination is DOMINANT — apply first on the original list ──
  const arrLocation = (f.arrivalAirport || f.arrivalStation || "").toLowerCase().replace(/\s*\([^)]*\)/g, "").trim();
  if (arrLocation && arrLocation !== "any" && arrLocation.length > 2) {
    const matched = out.filter(t => {
      const dest = t.destination.toLowerCase();
      const country = (t.country ?? "").toLowerCase();
      // Bidirectional containment
      if (dest.includes(arrLocation) || arrLocation.includes(dest) ||
          country.includes(arrLocation) || arrLocation.includes(country)) return true;
      // Fuzzy prefix match — handles language variants: "barcellona" vs "barcelona"
      // (common prefix of at least 6 chars covers almost all real city name pairs:
      //  "barcel" == "barcel" ✓, "lisbon" == "lisbon" ✓)
      const prefixLen = Math.min(arrLocation.length, dest.length, 6);
      if (prefixLen >= 5 && arrLocation.slice(0, prefixLen) === dest.slice(0, prefixLen)) return true;
      return false;
    });
    if (matched.length > 0) {
      // Expand matched destination to 20 realistic variations
      out = generateTripVariations(matched, 20);
    }
    // If zero exact matches → keep ALL trips as alternatives (never empty)
  }

  // ── STEP 2: Budget is HARD with a 10% tolerance — exclude trips where
  // flight + hotel*nights (multiplied by travellers) exceeds budget × 1.10.
  // Anything within that ±10% band is acceptable; anything above is dropped.
  // Safety net at STEP 4 ensures we never render an empty deck even if every
  // trip is above the cap (rare).
  if (f.budget > 0) {
    const people = Math.max(1, f.numberOfPeople ?? 1);
    const cap = f.budget * BUDGET_TOLERANCE;
    const t2 = out.filter((t) => tripTotalForParty(t, people) <= cap);
    if (t2.length > 0) out = t2;
  }

  // Flight preference (soft)
  if (f.flightPreference === "direct") {
    const t2 = out.filter(t => t.transport.isDirect);
    if (t2.length > 0) out = t2;
  }

  // Hotel stars (soft)
  const starsMin = f.hotelStarsMin ?? 1;
  const starsMax = f.hotelStarsMax ?? 5;
  if (starsMin > 1 || starsMax < 5) {
    const t2 = out.filter(t => t.hotel.stars >= starsMin && t.hotel.stars <= starsMax);
    if (t2.length > 0) out = t2;
  }

  // Accommodation type (soft)
  if (f.accommodationType === "budget") {
    const t2 = out.filter(t => t.hotel.pricePerNight < 80);
    if (t2.length > 0) out = t2;
  } else if (f.accommodationType === "standard") {
    const t2 = out.filter(t => t.hotel.pricePerNight >= 80 && t.hotel.pricePerNight < 140);
    if (t2.length > 0) out = t2;
  } else if (f.accommodationType === "luxury") {
    const t2 = out.filter(t => t.hotel.stars >= 4 && t.hotel.pricePerNight >= 140);
    if (t2.length > 0) out = t2;
  }

  // Min hotel rating (soft)
  if (f.minHotelRating != null) {
    const t2 = out.filter(t => (t.hotel.rating ?? 0) >= (f.minHotelRating as number));
    if (t2.length > 0) out = t2;
  }

  // ── STEP 3: Sort ─────────────────────────────────────────────────────────
  if (f.sortBy === "cheapest") out.sort((a, b) => a.totalPrice - b.totalPrice);
  else if (f.sortBy === "best_rating") out.sort((a, b) => (b.hotel.rating ?? 0) - (a.hotel.rating ?? 0));

  // ── STEP 4: Safety net — never return empty ───────────────────────────────
  if (out.length === 0) out = [...trips];

  return out.slice(0, 20);
}

/* ─── Google Maps embed — separate component so it doesn't re-render the sheet ── */
function TripMapSection({ destination, country }: { destination: string; country?: string }) {
  const apiKey = (import.meta.env.VITE_GOOGLE_API_KEY as string | undefined) ?? "";
  const place = country ? `${destination}, ${country}` : destination;
  const query = encodeURIComponent(place);

  // Fallback to a public Google Maps search link when no key is configured —
  // never render a broken iframe that would just show a Google error page.
  if (!apiKey) {
    return (
      <section className="bg-muted/40 rounded-2xl p-4">
        <p className="font-bold text-base mb-2 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-primary" />
          {destination}
        </p>
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${query}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-primary font-semibold flex items-center gap-1.5 hover:underline"
        >
          Apri su Google Maps <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </section>
    );
  }

  return (
    <section className="rounded-2xl overflow-hidden border border-border/50">
      <div className="bg-muted/40 px-4 py-3 flex items-center gap-2">
        <MapPin className="w-4 h-4 text-primary" />
        <p className="font-bold text-sm">{place}</p>
      </div>
      <iframe
        title={`Mappa di ${destination}`}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        src={`https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${query}&zoom=11`}
        className="w-full h-56 border-0 block"
        allowFullScreen
      />
    </section>
  );
}

/* ── Strict budget enforcement: trip total must be ≤ budget (BUDGET_TOLERANCE = 1.00).
 * Any trip costing more than the user's budget is filtered out and marked red.
 * Savings are highlighted in green when the total is below budget.
 */
const BUDGET_TOLERANCE = 1.00; // strict: never exceed the budget by even €1

/* "Over budget" label per language — used in toasts/badges where we don't
 * want to thread a new key through every translation block.
 */
const EXCEEDS_BUDGET_LABEL: Record<string, string> = {
  it: "Sfora budget",
  en: "Over budget",
  es: "Excede presupuesto",
  fr: "Hors budget",
  de: "Über Budget",
  zh: "超出预算",
};
function exceedsBudgetLabel(lang: string): string {
  return EXCEEDS_BUDGET_LABEL[lang] ?? EXCEEDS_BUDGET_LABEL.en;
}

/* ─── Hotel photo via Google Places (server-proxied) ──────────────────────── */
function HotelPhoto({
  query, alt, className,
}: { query: string; alt: string; className?: string }) {
  const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");
  const [failed, setFailed] = useState(false);
  if (!query.trim() || failed) {
    return (
      <div className={`${className ?? ""} bg-muted flex items-center justify-center`}>
        <Hotel className="w-4 h-4 text-muted-foreground/60" />
      </div>
    );
  }
  return (
    <img
      src={`${basePath}/api/external/place-photo?query=${encodeURIComponent(query)}`}
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}

/* ─── Budget helpers — single source of truth for cost & over-budget state ── */
function tripTotalForParty(trip: TripSuggestion, numberOfPeople: number): number {
  // trip.totalPrice already represents per-person cost (flight + hotel share),
  // multiply by travellers for the party total the user actually pays.
  return Math.round((trip.totalPrice ?? 0) * Math.max(1, numberOfPeople));
}

function budgetState(spent: number, budget: number): {
  ratio: number;
  status: "ok" | "warning" | "over";
  barClass: string;
  textClass: string;
} {
  if (!budget || budget <= 0) {
    return { ratio: 0, status: "ok", barClass: "bg-emerald-500", textClass: "text-emerald-300" };
  }
  const ratio = spent / budget;
  if (ratio > 1) {
    return { ratio, status: "over", barClass: "bg-red-500", textClass: "text-red-300" };
  }
  if (ratio >= 0.85) {
    return { ratio, status: "warning", barClass: "bg-amber-400", textClass: "text-amber-300" };
  }
  return { ratio, status: "ok", barClass: "bg-emerald-500", textClass: "text-emerald-300" };
}

/* ─── Budget meter — slim progress bar with live spent/max counter ──────── */
function BudgetMeter({
  spent, budget, lang, variant = "dark",
}: {
  spent: number;
  budget: number;
  lang: string;
  variant?: "dark" | "light";
}) {
  if (!budget || budget <= 0) return null;
  const { ratio, status, barClass } = budgetState(spent, budget);
  const fillPct = Math.min(100, Math.max(2, Math.round(ratio * 100)));
  const trackBg = variant === "dark" ? "bg-white/15" : "bg-zinc-200";
  const labelClr = variant === "dark" ? "text-white/85" : "text-zinc-700";
  const subClr = variant === "dark" ? "text-white/55" : "text-zinc-500";

  return (
    <div className="w-full select-none pointer-events-none">
      <div className="flex items-baseline justify-between mb-1">
        <span className={`text-[10px] font-semibold tracking-wide ${labelClr}`}>
          {formatCurrency(spent, lang)}
          <span className={`mx-1 ${subClr}`}>/</span>
          <span className={subClr}>{formatCurrency(budget, lang)} max</span>
        </span>
        {status === "over" && (
          <span className="text-[9px] font-bold uppercase tracking-wider text-red-400">
            {exceedsBudgetLabel(lang)}
          </span>
        )}
      </div>
      <div className={`h-1.5 w-full rounded-full overflow-hidden ${trackBg}`}>
        <motion.div
          className={`h-full rounded-full ${barClass}`}
          initial={{ width: 0 }}
          animate={{ width: `${fillPct}%` }}
          transition={{ duration: 0.45, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

/* ─── Fallback trips shown when the API is unavailable ─────────────────── */
const FALLBACK_TRIPS: TripSuggestion[] = [
  {
    id: "fb-1", destination: "Roma", country: "Italia", totalPrice: 480, durationDays: 4,
    description: "La città eterna con Colosseo, Vaticano e cucina straordinaria.", tripType: "round_trip",
    highlights: ["Colosseo", "Vaticano", "Fontana di Trevi"], imageUrl: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600&q=80",
    transport: { type: "flight", company: "ITA Airways", price: 60, duration: "1h 25m", isDirect: true, departureTime: "09:00", arrivalTime: "10:25" },
    hotel: { name: "Hotel Campo de' Fiori", stars: 3, pricePerNight: 95, distanceFromCenter: 0.4, rating: 8.1, amenities: ["WiFi", "Colazione"] },
    returnTransport: { type: "flight", company: "ITA Airways", price: 55, duration: "1h 30m", isDirect: true },
  },
  {
    id: "fb-2", destination: "Parigi", country: "Francia", totalPrice: 890, durationDays: 5,
    description: "Torre Eiffel, musei mondiali e cucina d'autore nella Ville Lumière.", tripType: "round_trip",
    highlights: ["Torre Eiffel", "Louvre", "Montmartre"], imageUrl: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&q=80",
    transport: { type: "flight", company: "Air France", price: 220, duration: "2h 10m", isDirect: true, departureTime: "07:15", arrivalTime: "09:25" },
    hotel: { name: "Hotel Le Marais", stars: 4, pricePerNight: 134, originalPrice: 169, distanceFromCenter: 0.8, rating: 8.7, amenities: ["WiFi", "Colazione", "Bar"] },
    returnTransport: { type: "flight", company: "Air France", price: 195, duration: "2h 05m", isDirect: true },
  },
  {
    id: "fb-3", destination: "Barcellona", country: "Spagna", totalPrice: 750, durationDays: 5,
    description: "Gaudí, La Rambla e spiagge soleggiate nel cuore del Mediterraneo.", tripType: "round_trip",
    highlights: ["Sagrada Família", "Park Güell", "Barceloneta Beach"], imageUrl: "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=600&q=80",
    transport: { type: "flight", company: "Vueling", price: 145, duration: "2h 05m", isDirect: true, departureTime: "06:45", arrivalTime: "09:00" },
    hotel: { name: "Gothic Quarter Hotel", stars: 3, pricePerNight: 89, distanceFromCenter: 0.2, rating: 8.5, amenities: ["WiFi", "Rooftop bar"] },
    returnTransport: { type: "flight", company: "Vueling", price: 130, duration: "2h 10m", isDirect: true },
  },
  {
    id: "fb-4", destination: "Amsterdam", country: "Paesi Bassi", totalPrice: 720, durationDays: 5,
    description: "Canali, tulipani e musei di livello mondiale in questa città unica.", tripType: "round_trip",
    highlights: ["Rijksmuseum", "Casa di Anne Frank", "Canali"], imageUrl: "https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?w=600&q=80",
    transport: { type: "flight", company: "KLM", price: 180, duration: "2h 15m", isDirect: true, departureTime: "08:30", arrivalTime: "10:45" },
    hotel: { name: "Canal View Hotel", stars: 3, pricePerNight: 110, distanceFromCenter: 0.6, rating: 8.2, amenities: ["WiFi", "Vista canale", "Colazione"] },
    returnTransport: { type: "flight", company: "KLM", price: 165, duration: "2h 20m", isDirect: true },
  },
  {
    id: "fb-5", destination: "Lisbona", country: "Portogallo", totalPrice: 680, durationDays: 5,
    description: "Fado, azulejos e tramonto sull'Atlantico nella capitale europea più trendy.", tripType: "round_trip",
    highlights: ["Torre di Belém", "Tram 28", "Sintra"], imageUrl: "https://images.unsplash.com/photo-1548707309-dcebeab9ea9b?w=600&q=80",
    transport: { type: "flight", company: "TAP Air Portugal", price: 180, duration: "2h 30m", isDirect: true, departureTime: "08:00", arrivalTime: "10:30" },
    hotel: { name: "Bairro Alto Hotel", stars: 3, pricePerNight: 75, distanceFromCenter: 0.3, rating: 8.2, amenities: ["WiFi", "Colazione", "Terrazza"] },
    returnTransport: { type: "flight", company: "TAP Air Portugal", price: 165, duration: "2h 40m", isDirect: true },
  },
  {
    id: "fb-6", destination: "Berlino", country: "Germania", totalPrice: 580, durationDays: 4,
    description: "Storia, arte e cultura underground nella capitale europea più cool.", tripType: "round_trip",
    highlights: ["Muro di Berlino", "Reichstag", "Museum Island"], imageUrl: "https://images.unsplash.com/photo-1560969184-10fe8719e047?w=600&q=80",
    transport: { type: "flight", company: "easyJet", price: 120, duration: "2h 00m", isDirect: true, departureTime: "07:00", arrivalTime: "09:00" },
    hotel: { name: "Mitte Design Hotel", stars: 3, pricePerNight: 89, distanceFromCenter: 0.5, rating: 8.0, amenities: ["WiFi", "Bar", "Bici a noleggio"] },
    returnTransport: { type: "flight", company: "easyJet", price: 115, duration: "2h 05m", isDirect: true },
  },
  {
    id: "fb-7", destination: "Santorini", country: "Grecia", totalPrice: 1120, durationDays: 7,
    description: "Chiese con cupole blu e tramonti da leggenda nelle Cicladi greche.", tripType: "round_trip",
    highlights: ["Tramonto a Oia", "Tour della caldera", "Degustazione vini"], imageUrl: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600&q=80",
    transport: { type: "flight", company: "Aegean Airlines", price: 310, duration: "2h 50m", isDirect: false, departureTime: "09:00", arrivalTime: "13:45", stops: 1, stopCities: ["ATH"] },
    hotel: { name: "Oia Sunset Villas", stars: 4, pricePerNight: 98, originalPrice: 128, distanceFromCenter: 1.5, rating: 9.1, amenities: ["WiFi", "Piscina", "Vista caldera"] },
    returnTransport: { type: "flight", company: "Aegean Airlines", price: 295, duration: "2h 45m", isDirect: false, stops: 1, stopCities: ["ATH"] },
  },
  {
    id: "fb-8", destination: "Praga", country: "Repubblica Ceca", totalPrice: 560, durationDays: 4,
    description: "Cento campanili, ponti medievali e birra leggendaria nella città delle fate.", tripType: "round_trip",
    highlights: ["Ponte Carlo", "Castello di Praga", "Città Vecchia"], imageUrl: "https://images.unsplash.com/photo-1595867818082-083862f3d630?w=600&q=80",
    transport: { type: "flight", company: "Ryanair", price: 95, duration: "1h 50m", isDirect: true, departureTime: "07:00", arrivalTime: "08:50" },
    hotel: { name: "Malá Strana Boutique", stars: 3, pricePerNight: 72, distanceFromCenter: 0.7, rating: 8.0, amenities: ["WiFi", "Colazione", "Edificio storico"] },
    returnTransport: { type: "flight", company: "Ryanair", price: 85, duration: "1h 55m", isDirect: true },
  },
];

const PLACEHOLDER_IMG = "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&q=80";

function getImgSrc(imageUrl: string) {
  const raw = imageUrl ?? "";
  // External URL (Unsplash, CDN, etc.) — return as-is without prepending basePath
  if (raw.startsWith("http://") || raw.startsWith("https://")) return raw;
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
            <Plane className="w-8 h-8 text-white" />
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
        transition={{ delay: 0.6 }}
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

  const shareText = `✈️ ${trip.destination}, ${trip.country} — ${trip.durationDays} ${t.tripDetail.nights} ${formatCurrency(trip.totalPrice, lang)}/${t.tripDetail.person}! TravelBudget 🌍`;
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
            <img src={getImgSrc(trip.imageUrl)} alt={trip.destination} className="w-14 h-14 rounded-xl object-cover shrink-0" onError={(e) => { (e.currentTarget as HTMLImageElement).src = PLACEHOLDER_IMG; }} />
            <div className="min-w-0">
              <p className="font-bold text-sm">{trip.destination}</p>
              <p className="text-xs text-muted-foreground">{trip.country}</p>
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
          <Plane className="w-7 h-7 text-white" />
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
                        {entry.tripType === "one_way" ? `→ ${t.filters.oneWay}` : `⇌ ${t.filters.roundTrip}`}
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

const GUEST_SEARCH_LIMIT = 100;

/* ─── Main page ─────────────────────────────────────────────────────────── */
export default function Discover() {
  const { isSignedIn } = useAuth();
  const [, setLocation] = useLocation();
  const { t, lang } = useI18n();

  const [, startEnrichTransition] = useTransition();
  const [trips, setTrips] = useState<TripSuggestion[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [history, setHistory] = useState<number[]>([]);
  const [detailTrip, setDetailTrip] = useState<TripSuggestion | null>(null);
  const [shareTrip, setShareTrip] = useState<TripSuggestion | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState<TripFilters>(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(FILTERS_STORAGE_KEY) ?? "null") as TripFilters | null;
      if (!stored) return DEFAULT_FILTERS;
      // Upgrade stored budget=0 to the default (2000) so searches always work
      return stored.budget > 0 ? stored : { ...stored, budget: DEFAULT_FILTERS.budget };
    } catch {
      return DEFAULT_FILTERS;
    }
  });
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [guestCount, setGuestCount] = useState(() => {
    try {
      const today = new Date().toISOString().slice(0, 10);
      const stored = localStorage.getItem("guestSearchDate");
      if (stored !== today) {
        localStorage.setItem("guestSearchDate", today);
        localStorage.setItem("guestSearchCount", "0");
        return 0;
      }
      return parseInt(localStorage.getItem("guestSearchCount") ?? "0");
    } catch {
      return 0;
    }
  });
  const [viewMode, setViewMode] = useState<"swipe" | "list">("swipe");
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [loadMoreExhausted, setLoadMoreExhausted] = useState(false);
  const seenHotelNamesRef = useRef<Set<string>>(new Set());
  const autoSearchFiredRef = useRef(false);

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

  // ── Stores trips from BEFORE a new search starts so errors can restore them ──
  const prevTripsRef = useRef<TripSuggestion[]>([]);
  // ── Stores the destination of the previous search (to avoid restoring wrong-city trips) ──
  const prevSearchDestRef = useRef<string>("");

  // ── Debounce timer: prevents API spam from rapid filter applies ──────────
  const loadTripsTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
    // ── Debounce: cancel any previous pending load, fire after 600ms ────────
    // This prevents API spam when the user clicks Apply many times rapidly.
    if (loadTripsTimerRef.current) {
      clearTimeout(loadTripsTimerRef.current);
    }
    loadTripsTimerRef.current = setTimeout(() => {
      loadTripsTimerRef.current = null;
      _doLoadTrips(f);
    }, 600);
  }

  function _doLoadTrips(f: TripFilters) {
    // ── Destinazione obbligatoria ──────────────────────────────────
    const destValue = (f.arrivalAirport || f.arrivalStation || "").trim();
    if (!destValue || destValue.toLowerCase() === "any") {
      toast.error("Seleziona prima la destinazione ✈️", {
        description: "Indica dove vuoi andare per trovare voli e hotel reali.",
        action: { label: "Scegli", onClick: () => setFilterOpen(true) },
        duration: 5000,
      });
      setFilterOpen(true);
      return;
    }

    // ── Offline gate ───────────────────────────────────────────────
    if (!isOnline) {
      toast.error(t.offline.searchDisabled);
      return;
    }

    // ── Freemium gate ──────────────────────────────────────────────
    if (!isSignedIn) {
      const today = new Date().toISOString().slice(0, 10);
      let currentGuestCount = 0;
      try {
        if (localStorage.getItem("guestSearchDate") !== today) {
          localStorage.setItem("guestSearchDate", today);
          localStorage.setItem("guestSearchCount", "0");
          setGuestCount(0);
        }
        currentGuestCount = parseInt(localStorage.getItem("guestSearchCount") ?? "0");
      } catch { /* storage unavailable — allow search */ }
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
    // Save current trips before clearing so errors can restore them
    // (but only if they match the destination we're about to search, to avoid restoring wrong-city trips)
    prevTripsRef.current = trips;
    prevSearchDestRef.current = (f.arrivalAirport || f.arrivalStation || "").toLowerCase().replace(/\s*\([^)]*\)/g, "").trim();
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

          // ── Client-side post-filter: enforce budget & prefs on API results ──
          const clientFiltered = applyClientSideFilters(cleaned, f);
          const finalTrips = clientFiltered.length > 0 ? clientFiltered : cleaned;

          setTrips(finalTrips);
          setCurrentIndex(0);
          setHistory([]);
          setHasSearched(true);
          // Populate seen hotel names for cross-batch dedup
          cleaned.forEach(t => seenHotelNamesRef.current.add(t.hotel.name));

          // ── Unified Flight+Hotel package enrichment ────────────────────
          // Both data sources follow IDENTICAL flow:
          //   1. localStorage cache hit → update shared state → aggiornaCard() immediately
          //   2. Fresh API fetch → save cache → update shared state → aggiornaCard()
          // aggiornaCard() is the single function that builds each card as a
          // Flight+Hotel package, crossing both sources and filtering by budget.
          if (arrLocation !== "Any" && arrLocation.length > 2 && f.departureDate) {
            const checkinDate  = f.departureDate.slice(0, 10);
            const checkoutDate = f.returnDate
              ? f.returnDate.slice(0, 10)
              : (() => {
                  const d = new Date(checkinDate);
                  d.setDate(d.getDate() + (f.numberOfNights ?? 3));
                  return d.toISOString().slice(0, 10);
                })();
            const destName = arrLocation.replace(/\s*\([^)]*\)/g, "").trim();
            const adults   = String(f.numberOfPeople ?? 1);
            const nights   = f.numberOfNights ?? 3;
            const budget   = f.budget ?? 9999;

            // Shared mutable state — updated by whichever source arrives first
            const enrichState: {
              hotels:  BookingHotelResult[]  | null;
              flights: FlightEnrichResult[]  | null;
            } = { hotels: null, flights: null };

            /**
             * aggiornaCard — single source of truth for card population.
             * Combines real hotel + real flight data into one package per card.
             * Falls back to mock values for any source not yet loaded.
             * Drops packages that exceed budget (only when BOTH sources are real).
             */
            const aggiornaCard = (baseTrips: TripSuggestion[]): TripSuggestion[] => {
              const rl = enrichState.flights;
              const rh = enrichState.hotels;
              const bothReal = !!(rl && rh);
              const packages: TripSuggestion[] = [];

              baseTrips.forEach((trip, i) => {
                const rf = rl ? rl[i % rl.length] : null;
                const ho = rh ? rh[i % rh.length] : null;

                const flightPrice = rf ? Math.round(rf.price)    : trip.transport.price;
                const hotelPpN    = ho ? ho.pricePerNight         : trip.hotel.pricePerNight;
                const totalPrice  = Math.round(flightPrice + hotelPpN * nights);

                // Budget filter: only active when both real sources available.
                // Use the shared BUDGET_TOLERANCE so enrichment matches the
                // main filter+save policy (single source of truth).
                if (bothReal && totalPrice > budget * BUDGET_TOLERANCE) return;

                packages.push({
                  ...trip,
                  imageUrl:   ho?.photoUrl || trip.imageUrl,
                  totalPrice,
                  transport: rf ? {
                    ...trip.transport,
                    company:       rf.airline,
                    price:         flightPrice,
                    isDirect:      rf.isDirect,
                    departureTime: rf.departureTime,
                    arrivalTime:   rf.arrivalTime,
                    duration:      rf.duration,
                  } : trip.transport,
                  hotel: ho ? {
                    ...trip.hotel,
                    name:          ho.name,
                    pricePerNight: ho.pricePerNight,
                    rating:        ho.rating,
                    stars:         Math.min(5, Math.max(1, Math.round(ho.rating / 2))),
                  } : trip.hotel,
                });
              });

              // Safety: if budget filter removed everything, show best available subset
              return packages.length > 0 ? packages : baseTrips;
            };

            /** Applies aggiornaCard to current trips state via useTransition for smooth DOM patch */
            const applyPackages = () => {
              if (thisGen !== searchGenRef.current) return;
              startEnrichTransition(() => {
                setTrips(prev => prev.length ? aggiornaCard(prev) : prev);
              });
            };

            /**
             * enrichWith — fully generic, identical for hotels and flights.
             * Takes a cache key, URL, and a setter that updates enrichState.
             * After each data arrival (cache or fresh), calls applyPackages().
             */
            const enrichWith = async <T,>(
              cacheKey: string,
              url: string,
              onData: (data: T) => void,
            ): Promise<void> => {
              try {
                const cached = localStorage.getItem(cacheKey);
                if (cached) { onData(JSON.parse(cached) as T); applyPackages(); }
              } catch { /* ignore */ }
              try {
                const r = await fetch(url);
                if (!r.ok) return;
                const data = await r.json() as T;
                try { localStorage.setItem(cacheKey, JSON.stringify(data)); } catch { /* ignore */ }
                onData(data);
                applyPackages();
              } catch { /* silently ignore — mock data stays */ }
            };

            // ── URLs ──
            const hotelCacheKey = `bkg_h_${destName}_${checkinDate}_${checkoutDate}_${adults}`;
            const hotelUrl      = `${basePath}/api/external/hotels/by-destination?${new URLSearchParams({
              destination: destName, checkin: checkinDate, checkout: checkoutDate, adults, limit: "20",
            })}`;

            const depIata = extractIata(f.departureAirport ?? "");
            const arrIata = extractIata(f.arrivalAirport ?? "");
            const canEnrichFlights  = !!(depIata && arrIata);
            const flightCacheKey    = `bkg_f_${depIata}_${arrIata}_${checkinDate}_${checkoutDate}_${adults}`;
            const flightUrl         = canEnrichFlights
              ? `${basePath}/api/external/flights/by-route?${new URLSearchParams({
                  origin: depIata!, destination: arrIata!, departureDate: checkinDate,
                  ...(f.returnDate ? { returnDate: checkoutDate } : {}),
                  adults, limit: "10",
                })}`
              : "";

            // ── Fire hotel + flight fetches in parallel ──
            Promise.all([
              enrichWith<{ hotels: BookingHotelResult[] }>(
                hotelCacheKey, hotelUrl,
                (d) => { enrichState.hotels = d?.hotels?.length ? d.hotels : null; },
              ),
              ...(canEnrichFlights
                ? [enrichWith<{ flights: FlightEnrichResult[] }>(
                    flightCacheKey, flightUrl,
                    (d) => { enrichState.flights = d?.flights?.length ? d.flights : null; },
                  )]
                : []),
            ]).catch(() => { /* silently ignore */ });
          }
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
            try {
              const newCount = parseInt(localStorage.getItem("guestSearchCount") ?? "0") + 1;
              localStorage.setItem("guestSearchCount", String(newCount));
              setGuestCount(newCount);
            } catch { /* storage unavailable */ }
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

          // Helper: restore previous trips only if they are for the SAME destination
          // we just searched. If the user searched a new city and it failed, show
          // the pre-search prompt instead of the old (wrong) city's trips.
          const restoreTrips = () => {
            const prev = prevTripsRef.current;
            if (prev.length === 0) return;
            const currentSearchDest = prevSearchDestRef.current;
            const prevTripDest = (prev[0]?.destination ?? "").toLowerCase();
            if (currentSearchDest && prevTripDest) {
              const pLen = Math.min(currentSearchDest.length, prevTripDest.length, 6);
              const sameDest =
                (pLen >= 5 && currentSearchDest.slice(0, pLen) === prevTripDest.slice(0, pLen)) ||
                currentSearchDest.includes(prevTripDest) ||
                prevTripDest.includes(currentSearchDest);
              if (!sameDest) return; // different city → show pre-search state
            }
            setTrips(prev);
            setCurrentIndex(0);
            setHasSearched(true);
          };

          // Detect network errors (server down, CORS, AbortError) — they have no HTTP status
          const isNetworkError = !status && (err instanceof TypeError || (err as { name?: string })?.name === "AbortError" || (err as { name?: string })?.name === "TypeError");

          if (status === 403) {
            // Premium paywall — show modal, restore trips so deck isn't empty
            setShowPremiumModal(true);
            restoreTrips();
          } else if (status === 429) {
            // Rate limited — show non-destructive toast, restore trips
            toast.error(t.discover.rateLimitError, {
              description: t.discover.rateLimitHint,
              duration: 6000,
            });
            restoreTrips();
          } else if (isNetworkError) {
            // API unreachable (static hosting / server down) — silently show
            // curated fallback trips with no error toast so the app stays usable.
            setTrips(FALLBACK_TRIPS);
            setCurrentIndex(0);
            setHistory([]);
            setHasSearched(true);
          } else {
            // Any other error (4xx/5xx) — restore previous trips silently if
            // available, otherwise fall back to curated local data.
            const prev = prevTripsRef.current;
            if (prev.length > 0) {
              restoreTrips();
            } else {
              setTrips(FALLBACK_TRIPS);
              setCurrentIndex(0);
              setHistory([]);
              setHasSearched(true);
            }
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

  // Auto-search only when a destination is already set (e.g. coming back with saved filters)
  // If no destination is set, skip auto-search and show the prompt state instead
  useEffect(() => {
    const destValue = (filters.arrivalAirport || filters.arrivalStation || "").trim();
    const hasDestination = destValue && destValue.toLowerCase() !== "any";
    if (!showSplash && !hasSearched && isOnline && !autoSearchFiredRef.current && hasDestination) {
      autoSearchFiredRef.current = true;
      loadTrips(filters);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showSplash, isOnline]);

  const handleSwipe = (direction: "left" | "right") => {
    if (currentIndex >= trips.length) return;
    const trip = trips[currentIndex];
    if (direction === "right") {
      // Hard-block saving trips that bust the user's budget — with a clear
      // micro-feedback toast so the user understands why the swipe didn't stick.
      const partyTotal = tripTotalForParty(trip, filters.numberOfPeople ?? 1);
      const budgetCap = filters.budget * BUDGET_TOLERANCE;
      if (filters.budget > 0 && partyTotal > budgetCap) {
        toast.error(exceedsBudgetLabel(lang), {
          description: `${formatCurrency(partyTotal, lang)} / ${formatCurrency(filters.budget, lang)}`,
        });
        return; // do NOT advance the deck — let the user undo/skip explicitly
      }
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
      <div className="flex-1 flex flex-col bg-primary relative">
        {/* Filter button — always accessible even during loading */}
        <div className="absolute top-4 right-4 z-10 flex gap-2">
          <button
            onClick={() => setFilterOpen(true)}
            className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 active:scale-95 backdrop-blur-sm text-white text-xs font-semibold px-3 py-2 rounded-full transition-all border border-white/30"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            {t.filters.title}
          </button>
        </div>

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

  /* ── Pre-search (no filters applied yet) ── */
  if (!hasSearched) {
    const noDestination = !(filters.arrivalAirport || filters.arrivalStation || "").trim() ||
      (filters.arrivalAirport || filters.arrivalStation || "").trim().toLowerCase() === "any";

    return (
      <div className="flex-1 flex flex-col bg-primary">
        {UsageBadge}
        {!isOnline ? (
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
        ) : noDestination ? (
          /* ── No destination set: mandatory first step ── */
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center gap-6">
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              className="w-24 h-24 rounded-3xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-xl"
            >
              <MapPin className="w-12 h-12 text-white" />
            </motion.div>

            <div>
              <h2 className="text-2xl font-black text-white mb-2">Dove vuoi andare?</h2>
              <p className="text-white/80 text-sm max-w-xs mx-auto leading-relaxed">
                Scegli la destinazione per trovare <strong className="text-white">voli + hotel reali</strong> nel tuo budget.
              </p>
            </div>

            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={() => setFilterOpen(true)}
              className="flex items-center gap-3 bg-white text-primary font-bold text-base px-8 py-4 rounded-2xl shadow-[0_8px_24px_rgba(0,0,0,0.25)] hover:bg-white/95 transition-all"
            >
              <Plane className="w-5 h-5" />
              Scegli destinazione
              <ChevronRight className="w-5 h-5" />
            </motion.button>

            <div className="flex items-center gap-4 text-white/50 text-xs mt-2">
              <div className="flex items-center gap-1.5">
                <Plane className="w-3.5 h-3.5" />
                <span>Voli reali</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-white/30" />
              <div className="flex items-center gap-1.5">
                <Hotel className="w-3.5 h-3.5" />
                <span>Hotel reali</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-white/30" />
              <div className="flex items-center gap-1.5">
                <Euro className="w-3.5 h-3.5" />
                <span>Nel tuo budget</span>
              </div>
            </div>

            {(recentSearches ?? []).length > 0 && (
              <div className="w-full max-w-sm">
                <p className="text-white/60 text-xs font-medium mb-2 text-left">Ricerche recenti</p>
                <div className="flex flex-col gap-2">
                  {(recentSearches ?? []).slice(0, 3).map((entry, i) => (
                    <button
                      key={i}
                      onClick={() => handleRepeatSearch(entry)}
                      className="flex items-center gap-3 bg-white/10 hover:bg-white/20 rounded-xl px-4 py-2.5 text-left transition-colors"
                    >
                      <MapPin className="w-4 h-4 text-white/60 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-white text-sm font-medium truncate">{entry.arrivalLocation}</p>
                        {entry.departureDate && (
                          <p className="text-white/50 text-xs">{entry.departureDate.slice(0, 10)}</p>
                        )}
                      </div>
                      <ChevronRight className="w-4 h-4 text-white/40 ml-auto shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* ── Destination set, not searched yet ── */
          <>
            <SurpriseBanner onPress={() => setLocation("/surprise")} t={t} />
            <PreSearchState
              onOpenFilters={() => setFilterOpen(true)}
              t={t}
              recentSearches={recentSearches ?? []}
              onRepeat={handleRepeatSearch}
            />
          </>
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
    // Build smart suggestions based on current filters
    interface Suggestion { label: string; apply: () => void }
    const suggestions: Suggestion[] = [];
    {
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
                <RefreshCw className="w-4 h-4 mr-2" />{t.discover.generateMore}
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

  /* ── Recent searches → chips for FilterBar ── */
  const recentChips = (recentSearches ?? []).slice(0, 5).map((entry) => {
    const parts: string[] = [];
    if (entry.departureLocation) parts.push(entry.departureLocation.split(" (")[0]);
    if (entry.arrivalLocation && entry.arrivalLocation !== "Any")
      parts.push("→ " + entry.arrivalLocation.split(" (")[0]);
    else parts.push("→ Any");
    if (entry.numberOfNights) parts.push(`${entry.numberOfNights}n`);
    return {
      label: parts.join(" "),
      onClick: () => handleRepeatSearch(entry),
    };
  });

  /* ── Main swipe / list deck ── */
  return (
    <>
      {/* ════════════════════ TINDER-STYLE LAYOUT ════════════════════ */}
      <div className="flex-1 flex flex-col bg-[#f5f5f5] overflow-hidden">

        {/* ── Top bar — filter | logo | profile ── */}
        <div className="shrink-0 flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100 shadow-sm z-10">
          <button
            onClick={() => setFilterOpen(true)}
            className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 active:scale-90 transition-transform"
            aria-label={t.filters.title}
          >
            <SlidersHorizontal className="w-5 h-5" />
          </button>

          <span className="text-xl font-black tracking-tight text-primary select-none">
            TravelBudget ✈️
          </span>

          <button
            onClick={() => setLocation("/profile")}
            className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 active:scale-90 transition-transform"
            aria-label={t.nav.profile}
          >
            <User className="w-5 h-5" />
          </button>
        </div>

        {viewMode === "swipe" ? (
          /* ── SWIPE VIEW (Tinder layout) ── */
          <>
            {/* Card area — fills ALL remaining space */}
            <div className="flex-1 min-h-0 p-3 pb-2">
              <div className="relative w-full h-full">
                <AnimatePresence>
                  {(() => {
                    const bgt = filters.budget;
                    const ppl = Math.max(1, filters.numberOfPeople ?? 1);
                    const cap = bgt > 0 ? bgt * BUDGET_TOLERANCE : Infinity;
                    const vTrips = trips.filter(
                      (tr) => cap === Infinity || tripTotalForParty(tr, ppl) <= cap
                    );
                    return vTrips.slice(currentIndex, currentIndex + 3).reverse().map((trip, i) => {
                      const stack = vTrips.slice(currentIndex, currentIndex + 3);
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
                    });
                  })()}
                </AnimatePresence>

                {/* Loading overlay inside card area */}
                {isLoadingMore && (
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 pointer-events-none flex items-center gap-2 bg-black/55 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-full">
                    <RefreshCw className="w-3 h-3 animate-spin" />
                    <span>{t.discover.loadingMore}</span>
                  </div>
                )}
              </div>
            </div>

            {/* ── Tinder action bar ── */}
            <div className="shrink-0 bg-white border-t border-gray-100 shadow-[0_-4px_16px_rgba(0,0,0,0.07)] px-5 py-4 flex items-center justify-around">
              {/* ↩ Undo */}
              <button
                onClick={handleUndo}
                disabled={history.length === 0}
                className="w-12 h-12 rounded-full bg-white border-2 border-gray-200 shadow-sm flex items-center justify-center text-amber-400 disabled:opacity-30 disabled:cursor-not-allowed active:scale-90 transition-transform"
                title={t.onboarding.back}
              >
                <RotateCcw className="w-5 h-5" />
              </button>

              {/* ❌ NOPE */}
              <button
                onClick={() => handleSwipe("left")}
                className="w-[68px] h-[68px] rounded-full bg-white border-[3px] border-red-400 shadow-md flex items-center justify-center text-red-500 active:scale-90 transition-transform"
                title={t.discover.nope}
              >
                <X className="w-8 h-8 stroke-[2.5]" />
              </button>

              {/* ℹ️ INFO */}
              <button
                onClick={() => { const top = trips[currentIndex]; if (top) setDetailTrip(top); }}
                disabled={!trips[currentIndex]}
                className="w-12 h-12 rounded-full bg-white border-2 border-blue-300 shadow-sm flex items-center justify-center text-blue-500 disabled:opacity-40 disabled:cursor-not-allowed active:scale-90 transition-transform"
                title={t.discover.infoBtn}
              >
                <Info className="w-5 h-5" />
              </button>

              {/* ❤️ LIKE */}
              <button
                onClick={() => handleSwipe("right")}
                className="w-[68px] h-[68px] rounded-full bg-white border-[3px] border-green-400 shadow-md flex items-center justify-center text-green-500 active:scale-90 transition-transform"
                title={t.discover.like}
              >
                <Heart className="w-8 h-8" />
              </button>

              {/* ≡ LIST */}
              <button
                onClick={() => setViewMode("list")}
                className="w-12 h-12 rounded-full bg-white border-2 border-gray-200 shadow-sm flex items-center justify-center text-gray-400 active:scale-90 transition-transform"
                title={t.discover.viewList}
              >
                <LayoutList className="w-5 h-5" />
              </button>
            </div>
          </>
        ) : (
          /* ── LIST VIEW ── */
          <div className="flex-1 overflow-y-auto">
            {/* Sticky back bar */}
            <div className="sticky top-0 z-10 bg-white border-b border-gray-100 shadow-sm px-4 py-3 flex items-center gap-3">
              <button
                onClick={() => setViewMode("swipe")}
                className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 active:scale-90 transition-transform"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="font-semibold text-gray-800 text-sm">
                {trips.length}{isLoadingMore ? "+" : ""} {t.discover.nResults}
              </span>
            </div>

            <div className="px-3 pt-3 pb-24 space-y-2 max-w-lg mx-auto">
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
                    const partyTotal = tripTotalForParty(trip, filters.numberOfPeople ?? 1);
                    const cap = filters.budget * BUDGET_TOLERANCE;
                    if (filters.budget > 0 && partyTotal > cap) {
                      toast.error(exceedsBudgetLabel(lang), {
                        description: `${formatCurrency(partyTotal, lang)} / ${formatCurrency(filters.budget, lang)}`,
                      });
                      return;
                    }
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

              {/* Load more */}
              <div className="py-4 flex justify-center">
                {isLoadingMore ? (
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>{t.profile.loading}</span>
                  </div>
                ) : !loadMoreExhausted ? (
                  <button
                    onClick={() => loadMore(filters)}
                    disabled={generateTrips.isPending}
                    className="px-6 py-2.5 bg-primary/10 hover:bg-primary/20 text-primary text-sm font-semibold rounded-xl transition-colors flex items-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    {t.discover.generateMore}
                  </button>
                ) : (
                  <p className="text-gray-400 text-sm">{t.discover.seenAll}</p>
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
        departureDate={filters.departureDate ?? null}
        returnDate={filters.returnDate ?? null}
        numberOfNights={filters.numberOfNights ?? 3}
        departureAirport={filters.departureAirport}
        arrivalAirport={filters.arrivalAirport}
        onSave={() => {
          if (detailTrip) {
            const partyTotal = tripTotalForParty(detailTrip, filters.numberOfPeople ?? 1);
            const cap = filters.budget * BUDGET_TOLERANCE;
            if (filters.budget > 0 && partyTotal > cap) {
              toast.error(exceedsBudgetLabel(lang), {
                description: `${formatCurrency(partyTotal, lang)} / ${formatCurrency(filters.budget, lang)}`,
              });
              return;
            }
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
  const totalForAll = tripTotalForParty(trip, numberOfPeople);
  const isOverBudget = !!budget && budget > 0 && totalForAll > budget * BUDGET_TOLERANCE;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.25 }}
      className={`bg-white border rounded-2xl overflow-hidden shadow-sm ${
        isOverBudget ? "border-red-300" : "border-gray-100"
      }`}
    >
      <div className="flex gap-3 p-3">
        {/* Thumbnail */}
        <div className="relative shrink-0">
          <img
            src={getImgSrc(trip.imageUrl)}
            alt={trip.destination}
            className="w-24 h-24 rounded-xl object-cover"
            onError={(e) => { (e.currentTarget as HTMLImageElement).src = PLACEHOLDER_IMG; }}
          />
          <div className={`absolute bottom-1 left-1 rounded-lg px-1.5 py-0.5 ${
            isOverBudget ? "bg-red-500/95" : "bg-black/65"
          }`}>
            <span className="text-white text-[10px] font-bold">{formatCurrency(totalForAll, lang)}</span>
          </div>
          {isOverBudget && (
            <div className="absolute top-1 left-1 bg-red-500/95 rounded-md px-1 py-0.5 pointer-events-none">
              <AlertCircle className="w-3 h-3 text-white" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-1 mb-1">
              <div>
                <p className="text-gray-900 font-bold text-base leading-tight">{trip.destination}</p>
                <p className="text-gray-500 text-xs">{trip.country}</p>
              </div>
            </div>

            {/* Pills row */}
            <div className="flex flex-wrap gap-1 mb-1.5">
              <span className="flex items-center gap-0.5 bg-gray-100 text-gray-600 text-[11px] px-2 py-0.5 rounded-full">
                <Clock className="w-3 h-3" />{trip.transport.duration}
              </span>
              <span className="flex items-center gap-0.5 bg-gray-100 text-gray-600 text-[11px] px-2 py-0.5 rounded-full">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                {trip.hotel.rating != null ? trip.hotel.rating.toFixed(1) : "–"}
              </span>
              <span className="flex items-center gap-0.5 bg-gray-100 text-gray-600 text-[11px] px-2 py-0.5 rounded-full">
                <MapPin className="w-3 h-3" />{formatDistance(trip.hotel.distanceFromCenter, lang)}
              </span>
              {departureFrom && (
                <span className="flex items-center gap-0.5 bg-gray-100 text-gray-600 text-[11px] px-2 py-0.5 rounded-full">
                  <Plane className="w-3 h-3" />{departureFrom.split(" (")[0].split(" ")[0]}
                </span>
              )}
            </div>

            <p className="text-gray-400 text-[11px] truncate">{trip.hotel.name} · {trip.durationDays}n</p>

            {/* Budget meter for list view */}
            {!!budget && budget > 0 && (
              <div className="mt-1.5">
                <BudgetMeter spent={totalForAll} budget={budget} lang={lang} variant="light" />
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 mt-2">
            <button
              onClick={onInfo}
              className="flex-1 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
            >
              <Info className="w-3.5 h-3.5" /> {t.discover.infoBtn}
            </button>
            <button
              onClick={onSave}
              disabled={isOverBudget}
              title={isOverBudget ? exceedsBudgetLabel(lang) : undefined}
              className={`flex-1 h-8 rounded-xl text-white text-xs font-semibold flex items-center justify-center gap-1 transition-colors ${
                isOverBudget
                  ? "bg-red-400 cursor-not-allowed opacity-80"
                  : "bg-green-500 hover:bg-green-600"
              }`}
            >
              {isOverBudget ? (
                <><AlertCircle className="w-3.5 h-3.5" /> {exceedsBudgetLabel(lang)}</>
              ) : (
                <><Heart className="w-3.5 h-3.5" /> {t.tripDetail.saveTrip}</>
              )}
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
  // Total for ALL people — single source of truth shared with filter + swipe logic
  const totalForAll = tripTotalForParty(trip, numberOfPeople ?? 1);
  const isOverBudget = !!budget && budget > 0 && totalForAll > budget * BUDGET_TOLERANCE;
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
          onError={(e) => { (e.currentTarget as HTMLImageElement).src = PLACEHOLDER_IMG; }}
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

        {/* ── Minimal card info — clean bottom overlay, no clutter ── */}
        <div className="absolute bottom-0 left-0 right-0 text-white pointer-events-none">
          <div className="px-5 pb-5 pt-24 bg-gradient-to-t from-black/92 via-black/55 to-transparent">

            {/* Destination + total price */}
            <div className="flex items-end justify-between gap-2 mb-2.5">
              <div className="min-w-0 flex-1">
                <h2 className="text-3xl font-black leading-tight">{trip.destination}</h2>
                <p className="text-white/75 text-sm mt-0.5 font-medium">{trip.country}</p>
              </div>
              <div className="text-right shrink-0">
                <p className={`text-2xl font-black ${isOverBudget ? "text-red-300" : ""}`}>
                  {formatCurrency(totalForAll, lang)}
                </p>
                <p className="text-[10px] text-white/55 uppercase tracking-wide font-semibold">{totalLabel}</p>
              </div>
            </div>

            {/* Key chips: airline · direct/stops · nights · stars */}
            <div className="flex gap-1.5 flex-wrap mb-2.5">
              <div className="flex items-center gap-1 bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-semibold">
                <Plane className="w-3 h-3 shrink-0" />
                <span className="truncate max-w-[72px]">{trip.transport.company}</span>
              </div>
              <div className={`flex items-center gap-1 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-semibold ${trip.transport.isDirect ? "bg-green-500/80" : "bg-amber-500/80"}`}>
                {trip.transport.isDirect ? <Check className="w-3 h-3 shrink-0" /> : <span className="opacity-80">~</span>}
                <span>{trip.transport.isDirect ? t.tripDetail.direct : (trip.transport.stops ? `${trip.transport.stops} ${t.tripDetail.withStops}` : t.tripDetail.withStops)}</span>
              </div>
              <div className="flex items-center gap-1 bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-semibold">
                <Clock className="w-3 h-3 shrink-0" />{trip.durationDays}{t.tripDetail.nightsAbbr}
              </div>
              <div className="flex items-center gap-1 bg-amber-500/70 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-semibold">
                <Star className="w-3 h-3 fill-white shrink-0" />{trip.hotel.stars}★
              </div>
            </div>

            {/* Savings chip (prominent) or over-budget warning */}
            {isOverBudget ? (
              <div className="inline-flex items-center gap-1.5 bg-red-500/95 backdrop-blur-md px-3 py-1.5 rounded-full">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span className="text-[11px] font-bold uppercase tracking-wide">{exceedsBudgetLabel(lang)}</span>
              </div>
            ) : savingsMsg ? (
              <div className="inline-flex items-center gap-1.5 bg-green-500/90 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-lg shadow-green-900/30">
                <span className="text-[12px] font-bold">💚 {savingsMsg}</span>
              </div>
            ) : null}
          </div>
        </div>

        {/* Over-budget badge — top center, always visible even on non-top cards */}
        {isOverBudget && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
            <div className="flex items-center gap-1 bg-red-500/95 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-lg ring-1 ring-white/25">
              <AlertCircle className="w-3 h-3" />
              {exceedsBudgetLabel(lang)}
            </div>
          </div>
        )}
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
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <span className="font-semibold">{transport.company}</span>
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${transport.isDirect ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"}`}>
            {transport.isDirect ? t.tripDetail.direct : (transport.stops ? `${transport.stops} ${t.tripDetail.withStops}` : t.tripDetail.withStops)}
          </span>
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
          </div>
          <div className="text-center min-w-[56px]">
            <p className="text-xs text-muted-foreground">{t.tripDetail.arrival}</p>
            <p className="font-bold text-base">{transport.arrivalTime}</p>
          </div>
        </div>
        {/* Stop cities */}
        {!transport.isDirect && transport.stopCities && transport.stopCities.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-0.5">
            {transport.stopCities.map((city, i) => (
              <span key={i} className="text-xs bg-amber-50 border border-amber-200 text-amber-700 dark:bg-amber-900/20 dark:border-amber-700/40 dark:text-amber-300 rounded-full px-2.5 py-0.5 font-medium">
                Via {city}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Enrichment types (real API responses that patch mock cards) ─────────── */
interface BookingHotelResult {
  hotelId: number;
  name: string;
  rating: number;
  pricePerNight: number;
  currency: string;
  bookingUrl: string;
  address: string;
  photoUrl?: string;
}

interface FlightEnrichResult {
  price: number;
  currency: string;
  airline: string;
  isDirect: boolean;
  departureTime: string;
  arrivalTime: string;
  duration: string;
}

/* ─── Trip Detail Sheet ──────────────────────────────────────────────────── */


function TripDetailSheet({
  trip, onClose, isSignedIn, onSave, onShare, budget, numberOfPeople,
  departureDate, returnDate, numberOfNights, departureAirport, arrivalAirport,
}: {
  trip: TripSuggestion | null;
  onClose: () => void;
  isSignedIn: boolean;
  onSave: () => void;
  onShare: () => void;
  budget?: number;
  numberOfPeople?: number;
  departureDate?: string | null;
  returnDate?: string | null;
  numberOfNights?: number;
  departureAirport?: string;
  arrivalAirport?: string;
}) {
  const { t, lang } = useI18n();

  const checkin = departureDate
    ? departureDate.slice(0, 10)
    : new Date().toISOString().slice(0, 10);
  const checkout = returnDate
    ? returnDate.slice(0, 10)
    : (() => {
        const d = new Date(checkin);
        d.setDate(d.getDate() + (numberOfNights ?? trip?.durationDays ?? 3));
        return d.toISOString().slice(0, 10);
      })();

  return (
    <Sheet open={!!trip} onOpenChange={(open) => { if (!open) onClose(); }}>
      <SheetContent side="bottom" className="h-[90dvh] p-0 rounded-t-3xl overflow-hidden flex flex-col">
        {trip && (
          <>
            <div className="relative h-52 shrink-0">
              <img src={getImgSrc(trip.imageUrl)} alt={trip.destination} className="w-full h-full object-cover" onError={(e) => { (e.currentTarget as HTMLImageElement).src = PLACEHOLDER_IMG; }} />
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
                  {t.tripDetail.flight}
                  <span className="ml-auto text-xs font-normal text-muted-foreground">
                    {trip.tripType === "one_way" ? `→ ${t.filters.oneWay}` : `↕ ${t.filters.roundTrip}`}
                  </span>
                </h3>
                <TransportBlock
                  transport={trip.transport}
                  t={t}
                  lang={lang}
                />
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

              {/* Google Maps embed — uses VITE_GOOGLE_API_KEY (public Maps key, safe in client). */}
              <TripMapSection destination={trip.destination} country={trip.country} />

              {/* Booking links — real deep links with dates + IATA */}
              {(() => {
                const depIata = departureAirport ? extractIata(departureAirport) : null;
                const arrIata = arrivalAirport
                  ? extractIata(arrivalAirport)
                  : extractIata(trip.destination);
                const depDate = checkin.replace(/-/g, "");
                const retDate = checkout.replace(/-/g, "");

                const bookingUrl = [
                  `https://www.booking.com/searchresults.html`,
                  `?ss=${encodeURIComponent(trip.destination)}`,
                  `&checkin=${checkin}`,
                  `&checkout=${checkout}`,
                  `&group_adults=${numberOfPeople ?? 1}`,
                  `&no_rooms=1`,
                  `&aid=304142`,
                ].join("");

                const skyscannerUrl = depIata && arrIata
                  ? trip.tripType === "one_way"
                    ? `https://www.skyscanner.it/transport/flights/${depIata.toLowerCase()}/${arrIata.toLowerCase()}/${depDate}/`
                    : `https://www.skyscanner.it/transport/flights/${depIata.toLowerCase()}/${arrIata.toLowerCase()}/${depDate}/${retDate}/`
                  : `https://www.skyscanner.it/transport/flights-from/${depIata?.toLowerCase() ?? "it"}/?query=${encodeURIComponent(trip.destination)}`;

                return (
                  <section className="bg-muted/40 rounded-2xl p-4">
                    <p className="font-bold text-base mb-1">{t.tripDetail.bookTitle}</p>
                    <p className="text-xs text-muted-foreground mb-3">
                      {checkin} → {checkout} · {numberOfPeople ?? 1} {(numberOfPeople ?? 1) > 1 ? t.tripDetail.people : t.tripDetail.person}
                    </p>
                    <div className="flex flex-col gap-2">
                      <a
                        href={bookingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between gap-3 bg-[#003580] text-white rounded-xl px-4 py-3 font-semibold text-sm hover:bg-[#00245a] transition-colors active:scale-[0.98]"
                      >
                        <span className="flex items-center gap-2">
                          <Hotel className="w-4 h-4" />
                          {t.tripDetail.bookHotel}
                        </span>
                        <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                      </a>
                      <a
                        href={skyscannerUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between gap-3 bg-[#0770e3] text-white rounded-xl px-4 py-3 font-semibold text-sm hover:bg-[#0558b0] transition-colors active:scale-[0.98]"
                      >
                        <span className="flex items-center gap-2">
                          <Plane className="w-4 h-4" />
                          {t.tripDetail.bookFlight}
                          {depIata && arrIata && (
                            <span className="opacity-70 text-xs font-normal">
                              {depIata} → {arrIata}
                            </span>
                          )}
                        </span>
                        <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                      </a>
                    </div>
                  </section>
                );
              })()}

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
