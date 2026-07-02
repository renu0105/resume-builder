import { interviewSessions } from "@/app/db/schema";
import { authOptions } from "@/lib/authOptions";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = Number(session.user.id);
    if (!Number.isInteger(userId) || userId < 1) {
      return NextResponse.json({ interviewSessions: [] });
    }

    const interviewSessionsData = await db
      .select()
      .from(interviewSessions)
      .where(eq(interviewSessions.userId, userId));

    return NextResponse.json({ interviewSessions: interviewSessionsData });
  } catch (error) {
    console.error("interview-session GET error:", error);
    return NextResponse.json(
      { error: "Error fetching interview session data" },
      { status: 500 },
    );
  }
}
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = Number(session.user.id);
    if (!Number.isInteger(userId) || userId < 1) {
      return NextResponse.json({ error: "Invalid user" }, { status: 401 });
    }

    // Read role/title from the request body — `$inferInsert` is a compile-time
    // type only and resolves to `undefined` at runtime, which would violate the
    // NOT NULL constraints on role/title.
    const body = await request.json();
    const role: string = (body.role ?? "").trim();
    const title: string = (body.title ?? "").trim() || `${role} Interview`;

    if (!role) {
      return NextResponse.json({ error: "Role is required" }, { status: 400 });
    }

    const [interviewSession] = await db
      .insert(interviewSessions)
      .values({ userId, role, title })
      .returning();

    return NextResponse.json({ interviewSession });
  } catch (error) {
    console.error("interview-session POST error:", error);
    return NextResponse.json(
      { error: "Error creating interview session" },
      { status: 500 },
    );
  }
}
