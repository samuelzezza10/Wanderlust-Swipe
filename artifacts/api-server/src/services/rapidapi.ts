/**
 * RapidAPI Booking.com client — server-side ONLY.
 *
 * Reads `RAPIDAPI_KEY` and `RAPIDAPI_HOST` from env. These secrets must NOT
 * be exposed to the browser (no VITE_ prefix). All requests run from the
 * Express server; the client hits our /api/external/rapid/* routes instead.
 *
 * Default host targets the popular "booking-com15.p.rapidapi.com" provider
 * (ApiDojo). If the user subscribed to a different Booking RapidAPI service,
 * setting RAPIDAPI_HOST in env points every call at it without code changes.
 */
import { logger } from "../lib/logger";

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY ?? "";
const RAPIDAPI_HOST = process.env.RAPIDAPI_HOST || "booking-com15.p.rapidapi.com";

export function isRapidApiConfigured(): boolean {
  return RAPIDAPI_KEY.length > 0;
}

/**
 * Diagnostic helper — pings searchDestination and returns the raw upstream
 * status + the host header we used. Lets us tell at a glance whether the
 * RAPIDAPI_HOST env matches what the subscribed plan expects, without ever
 * exposing the key itself.
 */
export async function diagnoseRapidApi(): Promise<{
  host: string;
  keySet: boolean;
  flightsStatus: number | null;
  hotelsStatus: number | null;
  flightsBody?: string;
  hotelsBody?: string;
}> {
  if (!RAPIDAPI_KEY) {
    return { host: RAPIDAPI_HOST, keySet: false, flightsStatus: null, hotelsStatus: null };
  }
  const ping = async (path: string) => {
    try {
      const r = await fetch(`https://${RAPIDAPI_HOST}${path}?query=Rome`, {
        headers: {
          "X-RapidAPI-Key": RAPIDAPI_KEY,
          "X-RapidAPI-Host": RAPIDAPI_HOST,
          Accept: "application/json",
        },
      });
      const body = await r.text();
      // Truncate body so we don't dump full payloads, but keep enough to
      // see the upstream error message (e.g. "You are not subscribed…").
      return { status: r.status, body: body.slice(0, 200) };
    } catch {
      return { status: 0, body: "fetch threw" };
    }
  };
  const [f, h] = await Promise.all([
    ping("/api/v1/flights/searchDestination"),
    ping("/api/v1/hotels/searchDestination"),
  ]);
  return {
    host: RAPIDAPI_HOST,
    keySet: true,
    flightsStatus: f.status,
    hotelsStatus: h.status,
    flightsBody: f.body,
    hotelsBody: h.body,
  };
}

/* ── Low-level fetch ────────────────────────────────────────────────────── */

/**
 * In-memory TTL cache, tiered by data volatility to mirror what large OTAs
 * (Skyscanner, Booking) ship in production:
 *
 *   FLIGHT   — 10 minutes. Prices & seat availability move on a minutes scale.
 *   HOTEL    — 30 minutes. Room inventory turns over more slowly than flights.
 *   STATIC   — 24 hours. Airport IATA codes & city dest_ids essentially never
 *              change; caching them aggressively saves the bulk of our quota
 *              (every flight or hotel search resolves 1-2 destinations first).
 *
 * Negative results (null) get a much shorter TTL so a transient 429/403
 * doesn't lock a route out for the full positive TTL.
 *
 * Cache key = `path + sorted query params` — so e.g.
 *   /api/v1/flights/searchFlights?fromId=ROM&toId=PAR&departDate=2026-07-15&adults=2
 * is one key per (origin, destination, date, passengers) tuple, exactly as
 * requested. Two users searching the same trip share the same cached entry.
 */
export const CACHE_TTL = {
  FLIGHT: 10 * 60 * 1000, // 10 min — Skyscanner-equivalent for live flight pricing
  HOTEL: 30 * 60 * 1000, // 30 min — Booking-equivalent for room availability
  STATIC: 24 * 60 * 60 * 1000, // 24 h — airport / city autocomplete
  NEG: 60 * 1000, // 60 s — transient failure cooldown
} as const;

type CacheEntry = { value: unknown; expiresAt: number };
const rapidCache = new Map<string, CacheEntry>();

/**
 * Build the canonical cache key. Sorts params alphabetically so that two
 * callers passing the same logical query in different key orders share the
 * same cache slot.
 */
