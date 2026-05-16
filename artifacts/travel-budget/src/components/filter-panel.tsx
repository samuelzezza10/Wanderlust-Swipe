import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SlidersHorizontal, X, Minus, Plus, ChevronRight, Star } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { LocationAutocomplete } from "@/components/location-autocomplete";

export interface TripFilters {
  budget: number;
  numberOfPeople: number;
  numberOfChildren: number;
  numberOfPets: number;
  departureDate: string;
  returnDate: string;
  numberOfNights: number;
  flightPreference: "direct" | "with_stops" | "any";
  maxDistanceFromAirportKm: number | null;
  maxHotelDistanceFromCenterKm: number | null;
  accommodationType: "budget" | "standard" | "luxury" | null;
  departureAirport: string;
  arrivalAirport: string;
  departureStation: string;
  arrivalStation: string;
  hotelStarsMin: number;
  hotelStarsMax: number;
}

export const DEFAULT_FILTERS: TripFilters = {
  budget: 3000,
  numberOfPeople: 2,
  numberOfChildren: 0,
  numberOfPets: 0,
  departureDate: "",
  returnDate: "",
  numberOfNights: 7,
  flightPreference: "any",
  maxDistanceFromAirportKm: null,
  maxHotelDistanceFromCenterKm: null,
  accommodationType: null,
  departureAirport: "",
  arrivalAirport: "",
  departureStation: "",
  arrivalStation: "",
  hotelStarsMin: 1,
  hotelStarsMax: 5,
};

export function countActiveFilters(f: TripFilters): number {
  let n = 0;
  if (f.budget !== DEFAULT_FILTERS.budget) n++;
  if (f.numberOfPeople !== DEFAULT_FILTERS.numberOfPeople) n++;
  if (f.numberOfChildren > 0) n++;
  if (f.numberOfPets > 0) n++;
  if (f.departureDate) n++;
  if (f.returnDate) n++;
  if (f.numberOfNights !== DEFAULT_FILTERS.numberOfNights) n++;
  if (f.flightPreference !== "any") n++;
  if (f.maxDistanceFromAirportKm !== null) n++;
  if (f.maxHotelDistanceFromCenterKm !== null) n++;
  if (f.accommodationType !== null) n++;
  if (f.departureAirport) n++;
  if (f.arrivalAirport) n++;
  if (f.departureStation) n++;
  if (f.arrivalStation) n++;
  if (f.hotelStarsMin !== 1 || f.hotelStarsMax !== 5) n++;
  return n;
}

