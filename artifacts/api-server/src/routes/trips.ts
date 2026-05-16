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
  ["NYC Budget Inn", "Manhattan Hostel", "Brooklyn B&B"],
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

const APARTMENTS = [
  ["Studio Montmartre", "Appartement Marais", "Loft République"],
  ["Bali Villa Ubud", "Canggu Apartment", "Seminyak Loft"],
  ["Shinjuku Studio", "Harajuku Flat", "Akihabara Loft"],
  ["Oia Cave Apartment", "Fira Studio", "Imerovigli Loft"],
  ["SoHo Loft", "Brooklyn Apartment", "Midtown Studio"],
  ["Bairro Alto Apartment", "Mouraria Studio", "Intendente Loft"],
  ["Maldives Beach House", "Lagoon Apartment", "Dhoni Loft"],
  ["Eixample Apartment", "Born Studio", "Gràcia Loft"],
];

const BASE_AMENITIES = ["WiFi", "24h Reception"];

// Feature flags by tier — each one has a probability of being included
const FEATURE_PROBS = {
  budget: {
    free_cancellation: 0.3,
    breakfast: 0.15,
    parking: 0.2,
    private_bathroom: 0.5,
    elevator: 0.3,
    pet_friendly: 0.2,
    online_payment: 0.6,
    pool: 0.1,
    spa: 0.0,
    gym: 0.1,
  },
  standard: {
    free_cancellation: 0.55,
    breakfast: 0.45,
    parking: 0.5,
    private_bathroom: 0.85,
    elevator: 0.65,
    pet_friendly: 0.35,
    online_payment: 0.85,
    pool: 0.4,
    spa: 0.2,
    gym: 0.35,
  },
  luxury: {
    free_cancellation: 0.8,
    breakfast: 0.75,
    parking: 0.75,
    private_bathroom: 1.0,
    elevator: 0.9,
    pet_friendly: 0.5,
    online_payment: 1.0,
    pool: 0.9,
    spa: 0.85,
    gym: 0.8,
  },
};