function buildCacheKey(path: string, params: URLSearchParams): string {
  const sorted = new URLSearchParams();
  [...params.keys()].sort().forEach((k) => sorted.set(k, params.get(k)!));
  return `${path}?${sorted.toString()}`;
}

async function rapidGet<T = unknown>(
  path: string,
  query: Record<string, string | number | undefined>,
  ttlMs: number,
): Promise<T | null> {
  if (!RAPIDAPI_KEY) {
    logger.warn("RAPIDAPI_KEY not set — skipping RapidAPI call");
    return null;
  }
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(query)) {
    if (v !== undefined && v !== null && v !== "") params.set(k, String(v));
  }
  const cacheKey = buildCacheKey(path, params);
  const cached = rapidCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.value as T | null;
  }

  const url = `https://${RAPIDAPI_HOST}${path}?${params.toString()}`;
  try {
    const resp = await fetch(url, {
      headers: {
        "X-RapidAPI-Key": RAPIDAPI_KEY,
        "X-RapidAPI-Host": RAPIDAPI_HOST,
        Accept: "application/json",
      },
    });
    if (!resp.ok) {
      logger.warn({ status: resp.status, path }, "RapidAPI request failed");
      rapidCache.set(cacheKey, { value: null, expiresAt: Date.now() + CACHE_TTL.NEG });
      return null;
    }
    const json = (await resp.json()) as T;
    rapidCache.set(cacheKey, { value: json, expiresAt: Date.now() + ttlMs });
    return json;
  } catch (err) {
    logger.error({ err, path }, "RapidAPI request error");
    rapidCache.set(cacheKey, { value: null, expiresAt: Date.now() + CACHE_TTL.NEG });
    return null;
  }
}

/* ── Destination resolver — needed for flights AND hotels ──────────────── */

interface RapidDestination {
  id?: string;
  dest_id?: string;
  code?: string;
  type?: string;
  city?: string;
  cityName?: string;
  name?: string;
  country?: string;
}

async function resolveFlightAirport(query: string): Promise<string | null> {
  // STATIC TTL: airport IATA codes are essentially immutable.
  const data = await rapidGet<{ data?: RapidDestination[] }>(
    "/api/v1/flights/searchDestination",
    { query },
    CACHE_TTL.STATIC,
  );
  const first = data?.data?.[0];
  return first?.id ?? first?.code ?? null;
}

async function resolveHotelDestId(query: string): Promise<string | null> {
  // STATIC TTL: city dest_ids on Booking change extremely rarely.
  const data = await rapidGet<{ data?: RapidDestination[] }>(
    "/api/v1/hotels/searchDestination",
    { query },
    CACHE_TTL.STATIC,
  );
  const first = data?.data?.[0];
  return first?.dest_id ?? first?.id ?? null;
}

/* ── Flights ───────────────────────────────────────────────────────────── */

export interface RapidFlightOffer {
  price: number;
  currency: string;
  airline: string;
  isDirect: boolean;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  deepLink?: string;
}

interface RawFlightOffer {
  priceBreakdown?: { total?: { units?: number; currencyCode?: string } };
  price?: { total?: { units?: number; currencyCode?: string } };
  segments?: Array<{
    legs?: Array<{
      carriersData?: Array<{ name?: string; code?: string }>;
      departureTime?: string;
      arrivalTime?: string;
    }>;
  }>;
  shareableUrl?: string;
}

