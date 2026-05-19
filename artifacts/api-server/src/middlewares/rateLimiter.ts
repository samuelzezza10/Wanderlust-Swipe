import { rateLimit } from "express-rate-limit";
import { slowDown } from "express-slow-down";

const rateLimitMessage = () => ({
  error: "rate_limit_exceeded",
  message: "Too many requests. Please try again later.",
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
 * Trip generation hard limit — 100 req / 10 min per IP.
 * Generous enough for active users applying filters repeatedly while still
 * preventing automated abuse.
 */
export const tripGenerateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 100,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: rateLimitMessage,
});

/**
 * Progressive slow-down on trip generation.
 * After 20 requests in 5 min, add 500 ms per extra request (max 5 s).
 * Invisible to normal users, makes bots crawl.
 */
export const tripGenerateSlowDown = slowDown({
  windowMs: 5 * 60 * 1000,
  delayAfter: 20,
  delayMs: (used, req) => {
    const delayAfter = req.slowDown.limit;
    return (used - delayAfter) * 500;
  },
  maxDelayMs: 5000,
  validate: { delayMs: false },
});

/**
 * Surprise trips — 100 req / 10 min per IP.
 */
export const surpriseLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 100,
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
