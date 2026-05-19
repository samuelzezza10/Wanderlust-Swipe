import { logger } from "../lib/logger";

const BASE_URL = "https://test.api.amadeus.com";
const CLIENT_ID = process.env.AMADEUS_CLIENT_ID ?? "";
const CLIENT_SECRET = process.env.AMADEUS_CLIENT_SECRET ?? "";

interface TokenCache {
  access_token: string;
  expires_at: number;
}

let tokenCache: TokenCache | null = null;

async function getAccessToken(): Promise<string> {
  if (tokenCache && Date.now() < tokenCache.expires_at - 30_000) {
    return tokenCache.access_token;
  }
  const resp = await fetch(`${BASE_URL}/v1/security/oauth2/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
    }),
  });
  if (!resp.ok) throw new Error(`Amadeus token error: ${resp.status}`);
  const data = (await resp.json()) as { access_token: string; expires_in: number };
  tokenCache = {
    access_token: data.access_token,
    expires_at: Date.now() + data.expires_in * 1000,
  };
  return tokenCache.access_token;
}

export interface FlightOffer {
  id: string;
  price: { total: string; currency: string };
  itineraries: Array<{
    duration: string;
    segments: Array<{
      departure: { iataCode: string; at: string };
      arrival: { iataCode: string; at: string };
      carrierCode: string;
      number: string;
    }>;
  }>;
}

export async function searchFlights(params: {
  originLocationCode: string;
  destinationLocationCode: string;
  departureDate: string;
  returnDate?: string;
  adults: number;
  nonStop?: boolean;
  currencyCode?: string;
  max?: number;
}): Promise<FlightOffer[]> {
  if (!CLIENT_ID || !CLIENT_SECRET) {
    logger.warn("Amadeus credentials not configured — returning empty flight offers");
    return [];
  }
  try {
    const token = await getAccessToken();
    const query = new URLSearchParams({
      originLocationCode: params.originLocationCode,
      destinationLocationCode: params.destinationLocationCode,
      departureDate: params.departureDate,
      adults: String(params.adults),
      max: String(params.max ?? 10),
      currencyCode: params.currencyCode ?? "EUR",
      ...(params.returnDate ? { returnDate: params.returnDate } : {}),
      ...(params.nonStop ? { nonStop: "true" } : {}),
    });
    const resp = await fetch(`${BASE_URL}/v2/shopping/flight-offers?${query}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!resp.ok) {
      logger.warn({ status: resp.status }, "Amadeus flight search failed");
      return [];
    }
    const data = (await resp.json()) as { data: FlightOffer[] };
    return data.data ?? [];
  } catch (err) {
    logger.error({ err }, "Amadeus searchFlights error");
    return [];
  }
}

export interface AirportCity {
  iataCode: string;
  name: string;
  cityName: string;
  countryName: string;
}

export async function searchAirportsCities(keyword: string): Promise<AirportCity[]> {
  if (!CLIENT_ID || !CLIENT_SECRET) return [];
  try {
    const token = await getAccessToken();
    const resp = await fetch(
      `${BASE_URL}/v1/reference-data/locations?keyword=${encodeURIComponent(keyword)}&subType=AIRPORT,CITY`,
      { headers: { Authorization: `Bearer ${token}` } },
    );
    if (!resp.ok) return [];
    const data = (await resp.json()) as {
      data: Array<{ iataCode: string; name: string; address: { cityName: string; countryName: string } }>;
    };
    return (data.data ?? []).map((loc) => ({
      iataCode: loc.iataCode,
      name: loc.name,
      cityName: loc.address?.cityName ?? "",
      countryName: loc.address?.countryName ?? "",
    }));
  } catch (err) {
    logger.error({ err }, "Amadeus searchAirportsCities error");
    return [];
  }
}