export async function searchFlightsRapid(params: {
  origin: string;
  destination: string;
  departDate: string;
  returnDate?: string;
  adults?: number;
  maxBudgetTotal?: number; // hard upper bound — drop offers above it
}): Promise<RapidFlightOffer[]> {
  if (!isRapidApiConfigured()) return [];

  const [fromId, toId] = await Promise.all([
    resolveFlightAirport(params.origin),
    resolveFlightAirport(params.destination),
  ]);
  if (!fromId || !toId) {
    logger.warn({ origin: params.origin, destination: params.destination }, "RapidAPI: airport resolve failed");
    return [];
  }

  // FLIGHT TTL (10 min): prices & seat counts move on a minutes scale.
  const data = await rapidGet<{ data?: { flightOffers?: RawFlightOffer[] } }>(
    "/api/v1/flights/searchFlights",
    {
      fromId,
      toId,
      departDate: params.departDate,
      returnDate: params.returnDate,
      adults: params.adults ?? 1,
      currency_code: "EUR",
      sort: "BEST",
    },
    CACHE_TTL.FLIGHT,
  );

  const offers = data?.data?.flightOffers ?? [];
  const normalized: RapidFlightOffer[] = offers.map((o) => {
    const breakdown = o.priceBreakdown?.total ?? o.price?.total;
    const units = breakdown?.units ?? 0;
    const currency = breakdown?.currencyCode ?? "EUR";
    const legs = o.segments?.[0]?.legs ?? [];
    const first = legs[0];
    const last = legs[legs.length - 1];
    const carrier = first?.carriersData?.[0];
    return {
      price: units,
      currency,
      airline: carrier?.name || carrier?.code || "",
      isDirect: legs.length === 1,
      departureTime: (first?.departureTime ?? "").slice(11, 16),
      arrivalTime: (last?.arrivalTime ?? "").slice(11, 16),
      duration: "",
      deepLink: o.shareableUrl,
    };
  });

  // Hard budget filter on the party total (flight is already party total in BKG)
  if (params.maxBudgetTotal && params.maxBudgetTotal > 0) {
    return normalized.filter((f) => f.price > 0 && f.price <= params.maxBudgetTotal!);
  }
  return normalized.filter((f) => f.price > 0);
}

/* ── Hotels ────────────────────────────────────────────────────────────── */

export interface RapidHotelResult {
  hotelId: string;
  name: string;
  rating: number;
  pricePerNight: number;
  currency: string;
  bookingUrl: string;
  address: string;
  photoUrl?: string;
}

interface RawHotelHit {
  hotel_id?: number | string;
  property?: {
    id?: number;
    name?: string;
    reviewScore?: number;
    photoUrls?: string[];
    priceBreakdown?: { grossPrice?: { value?: number; currency?: string } };
    wishlistName?: string;
  };
  accessibilityLabel?: string;
}

export async function searchHotelsRapid(params: {
  destination: string;
  checkin: string;
  checkout: string;
  adults?: number;
  rooms?: number;
  maxPricePerNight?: number; // hard upper bound after dividing by nights
}): Promise<RapidHotelResult[]> {
  if (!isRapidApiConfigured()) return [];

  const destId = await resolveHotelDestId(params.destination);
  if (!destId) {
    logger.warn({ destination: params.destination }, "RapidAPI: hotel dest_id resolve failed");
    return [];
  }

  const nights = Math.max(
    1,
    Math.round(
      (new Date(params.checkout).getTime() - new Date(params.checkin).getTime()) /
        (1000 * 60 * 60 * 24)
    )
  );

  // HOTEL TTL (30 min): room inventory turns over more slowly than flights.
  const data = await rapidGet<{ data?: { hotels?: RawHotelHit[] } }>(
    "/api/v1/hotels/searchHotels",
    {
      dest_id: destId,
      search_type: "CITY",
      arrival_date: params.checkin,
      departure_date: params.checkout,
      adults: params.adults ?? 2,
      room_qty: params.rooms ?? 1,
      page_number: 1,
      currency_code: "EUR",
    },
    CACHE_TTL.HOTEL,
  );

  const hits = data?.data?.hotels ?? [];
  // Compute exact (un-rounded) per-night cost for budget comparison, then
  // round only for display — rounding before comparison can admit a hotel
  // that's actually 150.4€/night under a 150€/night cap.
  const enriched = hits.map((h) => {
    const p = h.property ?? {};
    const totalPrice = p.priceBreakdown?.grossPrice?.value ?? 0;
    const exactPerNight = nights > 0 ? totalPrice / nights : totalPrice;
    const hotelId = String(h.hotel_id ?? p.id ?? "");
    return {
      exactPerNight,
      result: {
        hotelId,
        name: p.name ?? p.wishlistName ?? "",
        rating: Number((p.reviewScore ?? 0).toFixed(1)),
        pricePerNight: Math.round(exactPerNight),
        currency: p.priceBreakdown?.grossPrice?.currency ?? "EUR",
        bookingUrl: hotelId
          ? `https://www.booking.com/hotel/${hotelId}.html`
          : `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(params.destination)}`,
        address: "",
        photoUrl: p.photoUrls?.[0],
      } satisfies RapidHotelResult,
    };
  });

  const cap = params.maxPricePerNight;
  return enriched
    .filter((h) => h.exactPerNight > 0 && (cap === undefined || h.exactPerNight <= cap))
    .map((h) => h.result);
}
