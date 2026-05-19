import { useState, useRef, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  SlidersHorizontal, X, Minus, Plus, ChevronRight, Star,
  Check, Plane, TrainFront, Clock, RotateCcw,
} from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { LocationAutocomplete } from "@/components/location-autocomplete";

export interface RecentSearchChip {
  label: string;
  sublabel?: string;
  onClick: () => void;
}

export interface TripFilters {
  budget: number;
  numberOfPeople: number;
  numberOfChildren: number;
  numberOfPets: number;
  numberOfRooms: number;
  departureDate: string;
  returnDate: string;
  numberOfNights: number;
  flightPreference: "direct" | "with_stops" | "any";
  trainPreference: "direct" | "with_stops" | "any";
  maxDistanceFromAirportKm: number | null;
  maxHotelDistanceFromCenterKm: number | null;
  accommodationType: "budget" | "standard" | "luxury" | null;
  departureAirport: string;
  arrivalAirport: string;
  returnAirport: string;
  departureStation: string;
  arrivalStation: string;
  returnStation: string;
  hotelStarsMin: number;
  hotelStarsMax: number;
  // Hotel features
  freeCancellation: boolean;
  breakfastIncluded: boolean;
  parkingAvailable: boolean;
  minHotelRating: number | null;
  privateBathroom: boolean;
  propertyType: "hotel" | "apartment" | "hostel" | "any";
  onlinePayment: boolean;
  elevator: boolean;
  petFriendly: boolean;
  tripType: "one_way" | "round_trip";
  sortBy: "best_value" | "cheapest" | "best_rating";
  maxTravelTimeHours: number | null;
  departureTimeSlot: "morning" | "afternoon" | "evening" | "any";
}

export const DEFAULT_FILTERS: TripFilters = {
  budget: 0,
  numberOfPeople: 2,
  numberOfChildren: 0,
  numberOfPets: 0,
  numberOfRooms: 1,
  departureDate: "",
  returnDate: "",
  numberOfNights: 7,
  flightPreference: "any",
  trainPreference: "any",
  maxDistanceFromAirportKm: null,
  maxHotelDistanceFromCenterKm: null,
  accommodationType: null,
  departureAirport: "",
  arrivalAirport: "",
  returnAirport: "",
  departureStation: "",
  arrivalStation: "",
  returnStation: "",
  hotelStarsMin: 1,
  hotelStarsMax: 5,
  freeCancellation: false,
  breakfastIncluded: false,
  parkingAvailable: false,
  minHotelRating: null,
  privateBathroom: false,
  propertyType: "any",
  onlinePayment: false,
  elevator: false,
  petFriendly: false,
  tripType: "round_trip",
  sortBy: "cheapest",
  maxTravelTimeHours: null,
  departureTimeSlot: "any",
};

export function countActiveFilters(f: TripFilters): number {
  let n = 0;
  if (f.budget !== DEFAULT_FILTERS.budget) n++;
  if (f.numberOfPeople !== DEFAULT_FILTERS.numberOfPeople) n++;
  if (f.numberOfChildren > 0) n++;
  if (f.numberOfPets > 0) n++;
  if (f.numberOfRooms > 1) n++;
  if (f.departureDate) n++;
  if (f.returnDate) n++;
  if (f.numberOfNights !== DEFAULT_FILTERS.numberOfNights) n++;
  if (f.flightPreference !== "any") n++;
  if (f.trainPreference !== "any") n++;
  if (f.maxDistanceFromAirportKm !== null) n++;
  if (f.maxHotelDistanceFromCenterKm !== null) n++;
  if (f.accommodationType !== null) n++;
  if (f.departureAirport) n++;
  if (f.arrivalAirport) n++;
  if (f.returnAirport) n++;
  if (f.departureStation) n++;
  if (f.arrivalStation) n++;
  if (f.returnStation) n++;
  if (f.hotelStarsMin !== 1 || f.hotelStarsMax !== 5) n++;
  if (f.freeCancellation) n++;
  if (f.breakfastIncluded) n++;
  if (f.parkingAvailable) n++;
  if (f.minHotelRating !== null) n++;
  if (f.privateBathroom) n++;
  if (f.propertyType !== "any") n++;
  if (f.onlinePayment) n++;
  if (f.elevator) n++;
  if (f.petFriendly) n++;
  if (f.tripType === "one_way") n++;
  if (f.sortBy !== "best_value") n++;
  if (f.maxTravelTimeHours !== null) n++;
  if (f.departureTimeSlot !== "any") n++;
  return n;
}

function currencySymbolFor(lang: string): string {
  if (lang === "zh") return "¥";
  if (lang === "en") return "$";
  return "€";
}

