import { getServerSession } from "next-auth";
import { authOptions } from "./authOptions";

// Thrown when a request has no signed-in user. Routes catch this to answer with
// a 401 instead of a generic 500 — a logged-out client (e.g. right after
// signing out) is an expected state, not a server fault.
export class UnauthorizedError extends Error {
  constructor(message = "Unauthorized") {
    super(message);
    this.name = "UnauthorizedError";
  }
}

export async function getUserId() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new UnauthorizedError();
  }
  return Number(session.user.id);
}
