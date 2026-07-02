import { chatMessage, chatSession } from "@/app/db/schema";
import { getUserId } from "@/lib/auth";
import { db } from "@/lib/db";
import { and, asc, eq } from "drizzle-orm";
import Groq from "groq-sdk";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  try {
    const userId = await getUserId();
    const { question, sessionId } = await req.json();

    if (!question || typeof question !== "string" || !question.trim()) {
      return NextResponse.json(
        { error: "Question is required" },
        { status: 400 },
      );
    }

    let chatSessionId: number;
    const requestedSessionId = Number(sessionId);
    if (requestedSessionId) {
      const [existing] = await db
        .select({ id: chatSession.id })
        .from(chatSession)
        .where(
          and(
            eq(chatSession.id, requestedSessionId),
            eq(chatSession.userId, userId),
          ),
        )
        .limit(1);

      if (!existing) {
        return NextResponse.json(
          { error: "Session not found" },
          { status: 404 },
        );
      }
      chatSessionId = existing.id;
    } else {
      const [created] = await db
        .insert(chatSession)
        .values({ userId, title: question.trim().slice(0, 80) })
        .returning({ id: chatSession.id });
      chatSessionId = created.id;
    }

    // Load prior turns for this session so the assistant has context.
    const history = await db
      .select({ role: chatMessage.role, content: chatMessage.content })
      .from(chatMessage)
      .where(eq(chatMessage.sessionId, chatSessionId))
      .orderBy(asc(chatMessage.createdAt));

    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY!,
    });

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant which helps users with their queries. Give detailed and accurate responses.",
        },
        ...history.map((m) => ({
          role: m.role as "user" | "assistant",
          content: m.content,
        })),
        {
          role: "user",
          content: question,
        },
      ],
    });

    const answer = completion.choices[0]?.message?.content ?? "";

    await db.insert(chatMessage).values([
      {
        sessionId: chatSessionId,
        role: "user",
        content: question,
      },
      {
        sessionId: chatSessionId,
        role: "assistant",
        content: answer,
      },
    ]);

    return NextResponse.json(
      {
        sessionId: chatSessionId,
        message: { role: "assistant", content: answer },
      },
      { status: 200 },
    );
  } catch (err) {
    console.error("chat-bot POST error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
};

export const GET = async (req: Request) => {
  try {
    const userId = await getUserId();

    const { searchParams } = new URL(req.url);
    const sessionId = Number(searchParams.get("sessionId"));

    if (!sessionId) {
      return NextResponse.json({ error: "Missing sessionId" }, { status: 400 });
    }
    const [existing] = await db
      .select({ id: chatSession.id })
      .from(chatSession)
      .where(
        and(eq(chatSession.id, sessionId), eq(chatSession.userId, userId)),
      );

    if (!existing) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    const chatMessages = await db
      .select()
      .from(chatMessage)
      .where(eq(chatMessage.sessionId, sessionId))
      .orderBy(asc(chatMessage.createdAt));

    return NextResponse.json({ chatMessages }, { status: 200 });
  } catch (err) {
    console.error("chat-bot GET error:", err);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
};
