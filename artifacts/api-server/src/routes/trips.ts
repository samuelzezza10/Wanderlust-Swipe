import { Router } from "express";
import { getAuth } from "@clerk/express";

const router = Router();

const DESTINATIONS = [
  {
    destination: "Paris",
    country: "France",
    description: "The City of Light awaits with world-class cuisine, iconic landmarks, and unmatched romance.",
    highlights: ["Eiffel Tower", "Louvre Museum", "Notre-Dame Cathedral", "Montmartre"],
    tags: ["romantic", "culture", "food", "art"],
    imageUrl: "/destinations/paris.png",
  },
  {
    destination: "Bali",
    country: "Indonesia",
    description: "A tropical paradise blending lush rice terraces, ancient temples, and pristine beaches.",
    highlights: ["Ubud Rice Terraces", "Tanah Lot Temple", "Seminyak Beach", "Mount Batur"],
    tags: ["beach", "nature", "spiritual", "adventure"],
    imageUrl: "/destinations/bali.png",
  },
  {
    destination: "Tokyo",
    country: "Japan",
    description: "Where ancient tradition meets ultramodern innovation in the world's most dynamic city.",
    highlights: ["Shibuya Crossing", "Senso-ji Temple", "Tsukiji Market", "Akihabara"],
    tags: ["culture", "food", "technology", "shopping"],
    imageUrl: "/destinations/tokyo.png",
  },
  {
    destination: "Santorini",
    country: "Greece",
    description: "Iconic blue-domed churches, volcanic beaches, and spectacular Aegean sunsets.",
    highlights: ["Oia Village", "Akrotiri Ruins", "Red Beach", "Caldera Views"],
    tags: ["romantic", "scenic", "beach", "luxury"],
    imageUrl: "/destinations/santorini.png",
  },
  {
    destination: "New York",
    country: "United States",
    description: "The city that never sleeps — a vertical metropolis of culture, food, and limitless energy.",
    highlights: ["Central Park", "Times Square", "Brooklyn Bridge", "The Met"],
    tags: ["city", "culture", "food", "shopping"],
    imageUrl: "/destinations/new-york.png",
  },
  {
    destination: "Lisbon",
    country: "Portugal",
    description: "A sun-drenched city of colorful tiles, Fado music, and breathtaking hilltop views.",
    highlights: ["Alfama District", "Belem Tower", "Sintra Day Trip", "LX Factory"],
    tags: ["culture", "food", "scenic", "affordable"],
    imageUrl: "/destinations/lisbon.png",
  },
  {
    destination: "Maldives",
    country: "Maldives",
    description: "Crystal-clear turquoise waters, overwater bungalows, and pristine coral reefs.",
    highlights: ["Overwater Bungalows", "Snorkeling", "Sunset Cruises", "Dolphin Watching"],
    tags: ["luxury", "beach", "romantic", "nature"],
    imageUrl: "/destinations/maldives.png",
  },
  {
    destination: "Barcelona",
    country: "Spain",
    description: "Gaudí's architectural masterpieces, lively tapas bars, and sun-kissed Mediterranean beaches.",
    highlights: ["Sagrada Família", "Park Güell", "Las Ramblas", "Gothic Quarter"],
    tags: ["culture", "food", "beach", "architecture"],
    imageUrl: "/destinations/barcelona.png",
  },
];