/* ─── Elegant filter bar ────────────────────────────────────────────────── */
export function FilterBar({
  filters,
  onEdit,
  recentSearches,
}: {
  filters: TripFilters;
  onEdit: () => void;
  recentSearches?: RecentSearchChip[];
}) {
  const { t, lang } = useI18n();
  const currencySymbol = currencySymbolFor(lang);
  const activeCount = countActiveFilters(filters);
  const departure = filters.departureAirport || filters.departureStation || "";

  const chips: string[] = [];
  if (filters.tripType === "one_way") chips.push(t.filters.oneWay);
  if (filters.numberOfChildren > 0) chips.push(`${filters.numberOfChildren} ${t.filters.children.toLowerCase()}`);
  if (filters.numberOfPets > 0) chips.push(`${filters.numberOfPets} ${t.filters.pets.toLowerCase()}`);
  if (filters.numberOfRooms > 1) chips.push(`🛏 ${filters.numberOfRooms} stanze`);
  if (filters.flightPreference === "direct") chips.push(t.filters.directOnly);
  if (filters.flightPreference === "with_stops") chips.push(t.filters.withStops);
  if (filters.trainPreference === "direct") chips.push(`🚂 ${t.filters.trainDirect}`);
  if (filters.trainPreference === "with_stops") chips.push(`🚂 ${t.filters.trainWithChanges}`);
  if (filters.breakfastIncluded) chips.push(`🍳 ${t.filters.breakfastIncluded}`);
  if (filters.freeCancellation) chips.push(`✅ ${t.filters.freeCancellation}`);
  if (filters.parkingAvailable) chips.push(`🅿 ${t.filters.parkingAvailable}`);
  if (filters.petFriendly) chips.push(`🐾 ${t.filters.petFriendly}`);
  if (filters.minHotelRating !== null) chips.push(`⭐ ≥ ${filters.minHotelRating}/10`);
  if (filters.propertyType !== "any") chips.push(
    filters.propertyType === "hotel" ? t.filters.hotelOnly
      : filters.propertyType === "apartment" ? t.filters.apartmentOnly
      : t.filters.hostelOnly,
  );
  if (filters.sortBy !== "best_value") {
    const sl: Record<string, string> = { cheapest: t.filters.sortCheapest, best_rating: t.filters.sortBestRating };
    chips.push(`📊 ${sl[filters.sortBy] ?? filters.sortBy}`);
  }
  if (filters.departureTimeSlot !== "any") {
    const tl: Record<string, string> = { morning: t.filters.morning, afternoon: t.filters.afternoon, evening: t.filters.evening };
    chips.push(`🕐 ${tl[filters.departureTimeSlot] ?? filters.departureTimeSlot}`);
  }
  if (filters.maxTravelTimeHours !== null) chips.push(`⏱ ≤ ${filters.maxTravelTimeHours}h`);

  return (
    <div className="w-full px-4 pt-3 pb-2">
      <button
        onClick={onEdit}
        className="w-full flex items-center gap-3 bg-white rounded-2xl px-4 py-3 shadow-[0_2px_12px_rgba(30,75,204,0.12)] border border-border hover:shadow-[0_4px_18px_rgba(30,75,204,0.18)] active:scale-[0.98] transition-all"
      >
        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
          <SlidersHorizontal className="w-4 h-4 text-primary" />
        </div>
        <div className="flex-1 min-w-0 text-left">
          <p className="font-bold text-sm text-foreground leading-tight">{t.filters.title}</p>
          <p className="text-xs text-muted-foreground truncate mt-0.5">
            {departure
              ? `${departure.split(" (")[0]} · ${currencySymbol}${filters.budget.toLocaleString()} · ${filters.numberOfPeople}p · ${filters.numberOfNights}n`
              : `${currencySymbol}${filters.budget > 0 ? filters.budget.toLocaleString() : "—"} · ${filters.numberOfPeople}p · ${filters.numberOfNights}n`}
          </p>
        </div>
        {activeCount > 0 ? (
          <span className="shrink-0 bg-[hsl(25,90%,55%)] text-white rounded-full min-w-[22px] h-[22px] flex items-center justify-center text-xs font-bold px-1">
            {activeCount}
          </span>
        ) : (
          <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
        )}
      </button>

      {chips.length > 0 && (
        <div className="flex gap-1.5 overflow-x-auto scrollbar-hide mt-2 pb-0.5">
          {chips.map((chip, i) => (
            <Badge key={i} variant="secondary" className="shrink-0 text-xs px-2.5 py-1 font-medium whitespace-nowrap">
              {chip}
            </Badge>
          ))}
        </div>
      )}

      {recentSearches && recentSearches.length > 0 && (
        <div className="mt-2">
          <div className="flex items-center gap-1.5 mb-1.5 px-1">
            <Clock className="w-3 h-3 text-muted-foreground" />
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Ricerche recenti</span>
          </div>
          <div className="flex gap-1.5 overflow-x-auto scrollbar-hide pb-0.5">
            {recentSearches.map((s, i) => (
              <button
                key={i}
                onClick={s.onClick}
                className="shrink-0 flex items-center gap-1.5 bg-muted/60 hover:bg-muted border border-border rounded-full px-3 py-1.5 text-xs font-medium text-foreground transition-colors active:scale-95"
              >
                <RotateCcw className="w-3 h-3 text-muted-foreground" />
                <span className="max-w-[140px] truncate">{s.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Full filter sheet ─────────────────────────────────────────────────── */
export function FilterSheet({
  open,
  filters,
  onClose,
  onApply,
}: {
  open: boolean;
  filters: TripFilters;
  onClose: () => void;
  onApply: (f: TripFilters) => void;
}) {
  const { t, lang } = useI18n();
  const currencySymbol = currencySymbolFor(lang);
  const [draft, setDraft] = useState<TripFilters>(filters);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [tried, setTried] = useState(false);
  const [transportMode, setTransportMode] = useState<"flight" | "train">(() =>
    (filters.departureStation || filters.arrivalStation) ? "train" : "flight"
  );

  const contentRef = useRef<HTMLDivElement>(null);
  const departureRef = useRef<HTMLDivElement>(null);
  const arrivalRef = useRef<HTMLDivElement>(null);
  const datesRef = useRef<HTMLDivElement>(null);
  const budgetRef = useRef<HTMLDivElement>(null);

  const validate = (f: TripFilters, mode: "flight" | "train"): Record<string, string> => {
    const errs: Record<string, string> = {};
    const dep = mode === "flight" ? f.departureAirport : f.departureStation;
    const arr = mode === "flight" ? f.arrivalAirport : f.arrivalStation;

    if (!dep) errs["departure"] = t.filters.missingDeparture;
    if (!arr) errs["arrival"] = t.filters.missingArrival;
    if (!f.departureDate) errs["departureDate"] = t.filters.missingDepartureDate;
    if (f.tripType !== "one_way" && !f.returnDate) errs["returnDate"] = t.filters.missingReturnDate;

    if (f.departureDate && f.returnDate && f.returnDate < f.departureDate) {
      errs["returnDate"] = t.filters.returnBeforeDeparture;
    }
    if (dep && arr) {
      const depCity = dep.split(" (")[0].trim().toLowerCase();
      const arrCity = arr.split(" (")[0].trim().toLowerCase();
      if (depCity === arrCity) errs["arrival"] = t.filters.sameLocation;
    }
    if (f.budget == null || f.budget <= 0) errs["budget"] = t.filters.invalidBudget;

    return errs;
  };

  useEffect(() => {
    if (tried) setErrors(validate(draft, transportMode));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft, tried, transportMode]);

  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      setDraft(filters);
      setErrors({});
      setTried(false);
      setTransportMode((filters.departureStation || filters.arrivalStation) ? "train" : "flight");
    } else {
      onClose();
    }
  };

  const set = <K extends keyof TripFilters>(key: K, val: TripFilters[K]) =>
    setDraft((prev) => ({ ...prev, [key]: val }));

  const toggle = (key: keyof TripFilters) =>
    setDraft((prev) => ({ ...prev, [key]: !prev[key] }));

  const handleApply = () => {
    setTried(true);
    const errs = validate(draft, transportMode);
    setErrors(errs);

    if (Object.keys(errs).length > 0) {
      const firstRef =
        errs["departure"] ? departureRef :
        errs["arrival"] ? arrivalRef :
        errs["departureDate"] || errs["returnDate"] ? datesRef :
        errs["budget"] ? budgetRef : null;

      setTimeout(() => {
        firstRef?.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 80);
      return;
    }

    const finalDraft: TripFilters = transportMode === "flight"
      ? { ...draft, departureStation: "", arrivalStation: "", returnStation: "" }
      : { ...draft, departureAirport: "", arrivalAirport: "", returnAirport: "" };
    onApply(finalDraft);
    onClose();
  };

  const handleReset = () => { setDraft(DEFAULT_FILTERS); setErrors({}); setTried(false); };

  const hasErrors = Object.keys(errors).length > 0;

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent side="bottom" className="h-[100dvh] p-0 rounded-none overflow-hidden flex flex-col">
        <SheetHeader className="px-5 pt-5 pb-3 border-b flex-row items-center justify-between">
          <SheetTitle className="text-lg">{t.filters.title}</SheetTitle>
          <div className="flex gap-2 items-center">
            <button onClick={handleReset} className="text-xs text-muted-foreground underline underline-offset-2">
              {t.filters.reset}
            </button>
            <button onClick={onClose} className="w-7 h-7 rounded-full bg-muted flex items-center justify-center">
              <X className="w-4 h-4" />
            </button>
          </div>
        </SheetHeader>

        <div ref={contentRef} className="flex-1 overflow-y-auto px-5 py-4 space-y-6">

          {/* ── Tipo viaggio ─────────────────────────────────── */}
          <div className="space-y-3">
            <p className="text-sm font-semibold text-foreground">{t.filters.tripTypeLabel}</p>
            <div className="flex gap-2">
              <button
                onClick={() => setDraft((prev) => ({ ...prev, tripType: "round_trip" }))}
                className={`flex-1 flex flex-col items-center gap-1 py-3.5 rounded-xl text-sm font-bold transition-all border-2 ${
                  draft.tripType === "round_trip"
                    ? "bg-primary text-white border-primary shadow-md shadow-primary/30"
                    : "bg-background text-foreground border-border hover:border-primary/40"
                }`}
              >
                <span className="text-xl">🔄</span>
                <span>{t.filters.roundTrip}</span>
                <span className={`text-[10px] font-normal ${draft.tripType === "round_trip" ? "text-white/70" : "text-muted-foreground"}`}>Andata e ritorno</span>
              </button>
              <button
                onClick={() => setDraft((prev) => ({ ...prev, tripType: "one_way", returnDate: "", returnAirport: "", returnStation: "" }))}
                className={`flex-1 flex flex-col items-center gap-1 py-3.5 rounded-xl text-sm font-bold transition-all border-2 ${
                  draft.tripType === "one_way"
                    ? "bg-primary text-white border-primary shadow-md shadow-primary/30"
                    : "bg-background text-foreground border-border hover:border-primary/40"
                }`}
              >
                <span className="text-xl">✈️</span>
                <span>{t.filters.oneWay}</span>
                <span className={`text-[10px] font-normal ${draft.tripType === "one_way" ? "text-white/70" : "text-muted-foreground"}`}>Solo andata</span>
              </button>
            </div>
          </div>

          {/* ── Validation banner ───────────────────────────── */}
          {tried && hasErrors && (
            <div className="bg-red-50 border border-red-200 rounded-2xl px-4 py-3 flex gap-3 items-start">
              <span className="text-lg leading-none mt-0.5">⚠️</span>
              <div>
                <p className="text-sm font-semibold text-red-700">{t.filters.validationTitle}</p>
                <p className="text-xs text-red-600 mt-0.5">{t.filters.validationSubtitle}</p>
              </div>
            </div>
          )}

          {/* ── Ordina per ───────────────────────────────────── */}
          <FilterSection label={t.filters.sortBy}>
            <div className="grid grid-cols-3 gap-2">
              {([
                { value: "best_value", emoji: "🏆", label: t.filters.sortBestValue },
                { value: "cheapest", emoji: "💰", label: t.filters.sortCheapest },
                { value: "best_rating", emoji: "⭐", label: t.filters.sortBestRating },
              ] as const).map(({ value, emoji, label }) => (
                <button
                  key={value}
                  onClick={() => set("sortBy", value)}
                  className={`flex flex-col items-center gap-1 px-2 py-2.5 rounded-xl border text-[11px] font-semibold transition-colors ${
                    draft.sortBy === value
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-background text-foreground"
                  }`}
                >
                  <span className="text-lg leading-none">{emoji}</span>
                  <span className="text-center leading-tight">{label}</span>
                </button>
              ))}
            </div>
          </FilterSection>

          {/* ── Trasporto + Rotte (stile Booking.com) ─────── */}
          <div className="space-y-3">
            <p className="text-sm font-semibold text-foreground">Come vuoi viaggiare?</p>

            {/* Transport mode toggle */}
            <div className="flex rounded-xl border border-border overflow-hidden">
              <button
                type="button"
                onClick={() => setTransportMode("flight")}
                className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-bold transition-colors ${
                  transportMode === "flight" ? "bg-primary text-white" : "bg-muted/40 text-muted-foreground hover:bg-muted"
                }`}
              >
                <Plane className="w-4 h-4" /> ✈️ Aereo
              </button>
              <div className="w-px bg-border" />
              <button
                type="button"
                onClick={() => setTransportMode("train")}
                className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-bold transition-colors ${
                  transportMode === "train" ? "bg-primary text-white" : "bg-muted/40 text-muted-foreground hover:bg-muted"
                }`}
              >
                <TrainFront className="w-4 h-4" /> 🚆 Treno
              </button>
            </div>

            {/* Booking.com-style location card — NO overflow-hidden so dropdowns are visible */}
            <div className={`border-2 rounded-2xl transition-colors ${
              (errors["departure"] || errors["arrival"]) ? "border-red-400" : "border-border"
            }`}>
              {/* Departure */}
              <div ref={departureRef} className={`p-3 rounded-t-2xl ${errors["departure"] ? "bg-red-50" : "bg-background"}`}>
                <p className="text-[10px] font-bold text-foreground uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  {transportMode === "flight"
                    ? <><Plane className="w-3 h-3" /> Aeroporto di partenza</>
                    : <><TrainFront className="w-3 h-3" /> Stazione di partenza</>}
                </p>
                <LocationAutocomplete
                  value={transportMode === "flight" ? draft.departureAirport : draft.departureStation}
                  onChange={(v) => set(transportMode === "flight" ? "departureAirport" : "departureStation", v)}
                  placeholder={transportMode === "flight" ? t.filters.departureAirport : t.filters.departureStation}
                  filter={transportMode === "flight" ? "airport" : "station"}
                />
                {errors["departure"] && (
                  <p className="text-xs text-red-500 font-medium mt-1.5 flex items-center gap-1">
                    <span>⚠️</span>{errors["departure"]}
                  </p>
                )}
              </div>

              {/* Divider with swap indicator */}
              <div className="relative h-px bg-border">
                <div className="absolute right-4 -top-3.5 w-7 h-7 rounded-full bg-background border-2 border-border flex items-center justify-center text-xs text-muted-foreground select-none pointer-events-none font-bold">
                  ⇅
                </div>
              </div>

              {/* Arrival */}
              <div ref={arrivalRef} className={`p-3 ${draft.tripType !== "one_way" ? "" : "rounded-b-2xl"} ${errors["arrival"] ? "bg-red-50" : "bg-background"}`}>
                <p className="text-[10px] font-bold text-foreground uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <span>🏁</span>
                  {transportMode === "flight" ? "Aeroporto di arrivo" : "Stazione di arrivo"}
                </p>
                <LocationAutocomplete
                  value={transportMode === "flight" ? draft.arrivalAirport : draft.arrivalStation}
                  onChange={(v) => set(transportMode === "flight" ? "arrivalAirport" : "arrivalStation", v)}
                  placeholder={transportMode === "flight" ? t.filters.arrivalAirport : t.filters.arrivalStation}
                  filter={transportMode === "flight" ? "airport" : "station"}
                />
                {errors["arrival"] && (
                  <p className="text-xs text-red-500 font-medium mt-1.5 flex items-center gap-1">
                    <span>⚠️</span>{errors["arrival"]}
                  </p>
                )}
              </div>

              {/* Return location — only for round trip */}
              {draft.tripType !== "one_way" && (
                <>
                  <div className="relative h-px bg-border" />
                  <div className="p-3 rounded-b-2xl bg-background">
                    <p className="text-[10px] font-bold text-foreground uppercase tracking-wider mb-1.5 flex items-center gap-1">
                      <span>🔄</span>
                      {transportMode === "flight" ? "Aeroporto di ritorno" : "Stazione di ritorno"}
                    </p>
                    <LocationAutocomplete
                      value={transportMode === "flight" ? draft.returnAirport : draft.returnStation}
                      onChange={(v) => set(transportMode === "flight" ? "returnAirport" : "returnStation", v)}
                      placeholder={transportMode === "flight" ? t.filters.arrivalAirport : t.filters.arrivalStation}
                      filter={transportMode === "flight" ? "airport" : "station"}
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* ── Budget ─────────────────────────────────────── */}
          <div ref={budgetRef} className={`space-y-3 rounded-xl transition-colors ${errors["budget"] ? "p-3 ring-2 ring-red-400" : ""}`}>
            <div>
              <p className="text-sm font-semibold text-foreground">{t.filters.budget}</p>
              <p className="text-xs text-muted-foreground mt-0.5">✈️🏨 Include volo + hotel</p>
            </div>
            <div className="flex items-center gap-3 border-2 border-border rounded-xl px-4 py-3 bg-background focus-within:border-primary transition-colors">
              <span className="text-xl font-bold text-muted-foreground select-none">{currencySymbol}</span>
              <input
                type="number"
                min={0}
                max={20000}
                value={draft.budget || ""}
                onChange={(e) => {
                  const v = Math.max(0, Math.min(20000, parseInt(e.target.value, 10) || 0));
                  set("budget", v);
                }}
                className="flex-1 text-2xl font-black bg-transparent focus:outline-none text-foreground min-w-0"
                placeholder="0 – 20000"
              />
            </div>
            {/* Quick preset chips */}
            <div className="flex gap-2 flex-wrap">
              {[500, 1000, 2000, 5000, 10000].map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => set("budget", v)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                    draft.budget === v
                      ? "bg-primary text-white border-primary"
                      : "bg-background text-muted-foreground border-border hover:border-primary/50"
                  }`}
                >
                  €{v.toLocaleString()}
                </button>
              ))}
            </div>
            {errors["budget"] && (
              <p className="text-xs text-red-500 font-medium flex items-center gap-1.5">
                <span>⚠️</span>{errors["budget"]}
              </p>
            )}
          </div>

          {/* ── Persone + Stanze ───────────────────────────── */}
          <FilterSection label={t.filters.travelers}>
            <div className="flex gap-4 flex-wrap">
              <Stepper label={t.filters.travelers} value={draft.numberOfPeople} min={1} max={12} onChange={(v) => set("numberOfPeople", v)} />
              <Stepper label={t.filters.children} value={draft.numberOfChildren} min={0} max={10} onChange={(v) => set("numberOfChildren", v)} />
              <Stepper label={t.filters.pets} value={draft.numberOfPets} min={0} max={5} onChange={(v) => set("numberOfPets", v)} />
              <Stepper label="Stanze" value={draft.numberOfRooms} min={1} max={10} onChange={(v) => set("numberOfRooms", v)} />
            </div>
          </FilterSection>

          {/* ── Date ───────────────────────────────────────── */}
          <div ref={datesRef} className="space-y-3">
            <p className="text-sm font-semibold text-foreground">
              {draft.tripType === "one_way" ? t.filters.departureDate : t.filters.departureDate + " / " + t.filters.returnDate}
            </p>
            <div className={`grid gap-3 ${draft.tripType === "one_way" ? "grid-cols-1" : "grid-cols-2"}`}>
              {/* Departure date — always shown */}
              <div>
                <label className="text-xs text-muted-foreground block mb-1">{t.filters.departureDate}</label>
                <input
                  type="date"
                  value={draft.departureDate}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => set("departureDate", e.target.value)}
                  className={`w-full border rounded-lg px-3 py-2 text-sm bg-background text-foreground transition-colors ${
                    errors["departureDate"] ? "border-red-400 bg-red-50 focus:ring-red-400" : ""
                  }`}
                />
                {errors["departureDate"] && (
                  <p className="text-xs text-red-500 font-medium mt-1 flex items-center gap-1">
                    <span>⚠️</span>{errors["departureDate"]}
                  </p>
                )}
              </div>
              {/* Return date — hidden completely for one-way */}
              {draft.tripType !== "one_way" && (
                <div>
                  <label className="text-xs text-muted-foreground block mb-1">{t.filters.returnDate}</label>
                  <input
                    type="date"
                    value={draft.returnDate}
                    min={draft.departureDate || new Date().toISOString().split("T")[0]}
                    onChange={(e) => set("returnDate", e.target.value)}
                    className={`w-full border rounded-lg px-3 py-2 text-sm bg-background text-foreground transition-colors ${
                      errors["returnDate"] ? "border-red-400 bg-red-50" : ""
                    }`}
                  />
                  {errors["returnDate"] && (
                    <p className="text-xs text-red-500 font-medium mt-1 flex items-center gap-1">
                      <span>⚠️</span>{errors["returnDate"]}
                    </p>
                  )}
                </div>
              )}
            </div>
            {/* One-way info hint */}
            {draft.tripType === "one_way" && (
              <p className="text-xs text-primary/70 font-medium flex items-center gap-1.5">
                <span>✈️</span> {t.filters.oneWayHint}
              </p>
            )}
          </div>

          {/* ── Notti ──────────────────────────────────────── */}
          <FilterSection label={t.filters.nights}>
            <div className="flex items-center gap-3">
              <input type="range" min={1} max={30} step={1} value={draft.numberOfNights}
                onChange={(e) => set("numberOfNights", Number(e.target.value))}
                className="flex-1 accent-primary" />
              <span className="font-bold text-sm w-16 text-right">{draft.numberOfNights} {t.filters.nights.toLowerCase()}</span>
            </div>
          </FilterSection>

          {/* ── Tipo volo ──────────────────────────────────── */}
          <FilterSection label={t.filters.flightType}>
            <RadioGroup
              options={[
                { value: "any", label: t.filters.anyFlight },
                { value: "direct", label: t.filters.directOnly },
                { value: "with_stops", label: t.filters.withStops },
              ]}
              value={draft.flightPreference}
              onChange={(v) => set("flightPreference", v as TripFilters["flightPreference"])}
            />
          </FilterSection>

          {/* ── Tipo treno ─────────────────────────────────── */}
          <FilterSection label={t.filters.trainType}>
            <RadioGroup
              options={[
                { value: "any", label: t.filters.anyFlight },
                { value: "direct", label: t.filters.trainDirect },
                { value: "with_stops", label: t.filters.trainWithChanges },
              ]}
              value={draft.trainPreference}
              onChange={(v) => set("trainPreference", v as TripFilters["trainPreference"])}
            />
          </FilterSection>

          {/* ── Orario partenza ────────────────────────────── */}
          <FilterSection label={t.filters.departureTime}>
            <div className="flex gap-1.5">
              {([
                { value: "any", emoji: "🕐", label: t.filters.anyFlight },
                { value: "morning", emoji: "🌅", label: t.filters.morning },
                { value: "afternoon", emoji: "☀️", label: t.filters.afternoon },
                { value: "evening", emoji: "🌙", label: t.filters.evening },
              ] as const).map(({ value, emoji, label }) => (
                <button
                  key={value}
                  onClick={() => set("departureTimeSlot", value)}
                  className={`flex-1 flex flex-col items-center gap-0.5 py-2.5 rounded-xl border text-xs font-semibold transition-colors ${
                    draft.departureTimeSlot === value
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-background text-foreground"
                  }`}
                >
                  <span className="text-base">{emoji}</span>
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </FilterSection>

          {/* ── Durata massima viaggio ─────────────────────── */}
          <FilterSection label={t.filters.maxTravelTime}>
            <div className="flex items-center gap-3">
              <input type="range" min={1} max={24} step={1} value={draft.maxTravelTimeHours ?? 24}
                onChange={(e) => {
                  const v = Number(e.target.value);
                  set("maxTravelTimeHours", v >= 24 ? null : v);
                }}
                className="flex-1 accent-primary" />
              <span className="font-bold text-sm w-20 text-right">
                {draft.maxTravelTimeHours !== null ? `≤ ${draft.maxTravelTimeHours}h` : t.filters.noLimit}
              </span>
            </div>
          </FilterSection>

          {/* ── Max dist aeroporto → hotel ─────────────────── */}
          <FilterSection label={t.filters.maxAirportDist}>
            <div className="flex items-center gap-3">
              <input type="range" min={5} max={100} step={5} value={draft.maxDistanceFromAirportKm ?? 100}
                onChange={(e) => { const v = Number(e.target.value); set("maxDistanceFromAirportKm", v >= 100 ? null : v); }}
                className="flex-1 accent-primary" />
              <span className="font-bold text-sm w-20 text-right">
                {draft.maxDistanceFromAirportKm !== null ? `≤ ${draft.maxDistanceFromAirportKm} km` : t.filters.noLimit}
              </span>
            </div>
          </FilterSection>

          {/* ── Max hotel → centro ─────────────────────────── */}
          <FilterSection label={t.filters.maxCenterDist}>
            <div className="flex items-center gap-3">
              <input type="range" min={1} max={20} step={1} value={draft.maxHotelDistanceFromCenterKm ?? 20}
                onChange={(e) => { const v = Number(e.target.value); set("maxHotelDistanceFromCenterKm", v >= 20 ? null : v); }}
                className="flex-1 accent-primary" />
              <span className="font-bold text-sm w-20 text-right">
                {draft.maxHotelDistanceFromCenterKm !== null ? `≤ ${draft.maxHotelDistanceFromCenterKm} km` : t.filters.noLimit}
              </span>
            </div>
          </FilterSection>

          {/* ── Sistemazione ───────────────────────────────── */}
          <FilterSection label={t.filters.accommodation}>
            <RadioGroup
              options={[
                { value: "null", label: t.filters.anyAcc },
                { value: "budget", label: `⭐⭐ ${t.filters.budgetAcc}` },
                { value: "standard", label: `⭐⭐⭐ ${t.filters.standardAcc}` },
                { value: "luxury", label: `⭐⭐⭐⭐⭐ ${t.filters.luxuryAcc}` },
              ]}
              value={draft.accommodationType ?? "null"}
              onChange={(v) => set("accommodationType", v === "null" ? null : (v as TripFilters["accommodationType"]))}
            />
          </FilterSection>

          {/* ── Tipo struttura ─────────────────────────────── */}
          <FilterSection label={t.filters.propertyType}>
            <div className="grid grid-cols-2 gap-2">
              {(["any", "hotel", "apartment", "hostel"] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => set("propertyType", v as TripFilters["propertyType"])}
                  className={`py-2.5 rounded-xl border text-sm font-semibold transition-colors ${
                    draft.propertyType === v
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-background text-foreground"
                  }`}
                >
                  {v === "any" ? t.filters.anyAcc : v === "hotel" ? t.filters.hotelOnly : v === "apartment" ? t.filters.apartmentOnly : t.filters.hostelOnly}
                </button>
              ))}
            </div>
          </FilterSection>

          {/* ── Valutazione minima ─────────────────────────── */}
          <FilterSection label={t.filters.ratingFilter}>
            <div className="flex gap-2 flex-wrap">
              {([null, 7, 8, 9] as const).map((v) => (
                <button
                  key={String(v)}
                  onClick={() => set("minHotelRating", draft.minHotelRating === v ? null : v)}
                  className={`px-4 py-2 rounded-xl border text-sm font-semibold transition-colors ${
                    draft.minHotelRating === v && v !== null
                      ? "border-primary bg-primary/10 text-primary"
                      : v === null && draft.minHotelRating === null
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-background text-foreground"
                  }`}
                >
                  {v === null ? t.filters.anyFlight : `≥ ${v}/10`}
                </button>
              ))}
            </div>
          </FilterSection>

          {/* ── Servizi hotel ──────────────────────────────── */}
          <FilterSection label={t.filters.hotelFeatures}>
            <div className="grid grid-cols-2 gap-2">
              {([
                { key: "freeCancellation", emoji: "✅", label: t.filters.freeCancellation },
                { key: "breakfastIncluded", emoji: "🍳", label: t.filters.breakfastIncluded },
                { key: "parkingAvailable", emoji: "🅿️", label: t.filters.parkingAvailable },
                { key: "privateBathroom", emoji: "🚿", label: t.filters.privateBathroom },
                { key: "onlinePayment", emoji: "💳", label: t.filters.onlinePayment },
                { key: "elevator", emoji: "🛗", label: t.filters.elevator },
                { key: "petFriendly", emoji: "🐾", label: t.filters.petFriendly },
              ] as { key: keyof TripFilters; emoji: string; label: string }[]).map(({ key, emoji, label }) => {
                const active = !!draft[key];
                return (
                  <button
                    key={key}
                    onClick={() => toggle(key)}
                    className={`flex items-center gap-2 px-3 py-3 rounded-xl border text-sm text-left transition-colors ${
                      active
                        ? "border-primary bg-primary/8 text-primary font-semibold"
                        : "border-border bg-background text-foreground"
                    }`}
                  >
                    <span className="text-base leading-none">{emoji}</span>
                    <span className="flex-1 leading-tight text-xs">{label}</span>
                    {active && <Check className="w-3.5 h-3.5 shrink-0 text-primary" />}
                  </button>
                );
              })}
            </div>
          </FilterSection>

          <div className="h-2" />
        </div>

        <div className="px-5 pb-8 pt-3 border-t bg-background">
          <Button
            size="lg"
            className={`w-full text-base font-bold transition-all ${tried && hasErrors ? "bg-red-500 hover:bg-red-600" : ""}`}
            onClick={handleApply}
          >
            {tried && hasErrors ? `⚠️ ${t.filters.validationTitle}` : t.filters.apply}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

/* ─── Star range picker ─────────────────────────────────────────────────── */
function StarRangePicker({
  min, max, onChange,
}: {
  min: number; max: number; onChange: (min: number, max: number) => void;
}) {
  const { t } = useI18n();
  const handleStarClick = (star: number, role: "min" | "max") => {
    if (role === "min") {
      onChange(star, Math.max(star, max));
    } else {
      onChange(Math.min(star, min), star);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <span className="text-xs text-muted-foreground w-8 shrink-0">{t.filters.minLabel}</span>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((s) => (
            <button key={s} type="button" onClick={() => handleStarClick(s, "min")} className="transition-transform active:scale-90">
              <Star className={`w-7 h-7 transition-colors ${s <= min ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"}`} />
            </button>
          ))}
        </div>
        <span className="text-xs font-semibold text-foreground ml-1">{min}★</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-xs text-muted-foreground w-8 shrink-0">{t.filters.maxLabel}</span>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((s) => (
            <button key={s} type="button" onClick={() => handleStarClick(s, "max")} className="transition-transform active:scale-90">
              <Star className={`w-7 h-7 transition-colors ${s <= max ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"}`} />
            </button>
          ))}
        </div>
        <span className="text-xs font-semibold text-foreground ml-1">{max}★</span>
      </div>
      {(min !== 1 || max !== 5) && (
        <p className="text-xs text-primary font-medium">{min === max ? `${min} ★` : `${min} ★ – ${max} ★`}</p>
      )}
    </div>
  );
}

