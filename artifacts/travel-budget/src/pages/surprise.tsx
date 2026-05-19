import { useState } from "react";
import { useGenerateSurpriseTrips, useSaveTrip, useGetPreferences } from "@workspace/api-client-react";
import type { TripSuggestion } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dice6, Lock, Unlock, Plane, TrainFront, Hotel, Star,
  Users, Moon, Wallet, MapPin, ArrowLeft, Sparkles, Check,
  ChevronRight, Loader2, RefreshCw, PawPrint, Coffee,
  XCircle, Car, Bath, Building, Wifi, Baby,
} from "lucide-react";
import { useAuth } from "@clerk/react";
import { useLocation } from "wouter";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";
import { type TripFilters } from "@/components/filter-panel";
import { LocationAutocomplete } from "@/components/location-autocomplete";

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

function getImgSrc(imageUrl: string) {
  const raw = imageUrl ?? "";
  const withSlash = raw.startsWith("/") ? raw : `/${raw}`;
  const fixed = withSlash.replace(/\.(jpg|jpeg)$/i, ".png");
  return `${basePath}${fixed}`;
}

function formatDate(iso: string) {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString(undefined, { day: "numeric", month: "short" });
  } catch { return ""; }
}

const MYSTERY_GRADIENTS = [
  "from-violet-500 via-purple-600 to-indigo-700",
  "from-orange-500 via-rose-500 to-pink-600",
  "from-teal-500 via-cyan-600 to-blue-700",
];

const MYSTERY_EMOJIS = ["🏝️", "🏔️", "🌆"];

interface SurpriseFilters {
  budget: number;
  numberOfPeople: number;
  numberOfChildren: number;
  numberOfPets: number;
  numberOfNights: number;
  departureAirport: string;
  departureStation: string;
  departureDate: string;
  returnDate: string;
  tripType: "one_way" | "round_trip";
  flightPreference: TripFilters["flightPreference"];
  trainPreference: TripFilters["trainPreference"];
  accommodationType: TripFilters["accommodationType"];
  hotelStarsMin: number | null;
  hotelStarsMax: number | null;
  minHotelRating: number | null;
  freeCancellation: boolean;
  breakfastIncluded: boolean;
  parkingAvailable: boolean;
  privateBathroom: boolean;
  elevator: boolean;
  petFriendly: boolean;
  onlinePayment: boolean;
}

const DEFAULT_SURPRISE_FILTERS: SurpriseFilters = {
  budget: 0,
  numberOfPeople: 2,
  numberOfChildren: 0,
  numberOfPets: 0,
  numberOfNights: 7,
  departureAirport: "",
  departureStation: "",
  departureDate: "",
  returnDate: "",
  tripType: "round_trip",
  flightPreference: "any",
  trainPreference: "any",
  accommodationType: null,
  hotelStarsMin: null,
  hotelStarsMax: null,
  minHotelRating: null,
  freeCancellation: false,
  breakfastIncluded: false,
  parkingAvailable: false,
  privateBathroom: false,
  elevator: false,
  petFriendly: false,
  onlinePayment: false,
};

function StarRow({ stars }: { stars: number }) {
  return (
    <span className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-3 h-3 ${i < stars ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"}`}
        />
      ))}
    </span>
  );
}

function CounterBtn({
  value, min, max, onChange,
}: { value: number; min: number; max: number; onChange: (v: number) => void }) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className="w-7 h-7 rounded-full border flex items-center justify-center text-sm disabled:opacity-30 hover:bg-muted transition-colors"
      >−</button>
      <span className="w-6 text-center font-semibold text-sm">{value}</span>
      <button
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className="w-7 h-7 rounded-full border flex items-center justify-center text-sm disabled:opacity-30 hover:bg-muted transition-colors"
      >+</button>
    </div>
  );
}

