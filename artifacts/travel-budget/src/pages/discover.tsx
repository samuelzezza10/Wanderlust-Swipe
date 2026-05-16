import { useState, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { useGenerateTrips, useSaveTrip, useGetPreferences } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import {
  MapPin, Plane, Hotel, Check, X, RotateCcw, Info,
  Clock, Star, Navigation, Wifi, ArrowRight, SlidersHorizontal,
} from "lucide-react";
import { useAuth } from "@clerk/react";
import { useLocation } from "wouter";
import { toast } from "sonner";
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

export default function Discover() {
  const { isSignedIn } = useAuth();
  const [, setLocation] = useLocation();
  const { t } = useI18n();

  const [trips, setTrips] = useState<TripSuggestion[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [history, setHistory] = useState<number[]>([]);
  const [detailTrip, setDetailTrip] = useState<TripSuggestion | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState<TripFilters>(DEFAULT_FILTERS);

  // Fix a random message for the session (doesn't change on re-render)
  const loadingMsgRef = useRef<string | null>(null);
  const noResultsMsgRef = useRef<string | null>(null);
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

  const generateTrips = useGenerateTrips();
  const saveTrip = useSaveTrip();

  const didAutoLoad = useRef(false);
  if (!didAutoLoad.current) {
    didAutoLoad.current = true;
    setTimeout(() => loadTrips(DEFAULT_FILTERS), 0);
  }

  function loadTrips(f: TripFilters) {
    const effectiveBudget = f.budget || prefs?.defaultBudget || 2000;
    const depLocation =
      f.departureAirport || f.departureStation || prefs?.defaultDepartureLocation || "Any";
    const arrLocation = f.arrivalAirport || f.arrivalStation || "Any";
    generateTrips.mutate(
      {
        data: {
          budget: effectiveBudget,
          numberOfPeople: f.numberOfPeople,
          numberOfChildren: f.numberOfChildren > 0 ? f.numberOfChildren : null,
          numberOfPets: f.numberOfPets > 0 ? f.numberOfPets : null,
          departureDate: f.departureDate || new Date().toISOString(),
          returnDate: f.returnDate || new Date(Date.now() + f.numberOfNights * 86400000).toISOString(),
          departureLocation: depLocation,
          arrivalLocation: arrLocation,
          numberOfNights: f.numberOfNights,
          flightPreference: f.flightPreference,
          hotelDistanceKm: f.maxHotelDistanceFromCenterKm,
          maxDistanceFromAirportKm: f.maxDistanceFromAirportKm,
          accommodationType: f.accommodationType,
        },
      },
      {
        onSuccess: (data) => {
          setTrips(data);
          setCurrentIndex(0);
          setHistory([]);
          setHasSearched(true);
        },
      }
    );
  }

  const handleApplyFilters = (newFilters: TripFilters) => {
    setFilters(newFilters);
    loadTrips(newFilters);
  };

  const handleSwipe = (direction: "left" | "right") => {
    if (currentIndex >= trips.length) return;
    const trip = trips[currentIndex];
    if (direction === "right") {
      if (isSignedIn) {
        saveTrip.mutate({
          data: {
            tripData: trip,
            destination: trip.destination,
            totalPrice: trip.totalPrice,
            imageUrl: trip.imageUrl,
          },
        });
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

  /* ── Loading (initial) ── */
  if (generateTrips.isPending && !hasSearched) {
    return (
      <div className="flex-1 flex flex-col">
        <FilterBar filters={filters} onEdit={() => setFilterOpen(true)} />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3 px-8 text-center">
            <Plane className="w-14 h-14 text-primary mb-1 animate-bounce" />
            <p className="text-muted-foreground font-medium">{loadingMsgRef.current}</p>
          </div>
        </div>
        <FilterSheet open={filterOpen} filters={filters} onClose={() => setFilterOpen(false)} onApply={handleApplyFilters} />
      </div>
    );
  }

  /* ── No results ── */
  if (hasSearched && trips.length === 0 && !generateTrips.isPending) {
    return (
      <div className="flex-1 flex flex-col">
        <FilterBar filters={filters} onEdit={() => setFilterOpen(true)} />
        <div className="flex-1 flex items-center justify-center flex-col p-6 text-center">
          <div className="text-6xl mb-4">😭</div>
          <h2 className="text-xl font-bold mb-2">{t.filters.noResults}</h2>
          <p className="text-base text-muted-foreground mb-2 max-w-xs">{noResultsMsgRef.current}</p>
          <p className="text-sm text-muted-foreground/70 mb-8 max-w-xs">{t.filters.noResultsSub}</p>
          <Button onClick={() => setFilterOpen(true)} variant="outline" className="gap-2">
            <SlidersHorizontal className="w-4 h-4" />
            {t.filters.edit}
          </Button>
        </div>
        <FilterSheet open={filterOpen} filters={filters} onClose={() => setFilterOpen(false)} onApply={handleApplyFilters} />
      </div>
    );
  }

  /* ── Seen all ── */
  if (hasSearched && currentIndex >= trips.length && trips.length > 0) {
    return (
      <div className="flex-1 flex flex-col">
        <FilterBar filters={filters} onEdit={() => setFilterOpen(true)} />
        <div className="flex-1 flex items-center justify-center flex-col p-4 text-center">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
            <MapPin className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-2xl font-bold mb-2">{t.discover.seenAll}</h2>
          <p className="text-muted-foreground mb-8 max-w-sm">{t.discover.seenAllSub}</p>
          <Button onClick={() => loadTrips(filters)} size="lg" disabled={generateTrips.isPending}>
            {t.discover.generateMore}
          </Button>
        </div>
        <FilterSheet open={filterOpen} filters={filters} onClose={() => setFilterOpen(false)} onApply={handleApplyFilters} />
      </div>
    );
  }

  /* ── Main swipe deck ── */
  return (
    <>
      <div className="flex-1 flex flex-col">
        <FilterBar filters={filters} onEdit={() => setFilterOpen(true)} />

        {generateTrips.isPending ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3 px-8 text-center">
              <Plane className="w-14 h-14 text-primary mb-1 animate-bounce" />
              <p className="text-muted-foreground font-medium">{loadingMsgRef.current}</p>
            </div>
          </div>
        ) : (
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
                      likeLabel={t.discover.like}
                      nopeLabel={t.discover.nope}
                      totalLabel={t.discover.total}
                      caption={hashCaption(trip.id, t.fun.captions)}
                      departureFrom={filters.departureAirport || filters.departureStation}
                    />
                  );
                })}
              </AnimatePresence>
            </div>

            <div className="flex items-center gap-5 mt-8">
              <button
                onClick={handleUndo}
                disabled={history.length === 0}
                className="w-12 h-12 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center text-gray-500 disabled:opacity-30 disabled:cursor-not-allowed hover:scale-110 active:scale-95 transition-transform"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleSwipe("left")}
                className="rounded-full bg-red-500 shadow-[0_4px_20px_rgba(239,68,68,0.5)] flex items-center justify-center text-white hover:scale-110 active:scale-95 transition-transform"
                style={{ width: 72, height: 72 }}
              >
                <X className="w-9 h-9 stroke-[2.5]" />
              </button>
              <button
                onClick={() => handleSwipe("right")}
                className="rounded-full bg-green-500 shadow-[0_4px_20px_rgba(34,197,94,0.5)] flex items-center justify-center text-white hover:scale-110 active:scale-95 transition-transform"
                style={{ width: 72, height: 72 }}
              >
                <Check className="w-9 h-9 stroke-[2.5]" />
              </button>
            </div>
          </div>
        )}
      </div>

      <FilterSheet open={filterOpen} filters={filters} onClose={() => setFilterOpen(false)} onApply={handleApplyFilters} />

      <TripDetailSheet
        trip={detailTrip}
        onClose={() => setDetailTrip(null)}
        isSignedIn={!!isSignedIn}
        onSave={() => {
          if (detailTrip) {
            if (isSignedIn) {
              saveTrip.mutate({
                data: {
                  tripData: detailTrip,
                  destination: detailTrip.destination,
                  totalPrice: detailTrip.totalPrice,
                  imageUrl: detailTrip.imageUrl,
                },
              });
              setDetailTrip(null);
            } else {
              setLocation("/sign-up");
            }
          }
        }}
      />
    </>
  );
}