const AIRLINES = ["Air France", "Ryanair", "Vueling", "EasyJet", "British Airways", "Lufthansa", "Emirates", "Qatar Airways"];
const TRAINS = ["Eurostar", "TGV", "Thalys", "Renfe AVE", "Trenitalia"];
const HOTELS_BUDGET = [
  ["Hostel Central", "Budget Inn", "City Sleep"],
  ["Backpacker Paradise", "Bali Budget Lodge", "Eco Hostel"],
  ["Tokyo Budget Hotel", "Shinjuku Capsule", "Asakusa Inn"],
  ["Santorini Guesthouse", "Aegean Budget Stay", "Oia Hostel"],
  ["NYC Budget Inn", "Manhattan Hostel", "Brooklyn Bed & Breakfast"],
  ["Lisbon Budget Stay", "Alfama Hostel", "Central Lisbon Inn"],
  ["Maldives Guesthouse", "Island Budget Lodge", "Coral Hostel"],
  ["Barcelona Hostel", "Gothic Budget Inn", "Barceloneta Hostel"],
];
const HOTELS_STANDARD = [
  ["Grand Hotel Metropole", "Boutique Lumière", "The Urban Lodge"],
  ["Sunset Paradise Resort", "Bali Eco Retreat", "Villa Lotus"],
  ["Tokyo Garden Hotel", "Shinjuku Grand", "Akihabara Inn"],
  ["Santorini Dream Suites", "Caldera Blue Hotel", "Aegean Cliff Lodge"],
  ["Manhattan View Hotel", "Brooklyn Boutique", "SoHo Grand Inn"],
  ["Lisbon Heritage Hotel", "Alfama Terrace", "Belem River Lodge"],
  ["Overwater Paradise Villa", "Blue Lagoon Resort", "Coral Garden Lodge"],
  ["Barcelona Modernisme", "Gothic Quarter Inn", "Barceloneta Suites"],
];
const HOTELS_LUXURY = [
  ["Four Seasons Paris", "Le Bristol Paris", "Ritz Paris"],
  ["Four Seasons Bali", "COMO Uma Ubud", "Amandari Resort"],
  ["Park Hyatt Tokyo", "Aman Tokyo", "The Peninsula Tokyo"],
  ["Grace Hotel Santorini", "Canaves Oia", "Mystique Hotel"],
  ["The Mark NYC", "Mandarin Oriental NY", "Four Seasons Manhattan"],
  ["Bairro Alto Hotel", "Memmo Alfama", "Four Seasons Ritz Lisbon"],
  ["Soneva Jani", "Gili Lankanfushi", "Four Seasons Maldives"],
  ["Hotel Arts Barcelona", "W Barcelona", "Mandarin Oriental Barcelona"],
];

const AMENITIES = [
  ["WiFi", "Pool", "Spa", "Restaurant", "Gym"],
  ["WiFi", "Beach Access", "Bar", "Concierge"],
  ["WiFi", "Gym", "Restaurant", "24h Reception"],
  ["WiFi", "Pool", "Ocean View", "Breakfast"],
];

function randomBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

type AccommodationType = "budget" | "standard" | "luxury" | null;

function generateTripSuggestion(
  destIndex: number,
  budget: number,
  numberOfPeople: number,
  numberOfNights: number,
  flightPreference: string,
  accommodationType: AccommodationType,
  id: string,
) {
  const dest = DESTINATIONS[destIndex % DESTINATIONS.length];

  // Determine stars based on accommodation type
  let stars: number;
  let hotelList: string[][];
  if (accommodationType === "budget") {
    stars = randomBetween(2, 3);
    hotelList = HOTELS_BUDGET;
  } else if (accommodationType === "luxury") {
    stars = randomBetween(4, 5);
    hotelList = HOTELS_LUXURY;
  } else {
    stars = randomBetween(3, 4);
    hotelList = HOTELS_STANDARD;
  }

  const pricePerPerson = Math.min(
    budget,
    randomBetween(Math.floor(budget * 0.4), Math.floor(budget * 0.9)),
  );
  const totalPrice = pricePerPerson * numberOfPeople;

  const isFlightDest = ["Paris", "Bali", "Tokyo", "Santorini", "New York", "Maldives"].includes(dest.destination);
  const useTrainRandom = Math.random() > 0.6 && !isFlightDest;
  const useTransportType = useTrainRandom ? "train" : "flight";

  const isDirect = flightPreference === "direct" || (flightPreference !== "with_stops" && Math.random() > 0.4);
  const durationHours = randomBetween(1, 12);
  const durationMins = randomBetween(0, 59);
  const durationStr = `${durationHours}h ${durationMins}m`;

  const transportPrice = Math.floor(pricePerPerson * 0.45);
  const hotelIdx = destIndex % hotelList.length;
  const hotelNames = hotelList[hotelIdx];
  const hotelName = hotelNames[randomBetween(0, hotelNames.length - 1)];
  const pricePerNight = Math.floor((pricePerPerson * 0.55) / numberOfNights);
  const amenitySet = AMENITIES[randomBetween(0, AMENITIES.length - 1)];
  const distanceFromCenter = parseFloat((Math.random() * 4 + 0.5).toFixed(1));
  const transportToHotelKm = parseFloat((Math.random() * 25 + 2).toFixed(1));

  const departureHour = randomBetween(6, 20);
  const arrivalHour = (departureHour + durationHours) % 24;
  const fmt = (h: number) => `${String(h).padStart(2, "0")}:${String(randomBetween(0, 59)).padStart(2, "0")}`;

  const company =
    useTransportType === "train"
      ? TRAINS[randomBetween(0, TRAINS.length - 1)]
      : AIRLINES[randomBetween(0, AIRLINES.length - 1)];

  return {
    id,
    destination: dest.destination,
    country: dest.country,
    totalPrice,
    pricePerPerson,
    transport: {
      type: useTransportType,
      company,
      duration: durationStr,
      price: transportPrice,
      isDirect,
      departureTime: fmt(departureHour),
      arrivalTime: fmt(arrivalHour),
    },
    hotel: {
      name: hotelName,
      stars,
      pricePerNight,
      distanceFromCenter,
      amenities: amenitySet,
      rating: parseFloat((3.5 + Math.random() * 1.5).toFixed(1)),
      imageUrl: null,
    },
    description: dest.description,
    highlights: dest.highlights,
    imageUrl: dest.imageUrl,
    durationDays: numberOfNights + 1,
    transportToHotelKm,
    tags: dest.tags,
  };
}

