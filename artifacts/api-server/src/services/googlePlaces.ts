/**
 * Google Places API (v1) client — server-side ONLY.
 *
 * Reads `GOOGLE_API_KEY` from env.  This key must NEVER be sent to the
 * client (no VITE_ prefix); all photo requests are proxied through our
 * /api/external/place-photo route so the key never leaves the server.
 *
 * Uses the new "Places API (New)" v1 endpoints:
 *   - POST https://places.googleapis.com/v1/places:searchText
 *   - GET  https://places.googleapis.com/v1/{photo_name}/media
 *
 * In-process LRU-style cache keeps quota usage low on the free tier.
 */
import { logger } from "../lib/logger";

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY ?? "";
const SEARCH_URL = "https://places.googleapis.com/v1/places:searchText";
const PHOTO_TTL_MS = 1000 * 60 * 60 * 24; // 24h
const NEGATIVE_TTL_MS = 1000 * 60 * 30; // remember 404s for 30min, don't retry

interface CacheEntry {
  url: string | null; // null => negative cache (no result)
  expires: number;
}

const photoCache = new Map<string, CacheEntry>();
const MAX_CACHE = 500;

function pruneCacheIfNeeded(): void {
  if (photoCache.size <= MAX_CACHE) return;
  const oldestKey = photoCache.keys().next().value;
  if (oldestKey !== undefined) photoCache.delete(oldestKey);
}

export function isGooglePlacesConfigured(): boolean {
  return GOOGLE_API_KEY.length > 0;
}

/**
 * Look up a place by free-form text query (e.g. "Hotel Adlon Berlin") and
 * return the media-URL of its first photo, or null when no place is found.
 * Result is memoised; repeated calls in the same process return cached URL
 * without hitting Google again.
 */
export async function getPlacePhotoUrl(query: string): Promise<string | null> {
  if (!GOOGLE_API_KEY) return null;
  const key = query.trim().toLowerCase();
  if (!key) return null;

  const cached = photoCache.get(key);
  if (cached && cached.expires > Date.now()) return cached.url;

  try {
    const resp = await fetch(SEARCH_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": GOOGLE_API_KEY,
        "X-Goog-FieldMask": "places.id,places.displayName,places.photos.name",
      },
      body: JSON.stringify({ textQuery: query, pageSize: 1 }),
    });

    if (!resp.ok) {
      const body = await resp.text();
      logger.warn(
        { status: resp.status, body: body.slice(0, 200), query },
        "google places searchText failed",
      );
      // Negative cache: don't hammer Google with the same failing query
      photoCache.set(key, { url: null, expires: Date.now() + NEGATIVE_TTL_MS });
      pruneCacheIfNeeded();
      return null;
    }

    const data = (await resp.json()) as {
      places?: Array<{ photos?: Array<{ name: string }> }>;
    };
    const photoName = data.places?.[0]?.photos?.[0]?.name;
    if (!photoName) {
      photoCache.set(key, { url: null, expires: Date.now() + NEGATIVE_TTL_MS });
      pruneCacheIfNeeded();
      return null;
    }

    const url = `https://places.googleapis.com/v1/${photoName}/media?key=${GOOGLE_API_KEY}&maxHeightPx=400&maxWidthPx=600`;
    photoCache.set(key, { url, expires: Date.now() + PHOTO_TTL_MS });
    pruneCacheIfNeeded();
    return url;
  } catch (err) {
    logger.error({ err, query }, "google places lookup threw");
    return null;
  }
}