/* ─── Trip Card ─────────────────────────────────────────────────────────── */
function TripCard({
  trip, isTop, index, onSwipe, onInfo,
  likeLabel, nopeLabel, totalLabel, caption, departureFrom,
}: {
  trip: TripSuggestion;
  isTop: boolean;
  index: number;
  onSwipe: (dir: "left" | "right") => void;
  onInfo: () => void;
  likeLabel: string;
  nopeLabel: string;
  totalLabel: string;
  caption: string;
  departureFrom?: string;
}) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-10, 10]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);
  const likeOpacity = useTransform(x, [0, 100], [0, 1]);
  const nopeOpacity = useTransform(x, [0, -100], [0, 1]);

  const roundTripTransport = trip.transport.price + (trip.returnTransport?.price ?? 0);

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
            {/* Fun caption pill */}
            <div className="absolute top-4 left-4 bg-black/55 backdrop-blur-md text-white text-xs font-semibold px-3 py-1.5 rounded-full pointer-events-none max-w-[60%] truncate">
              {caption}
            </div>
            {/* Info button */}
            <button
              onClick={(e) => { e.stopPropagation(); onInfo(); }}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/60 transition-colors z-10"
            >
              <Info className="w-4 h-4" />
            </button>
          </>
        )}

        {isTop && (
          <>
            <motion.div
              style={{ opacity: likeOpacity }}
              className="absolute top-16 left-6 border-4 border-green-400 text-green-400 font-black text-3xl px-4 py-2 rounded-xl rotate-[-15deg] pointer-events-none"
            >
              {likeLabel}
            </motion.div>
            <motion.div
              style={{ opacity: nopeOpacity }}
              className="absolute top-16 right-6 border-4 border-red-400 text-red-400 font-black text-3xl px-4 py-2 rounded-xl rotate-[15deg] pointer-events-none"
            >
              {nopeLabel}
            </motion.div>
          </>
        )}

        <div className="absolute bottom-0 left-0 right-0 p-5 text-white pointer-events-none">
          <h2 className="text-3xl font-bold mb-0.5">{trip.destination}</h2>
          <p className="text-white/80 font-medium mb-3">{trip.country}</p>
          <div className="flex gap-2.5 mb-3">
            {/* Round-trip transport price + route */}
            <div className="flex items-center gap-1.5 bg-black/45 backdrop-blur-md px-3 py-1.5 rounded-full text-sm">
              <Plane className="w-3.5 h-3.5" />
              {departureFrom ? (
                <span className="text-xs max-w-[90px] truncate">{departureFrom.split(" ")[0]} → {trip.destination}</span>
              ) : (
                <>
                  <span className="text-[11px] opacity-80">↕</span>
                  <span>${roundTripTransport}</span>
                </>
              )}
            </div>
            {/* Hotel per night */}
            <div className="flex items-center gap-1.5 bg-black/45 backdrop-blur-md px-3 py-1.5 rounded-full text-sm">
              <Hotel className="w-3.5 h-3.5" /><span>${trip.hotel.pricePerNight}/nt</span>
            </div>
          </div>
          <div className="flex items-end justify-between">
            <p className="text-sm text-white/80 line-clamp-2 pr-4 leading-relaxed">{trip.description}</p>
            <div className="text-right shrink-0">
              <p className="text-[10px] text-white/60 uppercase tracking-widest font-bold mb-0.5">{totalLabel}</p>
              <p className="text-2xl font-black">${trip.totalPrice}</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Transport block (reused for outbound + return) ─────────────────────── */
