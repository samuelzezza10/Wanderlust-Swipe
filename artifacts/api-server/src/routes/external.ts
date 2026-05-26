import { Router } from "express";
import { searchFlights as amadeusFlights, searchAirportsCities } from "../services/amadeus";
import { searchFlightPrices } from "../services/skyscanner";
import { searchHotels, searchHotelsByDestination, buildBookingAffiliateLink } from "../services/booking";
import {
  diagnoseRapidApi,
  isRapidApiConfigured,
  searchFlightsRapid,
  searchHotelsRapid,
} from "../services/rapidapi";

const router = Router();

/* ── Mock data — last-resort fallback when all upstream APIs are unavailable ─
 *
 * These fire ONLY when RapidAPI is configured (key present) but returns empty
 * due to quota exhaustion (429/403). Google APIs are excluded intentionally:
 * those work live and must never be mocked.
 * Prices are deterministic per (origin+destination+date) so the same search
 * always returns the same fake results during testing.
 */

function deterministicSeed(s: string): number {
  return s.split("").reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 0);
}

interface MockFlight {
  price: number; currency: string; airline: string; isDirect: boolean;
  departureTime: string; arrivalTime: string; duration: string;
  stops?: number; stopCities?: string[];
}
interface MockHotel {
  hotelId: number; name: string; rating: number; pricePerNight: number;
  originalPrice?: number; distanceFromCenter: number;
  currency: string; bookingUrl: string; address: string; photoUrl?: string;
}

const AIRLINES = ["Ryanair", "EasyJet", "Vueling", "Lufthansa", "ITA Airways", "Wizz Air", "Transavia"];
const LAYOVER_CITIES = ["MXP", "CDG", "MAD", "FCO", "AMS", "LHR", "FRA", "BCN", "VIE", "ATH"];
const HOTEL_PHOTOS = [
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400",
  "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400",
  "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400",
  "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400",
  "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400",
];

function getMockFlights(origin: string, dest: string, date: string, adults: number): MockFlight[] {
  const seed = deterministicSeed(`${origin}-${dest}-${date}`);
  const basePrice = 59 + (seed % 180); // 59–239 € per person
  const airline1 = AIRLINES[seed % AIRLINES.length];
  const airline2 = AIRLINES[(seed + 2) % AIRLINES.length];
  const airline3 = AIRLINES[(seed + 4) % AIRLINES.length];
  const depH = 5 + (seed % 14); // 05:xx–18:xx
  const durMin = 90 + (seed % 150); // 1h30–4h00
  const arrMin = depH * 60 + (seed % 30) + durMin;
  const fmt = (totalMin: number) =>
    `${String(Math.floor(totalMin / 60) % 24).padStart(2, "0")}:${String(totalMin % 60).padStart(2, "0")}`;
  const dur = (m: number) => `${Math.floor(m / 60)}h ${String(m % 60).padStart(2, "0")}m`;
  const layoverCity = LAYOVER_CITIES[(seed + 1) % LAYOVER_CITIES.length];
  return [
    {
      price: basePrice * adults,
      currency: "EUR", airline: airline1, isDirect: true,
      departureTime: fmt(depH * 60 + (seed % 30)),
      arrivalTime: fmt(arrMin),
      duration: dur(durMin),
      stops: 0,
    },
    {
      price: Math.round(basePrice * 1.35) * adults,
      currency: "EUR", airline: airline2, isDirect: false,
      departureTime: fmt((depH + 3) * 60 + (seed % 45)),
      arrivalTime: fmt((depH + 3) * 60 + (seed % 45) + durMin + 55),
      duration: dur(durMin + 55),
      stops: 1,
      stopCities: [layoverCity],
    },
    {
      price: Math.round(basePrice * 1.7) * adults,
      currency: "EUR", airline: airline3, isDirect: true,
      departureTime: fmt((depH + 7) * 60 + 10),
      arrivalTime: fmt((depH + 7) * 60 + 10 + durMin),
      duration: dur(durMin),
      stops: 0,
    },
  ];
}