function randomBetween(min: number, max: number) {
  if (min >= max) return min;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function fmt(h: number, m: number) {
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

type AccommodationType = "budget" | "standard" | "luxury" | null;
type Tier = "budget" | "standard" | "luxury";

function generateHotelFeatures(tier: Tier): { amenities: string[]; features: Set<string> } {
  const probs = FEATURE_PROBS[tier];
  const features = new Set<string>();
  const amenities = [...BASE_AMENITIES];

  for (const [feat, prob] of Object.entries(probs)) {
    if (Math.random() < prob) {
      features.add(feat);
      // Map to display amenity labels
      if (feat === "breakfast") amenities.push("Breakfast Included");
      else if (feat === "parking") amenities.push("Parking");
      else if (feat === "pool") amenities.push("Pool");
      else if (feat === "spa") amenities.push("Spa");
      else if (feat === "gym") amenities.push("Gym");
      else if (feat === "free_cancellation") amenities.push("Free Cancellation");
      else if (feat === "private_bathroom") amenities.push("Private Bathroom");
      else if (feat === "elevator") amenities.push("Elevator");
      else if (feat === "pet_friendly") amenities.push("Pets Allowed");
      else if (feat === "online_payment") amenities.push("Online Payment");
    }
  }
  return { amenities, features };
}

function generateTrip(
  destIndex: number,
  budget: number,
  numberOfPeople: number,
  numberOfNights: number,
  flightPreference: string,
  accommodationType: AccommodationType,
  propertyType: string,
  id: string,
) {
  const dest = DESTINATIONS[destIndex % DESTINATIONS.length];

  // ─── Accommodation tier ───────────────────────────────────────
  let stars: number;
  let hotelList: string[][];
  let hotelShare: number;
  let tier: Tier;

  if (accommodationType === "budget") {
    stars = randomBetween(2, 3);
    hotelList = propertyType === "apartment" ? APARTMENTS : HOTELS_BUDGET;
    hotelShare = 0.28;
    tier = "budget";
  } else if (accommodationType === "luxury") {
    stars = randomBetween(4, 5);
    hotelList = propertyType === "apartment" ? APARTMENTS : HOTELS_LUXURY;
    hotelShare = 0.55;
    tier = "luxury";
  } else {
    stars = randomBetween(3, 4);
    hotelList = propertyType === "apartment" ? APARTMENTS : HOTELS_STANDARD;
    hotelShare = 0.42;
    tier = "standard";
  }

  // ─── Hotel cost (strictly within budget share) ────────────────
  const hotelBudgetTotal = Math.floor(budget * hotelShare);
  const maxPerNight = Math.max(25, Math.floor(hotelBudgetTotal / numberOfNights));
  const minPerNight = Math.max(15, Math.floor(maxPerNight * 0.55));
  const pricePerNight = randomBetween(minPerNight, maxPerNight);
  const hotelTotalPerPerson = pricePerNight * numberOfNights;

  // ─── Transport: round-trip ────────────────────────────────────
  const transportBudgetPerPerson = budget - hotelTotalPerPerson;
  if (transportBudgetPerPerson < 40) return null;

  const maxOutbound = Math.floor(transportBudgetPerPerson * 0.52);
  const minOutbound = Math.max(20, Math.floor(transportBudgetPerPerson * 0.30));
  if (maxOutbound < minOutbound) return null;

  const outboundPrice = randomBetween(minOutbound, maxOutbound);
  const returnPrice = Math.floor(outboundPrice * (0.80 + Math.random() * 0.35));

  const totalTransportPerPerson = outboundPrice + returnPrice;
  const totalPerPerson = totalTransportPerPerson + hotelTotalPerPerson;

  // ─── STRICT budget check ──────────────────────────────────────
  if (totalPerPerson > budget) return null;

  const totalPrice = Math.round(totalPerPerson * numberOfPeople);
  const hotelTotalCost = Math.round(hotelTotalPerPerson * numberOfPeople);

  // ─── Transport type ───────────────────────────────────────────
  const isFlightDest = ["Paris", "Bali", "Tokyo", "Santorini", "New York", "Maldives"].includes(dest.destination);
  const useTrainRandom = Math.random() > 0.65 && !isFlightDest;
  const transportType = useTrainRandom ? "train" : "flight";

  const isDirect = flightPreference === "direct" || (flightPreference !== "with_stops" && Math.random() > 0.4);
  const isReturnDirect = flightPreference === "direct" || (flightPreference !== "with_stops" && Math.random() > 0.4);

  const getCompany = () =>
    transportType === "train"
      ? TRAINS[randomBetween(0, TRAINS.length - 1)]
      : AIRLINES[randomBetween(0, AIRLINES.length - 1)];

  // Outbound
  const outDurH = randomBetween(1, 14);
  const outDurM = randomBetween(0, 59);
  const outDepH = randomBetween(5, 22);
  const outArrH = (outDepH + outDurH) % 24;

  // Return
  const retDurH = randomBetween(1, 14);
  const retDurM = randomBetween(0, 59);
  const retDepH = randomBetween(5, 22);
  const retArrH = (retDepH + retDurH) % 24;

  // ─── Hotel details ────────────────────────────────────────────
  const hotelIdx = destIndex % hotelList.length;
  const hotelNames = hotelList[hotelIdx];
  const hotelName = hotelNames[randomBetween(0, hotelNames.length - 1)];
  const { amenities: amenitySet, features } = generateHotelFeatures(tier);
  const distanceFromCenter = parseFloat((Math.random() * 4 + 0.3).toFixed(1));
  const transportToHotelKm = parseFloat((Math.random() * 28 + 2).toFixed(1));
  // Rating: budget 3.5-7.5, standard 6-8.5, luxury 7.5-10
  const ratingMin = tier === "luxury" ? 7.5 : tier === "standard" ? 6.0 : 3.5;
  const ratingMax = tier === "luxury" ? 10 : tier === "standard" ? 8.8 : 7.5;
  const rating = parseFloat((ratingMin + Math.random() * (ratingMax - ratingMin)).toFixed(1));

  return {
    id,
    destination: dest.destination,
    country: dest.country,
    totalPrice,
    pricePerPerson: totalPerPerson,
    transport: {
      type: transportType,
      company: getCompany(),
      duration: `${outDurH}h ${outDurM}m`,
      price: outboundPrice,
      isDirect,
      departureTime: fmt(outDepH, randomBetween(0, 59)),
      arrivalTime: fmt(outArrH, randomBetween(0, 59)),
    },
    returnTransport: {
      type: transportType,
      company: getCompany(),
      duration: `${retDurH}h ${retDurM}m`,
      price: returnPrice,
      isDirect: isReturnDirect,
      departureTime: fmt(retDepH, randomBetween(0, 59)),
      arrivalTime: fmt(retArrH, randomBetween(0, 59)),
    },
    hotel: {
      name: hotelName,
      stars,
      pricePerNight,
      distanceFromCenter,
      amenities: amenitySet,
      rating,
      imageUrl: null,
    },
    hotelTotalCost,
    description: dest.description,
    highlights: dest.highlights,
    imageUrl: dest.imageUrl,
    durationDays: numberOfNights + 1,
    transportToHotelKm,
    tags: dest.tags,
    _features: features, // internal, not serialized
  };
}

router.post("/trips/generate", (req, res) => {
  const {
    budget = 2000,
    numberOfPeople = 2,
    numberOfNights = 7,
    flightPreference = "any",
    trainPreference = "any",
    hotelDistanceKm = null,
    maxDistanceFromAirportKm = null,
    accommodationType = null,
    propertyType = "any",
    hotelAmenities = [],
    minHotelRating = null,
    hotelStarsMin = null,
    hotelStarsMax = null,
  } = req.body;

  const seen = new Set<string>();
  const results: ReturnType<typeof generateTrip>[] = [];
  let attempts = 0;
  const MAX_ATTEMPTS = 120;

  while (results.length < 8 && attempts < MAX_ATTEMPTS) {
    const destIndex = attempts % DESTINATIONS.length;
    attempts++;

    const trip = generateTrip(
      destIndex,
      budget,
      numberOfPeople,
      numberOfNights,
      flightPreference,
      accommodationType as AccommodationType,
      propertyType,
      `trip-${Date.now()}-${attempts}`,
    );

    if (!trip) continue;
    if (seen.has(trip.destination)) continue;

    // ─── Apply strict filters ─────────────────────────────────────
    if (flightPreference === "direct" && trip.transport.type === "flight" && !trip.transport.isDirect) continue;
    if (flightPreference === "with_stops" && trip.transport.type === "flight" && trip.transport.isDirect) continue;
    if (trainPreference === "direct" && trip.transport.type === "train" && !trip.transport.isDirect) continue;
    if (trainPreference === "with_stops" && trip.transport.type === "train" && trip.transport.isDirect) continue;
    if (hotelDistanceKm != null && trip.hotel.distanceFromCenter > hotelDistanceKm) continue;
    if (maxDistanceFromAirportKm != null && trip.transportToHotelKm > maxDistanceFromAirportKm) continue;
    if (accommodationType === "budget" && trip.hotel.stars > 3) continue;
    if (accommodationType === "standard" && (trip.hotel.stars < 3 || trip.hotel.stars > 4)) continue;
    if (accommodationType === "luxury" && trip.hotel.stars < 4) continue;
    if (hotelStarsMin != null && trip.hotel.stars < hotelStarsMin) continue;
    if (hotelStarsMax != null && trip.hotel.stars > hotelStarsMax) continue;
    if (minHotelRating != null && trip.hotel.rating < minHotelRating) continue;

    // ─── Amenity filters ──────────────────────────────────────────
    const requiredAmenities: string[] = Array.isArray(hotelAmenities) ? hotelAmenities : [];
    if (requiredAmenities.length > 0) {
      const hasAll = requiredAmenities.every((a: string) => trip._features.has(a));
      if (!hasAll) continue;
    }

    seen.add(trip.destination);
    // Remove internal field before returning
    const { _features, ...tripOut } = trip;
    results.push(tripOut as typeof trip);
  }

  res.json(results);
});

router.get("/trips/stats", async (req, res) => {
  const auth = getAuth(req);
  const userId = auth?.userId;

  if (!userId) {
    return res.json({ totalSaved: 0, totalSpent: 0, topDestinations: [], averagePrice: 0, mostRecentTrip: null });
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

    return res.json({ totalSaved, totalSpent, topDestinations, averagePrice, mostRecentTrip });
  } catch {
    return res.json({ totalSaved: 0, totalSpent: 0, topDestinations: [], averagePrice: 0, mostRecentTrip: null });
  }
});

export default router;