function TransportBlock({
  label, transport, t,
}: {
  label: string;
  transport: NonNullable<TripSuggestion["returnTransport"]>;
  t: ReturnType<typeof useI18n>["t"];
}) {
  return (
    <div>
      <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">{label}</p>
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
  trip, onClose, isSignedIn, onSave,
}: {
  trip: TripSuggestion | null;
  onClose: () => void;
  isSignedIn: boolean;
  onSave: () => void;
}) {
  const { t } = useI18n();

  return (
    <Sheet open={!!trip} onOpenChange={(open) => { if (!open) onClose(); }}>
      <SheetContent side="bottom" className="h-[90dvh] p-0 rounded-t-3xl overflow-hidden flex flex-col">
        {trip && (
          <>
            {/* Hero image */}
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
                    <p className="text-2xl font-bold">${trip.totalPrice}</p>
                    <p className="text-xs text-white/60">{t.tripDetail.perPerson}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-5 space-y-6">
              {/* Overview */}
              <section>
                <h3 className="font-bold text-base mb-2">{t.tripDetail.overview}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{trip.description}</p>
              </section>

              {/* Highlights */}
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

              {/* Transport: outbound + return */}
              <section className="bg-muted/40 rounded-2xl p-4 space-y-4">
                <h3 className="font-bold text-base flex items-center gap-2">
                  <Plane className="w-4 h-4 text-primary" />
                  {trip.transport.type === "train" ? t.tripDetail.train : t.tripDetail.flight}
                </h3>
                <TransportBlock label={t.tripDetail.outbound} transport={trip.transport} t={t} />
                {trip.returnTransport && (
                  <>
                    <div className="border-t border-border" />
                    <TransportBlock label={t.tripDetail.returnJourney} transport={trip.returnTransport} t={t} />
                  </>
                )}
              </section>

              {/* Hotel */}
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
                  <div className="flex flex-wrap items-center gap-3 text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      {trip.hotel.stars} {t.tripDetail.stars}
                    </span>
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

              {/* Stats row */}
              <section className="flex gap-3">
                <div className="flex-1 bg-muted/40 rounded-xl p-3 text-center">
                  <Clock className="w-4 h-4 mx-auto text-muted-foreground mb-1" />
                  <p className="text-lg font-bold">{trip.durationDays}</p>
                  <p className="text-xs text-muted-foreground">{t.tripDetail.nights}</p>
                </div>
                <div className="flex-1 bg-muted/40 rounded-xl p-3 text-center">
                  <Plane className="w-4 h-4 mx-auto text-muted-foreground mb-1" />
                  <p className="text-lg font-bold">${trip.transport.price + (trip.returnTransport?.price ?? 0)}</p>
                  <p className="text-xs text-muted-foreground">{t.tripDetail.flight} ↕</p>
                </div>
                <div className="flex-1 bg-muted/40 rounded-xl p-3 text-center">
                  <Hotel className="w-4 h-4 mx-auto text-muted-foreground mb-1" />
                  <p className="text-lg font-bold">${trip.hotelTotalCost ?? trip.hotel.pricePerNight}</p>
                  <p className="text-xs text-muted-foreground">{t.tripDetail.totalHotel}</p>
                </div>
              </section>

              {/* CTA */}
              <Button size="lg" className="w-full" onClick={onSave}>
                {isSignedIn ? (
                  <><Check className="w-4 h-4 mr-2" />{t.tripDetail.saveTrip}</>
                ) : (
                  <>{t.tripDetail.signUpCta} <ArrowRight className="w-4 h-4 ml-2" /></>
                )}
              </Button>

              <div className="h-4" />
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
