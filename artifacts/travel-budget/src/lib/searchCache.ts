const CACHE_KEY = "tb_search_cache";
const CACHE_TTL_MS = 15 * 60 * 1000;

interface CacheEntry {
  results: unknown[];
  timestamp: number;
}

type CacheStore = Record<string, CacheEntry>;

const HASH_FIELDS = [
  "budget", "numberOfPeople", "departureAirport",
  "arrivalAirport", "departureDate", "returnDate",
  "tripType", "numberOfNights", "flightPreference",
  "accommodationType", "propertyType", "hotelStarsMin", "hotelStarsMax",
  "minHotelRating", "maxHotelDistanceFromCenterKm", "freeCancellation",
  "breakfastIncluded", "parkingAvailable", "petFriendly", "numberOfChildren",
  "numberOfPets",
];

export function hashFilters(filters: Record<string, unknown>): string {
  return HASH_FIELDS.map((k) => `${k}:${JSON.stringify(filters[k] ?? null)}`).join("|");
}

function loadStore(): CacheStore {
  try {
    return JSON.parse(localStorage.getItem(CACHE_KEY) ?? "{}") as CacheStore;
  } catch {
    return {};
  }
}

function saveStore(store: CacheStore) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(store));
  } catch {
    localStorage.removeItem(CACHE_KEY);
  }
}

export function getCachedSearch<T>(filters: Record<string, unknown>): T[] | null {
  const store = loadStore();
  const key = hashFilters(filters);
  const entry = store[key];
  if (!entry) return null;
  if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
    delete store[key];
    saveStore(store);
    return null;
  }
  return entry.results as T[];
}

export function setCachedSearch<T>(filters: Record<string, unknown>, results: T[]) {
  const store = loadStore();
  const key = hashFilters(filters);
  const now = Date.now();
  for (const k of Object.keys(store)) {
    if (now - store[k].timestamp > CACHE_TTL_MS) delete store[k];
  }
  store[key] = { results: results as unknown[], timestamp: now };
  saveStore(store);
}
