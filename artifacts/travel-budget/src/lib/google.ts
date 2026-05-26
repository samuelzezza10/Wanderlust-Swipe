/**
 * Google services helper.
 *
 * The key comes from `import.meta.env.VITE_GOOGLE_API_KEY`, which is bridged
 * from the `GOOGLE_API_KEY` Replit Secret in `vite.config.ts` (dev) and from
 * the `VITE_GOOGLE_API_KEY` GitHub Actions Secret in the CI build.
 *
 * IMPORTANT — restrict the key in Google Cloud Console:
 *   - HTTP referrer restriction limited to your domains
 *     (https://samuelzezza10.github.io/* and your dev domain)
 *   - API restriction: enable ONLY Maps JavaScript API + Places API for this key
 *
 * Never use this client-side key for Gemini — Gemini must be called from the
 * API server using the server-only `GOOGLE_API_KEY` env var.
 */

export const GOOGLE_API_KEY: string =
  (import.meta.env.VITE_GOOGLE_API_KEY as string | undefined) ?? "";

export function hasGoogleKey(): boolean {
  return GOOGLE_API_KEY.length > 0;
}

let mapsLoaderPromise: Promise<void> | null = null;

/**
 * Lazy-load the Google Maps JS SDK with the Places library.
 * Resolves once `window.google.maps` is available, or rejects if the key
 * is missing or the script fails to load.
 */
export function loadGoogleMaps(): Promise<void> {
  if (mapsLoaderPromise) return mapsLoaderPromise;
  if (!hasGoogleKey()) {
    return Promise.reject(new Error("VITE_GOOGLE_API_KEY is not configured"));
  }
  if (typeof window === "undefined") {
    return Promise.reject(new Error("loadGoogleMaps() called outside the browser"));
  }
  if ((window as unknown as { google?: { maps?: unknown } }).google?.maps) {
    mapsLoaderPromise = Promise.resolve();
    return mapsLoaderPromise;
  }

  mapsLoaderPromise = new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    const params = new URLSearchParams({
      key: GOOGLE_API_KEY,
      libraries: "places",
      v: "weekly",
      loading: "async",
    });
    script.src = `https://maps.googleapis.com/maps/api/js?${params.toString()}`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Google Maps SDK"));
    document.head.appendChild(script);
  });

  return mapsLoaderPromise;
}
