import { getServerSession } from "next-auth";
import { eq } from "drizzle-orm";
import { authOptions } from "./authOptions";
import { db } from "./db";
import { users } from "@/app/db/schema";

// Thrown when a request has no signed-in user. Routes catch this to answer with
// a 401 instead of a generic 500 — a logged-out client (e.g. right after
// signing out) is an expected state, not a server fault.
export class UnauthorizedError extends Error {
  constructor(message = "Unauthorized") {
    super(message);
    this.name = "UnauthorizedError";
  }
}

/**
 * Resolve the signed-in user's `users.id`. Every route that reads or writes
 * user-owned rows must scope its query with this — never return unfiltered
 * tables, or one user sees another's data.
 */
export async function getUserId(): Promise<number> {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    throw new UnauthorizedError();
  }

  // `session.user.id` falls back to the OAuth subject id when the jwt callback
  // couldn't reach the DB, and that is not our serial `users.id`. Only trust it
  // when it is a real positive integer; otherwise resolve the row by email so a
  // transient DB hiccup at sign-in can't mis-key a whole session.
  const sessionId = Number(session.user.id);
  if (Number.isInteger(sessionId) && sessionId > 0) {
    return sessionId;
  }

  if (!session.user.email) {
    throw new UnauthorizedError();
  }

  const [dbUser] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, session.user.email));

  if (!dbUser) {
    throw new UnauthorizedError("User not found");
  }
  return dbUser.id;
}
