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
    const resp = await fetch(`${BASE_URL}/hotels?${query}`, {
      headers: {
        "X-Affiliate-Id": AFFILIATE_ID,
        Authorization: `Bearer ${API_KEY}`,
        Accept: "application/json",
      },
    });
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