const CITY_HOTELS: Record<string, { name: string; stars: number; area: string; distance: number; discountMult?: number }[]> = {
  berlin:  [{ name: "Hotel Adlon Kempinski", stars: 5, area: "Mitte", distance: 0.2 }, { name: "Motel One Berlin-Alexanderplatz", stars: 3, area: "Alexanderplatz", distance: 0.8, discountMult: 1.30 }, { name: "25hours Hotel Bikini", stars: 4, area: "Zoo", distance: 1.5 }],
  paris:   [{ name: "Hôtel du Louvre", stars: 4, area: "1st Arr.", distance: 0.4 }, { name: "ibis Paris Gare du Nord", stars: 3, area: "10th Arr.", distance: 1.2, discountMult: 1.22 }, { name: "Hôtel de la Paix", stars: 3, area: "Montmartre", distance: 2.8 }],
  rome:    [{ name: "Hotel de Russie", stars: 5, area: "Piazza del Popolo", distance: 0.6 }, { name: "Generator Roma", stars: 3, area: "Trastevere", distance: 1.4, discountMult: 1.25 }, { name: "Palazzo Manfredi", stars: 5, area: "Colosseum", distance: 0.3 }],
  london:  [{ name: "The Savoy", stars: 5, area: "Strand", distance: 0.7 }, { name: "Z Hotel Shoreditch", stars: 3, area: "Shoreditch", distance: 2.1, discountMult: 1.20 }, { name: "citizenM London Bankside", stars: 4, area: "South Bank", distance: 1.0 }],
  barcelona: [{ name: "W Barcelona", stars: 5, area: "Barceloneta", distance: 1.8 }, { name: "Hotel Arts", stars: 5, area: "Port Olímpic", distance: 2.2 }, { name: "Catalonia Eixample", stars: 4, area: "Eixample", distance: 0.9, discountMult: 1.28 }],
  amsterdam: [{ name: "Pulitzer Amsterdam", stars: 5, area: "Jordaan", distance: 0.5 }, { name: "The Student Hotel Amsterdam", stars: 3, area: "Westerpark", distance: 1.7, discountMult: 1.24 }, { name: "Park Hotel", stars: 4, area: "Leidseplein", distance: 0.8 }],
  madrid:  [{ name: "Gran Meliá Palacio de los Duques", stars: 5, area: "Opera", distance: 0.4 }, { name: "Hotel Único Madrid", stars: 5, area: "Serrano", distance: 1.1 }, { name: "Room Mate Óscar", stars: 4, area: "Gran Vía", distance: 0.6, discountMult: 1.18 }],
  vienna:  [{ name: "Hotel Sacher Wien", stars: 5, area: "Staatsoper", distance: 0.3 }, { name: "Ibis Wien Mariahilf", stars: 3, area: "6th District", distance: 1.3, discountMult: 1.22 }, { name: "Hotel Josefshof", stars: 4, area: "Josefstadt", distance: 1.0 }],
  lisbon:  [{ name: "Bairro Alto Hotel", stars: 5, area: "Bairro Alto", distance: 0.4 }, { name: "Generator Hostel Lisboa", stars: 3, area: "Mouraria", distance: 0.9, discountMult: 1.26 }, { name: "Hotel Aviz", stars: 4, area: "Marquês de Pombal", distance: 1.6 }],
  prague:  [{ name: "The Grand Mark Prague", stars: 5, area: "Old Town", distance: 0.2 }, { name: "Mosaic House Design Hotel", stars: 3, area: "Smíchov", distance: 1.8, discountMult: 1.20 }, { name: "Hotel Josef Prague", stars: 4, area: "Old Town", distance: 0.5 }],
};

