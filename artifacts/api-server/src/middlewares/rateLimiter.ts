import { rateLimit } from "express-rate-limit";
import { slowDown } from "express-slow-down";

const rateLimitMessage = () => ({
  error: "rate_limit_exceeded",
  message: "Unusual activity detected. Please try again later.",
});

/**
 * Global limiter — 300 req / 15 min per IP.
 * Very generous: a real user browsing the app for 15 minutes would rarely
 * hit this. Bots running automated scripts will.
 */
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: rateLimitMessage,
  skip: (req) => req.path.includes("__clerk"),
});

/**
 * Trip generation hard limit — 30 req / 10 min per IP.
 * Generation is the most expensive endpoint (AI + DB writes). A real user
 * rarely needs more than a handful of searches in 10 minutes.
 */
export const tripGenerateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 30,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: rateLimitMessage,
});

/**
 * Progressive slow-down on trip generation.
 * After 10 requests in 5 min, add 500 ms per extra request (max 5 s).
 * Invisible to normal users, makes bots crawl.
 */
export const tripGenerateSlowDown = slowDown({
  windowMs: 5 * 60 * 1000,
  delayAfter: 10,
  delayMs: 500,
  maxDelayMs: 5000,
});

/**
 * Surprise trips — 40 req / 10 min per IP.
 * Slightly more generous than generate because it's stateless and cheaper.
 */
export const surpriseLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 40,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: rateLimitMessage,
});

/**
 * Write operations (save / delete trips) — 60 req / 10 min per IP.
 * Prevents spam saves and bulk-delete bots. Real users save a few trips.
 */
export const writeLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 60,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: rateLimitMessage,
});
