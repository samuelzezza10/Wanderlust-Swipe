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

/* ── Low-level fetch ────────────────────────────────────────────────────── */

async function rapidGet<T = unknown>(path: string, query: Record<string, string | number | undefined>): Promise<T | null> {
  if (!RAPIDAPI_KEY) {
    logger.warn("RAPIDAPI_KEY not set — skipping RapidAPI call");
    return null;
  }
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(query)) {
    if (v !== undefined && v !== null && v !== "") params.set(k, String(v));
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
      return null;
    }
    return (await resp.json()) as T;
  } catch (err) {
    logger.error({ err, path }, "RapidAPI request error");
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
  const data = await rapidGet<{ data?: RapidDestination[] }>(
    "/api/v1/flights/searchDestination",
    { query }
  );
  const first = data?.data?.[0];
  return first?.id ?? first?.code ?? null;
}

async function resolveHotelDestId(query: string): Promise<string | null> {
  const data = await rapidGet<{ data?: RapidDestination[] }>(
    "/api/v1/hotels/searchDestination",
    { query }
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
    }
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
    }
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