/* ─── Helpers ───────────────────────────────────────────────────────────── */
function FilterSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <p className="text-sm font-semibold text-foreground">{label}</p>
      {children}
    </div>
  );
}

function Stepper({ label, value, min, max, onChange }: { label: string; value: number; min: number; max: number; onChange: (v: number) => void }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <span className="text-xs text-muted-foreground">{label}</span>
      <div className="flex items-center gap-3">
        <button onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min}
          className="w-8 h-8 rounded-full border flex items-center justify-center text-foreground hover:bg-muted disabled:opacity-30">
          <Minus className="w-3.5 h-3.5" />
        </button>
        <span className="font-bold text-base w-5 text-center">{value}</span>
        <button onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max}
          className="w-8 h-8 rounded-full border flex items-center justify-center text-foreground hover:bg-muted disabled:opacity-30">
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

function RadioGroup({ options, value, onChange }: { options: { value: string; label: string }[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-col gap-2">
      {options.map((opt) => (
        <button key={opt.value} onClick={() => onChange(opt.value)}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-sm text-left transition-colors ${
            value === opt.value ? "border-primary bg-primary/5 font-semibold text-primary" : "border-border bg-background text-foreground hover:bg-muted"
          }`}>
          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${value === opt.value ? "border-primary" : "border-muted-foreground"}`}>
            {value === opt.value && <div className="w-2 h-2 rounded-full bg-primary" />}
          </div>
          {opt.label}
        </button>
      ))}
    </div>
  );
}
