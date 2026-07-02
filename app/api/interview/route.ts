import { interviewQuestions, interviewSessions } from "@/app/db/schema";
import { authOptions } from "@/lib/authOptions";
import { db } from "@/lib/db";
import Groq from "groq-sdk";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = Number(session.user.id);
    if (!Number.isInteger(userId) || userId < 1) {
      return NextResponse.json({ error: "Invalid user" }, { status: 401 });
    }

    const { role, answer, sessionId } = await request.json();

    if (!role || typeof role !== "string") {
      return NextResponse.json({ error: "Role is required" }, { status: 400 });
    }

    // `interviewQuestions.sessionId` is a FK to `interviewSessions.id`, NOT the
    // user id. Start a new interview session on the first call (no sessionId)
    // and reuse it for every subsequent question/answer.
    let interviewSessionId = Number(sessionId);
    if (!Number.isInteger(interviewSessionId) || interviewSessionId < 1) {
      const [created] = await db
        .insert(interviewSessions)
        .values({ userId, role, title: `${role} Interview` })
        .returning({ id: interviewSessions.id });
      interviewSessionId = created.id;
    }

    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY || "",
    });

    const messages = answer
      ? [
          {
            role: "user" as const,
            content: answer,
          },
        ]
      : [];

    const res = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `
You are a professional interviewer.

Role: ${role}

Rules:
- Ask one interview question at a time.
- Wait for the candidate's answer.
- Evaluate the answer briefly.
- Then ask the next question.
- Start with easy questions and gradually increase difficulty.
- Keep the interview conversational.
          `,
        },
        ...messages,
      ],
    });

    const nextQuestion = res.choices[0]?.message?.content ?? "";

    await db.insert(interviewQuestions).values({
      sessionId: interviewSessionId,
      question: nextQuestion,
      answer: answer || "",
    });

    return NextResponse.json({
      message: { role: "assistant", content: nextQuestion },
      sessionId: interviewSessionId,
    });
  } catch (error) {
    console.error("interview POST error:", error);
    return NextResponse.json(
      { error: "Failed to process the request" },
      { status: 500 },
    );
  }
};
