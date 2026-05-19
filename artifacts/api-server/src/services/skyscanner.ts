import { logger } from "../lib/logger";

const API_KEY = process.env.SKYSCANNER_API_KEY ?? "";
const BASE_URL = "https://partners.api.skyscanner.net/apiservices";

export interface SkyscannerQuote {
  MinPrice: number;
  Direct: boolean;
  OutboundLeg: {
    CarrierIds: number[];
    OriginId: number;
    DestinationId: number;
    DepartureDate: string;
  };
  InboundLeg?: {
    CarrierIds: number[];
    OriginId: number;
    DestinationId: number;
    DepartureDate: string;
  };
}

export interface SkyscannerResult {
  Quotes: SkyscannerQuote[];
  deepLink: string;
}

export async function searchFlightPrices(params: {
  originPlace: string;
  destinationPlace: string;
  outboundPartialDate: string;
  inboundPartialDate?: string;
  adults?: number;
  currency?: string;
  locale?: string;
  country?: string;
}): Promise<SkyscannerResult> {
  const empty: SkyscannerResult = { Quotes: [], deepLink: "" };
  if (!API_KEY) {
    logger.warn("Skyscanner API key not configured — returning empty quotes");
    return empty;
  }
  try {
    const {
      originPlace,
      destinationPlace,
      outboundPartialDate,
      inboundPartialDate,
      currency = "EUR",
      locale = "en-GB",
      country = "IT",
    } = params;

    const inbound = inboundPartialDate ? `/${inboundPartialDate}` : "";
    const url = `${BASE_URL}/browsequotes/v1.0/${country}/${currency}/${locale}/${originPlace}/${destinationPlace}/${outboundPartialDate}${inbound}?apiKey=${API_KEY}`;

    const resp = await fetch(url, {
      headers: { Accept: "application/json" },
    });
    if (!resp.ok) {
      logger.warn({ status: resp.status }, "Skyscanner quotes request failed");
      return empty;
    }
    const data = (await resp.json()) as { Quotes: SkyscannerQuote[] };
    const deepLink = buildSkyscannerDeepLink(originPlace, destinationPlace, outboundPartialDate, inboundPartialDate);
    return { Quotes: data.Quotes ?? [], deepLink };
  } catch (err) {
    logger.error({ err }, "Skyscanner searchFlightPrices error");
    return empty;
  }
}

function buildSkyscannerDeepLink(
  origin: string,
  destination: string,
  outDate: string,
  inDate?: string,
): string {
  const base = `https://www.skyscanner.net/transport/flights/${origin.toLowerCase()}/${destination.toLowerCase()}/${outDate.replace(/-/g, "").slice(2)}`;
  if (inDate) return `${base}/${inDate.replace(/-/g, "").slice(2)}/`;
  return `${base}/`;
}
