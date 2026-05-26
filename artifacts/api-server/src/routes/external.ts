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
