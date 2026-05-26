import express, { type Express, type Request, type Response } from "express";
import cors from "cors";
import helmet from "helmet";
import { pinoHttp } from "pino-http";
import type { IncomingMessage, ServerResponse } from "http";
import { clerkMiddleware } from "@clerk/express";
import { publishableKeyFromHost } from "@clerk/shared/keys";
import {
  CLERK_PROXY_PATH,
  clerkProxyMiddleware,
  getClerkProxyHost,
} from "./middlewares/clerkProxyMiddleware";
import { globalLimiter } from "./middlewares/rateLimiter";
import router from "./routes";
import { logger } from "./lib/logger";

const app: Express = express();

// Trust the reverse proxy (Replit, Vercel, etc.) so express-rate-limit and
// the Clerk proxy middleware read the real client IP from X-Forwarded-For
// instead of the proxy's IP.
app.set("trust proxy", 1);

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req: IncomingMessage & { id?: PropertyKey }) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res: ServerResponse) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);

app.use(CLERK_PROXY_PATH, clerkProxyMiddleware());

// CORS — allow the configured origin (or all origins in development)
const corsOrigin = process.env.CORS_ORIGIN ?? true;
app.use(
  cors({
    credentials: true,
    origin: corsOrigin,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// Security headers — disable CSP (API-only server, not serving HTML)
// and crossOriginEmbedderPolicy (would break Clerk proxy responses)
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  }),
);

// Global IP-based rate limiter (generous: protects against floods/bots)
app.use(globalLimiter);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  clerkMiddleware((req: Request) => ({
    publishableKey: publishableKeyFromHost(
      getClerkProxyHost(req) ?? "",
      process.env.CLERK_PUBLISHABLE_KEY,
    ),
  })),
);

app.use("/api", router);

export default app;
