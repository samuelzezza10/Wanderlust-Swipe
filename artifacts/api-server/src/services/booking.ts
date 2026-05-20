import { logger } from "../lib/logger";

const AFFILIATE_ID = process.env.BOOKING_AFFILIATE_ID ?? "";
const API_KEY = process.env.BOOKING_API_KEY ?? "";
const BASE_URL = "https://distribution-xml.booking.com/2.9/json";

export interface BookingHotel {
  hotel_id: number;
  name: string;
  review_score: number;
  min_total_price: number;
  currency_code: string;
  url: string;
  address: string;
  city: string;
  photo_url?: string;
}

export interface BookingHotelResult {
  hotelId: number;
  name: string;
  rating: number;
  pricePerNight: number;
  currency: string;
  bookingUrl: string;
  address: string;
  photoUrl?: string;
}

function makeHeaders() {
  return {
    ...(AFFILIATE_ID ? { "X-Affiliate-Id": AFFILIATE_ID } : {}),
    Authorization: `Bearer ${API_KEY}`,
    Accept: "application/json",
  };
}

/** Resolve a free-text destination name to a Booking.com city_id */
export async function lookupCityId(destination: string): Promise<string | null> {
  if (!API_KEY) return null;
  try {
    const query = new URLSearchParams({ text: destination, language: "it", rows: "3" });
    const resp = await fetch(`${BASE_URL}/cities?${query}`, { headers: makeHeaders() });
    if (!resp.ok) {
      logger.warn({ status: resp.status }, "Booking.com city lookup failed");
      return null;
    }
    const data = (await resp.json()) as { result?: Array<{ city_id: number; name: string }> };
    const cities = data.result ?? [];
    if (!cities.length) return null;
    return String(cities[0].city_id);
  } catch (err) {
    logger.warn({ err }, "Booking.com lookupCityId error");
    return null;
  }
}

export async function searchHotels(params: {
  city_ids?: string;
  checkout_date: string;
  checkin_date: string;
  room_number?: number;
  adults_number?: number;
  order_by?: "popularity" | "distance" | "review_score" | "price";
  filter_by_currency?: string;
  rows?: number;
}): Promise<BookingHotel[]> {
  if (!API_KEY) {
    logger.warn("Booking.com API key not configured — returning empty hotel list");
    return [];
  }
  try {
    const query = new URLSearchParams({
      checkin_date: params.checkin_date,
      checkout_date: params.checkout_date,
      room_number: String(params.room_number ?? 1),
      adults_number: String(params.adults_number ?? 2),
      order_by: params.order_by ?? "popularity",
      filter_by_currency: params.filter_by_currency ?? "EUR",
      rows: String(params.rows ?? 10),
      ...(params.city_ids ? { city_ids: params.city_ids } : {}),
    });
    const resp = await fetch(`${BASE_URL}/hotels?${query}`, { headers: makeHeaders() });
    if (!resp.ok) {
      logger.warn({ status: resp.status }, "Booking.com hotel search failed");
      return [];
    }
    const data = (await resp.json()) as { result: BookingHotel[] };
    return data.result ?? [];
  } catch (err) {
    logger.error({ err }, "Booking.com searchHotels error");
    return [];
  }
}

export async function searchHotelsByDestination(params: {
  destination: string;
  checkin: string;
  checkout: string;
  adults?: number;
  rooms?: number;
  limit?: number;
}): Promise<BookingHotelResult[]> {
  if (!API_KEY) {
    logger.warn("BOOKING_API_KEY not set — skipping real hotel fetch");
    return [];
  }

  try {
    const nights = Math.max(
      1,
      Math.round(
        (new Date(params.checkout).getTime() - new Date(params.checkin).getTime()) /
          (1000 * 60 * 60 * 24)
      )
    );

    // Step 1: resolve destination name → city_id for precise search
    const cityId = await lookupCityId(params.destination);

    const query = new URLSearchParams({
      checkin_date: params.checkin,
      checkout_date: params.checkout,
      room_number: String(params.rooms ?? 1),
      adults_number: String(params.adults ?? 2),
      order_by: "popularity",
      filter_by_currency: "EUR",
      rows: String(params.limit ?? 20),
      language: "it",
    });

    // Step 2: prefer city_ids (precise), fall back to text search
    if (cityId) {
      query.set("city_ids", cityId);
    } else {
      query.set("text", params.destination);
    }

    const resp = await fetch(`${BASE_URL}/hotels?${query}`, { headers: makeHeaders() });

    if (!resp.ok) {
      logger.warn(
        { status: resp.status, destination: params.destination, cityId },
        "Booking.com hotels-by-destination failed"
      );
      return [];
    }

    const data = (await resp.json()) as { result?: BookingHotel[] };
    const raw = data.result ?? [];

    return raw.map((h) => ({
      hotelId: h.hotel_id,
      name: h.name,
      rating: Number((h.review_score ?? 0).toFixed(1)),
      pricePerNight:
        nights > 0
          ? Math.round((h.min_total_price ?? 0) / nights)
          : (h.min_total_price ?? 0),
      currency: h.currency_code ?? "EUR",
      bookingUrl:
        h.url ||
        buildBookingAffiliateLink({
          destination: params.destination,
          checkin: params.checkin,
          checkout: params.checkout,
          adults: params.adults,
          rooms: params.rooms,
        }),
      address: h.address ?? "",
      photoUrl: h.photo_url,
    }));
  } catch (err) {
    logger.error({ err }, "Booking.com searchHotelsByDestination error");
    return [];
  }
}

export function buildBookingAffiliateLink(params: {
  destination: string;
  checkin: string;
  checkout: string;
  adults?: number;
  rooms?: number;
}): string {
  const aid = AFFILIATE_ID || "304142";
  const base = "https://www.booking.com/searchresults.html";
  const query = new URLSearchParams({
    ss: params.destination,
    checkin: params.checkin,
    checkout: params.checkout,
    group_adults: String(params.adults ?? 2),
    no_rooms: String(params.rooms ?? 1),
    aid,
  });
  return `${base}?${query}`;
}