function getMockHotels(destination: string, limit: number): MockHotel[] {
  const key = destination.toLowerCase().split(/[\s,]+/)[0];
  const seed = deterministicSeed(destination.toLowerCase());
  const templates = CITY_HOTELS[key] ?? [
    { name: `${destination} Grand Hotel`, stars: 4, area: "City Centre", distance: 0.5 },
    { name: `${destination} Budget Inn`, stars: 2, area: "Near Station", distance: 1.2, discountMult: 1.25 },
    { name: `${destination} Boutique Stay`, stars: 3, area: "Old Town", distance: 0.8 },
  ];
  return templates.slice(0, limit).map((t, i) => {
    const basePrice = 55 + (seed % 120) + i * 30; // staggered pricing
    const originalPrice = t.discountMult ? Math.round(basePrice * t.discountMult) : undefined;
    return {
      hotelId: (seed + i * 7) % 9_000_000 + 1_000_000,
      name: t.name,
      rating: Number((6.5 + (((seed + i) % 35) / 10)).toFixed(1)),
      pricePerNight: basePrice,
      originalPrice,
      distanceFromCenter: t.distance,
      currency: "EUR",
      bookingUrl: `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(destination)}`,
      address: `${t.area}, ${destination}`,
      photoUrl: HOTEL_PHOTOS[(seed + i) % HOTEL_PHOTOS.length],
    };
  });
}

router.get("/external/flights/search", async (req, res) => {
  const {
    origin,
    destination,
    departureDate,
    returnDate,
    adults = "2",
    nonStop,
    provider = "amadeus",
  } = req.query as Record<string, string>;

  if (!origin || !destination || !departureDate) {
    return res.status(400).json({ error: "origin, destination and departureDate are required" });
  }

  if (provider === "skyscanner") {
    const result = await searchFlightPrices({
      originPlace: origin,
      destinationPlace: destination,
      outboundPartialDate: departureDate,
      inboundPartialDate: returnDate,
    });
    return res.json(result);
  }

  const offers = await amadeusFlights({
    originLocationCode: origin,
    destinationLocationCode: destination,
    departureDate,
    returnDate,
    adults: parseInt(adults, 10),
    nonStop: nonStop === "true",
  });
  return res.json(offers);
});

router.get("/external/airports/search", async (req, res) => {
  const { q } = req.query as { q?: string };
  if (!q || q.length < 2) return res.json([]);
  const results = await searchAirportsCities(q);
  return res.json(results);
});

router.get("/external/hotels/search", async (req, res) => {
  const {
    destination,
    checkin,
    checkout,
    adults = "2",
    rooms = "1",
  } = req.query as Record<string, string>;

  if (!destination || !checkin || !checkout) {
    return res.status(400).json({ error: "destination, checkin and checkout are required" });
  }

  const hotels = await searchHotels({
    checkin_date: checkin,
    checkout_date: checkout,
    adults_number: parseInt(adults, 10),
    room_number: parseInt(rooms, 10),
  });

  const affiliateLink = buildBookingAffiliateLink({
    destination,
    checkin,
    checkout,
    adults: parseInt(adults, 10),
    rooms: parseInt(rooms, 10),
  });

  return res.json({ hotels, affiliateLink });
});

/**
 * Normalised flight search by IATA route.
 * Returns {flights: FlightEnrichResult[]} — same shape pattern as hotels/by-destination.
 */
