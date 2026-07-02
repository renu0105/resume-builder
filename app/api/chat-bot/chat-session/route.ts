import { chatSession } from "@/app/db/schema";
import { getUserId } from "@/lib/auth";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
  try {
    const userId = await getUserId();
    const body = await request.json();
    const title: string = (body.title ?? "").trim() || "New Chat Session";

    const [chatSessionData] = await db
      .insert(chatSession)
      .values({
        userId,
        title,
      })
      .returning();

    return NextResponse.json({ chatSessionData });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create chat session" },
      { status: 500 },
    );
  }
};

export const GET = async () => {
  try {
    const userId = await getUserId();
    const chatSessions = await db
      .select()
      .from(chatSession)
      .where(eq(chatSession.userId, userId));
    return NextResponse.json({ chatSessions });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to get chat sessions" },
      { status: 500 },
    );
  }
};