router.post("/trips/generate", (req, res) => {
  const {
    budget = 2000,
    numberOfPeople = 2,
    numberOfNights = 7,
    flightPreference = "any",
    hotelDistanceKm = null,
    maxDistanceFromAirportKm = null,
    accommodationType = null,
  } = req.body;

  // Generate a larger pool so filtering has more to work with
  const poolSize = 24;
  const pool = Array.from({ length: poolSize }, (_, i) => {
    const destIndex = i % DESTINATIONS.length;
    return generateTripSuggestion(
      destIndex,
      budget,
      numberOfPeople,
      numberOfNights,
      flightPreference,
      accommodationType as AccommodationType,
      `trip-${Date.now()}-${i}`,
    );
  });

  // Strict filtering
  const filtered = pool.filter((trip) => {
    // Budget: totalPrice must not exceed budget × numberOfPeople
    if (trip.totalPrice > budget * numberOfPeople) return false;

    // Flight preference
    if (flightPreference === "direct" && !trip.transport.isDirect) return false;
    if (flightPreference === "with_stops" && trip.transport.isDirect) return false;

    // Hotel distance from city centre
    if (hotelDistanceKm != null && trip.hotel.distanceFromCenter > hotelDistanceKm) return false;

    // Transport-to-hotel distance
    if (maxDistanceFromAirportKm != null && trip.transportToHotelKm > maxDistanceFromAirportKm) return false;

    // Accommodation type (stars)
    if (accommodationType === "budget" && trip.hotel.stars > 3) return false;
    if (accommodationType === "standard" && (trip.hotel.stars < 3 || trip.hotel.stars > 4)) return false;
    if (accommodationType === "luxury" && trip.hotel.stars < 4) return false;

    return true;
  });

  // Return up to 8 unique-destination results
  const seen = new Set<string>();
  const results = filtered.filter((t) => {
    if (seen.has(t.destination)) return false;
    seen.add(t.destination);
    return true;
  }).slice(0, 8);

  res.json(results);
});

router.get("/trips/stats", async (req, res) => {
  const auth = getAuth(req);
  const userId = auth?.userId;

  if (!userId) {
    return res.json({
      totalSaved: 0,
      totalSpent: 0,
      topDestinations: [],
      averagePrice: 0,
      mostRecentTrip: null,
    });
  }

  try {
    const { db } = await import("@workspace/db");
    const { savedTripsTable } = await import("@workspace/db");
    const { eq, desc } = await import("drizzle-orm");

    const trips = await db
      .select()
      .from(savedTripsTable)
      .where(eq(savedTripsTable.clerkUserId, userId))
      .orderBy(desc(savedTripsTable.createdAt));

    const totalSaved = trips.length;
    const totalSpent = trips.reduce((sum, t) => sum + parseFloat(String(t.totalPrice)), 0);
    const averagePrice = totalSaved > 0 ? totalSpent / totalSaved : 0;
    const topDestinations = [...new Set(trips.map((t) => t.destination))].slice(0, 3);
    const mostRecentTrip = trips[0]?.destination ?? null;

    res.json({ totalSaved, totalSpent, topDestinations, averagePrice, mostRecentTrip });
  } catch {
    res.json({
      totalSaved: 0,
      totalSpent: 0,
      topDestinations: [],
      averagePrice: 0,
      mostRecentTrip: null,
    });
  }
});

export default router;