/* ─── Elegant filter bar ────────────────────────────────────────────────── */
export function FilterBar({
  filters,
  onEdit,
}: {
  filters: TripFilters;
  onEdit: () => void;
}) {
  const { t } = useI18n();
  const activeCount = countActiveFilters(filters);
  const departure = filters.departureAirport || filters.departureStation || "";

  const chips: string[] = [];
  if (filters.numberOfChildren > 0) chips.push(`${filters.numberOfChildren} ${t.filters.children.toLowerCase()}`);
  if (filters.numberOfPets > 0) chips.push(`${filters.numberOfPets} ${t.filters.pets.toLowerCase()}`);
  if (filters.flightPreference === "direct") chips.push(t.filters.directOnly);
  if (filters.flightPreference === "with_stops") chips.push(t.filters.withStops);
  if (filters.maxDistanceFromAirportKm !== null) chips.push(`✈ ≤${filters.maxDistanceFromAirportKm}km`);
  if (filters.maxHotelDistanceFromCenterKm !== null) chips.push(`🏨 ≤${filters.maxHotelDistanceFromCenterKm}km`);
  if (filters.hotelStarsMin !== 1 || filters.hotelStarsMax !== 5) {
    chips.push(`${"⭐".repeat(filters.hotelStarsMin)}–${"⭐".repeat(filters.hotelStarsMax)}`);
  }

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
              ? `${departure.split(" (")[0]} · €${filters.budget.toLocaleString()} · ${filters.numberOfPeople}p · ${filters.numberOfNights}n`
              : `€${filters.budget.toLocaleString()} · ${filters.numberOfPeople}p · ${filters.numberOfNights}n`}
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
  const { t } = useI18n();
  const [draft, setDraft] = useState<TripFilters>(filters);

  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) setDraft(filters);
    else onClose();
  };

  const set = <K extends keyof TripFilters>(key: K, val: TripFilters[K]) =>
    setDraft((prev) => ({ ...prev, [key]: val }));

  const handleApply = () => { onApply(draft); onClose(); };
  const handleReset = () => setDraft(DEFAULT_FILTERS);

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent side="bottom" className="h-[92dvh] p-0 rounded-t-3xl overflow-hidden flex flex-col">
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

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6">

          {/* ── Aeroporto partenza / arrivo ─────────────────── */}
          <FilterSection label={t.filters.departureAirport}>
            <LocationAutocomplete value={draft.departureAirport} onChange={(v) => set("departureAirport", v)} placeholder={t.filters.departureAirport} filter="airport" />
          </FilterSection>

          <FilterSection label={t.filters.arrivalAirport}>
            <LocationAutocomplete value={draft.arrivalAirport} onChange={(v) => set("arrivalAirport", v)} placeholder={t.filters.arrivalAirport} filter="airport" />
          </FilterSection>

          {/* ── Stazione partenza / arrivo ──────────────────── */}
          <FilterSection label={t.filters.departureStation}>
            <LocationAutocomplete value={draft.departureStation} onChange={(v) => set("departureStation", v)} placeholder={t.filters.departureStation} filter="station" />
          </FilterSection>

          <FilterSection label={t.filters.arrivalStation}>
            <LocationAutocomplete value={draft.arrivalStation} onChange={(v) => set("arrivalStation", v)} placeholder={t.filters.arrivalStation} filter="station" />
          </FilterSection>

          {/* ── Budget ─────────────────────────────────────── */}
          <FilterSection label={t.filters.budget}>
            <div className="flex items-center gap-3">
              <input type="range" min={100} max={20000} step={100} value={draft.budget}
                onChange={(e) => set("budget", Number(e.target.value))}
                className="flex-1 accent-primary" />
              <span className="font-bold text-sm w-20 text-right">€{draft.budget.toLocaleString()}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">{t.filters.perPerson}</p>
          </FilterSection>

          {/* ── Stelle hotel ───────────────────────────────── */}
          <FilterSection label={t.filters.hotelStars}>
            <StarRangePicker
              min={draft.hotelStarsMin}
              max={draft.hotelStarsMax}
              onChange={(min, max) => setDraft((prev) => ({ ...prev, hotelStarsMin: min, hotelStarsMax: max }))}
            />
          </FilterSection>

          {/* ── Persone ────────────────────────────────────── */}
          <FilterSection label={t.filters.travelers}>
            <div className="flex gap-6 flex-wrap">
              <Stepper label={t.filters.travelers} value={draft.numberOfPeople} min={1} max={12} onChange={(v) => set("numberOfPeople", v)} />
              <Stepper label={t.filters.children} value={draft.numberOfChildren} min={0} max={10} onChange={(v) => set("numberOfChildren", v)} />
              <Stepper label={t.filters.pets} value={draft.numberOfPets} min={0} max={5} onChange={(v) => set("numberOfPets", v)} />
            </div>
          </FilterSection>

          {/* ── Date ───────────────────────────────────────── */}
          <FilterSection label={t.filters.departureDate}>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted-foreground block mb-1">{t.filters.departureDate}</label>
                <input type="date" value={draft.departureDate} min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => set("departureDate", e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-sm bg-background text-foreground" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground block mb-1">{t.filters.returnDate}</label>
                <input type="date" value={draft.returnDate} min={draft.departureDate || new Date().toISOString().split("T")[0]}
                  onChange={(e) => set("returnDate", e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-sm bg-background text-foreground" />
              </div>
            </div>
          </FilterSection>

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

          {/* ── Max aeroporto → hotel ──────────────────────── */}
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

          <div className="h-2" />
        </div>

        <div className="px-5 pb-8 pt-3 border-t bg-background">
          <Button size="lg" className="w-full text-base font-bold" onClick={handleApply}>
            {t.filters.apply}
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
        <span className="text-xs text-muted-foreground w-8 shrink-0">Min</span>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => handleStarClick(s, "min")}
              className="transition-transform active:scale-90"
            >
              <Star
                className={`w-7 h-7 transition-colors ${
                  s <= min ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"
                }`}
              />
            </button>
          ))}
        </div>
        <span className="text-xs font-semibold text-foreground ml-1">{min}★</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-xs text-muted-foreground w-8 shrink-0">Max</span>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => handleStarClick(s, "max")}
              className="transition-transform active:scale-90"
            >
              <Star
                className={`w-7 h-7 transition-colors ${
                  s <= max ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"
                }`}
              />
            </button>
          ))}
        </div>
        <span className="text-xs font-semibold text-foreground ml-1">{max}★</span>
      </div>
      {(min !== 1 || max !== 5) && (
        <p className="text-xs text-primary font-medium">
          {min === max ? `${min} ★` : `${min} ★ – ${max} ★`}
        </p>
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
