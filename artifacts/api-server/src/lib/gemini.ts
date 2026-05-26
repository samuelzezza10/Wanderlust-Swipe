/**
 * Server-side Gemini AI helper.
 *
 * Reads the key from `process.env.GOOGLE_API_KEY` (Replit Secret in dev, or
 * the equivalent env var in production). NEVER expose this key to the client.
 *
 * The helper is intentionally dependency-free (raw `fetch` against the public
 * Generative Language REST API) so we don't have to install/maintain an SDK.
 * Routes can call `generateTripContent()` to enrich mock destinations with
 * AI-generated descriptions — when the key is missing or the call fails, the
 * caller falls back to its existing static data.
 */

const GEMINI_ENDPOINT =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

export function hasGeminiKey(): boolean {
  return Boolean(process.env.GOOGLE_API_KEY);
}

interface GeminiTextResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{ text?: string }>;
    };
  }>;
}

/**
 * Send a single-turn prompt to Gemini and return the plain-text response.
 * Returns `null` if the key is missing or the request fails — callers must
 * treat this as "use your fallback".
 */
export async function geminiPrompt(
  prompt: string,
  opts: { timeoutMs?: number } = {},
): Promise<string | null> {
  const key = process.env.GOOGLE_API_KEY;
  if (!key) return null;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), opts.timeoutMs ?? 8000);

  try {
    const res = await fetch(`${GEMINI_ENDPOINT}?key=${encodeURIComponent(key)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 512 },
      }),
      signal: controller.signal,
    });
    if (!res.ok) return null;
    const data = (await res.json()) as GeminiTextResponse;
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    return typeof text === "string" && text.trim().length > 0 ? text.trim() : null;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}
