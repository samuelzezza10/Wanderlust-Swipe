import { Router } from "express";
import { searchFlights as amadeusFlights, searchAirportsCities } from "../services/amadeus";
import { searchFlightPrices } from "../services/skyscanner";
import { searchHotels, searchHotelsByDestination, buildBookingAffiliateLink } from "../services/booking";

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

  return res.json({ flights });
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

  return res.json({ hotels, affiliateLink });
});

export default router;