router.get("/external/flights/by-route", async (req, res) => {
  const {
    origin,
    destination,
    departureDate,
    returnDate,
    adults = "1",
    limit = "10",
  } = req.query as Record<string, string>;

  if (!origin || !destination || !departureDate) {
    return res.status(400).json({ error: "origin, destination and departureDate are required" });
  }

  const offers = await amadeusFlights({
    originLocationCode: origin.toUpperCase().slice(0, 3),
    destinationLocationCode: destination.toUpperCase().slice(0, 3),
    departureDate: departureDate.slice(0, 10),
    returnDate: returnDate ? returnDate.slice(0, 10) : undefined,
    adults: Math.max(1, parseInt(adults, 10)),
    max: Math.min(20, parseInt(limit, 10)),
  });

  const flights = offers.map((offer) => {
    const segs  = offer.itineraries[0]?.segments ?? [];
    const first = segs[0];
    const last  = segs[segs.length - 1];
    const depAt = first?.departure?.at ?? "";
    const arrAt = last?.arrival?.at ?? "";
    const durRaw = offer.itineraries[0]?.duration ?? "";
    const durH = parseInt(durRaw.match(/(\d+)H/)?.[1] ?? "0", 10);
    const durM = parseInt(durRaw.match(/(\d+)M/)?.[1] ?? "0", 10);
    const duration = durH > 0 ? `${durH}h ${String(durM).padStart(2, "0")}m` : `${durM}m`;
    return {
      price:         parseFloat(offer.price.total),
      currency:      offer.price.currency,
      airline:       first?.carrierCode ?? "",
      isDirect:      segs.length === 1,
      departureTime: depAt.slice(11, 16),
      arrivalTime:   arrAt.slice(11, 16),
      duration,
    };
  });

  // Fallback to RapidAPI Booking when Amadeus returns nothing AND RapidAPI is
  // configured. Keeps the client contract identical — same FlightEnrichResult
  // shape, same wrapper { flights: [...] } — so no client change needed.
  if (flights.length === 0 && isRapidApiConfigured()) {
    const rapid = await searchFlightsRapid({
      origin:      origin.toUpperCase().slice(0, 3),
      destination: destination.toUpperCase().slice(0, 3),
      departDate:  departureDate.slice(0, 10),
      returnDate:  returnDate ? returnDate.slice(0, 10) : undefined,
      adults:      Math.max(1, parseInt(adults, 10)),
    });
    if (rapid.length > 0) {
      return res.json({
        flights: rapid.map((r) => ({
          price:         r.price,
          currency:      r.currency,
          airline:       r.airline,
          isDirect:      r.isDirect,
          departureTime: r.departureTime,
          arrivalTime:   r.arrivalTime,
          duration:      r.duration,
        })),
        source: "rapidapi",
      });
    }
  }

  // Last-resort mock fallback: if both Amadeus and RapidAPI returned nothing
  // (e.g. quota exhausted) and RapidAPI is configured, return deterministic
  // demo data so the swipe deck stays testable. Never fires for hotels or
  // Google endpoints — those have their own live sources.
  if (flights.length === 0 && isRapidApiConfigured()) {
    return res.json({
      flights: getMockFlights(
        origin.toUpperCase().slice(0, 3),
        destination.toUpperCase().slice(0, 3),
        departureDate.slice(0, 10),
        Math.max(1, parseInt(adults, 10)),
      ),
      source: "mock",
    });
  }

  return res.json({ flights, source: "amadeus" });
});

router.get("/external/hotels/by-destination", async (req, res) => {
  const {
    destination,
    checkin,
    checkout,
    adults = "2",
    rooms = "1",
    limit = "5",
  } = req.query as Record<string, string>;

  if (!destination || !checkin || !checkout) {
    return res.status(400).json({ error: "destination, checkin e checkout sono obbligatori" });
  }

  const hotels = await searchHotelsByDestination({
    destination,
    checkin,
    checkout,
    adults: parseInt(adults, 10),
    rooms: parseInt(rooms, 10),
    limit: parseInt(limit, 10),
  });

  const affiliateLink = buildBookingAffiliateLink({
    destination,
    checkin,
    checkout,
    adults: parseInt(adults, 10),
    rooms: parseInt(rooms, 10),
  });

  // Fallback to RapidAPI Booking when the official Booking pipeline returns
  // nothing AND RapidAPI is configured. RapidHotelResult has hotelId:string;
  // the client's BookingHotelResult expects hotelId:number — convert by
  // parsing (booking.com hotel IDs are numeric) with a 0 fallback so the
  // shape never breaks even on malformed upstream rows.
  if (hotels.length === 0 && isRapidApiConfigured()) {
    const rapid = await searchHotelsRapid({
      destination,
      checkin,
      checkout,
      adults: parseInt(adults, 10),
      rooms: parseInt(rooms, 10),
    });
    if (rapid.length > 0) {
      return res.json({
        hotels: rapid.slice(0, parseInt(limit, 10)).map((h) => ({
          hotelId:       Number(h.hotelId) || 0,
          name:          h.name,
          rating:        h.rating,
          pricePerNight: h.pricePerNight,
          currency:      h.currency,
          bookingUrl:    h.bookingUrl,
          address:       h.address,
          photoUrl:      h.photoUrl,
        })),
        affiliateLink,
        source: "rapidapi",
      });
    }
  }

  // Last-resort mock fallback for hotels (same rationale as flights above).
  if (hotels.length === 0 && isRapidApiConfigured()) {
    return res.json({
      hotels: getMockHotels(destination, parseInt(limit, 10) || 5),
      affiliateLink,
      source: "mock",
    });
  }

  return res.json({ hotels, affiliateLink, source: "booking" });
});

