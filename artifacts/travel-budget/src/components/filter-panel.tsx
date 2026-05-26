import { useState, useRef, useEffect, Component, type ReactNode, type ErrorInfo } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  SlidersHorizontal, X, Minus, Plus, ChevronRight, Clock,
  Check, Plane, RotateCcw, RefreshCw, AlertCircle,
} from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { LocationAutocomplete } from "@/components/location-autocomplete";

/* ─── Local error boundary ──────────────────────────────────────────────── */
class FilterBodyBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(): { hasError: boolean } {
    return { hasError: true };
  }
  componentDidCatch(err: Error, info: ErrorInfo) {
    console.error("[FilterBodyBoundary]", err.message, info.componentStack?.slice(0, 200));
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8 text-center">
          <div className="w-12 h-12 rounded-2xl bg-zinc-100 flex items-center justify-center">
            <AlertCircle className="w-6 h-6 text-zinc-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-zinc-800">Errore nel pannello filtri</p>
            <p className="text-xs text-zinc-500 mt-1">Tocca Riprova per ripristinare.</p>
          </div>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="flex items-center gap-2 bg-zinc-900 text-white font-semibold px-5 py-2.5 rounded-xl text-sm active:scale-95 transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            Riprova
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

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
  budget: 2000,
  numberOfPeople: 2,
  numberOfChildren: 0,
  numberOfPets: 0,
  numberOfRooms: 1,
  departureDate: "",
  returnDate: "",
  numberOfNights: 7,
  flightPreference: "any",
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

/* ─── Filter bar ────────────────────────────────────────────────────────── */
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
  if (filters.numberOfChildren > 0) chips.push(`${filters.numberOfChildren} ${(t.filters.children ?? "").toLowerCase()}`);
  if (filters.numberOfPets > 0) chips.push(`${filters.numberOfPets} ${(t.filters.pets ?? "").toLowerCase()}`);
  if (filters.numberOfRooms > 1) chips.push(`${filters.numberOfRooms} stanze`);
  if (filters.flightPreference === "direct") chips.push(t.filters.directOnly);
  if (filters.flightPreference === "with_stops") chips.push(t.filters.withStops);
  if (filters.breakfastIncluded) chips.push(t.filters.breakfastIncluded);
  if (filters.freeCancellation) chips.push(t.filters.freeCancellation);
  if (filters.parkingAvailable) chips.push(t.filters.parkingAvailable);
  if (filters.petFriendly) chips.push(t.filters.petFriendly);
  if (filters.minHotelRating !== null) chips.push(`≥ ${filters.minHotelRating}/10`);
  if (filters.propertyType !== "any") chips.push(
    filters.propertyType === "hotel" ? t.filters.hotelOnly
      : filters.propertyType === "apartment" ? t.filters.apartmentOnly
      : t.filters.hostelOnly,
  );
  if (filters.sortBy !== "best_value") {
    const sl: Record<string, string> = { cheapest: t.filters.sortCheapest, best_rating: t.filters.sortBestRating };
    chips.push(sl[filters.sortBy] ?? filters.sortBy);
  }
  if (filters.departureTimeSlot !== "any") {
    const tl: Record<string, string> = { morning: t.filters.morning, afternoon: t.filters.afternoon, evening: t.filters.evening };
    chips.push(tl[filters.departureTimeSlot] ?? filters.departureTimeSlot);
  }
  if (filters.maxTravelTimeHours !== null) chips.push(`≤ ${filters.maxTravelTimeHours}h`);

  return (
    <div className="w-full px-4 pt-3 pb-2">
      <button
        onClick={onEdit}
        className="w-full flex items-center gap-3 bg-white rounded-2xl px-4 py-3 border border-zinc-200 shadow-sm hover:border-zinc-300 hover:shadow-md active:scale-[0.99] transition-all duration-150"
      >
        <div className="w-9 h-9 rounded-xl bg-zinc-100 flex items-center justify-center shrink-0">
          <SlidersHorizontal className="w-4 h-4 text-zinc-500" />
        </div>
        <div className="flex-1 min-w-0 text-left">
          <p className="font-semibold text-sm text-zinc-800 leading-tight">{t.filters.title}</p>
          <p className="text-xs text-zinc-400 truncate mt-0.5">
            {departure
              ? `${departure.split(" (")[0]} · ${currencySymbol}${filters.budget.toLocaleString()} · ${filters.numberOfPeople}p · ${filters.numberOfNights}n`
              : `${currencySymbol}${filters.budget > 0 ? filters.budget.toLocaleString() : "—"} · ${filters.numberOfPeople}p · ${filters.numberOfNights}n`}
          </p>
        </div>
        {activeCount > 0 ? (
          <span className="shrink-0 bg-zinc-900 text-white rounded-full min-w-[22px] h-[22px] flex items-center justify-center text-[11px] font-bold px-1.5">
            {activeCount}
          </span>
        ) : (
          <ChevronRight className="w-4 h-4 text-zinc-400 shrink-0" />
        )}
      </button>

      {chips.length > 0 && (
        <div className="flex gap-1.5 overflow-x-auto scrollbar-hide mt-2 pb-0.5">
          {chips.map((chip, i) => (
            <Badge
              key={i}
              variant="secondary"
              className="shrink-0 text-xs px-2.5 py-1 font-medium whitespace-nowrap bg-zinc-100 text-zinc-600 border-0 rounded-full"
            >
              {chip}
            </Badge>
          ))}
        </div>
      )}

      {recentSearches && recentSearches.length > 0 && (
        <div className="mt-2">
          <div className="flex items-center gap-1.5 mb-1.5 px-1">
            <Clock className="w-3 h-3 text-zinc-400" />
            <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">{t.profile.recentSearches}</span>
          </div>
          <div className="flex gap-1.5 overflow-x-auto scrollbar-hide pb-0.5">
            {recentSearches.map((s, i) => (
              <button
                key={i}
                onClick={s.onClick}
                className="shrink-0 flex items-center gap-1.5 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 rounded-full px-3 py-1.5 text-xs font-medium text-zinc-600 transition-colors active:scale-95"
              >
                <RotateCcw className="w-3 h-3 text-zinc-400" />
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

  const contentRef = useRef<HTMLDivElement>(null);
  const departureRef = useRef<HTMLDivElement>(null);
  const arrivalRef = useRef<HTMLDivElement>(null);
  const datesRef = useRef<HTMLDivElement>(null);
  const budgetRef = useRef<HTMLDivElement>(null);

  const validate = (f: TripFilters): Record<string, string> => {
    const errs: Record<string, string> = {};
    const dep = f.departureAirport;
    const arr = f.arrivalAirport;
    if (f.departureDate && f.returnDate && f.returnDate < f.departureDate) {
      errs["returnDate"] = t.filters.returnBeforeDeparture;
    }
    if (dep && arr) {
      const depCity = dep.split(" (")[0].trim().toLowerCase();
      const arrCity = arr.split(" (")[0].trim().toLowerCase();
      if (depCity === arrCity) errs["arrival"] = t.filters.sameLocation;
    }
    return errs;
  };

  useEffect(() => {
    if (tried) setErrors(validate(draft));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft, tried]);

  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      setDraft(filters);
      setErrors({});
      setTried(false);
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
    const arr = draft.arrivalAirport.trim();
    if (!arr || arr.toLowerCase() === "any") {
      setErrors({ arrival: t.filters.arrivalRequired ?? "Seleziona una destinazione" });
      arrivalRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    const errs = validate(draft);
    setErrors(errs);
    if (errs["arrival"]) return;
    const finalDraft: TripFilters = { ...draft, departureStation: "", arrivalStation: "", returnStation: "" };
    onApply(finalDraft);
    onClose();
  };

  const handleReset = () => { setDraft(DEFAULT_FILTERS); setErrors({}); setTried(false); };

  const hasErrors = Object.keys(errors).length > 0;

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent side="bottom" className="h-[100dvh] p-0 rounded-none overflow-hidden flex flex-col bg-white">

        {/* ── Header ── */}
        <SheetHeader className="px-5 pt-6 pb-4 border-b border-zinc-100 flex-row items-center justify-between shrink-0">
          <SheetTitle className="text-base font-semibold text-zinc-900 tracking-tight">{t.filters.title}</SheetTitle>
          <div className="flex gap-3 items-center">
            <button
              onClick={handleReset}
              className="text-xs font-medium text-zinc-400 hover:text-zinc-600 transition-colors"
            >
              {t.filters.reset}
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-zinc-100 hover:bg-zinc-200 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4 text-zinc-500" />
            </button>
          </div>
        </SheetHeader>

        <FilterBodyBoundary key={open ? "open" : "closed"}>
          <div ref={contentRef} className="flex-1 overflow-y-auto px-5 py-5 space-y-7">

            {/* ── Validation banner ── */}
            {tried && hasErrors && (
              <div className="bg-red-50 border border-red-100 rounded-2xl px-4 py-3 flex gap-3 items-start">
                <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-red-700">{t.filters.validationTitle}</p>
                  <p className="text-xs text-red-500 mt-0.5">{t.filters.validationSubtitle}</p>
                </div>
              </div>
            )}

            {/* ── Tipo viaggio ── */}
            <FilterSection label={t.filters.tripTypeLabel}>
              <div className="flex gap-2">
                <PillButton
                  active={draft.tripType === "round_trip"}
                  onClick={() => setDraft((prev) => ({ ...prev, tripType: "round_trip" }))}
                >
                  {t.filters.roundTrip}
                </PillButton>
                <PillButton
                  active={draft.tripType === "one_way"}
                  onClick={() => setDraft((prev) => ({ ...prev, tripType: "one_way", returnDate: "", returnAirport: "", returnStation: "" }))}
                >
                  {t.filters.oneWay}
                </PillButton>
              </div>
            </FilterSection>

            {/* ── Ordina per ── */}
            <FilterSection label={t.filters.sortBy}>
              <div className="flex gap-2">
                {([
                  { value: "best_value", label: t.filters.sortBestValue },
                  { value: "cheapest", label: t.filters.sortCheapest },
                  { value: "best_rating", label: t.filters.sortBestRating },
                ] as const).map(({ value, label }) => (
                  <PillButton key={value} active={draft.sortBy === value} onClick={() => set("sortBy", value)}>
                    {label}
                  </PillButton>
                ))}
              </div>
            </FilterSection>

            {/* ── Rotte ── */}
            <FilterSection label="Destinazione">
              <div className={`border rounded-2xl overflow-visible transition-colors ${(errors["departure"] || errors["arrival"]) ? "border-red-300" : "border-zinc-200"}`}>
                {/* Departure */}
                <div ref={departureRef} className="p-4">
                  <FieldLabel><Plane className="w-3 h-3" /> {t.filters.departureAirport}</FieldLabel>
                  <LocationAutocomplete
                    value={draft.departureAirport}
                    onChange={(v) => set("departureAirport", v)}
                    placeholder={t.filters.departureAirport}
                    filter="airport"
                  />
                  {errors["departure"] && <FieldError>{errors["departure"]}</FieldError>}
                </div>

                <div className="h-px bg-zinc-100 mx-4" />

                {/* Arrival */}
                <div ref={arrivalRef} className={`p-4 ${draft.tripType !== "one_way" ? "" : ""}`}>
                  <FieldLabel>Destinazione</FieldLabel>
                  <LocationAutocomplete
                    value={draft.arrivalAirport}
                    onChange={(v) => set("arrivalAirport", v)}
                    placeholder={t.filters.arrivalAirport}
                    filter="airport"
                  />
                  {errors["arrival"] && <FieldError>{errors["arrival"]}</FieldError>}
                </div>

                {/* Return — round trip only */}
                {draft.tripType !== "one_way" && (
                  <>
                    <div className="h-px bg-zinc-100 mx-4" />
                    <div className="p-4">
                      <FieldLabel>Ritorno (opzionale)</FieldLabel>
                      <LocationAutocomplete
                        value={draft.returnAirport}
                        onChange={(v) => set("returnAirport", v)}
                        placeholder={t.filters.arrivalAirport}
                        filter="airport"
                      />
                    </div>
                  </>
                )}
              </div>
            </FilterSection>

            {/* ── Budget ── */}
            <div ref={budgetRef} className="space-y-3">
              <SectionLabel>{t.filters.budget}</SectionLabel>
              <div className="flex items-center gap-2 border border-zinc-200 rounded-2xl px-4 py-3.5 bg-white focus-within:border-zinc-400 transition-colors">
                <span className="text-lg font-semibold text-zinc-300 select-none">{currencySymbol}</span>
                <input
                  type="number"
                  min={0}
                  max={20000}
                  value={draft.budget || ""}
                  onChange={(e) => {
                    const v = Math.max(0, Math.min(20000, parseInt(e.target.value, 10) || 0));
                    set("budget", v);
                  }}
                  className="flex-1 text-2xl font-bold bg-transparent focus:outline-none text-zinc-900 min-w-0"
                  placeholder="es. 1500"
                />
              </div>
              <p className="text-xs text-zinc-400 mt-1 px-1">
                {t.filters.budgetHint ?? "Scrivi il tuo budget massimo totale (volo + hotel)"}
              </p>
              <div className="flex gap-2 flex-wrap">
                {[500, 1000, 2000, 5000, 10000].map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => set("budget", v)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                      draft.budget === v
                        ? "bg-zinc-900 text-white border-zinc-900"
                        : "bg-white text-zinc-600 border-zinc-200 hover:border-zinc-400"
                    }`}
                  >
                    {currencySymbol}{v.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>

            {/* ── Persone + Stanze ── */}
            <FilterSection label={t.filters.travelers}>
              <div className="flex gap-4 flex-wrap">
                <Stepper label={t.filters.travelers} value={draft.numberOfPeople} min={1} max={12} onChange={(v) => set("numberOfPeople", v)} />
                <Stepper label={t.filters.children} value={draft.numberOfChildren} min={0} max={10} onChange={(v) => set("numberOfChildren", v)} />
                <Stepper label={t.filters.pets} value={draft.numberOfPets} min={0} max={5} onChange={(v) => set("numberOfPets", v)} />
                <Stepper label="Stanze" value={draft.numberOfRooms} min={1} max={10} onChange={(v) => set("numberOfRooms", v)} />
              </div>
            </FilterSection>

            {/* ── Date ── */}
            <div ref={datesRef} className="space-y-3">
              <SectionLabel>
                {draft.tripType === "one_way" ? t.filters.departureDate : `${t.filters.departureDate} / ${t.filters.returnDate}`}
              </SectionLabel>
              <div className={`grid gap-3 ${draft.tripType === "one_way" ? "grid-cols-1" : "grid-cols-2"}`}>
                <div>
                  <label className="text-xs text-zinc-400 block mb-1.5">{t.filters.departureDate}</label>
                  <input
                    type="date"
                    value={draft.departureDate}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) => set("departureDate", e.target.value)}
                    className={`w-full border rounded-xl px-3 py-2.5 text-sm bg-white text-zinc-800 transition-colors focus:outline-none focus:border-zinc-400 ${
                      errors["departureDate"] ? "border-red-300 bg-red-50" : "border-zinc-200"
                    }`}
                  />
                  {errors["departureDate"] && <FieldError>{errors["departureDate"]}</FieldError>}
                </div>
                {draft.tripType !== "one_way" && (
                  <div>
                    <label className="text-xs text-zinc-400 block mb-1.5">{t.filters.returnDate}</label>
                    <input
                      type="date"
                      value={draft.returnDate}
                      min={draft.departureDate || new Date().toISOString().split("T")[0]}
                      onChange={(e) => set("returnDate", e.target.value)}
                      className={`w-full border rounded-xl px-3 py-2.5 text-sm bg-white text-zinc-800 transition-colors focus:outline-none focus:border-zinc-400 ${
                        errors["returnDate"] ? "border-red-300 bg-red-50" : "border-zinc-200"
                      }`}
                    />
                    {errors["returnDate"] && <FieldError>{errors["returnDate"]}</FieldError>}
                  </div>
                )}
              </div>
              {draft.tripType === "one_way" && (
                <p className="text-xs text-zinc-400 font-medium">{t.filters.oneWayHint}</p>
              )}
            </div>

            {/* ── Notti ── */}
            <FilterSection label={`${t.filters.nights} — ${draft.numberOfNights} ${(t.filters.nights ?? "").toLowerCase()}`}>
              <input
                type="range" min={1} max={30} step={1} value={draft.numberOfNights}
                onChange={(e) => set("numberOfNights", Number(e.target.value))}
                className="w-full accent-zinc-900"
              />
              <div className="flex justify-between text-xs text-zinc-400">
                <span>1</span><span>30</span>
              </div>
            </FilterSection>

            {/* ── Tipo volo ── */}
            <FilterSection label={t.filters.flightType}>
              <div className="flex gap-2 flex-wrap">
                {([
                  { value: "any", label: t.filters.anyFlight },
                  { value: "direct", label: t.filters.directOnly },
                  { value: "with_stops", label: t.filters.withStops },
                ] as const).map(({ value, label }) => (
                  <PillButton key={value} active={draft.flightPreference === value} onClick={() => set("flightPreference", value)}>
                    {label}
                  </PillButton>
                ))}
              </div>
            </FilterSection>

            {/* ── Orario partenza ── */}
            <FilterSection label={t.filters.departureTime}>
              <div className="flex gap-2 flex-wrap">
                {([
                  { value: "any", label: t.filters.anyFlight },
                  { value: "morning", label: t.filters.morning },
                  { value: "afternoon", label: t.filters.afternoon },
                  { value: "evening", label: t.filters.evening },
                ] as const).map(({ value, label }) => (
                  <PillButton key={value} active={draft.departureTimeSlot === value} onClick={() => set("departureTimeSlot", value)}>
                    {label}
                  </PillButton>
                ))}
              </div>
            </FilterSection>

            {/* ── Durata massima viaggio ── */}
            <FilterSection label={`${t.filters.maxTravelTime} — ${draft.maxTravelTimeHours !== null ? `≤ ${draft.maxTravelTimeHours}h` : t.filters.noLimit}`}>
              <input
                type="range" min={1} max={24} step={1} value={draft.maxTravelTimeHours ?? 24}
                onChange={(e) => { const v = Number(e.target.value); set("maxTravelTimeHours", v >= 24 ? null : v); }}
                className="w-full accent-zinc-900"
              />
              <div className="flex justify-between text-xs text-zinc-400">
                <span>1h</span><span>{t.filters.noLimit}</span>
              </div>
            </FilterSection>

            {/* ── Max dist aeroporto ── */}
            <FilterSection label={`${t.filters.maxAirportDist} — ${draft.maxDistanceFromAirportKm !== null ? `≤ ${draft.maxDistanceFromAirportKm} km` : t.filters.noLimit}`}>
              <input
                type="range" min={5} max={100} step={5} value={draft.maxDistanceFromAirportKm ?? 100}
                onChange={(e) => { const v = Number(e.target.value); set("maxDistanceFromAirportKm", v >= 100 ? null : v); }}
                className="w-full accent-zinc-900"
              />
              <div className="flex justify-between text-xs text-zinc-400">
                <span>5 km</span><span>{t.filters.noLimit}</span>
              </div>
            </FilterSection>

            {/* ── Max hotel → centro ── */}
            <FilterSection label={`${t.filters.maxCenterDist} — ${draft.maxHotelDistanceFromCenterKm !== null ? `≤ ${draft.maxHotelDistanceFromCenterKm} km` : t.filters.noLimit}`}>
              <input
                type="range" min={1} max={20} step={1} value={draft.maxHotelDistanceFromCenterKm ?? 20}
                onChange={(e) => { const v = Number(e.target.value); set("maxHotelDistanceFromCenterKm", v >= 20 ? null : v); }}
                className="w-full accent-zinc-900"
              />
              <div className="flex justify-between text-xs text-zinc-400">
                <span>1 km</span><span>{t.filters.noLimit}</span>
              </div>
            </FilterSection>

            {/* ── Sistemazione ── */}
            <FilterSection label={t.filters.accommodation}>
              <div className="flex gap-2 flex-wrap">
                {([
                  { value: "null", label: t.filters.anyAcc },
                  { value: "budget", label: t.filters.budgetAcc },
                  { value: "standard", label: t.filters.standardAcc },
                  { value: "luxury", label: t.filters.luxuryAcc },
                ] as const).map(({ value, label }) => (
                  <PillButton
                    key={value}
                    active={(draft.accommodationType ?? "null") === value}
                    onClick={() => set("accommodationType", value === "null" ? null : (value as TripFilters["accommodationType"]))}
                  >
                    {label}
                  </PillButton>
                ))}
              </div>
            </FilterSection>

            {/* ── Tipo struttura ── */}
            <FilterSection label={t.filters.propertyType}>
              <div className="grid grid-cols-2 gap-2">
                {(["any", "hotel", "apartment", "hostel"] as const).map((v) => (
                  <button
                    key={v}
                    onClick={() => set("propertyType", v as TripFilters["propertyType"])}
                    className={`py-3 rounded-2xl border text-sm font-medium transition-all ${
                      draft.propertyType === v
                        ? "bg-zinc-900 text-white border-zinc-900"
                        : "bg-white text-zinc-700 border-zinc-200 hover:border-zinc-400"
                    }`}
                  >
                    {v === "any" ? t.filters.anyAcc : v === "hotel" ? t.filters.hotelOnly : v === "apartment" ? t.filters.apartmentOnly : t.filters.hostelOnly}
                  </button>
                ))}
              </div>
            </FilterSection>

            {/* ── Valutazione minima ── */}
            <FilterSection label={t.filters.ratingFilter}>
              <div className="flex gap-2 flex-wrap">
                {([null, 7, 8, 9] as const).map((v) => (
                  <button
                    key={String(v)}
                    onClick={() => set("minHotelRating", draft.minHotelRating === v ? null : v)}
                    className={`px-4 py-2 rounded-full border text-sm font-medium transition-all ${
                      (v === null && draft.minHotelRating === null) || (v !== null && draft.minHotelRating === v)
                        ? "bg-zinc-900 text-white border-zinc-900"
                        : "bg-white text-zinc-600 border-zinc-200 hover:border-zinc-400"
                    }`}
                  >
                    {v === null ? t.filters.anyFlight : `≥ ${v}/10`}
                  </button>
                ))}
              </div>
            </FilterSection>

            {/* ── Servizi hotel ── */}
            <FilterSection label={t.filters.hotelFeatures}>
              <div className="grid grid-cols-2 gap-2">
                {([
                  { key: "freeCancellation", label: t.filters.freeCancellation },
                  { key: "breakfastIncluded", label: t.filters.breakfastIncluded },
                  { key: "parkingAvailable", label: t.filters.parkingAvailable },
                  { key: "privateBathroom", label: t.filters.privateBathroom },
                  { key: "onlinePayment", label: t.filters.onlinePayment },
                  { key: "elevator", label: t.filters.elevator },
                  { key: "petFriendly", label: t.filters.petFriendly },
                ] as { key: keyof TripFilters; label: string }[]).map(({ key, label }) => {
                  const active = !!draft[key];
                  return (
                    <button
                      key={key}
                      onClick={() => toggle(key)}
                      className={`flex items-center justify-between gap-2 px-3.5 py-3 rounded-2xl border text-sm text-left transition-all ${
                        active
                          ? "bg-zinc-900 text-white border-zinc-900"
                          : "bg-white text-zinc-700 border-zinc-200 hover:border-zinc-400"
                      }`}
                    >
                      <span className="leading-tight text-xs font-medium">{label}</span>
                      {active && <Check className="w-3.5 h-3.5 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </FilterSection>

            <div className="h-2" />
          </div>
        </FilterBodyBoundary>

        {/* ── Apply CTA ── */}
        <div className="px-5 pb-8 pt-4 border-t border-zinc-100 bg-white shrink-0">
          <Button
            size="lg"
            className={`w-full text-sm font-semibold rounded-2xl transition-all ${
              tried && hasErrors
                ? "bg-red-500 hover:bg-red-600 text-white"
                : "bg-zinc-900 hover:bg-zinc-800 text-white"
            }`}
            onClick={handleApply}
          >
            {tried && hasErrors ? t.filters.validationTitle : t.filters.apply}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

/* ─── Helpers ───────────────────────────────────────────────────────────── */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">{children}</p>
  );
}

function FilterSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <SectionLabel>{label}</SectionLabel>
      {children}
    </div>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
      {children}
    </p>
  );
}

function FieldError({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs text-red-500 font-medium mt-1.5 flex items-center gap-1">
      <AlertCircle className="w-3 h-3" />{children}
    </p>
  );
}

function PillButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 px-3 py-2.5 rounded-xl border text-sm font-medium transition-all ${
        active
          ? "bg-zinc-900 text-white border-zinc-900"
          : "bg-white text-zinc-600 border-zinc-200 hover:border-zinc-400"
      }`}
    >
      {children}
    </button>
  );
}

function Stepper({ label, value, min, max, onChange }: { label: string; value: number; min: number; max: number; onChange: (v: number) => void }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <span className="text-xs text-zinc-400 font-medium">{label}</span>
      <div className="flex items-center gap-3">
        <button
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          className="w-8 h-8 rounded-full border border-zinc-200 flex items-center justify-center text-zinc-600 hover:bg-zinc-50 disabled:opacity-30 transition-colors"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>
        <span className="font-bold text-base w-5 text-center text-zinc-900">{value}</span>
        <button
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          className="w-8 h-8 rounded-full border border-zinc-200 flex items-center justify-center text-zinc-600 hover:bg-zinc-50 disabled:opacity-30 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
