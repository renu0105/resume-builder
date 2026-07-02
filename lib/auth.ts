import { getServerSession } from "next-auth";
import { authOptions } from "./authOptions";

export async function getUserId() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }
  return Number(session.user.id);
}