function AmenityToggle({
  active, label, icon, onClick,
}: { active: boolean; label: string; icon: React.ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium border transition-all ${
        active
          ? "bg-primary text-primary-foreground border-primary"
          : "bg-background text-muted-foreground border-border hover:border-primary/50"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

export default function SurprisePage() {
  const { t } = useI18n();
  const [, setLocation] = useLocation();
  const { isSignedIn } = useAuth();
  const { data: prefs } = useGetPreferences({ query: { enabled: !!isSignedIn, queryKey: ["preferences"] } });

  const [filters, setFilters] = useState<SurpriseFilters>(DEFAULT_SURPRISE_FILTERS);
  const [transportMode, setTransportMode] = useState<"flight" | "train">("flight");
  const [trips, setTrips] = useState<TripSuggestion[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const [paying, setPaying] = useState<Record<string, boolean>>({});

  const generateSurprise = useGenerateSurpriseTrips();
  const saveTrip = useSaveTrip();

  const effectiveDep = filters.departureAirport || filters.departureStation || prefs?.defaultDepartureLocation || "Any";

  function toggle<K extends keyof SurpriseFilters>(key: K) {
    setFilters((f) => ({ ...f, [key]: !f[key] }));
  }

  function handleGenerate() {
    const depDate = filters.departureDate || new Date().toISOString();
    const retDate = filters.tripType === "one_way"
      ? null
      : (filters.returnDate || new Date(Date.now() + filters.numberOfNights * 86400000).toISOString());
    const hotelAmenities = [
      ...(filters.freeCancellation ? ["free_cancellation"] : []),
      ...(filters.breakfastIncluded ? ["breakfast"] : []),
      ...(filters.parkingAvailable ? ["parking"] : []),
      ...(filters.privateBathroom ? ["private_bathroom"] : []),
      ...(filters.elevator ? ["elevator"] : []),
      ...(filters.petFriendly ? ["pet_friendly"] : []),
      ...(filters.onlinePayment ? ["online_payment"] : []),
    ];
    generateSurprise.mutate(
      {
        data: {
          budget: filters.budget,
          numberOfPeople: filters.numberOfPeople,
          numberOfChildren: filters.numberOfChildren,
          hasChildren: filters.numberOfChildren > 0,
          hasPets: filters.numberOfPets > 0 || filters.petFriendly,
          numberOfNights: filters.numberOfNights,
          departureLocation: effectiveDep,
          departureDate: depDate,
          returnDate: retDate ?? null,
          tripType: filters.tripType,
          flightPreference: filters.flightPreference,
          trainPreference: filters.trainPreference,
          accommodationType: filters.accommodationType,
          hotelStarsMin: filters.hotelStarsMin,
          hotelStarsMax: filters.hotelStarsMax,
          minHotelRating: filters.minHotelRating,
          hotelAmenities,
        },
      },
      {
        onSuccess: (data) => {
          setTrips(data);
          setRevealed({});
          setHasSearched(true);
        },
      }
    );
  }

  function handleReveal(tripId: string) {
    if (paying[tripId] || revealed[tripId]) return;
    setPaying((p) => ({ ...p, [tripId]: true }));
    setTimeout(() => {
      setPaying((p) => ({ ...p, [tripId]: false }));
      setRevealed((r) => ({ ...r, [tripId]: true }));
      toast.success(t.surprise.revealed);
    }, 1600);
  }

  function handleSave(trip: TripSuggestion) {
    if (!isSignedIn) {
      setLocation("/sign-up");
      return;
    }
    saveTrip.mutate(
      { data: { tripData: trip, destination: trip.destination, totalPrice: trip.totalPrice, imageUrl: trip.imageUrl } },
      { onSuccess: () => toast.success(t.surprise.saveRevealed) }
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-orange-500 text-white px-4 pt-4 pb-6">
        <div className="flex items-center gap-3 mb-3">
          <button onClick={() => setLocation("/discover")} className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2">
            <Dice6 className="w-6 h-6" />
            <h1 className="text-xl font-bold">{t.surprise.title}</h1>
          </div>
        </div>
        <p className="text-sm text-white/80 ml-11">{t.surprise.subtitle}</p>
      </div>

      <div className="flex-1 overflow-y-auto pb-6">

        {/* How it works banner */}
        <div className="mx-4 mt-3 bg-gradient-to-br from-violet-500/10 to-orange-400/10 border border-violet-400/20 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-bold text-foreground">{t.surprise.howItWorksTitle}</p>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
              {t.surprise.howItWorksBadge}
            </span>
          </div>
          <ol className="flex flex-col gap-2">
            {[t.surprise.howItWorks1, t.surprise.howItWorks2, t.surprise.howItWorks3].map((step, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Filter card */}
        <div className="mx-4 mt-3 bg-card rounded-2xl shadow-lg border p-4 flex flex-col gap-3">

          {/* Budget */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Wallet className="w-4 h-4 text-primary" />
              <span>{t.surprise.budgetLabel}</span>
              <span className="text-xs text-muted-foreground ml-auto">{t.surprise.budgetIncludesCompact}</span>
            </div>
            <div className="flex items-center gap-3 border-2 border-border rounded-xl px-4 py-2.5 bg-background focus-within:border-primary transition-colors">
              <span className="text-lg font-bold text-muted-foreground select-none">€</span>
              <input
                type="number"
                min={0}
                max={20000}
                value={filters.budget || ""}
                onChange={(e) => {
                  const v = Math.max(0, Math.min(20000, parseInt(e.target.value, 10) || 0));
                  setFilters(f => ({ ...f, budget: v }));
                }}
                className="flex-1 text-xl font-black bg-transparent focus:outline-none text-foreground min-w-0"
                placeholder="0"
              />
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {[500, 1000, 2000, 5000, 10000].map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setFilters(f => ({ ...f, budget: v }))}
                  className={`px-2.5 py-1 rounded-full text-xs font-semibold border transition-colors ${
                    filters.budget === v
                      ? "bg-primary text-white border-primary"
                      : "bg-background text-muted-foreground border-border hover:border-primary/50"
                  }`}
                >
                  €{v}
                </button>
              ))}
            </div>
          </div>

          {/* People + Nights */}
          <div className="flex gap-4">
            <div className="flex-1 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-sm font-medium">
                <Users className="w-4 h-4 text-primary" />
                <span>{t.surprise.peopleLabel}</span>
              </div>
              <CounterBtn value={filters.numberOfPeople} min={1} max={12} onChange={(v) => setFilters(f => ({ ...f, numberOfPeople: v }))} />
            </div>
            <div className="w-px bg-border" />
            <div className="flex-1 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-sm font-medium">
                <Moon className="w-4 h-4 text-primary" />
                <span>{t.surprise.nightsLabel}</span>
              </div>
              <CounterBtn value={filters.numberOfNights} min={1} max={30} onChange={(v) => setFilters(f => ({ ...f, numberOfNights: v }))} />
            </div>
          </div>

          {/* Children + Pets */}
          <div className="flex gap-4">
            <div className="flex-1 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-sm font-medium">
                <Baby className="w-4 h-4 text-primary" />
                <span>{t.surprise.childrenLabel}</span>
              </div>
              <CounterBtn value={filters.numberOfChildren} min={0} max={8} onChange={(v) => setFilters(f => ({ ...f, numberOfChildren: v }))} />
            </div>
            <div className="w-px bg-border" />
            <div className="flex-1 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-sm font-medium">
                <PawPrint className="w-4 h-4 text-primary" />
                <span>{t.surprise.petsLabel}</span>
              </div>
              <CounterBtn value={filters.numberOfPets} min={0} max={4} onChange={(v) => setFilters(f => ({ ...f, numberOfPets: v, petFriendly: v > 0 ? true : f.petFriendly }))} />
            </div>
          </div>

          {/* Departure - transport toggle + single field */}
          <div className="space-y-2">
            <p className="text-sm font-medium">{t.surprise.departureLabel}</p>
            <div className="flex rounded-xl border border-border overflow-hidden">
              <button
                type="button"
                onClick={() => {
                  setTransportMode("flight");
                  setFilters(f => ({ ...f, departureStation: "" }));
                }}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold transition-colors ${
                  transportMode === "flight" ? "bg-primary text-white" : "bg-muted/40 text-muted-foreground hover:bg-muted"
                }`}
              >
                <Plane className="w-3.5 h-3.5" /> ✈️ {t.surprise.byFlight}
              </button>
              <div className="w-px bg-border" />
              <button
                type="button"
                onClick={() => {
                  setTransportMode("train");
                  setFilters(f => ({ ...f, departureAirport: "" }));
                }}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold transition-colors ${
                  transportMode === "train" ? "bg-primary text-white" : "bg-muted/40 text-muted-foreground hover:bg-muted"
                }`}
              >
                <TrainFront className="w-3.5 h-3.5" /> 🚆 {t.surprise.byTrain}
              </button>
            </div>
            <LocationAutocomplete
              value={transportMode === "flight" ? filters.departureAirport : filters.departureStation}
              onChange={(v) => setFilters(f => ({
                ...f,
                departureAirport: transportMode === "flight" ? v : "",
                departureStation: transportMode === "train" ? v : "",
              }))}
              placeholder={transportMode === "flight"
                ? (prefs?.defaultDepartureLocation || "Roma FCO, Milano MXP…")
                : "Roma Termini, Milano Centrale…"}
              filter={transportMode === "flight" ? "airport" : "station"}
            />
          </div>

          {/* Trip type toggle */}
          <div className="flex gap-2">
            {(["one_way", "round_trip"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setFilters(f => ({ ...f, tripType: v, ...(v === "one_way" ? { returnDate: "" } : {}) }))}
                className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  filters.tripType === v
                    ? "bg-primary text-white shadow-md shadow-primary/30"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {v === "round_trip" ? `🔄 ${t.filters.roundTrip}` : `✈️ ${t.filters.oneWay}`}
              </button>
            ))}
          </div>

          {/* Dates */}
          <div className={`grid gap-2 ${filters.tripType === "one_way" ? "grid-cols-1" : "grid-cols-2"}`}>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">{t.filters.departureDate} ✈️</label>
              <input
                type="date"
                value={filters.departureDate ? filters.departureDate.split("T")[0] : ""}
                onChange={(e) => {
                  const d = e.target.value ? new Date(e.target.value).toISOString() : "";
                  setFilters(f => ({ ...f, departureDate: d }));
                }}
                className="w-full h-9 rounded-lg border border-input bg-background px-3 text-sm"
              />
            </div>
            {filters.tripType !== "one_way" && (
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">{t.filters.returnDate} 🏠</label>
                <input
                  type="date"
                  value={filters.returnDate ? filters.returnDate.split("T")[0] : ""}
                  min={filters.departureDate ? filters.departureDate.split("T")[0] : undefined}
                  onChange={(e) => {
                    const d = e.target.value ? new Date(e.target.value).toISOString() : "";
                    setFilters(f => ({ ...f, returnDate: d }));
                  }}
                  className="w-full h-9 rounded-lg border border-input bg-background px-3 text-sm"
                />
              </div>
            )}
          </div>

          {/* Hotel amenities */}
          <div>
            <p className="text-sm font-medium mb-2 flex items-center gap-1.5">
              <Building className="w-4 h-4 text-primary" />
              {t.surprise.amenitiesLabel}
            </p>
            <div className="flex flex-wrap gap-2">
              <AmenityToggle active={filters.petFriendly} label={t.surprise.petFriendly} icon={<PawPrint className="w-3 h-3" />} onClick={() => toggle("petFriendly")} />
              <AmenityToggle active={filters.elevator} label={t.surprise.elevator} icon={<Building className="w-3 h-3" />} onClick={() => toggle("elevator")} />
              <AmenityToggle active={filters.breakfastIncluded} label={t.surprise.breakfastIncluded} icon={<Coffee className="w-3 h-3" />} onClick={() => toggle("breakfastIncluded")} />
              <AmenityToggle active={filters.freeCancellation} label={t.surprise.freeCancellation} icon={<XCircle className="w-3 h-3" />} onClick={() => toggle("freeCancellation")} />
              <AmenityToggle active={filters.parkingAvailable} label={t.surprise.parkingAvailable} icon={<Car className="w-3 h-3" />} onClick={() => toggle("parkingAvailable")} />
              <AmenityToggle active={filters.privateBathroom} label={t.surprise.privateBathroom} icon={<Bath className="w-3 h-3" />} onClick={() => toggle("privateBathroom")} />
              <AmenityToggle active={filters.onlinePayment} label={t.surprise.onlinePayment} icon={<Wifi className="w-3 h-3" />} onClick={() => toggle("onlinePayment")} />
            </div>
          </div>

          {/* Generate button */}
          <Button
            onClick={handleGenerate}
            disabled={generateSurprise.isPending}
            className="w-full gap-2 bg-gradient-to-r from-primary to-orange-500 hover:opacity-90 text-white font-semibold"
            size="lg"
          >
            {generateSurprise.isPending ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                {t.surprise.loading}
              </>
            ) : hasSearched ? (
              <>
                <RefreshCw className="w-5 h-5" />
                {t.surprise.regenerate}
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                {t.surprise.generate}
              </>
            )}
          </Button>
        </div>

        {/* Loading state */}
        {generateSurprise.isPending && (
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-center px-8">
            <div className="text-5xl animate-bounce">🎲</div>
            <p className="font-medium text-muted-foreground">{t.surprise.loading}</p>
          </div>
        )}

        {/* No results */}
        {hasSearched && !generateSurprise.isPending && trips.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-center px-8">
            <div className="text-5xl">😔</div>
            <p className="font-medium text-muted-foreground">{t.surprise.noResults}</p>
          </div>
        )}

        {/* Mystery cards */}
        {!generateSurprise.isPending && trips.length > 0 && (
          <div className="flex flex-col gap-4 mt-4 px-4">
            {trips.map((trip, idx) => {
              const isRevealed = revealed[trip.id];
              const isPaying = paying[trip.id];
              const gradient = MYSTERY_GRADIENTS[idx % MYSTERY_GRADIENTS.length];
              const emoji = MYSTERY_EMOJIS[idx % MYSTERY_EMOJIS.length];

              return (
                <div
                  key={trip.id}
                  className="bg-card border rounded-2xl overflow-hidden shadow-md transition-all duration-500"
                >
                  {/* Card image area */}
                  {isRevealed ? (
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={getImgSrc(trip.imageUrl)}
                        alt={trip.destination}
                        className="w-full h-full object-cover"
                        onError={(e) => { (e.target as HTMLImageElement).src = `${basePath}/images/placeholder.png`; }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                      <div className="absolute bottom-0 left-0 p-4">
                        <div className="flex items-center gap-1.5 mb-1">
                          <Badge className="bg-green-500 text-white text-xs gap-1"><Unlock className="w-3 h-3" />{t.surprise.revealed}</Badge>
                        </div>
                        <h2 className="text-2xl font-bold text-white">{trip.destination}</h2>
                        {trip.country && <p className="text-white/80 text-sm">{trip.country}</p>}
                      </div>
                    </div>
                  ) : (
                    <div className={`relative h-48 bg-gradient-to-br ${gradient} flex flex-col items-center justify-center`}>
                      <div className="text-6xl mb-2 opacity-40">{emoji}</div>
                      <div className="flex items-center gap-2 text-white">
                        <Lock className="w-5 h-5" />
                        <span className="text-2xl font-bold tracking-widest">???</span>
                      </div>
                      <p className="text-white/70 text-xs mt-2">{t.surprise.destinationHidden}</p>
                      <div className="absolute top-3 right-3">
                        <Badge className="bg-white/20 text-white border-white/30">{t.surprise.cardLabel}{idx + 1}</Badge>
                      </div>
                    </div>
                  )}

                  {/* Card body */}
                  <div className="p-4 flex flex-col gap-3">
                    {/* Price + budget badge */}
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-2xl font-bold text-primary">€{trip.totalPrice.toLocaleString()}</span>
                        <span className="text-sm text-muted-foreground ml-1">/ {filters.numberOfPeople} {t.surprise.peopleLabel.toLowerCase()}</span>
                      </div>
                      <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800 text-xs">
                        {t.surprise.budgetExceeded}
                      </Badge>
                    </div>

                    {/* Transport info (always visible) */}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/40 rounded-lg p-2.5">
                      {trip.transport.type === "flight" ? (
                        <Plane className="w-4 h-4 text-primary shrink-0" />
                      ) : (
                        <TrainFront className="w-4 h-4 text-primary shrink-0" />
                      )}
                      <span className="capitalize">{trip.transport.type === "flight" ? "✈️" : "🚂"}</span>
                      {effectiveDep && effectiveDep !== "Any" && (
                        <>
                          <span>·</span>
                          <MapPin className="w-3 h-3 shrink-0" />
                          <span className="truncate">{effectiveDep}</span>
                        </>
                      )}
                      <span>·</span>
                      <span>{trip.transport.isDirect ? t.surprise.direct : t.surprise.withStop}</span>
                    </div>

                    {/* Hotel info */}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/40 rounded-lg p-2.5">
                      <Hotel className="w-4 h-4 text-primary shrink-0" />
                      {isRevealed ? (
                        <span className="truncate">{trip.hotel.name}</span>
                      ) : (
                        <span>{t.surprise.hotel}</span>
                      )}
                      <span className="ml-auto shrink-0">
                        <StarRow stars={trip.hotel.stars} />
                      </span>
                    </div>

                    {/* Nights */}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Moon className="w-4 h-4 text-primary" />
                      <span>{filters.numberOfNights} {t.tripDetail.nights}</span>
                      <span className="mx-1">·</span>
                      <span>€{Math.round(trip.pricePerPerson ?? trip.totalPrice / filters.numberOfPeople)}/{t.tripDetail.perPerson ?? "pers."}</span>
                    </div>

                    {/* Revealed highlights */}
                    {isRevealed && trip.highlights && trip.highlights.length > 0 && (
                      <div className="bg-muted/30 rounded-lg p-3">
                        <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">{t.tripDetail.highlights}</p>
                        <div className="flex flex-wrap gap-1.5">
                          {trip.highlights.slice(0, 4).map((h, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">{h}</Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* CTA button */}
                    {isRevealed ? (
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleSave(trip)}
                          className="flex-1 gap-2 bg-green-500 hover:bg-green-600 text-white"
                        >
                          <Check className="w-4 h-4" />
                          {t.surprise.saveRevealed}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => window.open(`https://www.booking.com/searchresults.html?ss=${encodeURIComponent(trip.destination)}`, "_blank")}
                          className="gap-1 text-xs"
                          size="sm"
                        >
                          <ChevronRight className="w-3 h-3" />
                          Booking
                        </Button>
                      </div>
                    ) : isPaying ? (
                      <Button disabled className="w-full gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        {t.surprise.paying}
                      </Button>
                    ) : (
                      <div className="flex flex-col gap-1">
                        <Button
                          onClick={() => handleReveal(trip.id)}
                          className="w-full gap-2 bg-gradient-to-r from-violet-500 to-orange-500 hover:opacity-90 text-white font-semibold"
                        >
                          <Dice6 className="w-4 h-4" />
                          {t.surprise.revealBtn}
                        </Button>
                        <p className="text-center text-[10px] text-muted-foreground/60">{t.surprise.disclaimer}</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pre-search state */}
        {!hasSearched && !generateSurprise.isPending && (
          <div className="flex flex-col items-center gap-4 py-10 px-8 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-primary to-orange-400 rounded-full flex items-center justify-center shadow-lg">
              <Dice6 className="w-10 h-10 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-lg mb-1">{t.surprise.button}</h2>
              <p className="text-sm text-muted-foreground">{t.surprise.buttonSub}</p>
            </div>
            <div className="flex flex-col gap-2 w-full max-w-xs">
              {[t.surprise.cardLabel + "1", t.surprise.cardLabel + "2", t.surprise.cardLabel + "3"].map((label, i) => (
                <div key={i} className={`h-14 rounded-xl bg-gradient-to-r ${MYSTERY_GRADIENTS[i]} flex items-center justify-center gap-3 text-white font-semibold opacity-80`}>
                  <Lock className="w-4 h-4" />
                  <span>{label} — ???</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
