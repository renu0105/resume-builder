import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

// DATABASE_URL points at Supabase's transaction-mode pooler (port 6543), which
// does NOT support prepared statements. postgres-js uses them by default, so we
// must disable them — otherwise queries fail on Vercel's serverless functions
// with "prepared statement already exists". `max: 1` keeps each serverless
// invocation to a single connection so we don't exhaust the pooler.
const client = postgres(process.env.DATABASE_URL!, {
  prepare: false,
  max: 1,
});
export const db = drizzle(client);