/**
 * RapidAPI Booking — real flights with hard server-side budget filter.
 * Client passes max party total; we drop any offer that busts it BEFORE
 * sending results to the browser so the swipe deck can't show busts.
 */
/**
 * Diagnostic endpoint — reveals whether the upstream is reachable with the
 * current key+host pair. Returns the host (safe), key-set flag, and the
 * upstream HTTP status + a truncated error body so we can tell at a glance
 * if it's a wrong-host (404), wrong-subscription (403), or rate-limit (429).
 * Never returns the key itself.
 */
router.get("/external/rapid/_diag", async (_req, res) => {
  const result = await diagnoseRapidApi();
  return res.json(result);
});

router.get("/external/rapid/flights", async (req, res) => {
  const {
    origin,
    destination,
    departureDate,
    returnDate,
    adults = "1",
    maxBudgetTotal,
  } = req.query as Record<string, string>;

  // Validate inputs FIRST so callers get a proper 400 on bad params even when
  // the upstream key is missing — silent 200s on garbage input hide bugs.
  if (!origin || !destination || !departureDate) {
    return res.status(400).json({ error: "origin, destination and departureDate are required" });
  }
  let budgetCap: number | undefined;
  if (maxBudgetTotal !== undefined && maxBudgetTotal !== "") {
    const parsed = Number(maxBudgetTotal);
    if (!Number.isFinite(parsed) || parsed <= 0) {
      return res.status(400).json({ error: "maxBudgetTotal must be a positive number" });
    }
    budgetCap = parsed;
  }
  if (!isRapidApiConfigured()) {
    return res.json({ flights: [], configured: false });
  }

  const flights = await searchFlightsRapid({
    origin,
    destination,
    departDate: departureDate.slice(0, 10),
    returnDate: returnDate ? returnDate.slice(0, 10) : undefined,
    adults: Math.max(1, parseInt(adults, 10)),
    maxBudgetTotal: budgetCap,
  });

  return res.json({ flights, configured: true });
});

/**
 * RapidAPI Booking — real hotels with hard per-night budget filter.
 * Falls back automatically when the official BOOKING_API_KEY pipeline is
 * unavailable; otherwise serves as a second source.
 */
router.get("/external/rapid/hotels", async (req, res) => {
  const {
    destination,
    checkin,
    checkout,
    adults = "2",
    rooms = "1",
    maxPricePerNight,
  } = req.query as Record<string, string>;

  // Validate inputs FIRST — bad params should 400 even when key missing.
  if (!destination || !checkin || !checkout) {
    return res.status(400).json({ error: "destination, checkin and checkout are required" });
  }
  let nightCap: number | undefined;
  if (maxPricePerNight !== undefined && maxPricePerNight !== "") {
    const parsed = Number(maxPricePerNight);
    if (!Number.isFinite(parsed) || parsed <= 0) {
      return res.status(400).json({ error: "maxPricePerNight must be a positive number" });
    }
    nightCap = parsed;
  }
  if (!isRapidApiConfigured()) {
    return res.json({ hotels: [], affiliateLink: "", configured: false });
  }

  const hotels = await searchHotelsRapid({
    destination,
    checkin,
    checkout,
    adults: parseInt(adults, 10),
    rooms: parseInt(rooms, 10),
    maxPricePerNight: nightCap,
  });

  const affiliateLink = buildBookingAffiliateLink({
    destination,
    checkin,
    checkout,
    adults: parseInt(adults, 10),
    rooms: parseInt(rooms, 10),
  });

  return res.json({ hotels, affiliateLink, configured: true });
});

export default router;
