import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// max:1 keeps connection count low for serverless/edge environments (Vercel
// functions, Supabase pgBouncer).  For long-running servers raise this value
// via the DATABASE_POOL_MAX env var if needed.
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: Number(process.env.DATABASE_POOL_MAX ?? "1"),
});
export const db = drizzle(pool, { schema });

export * from "./schema";
