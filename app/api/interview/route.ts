import { interviewQuestions, interviewSessions } from "@/app/db/schema";
import { authOptions } from "@/lib/authOptions";
import { db } from "@/lib/db";
import { asc, eq } from "drizzle-orm";
import Groq from "groq-sdk";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";

// What the model is asked to return alongside the next question.
type Feedback = {
  score: number;
  strengths: string;
  improvements: string[];
  improvedAnswer: string;
};

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

    // Replay the session so the interviewer remembers what it already asked and
    // how the candidate answered. Without this every turn started from scratch,
    // so questions repeated and follow-ups made no sense.
    const previous = await db
      .select({
        question: interviewQuestions.question,
        answer: interviewQuestions.answer,
      })
      .from(interviewQuestions)
      .where(eq(interviewQuestions.sessionId, interviewSessionId))
      .orderBy(asc(interviewQuestions.createdAt));

    const history = previous.flatMap((turn) => [
      ...(turn.question
        ? [{ role: "assistant" as const, content: turn.question }]
        : []),
      ...(turn.answer ? [{ role: "user" as const, content: turn.answer }] : []),
    ]);

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
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `
You are a professional interviewer for the role of ${role}.

Return ONLY valid JSON in exactly this shape:

{
  "feedback": {
    "score": 0-10,
    "strengths": "what the candidate did well, one or two sentences",
    "improvements": ["specific, actionable suggestion", "another suggestion"],
    "improvedAnswer": "a stronger version of the candidate's answer"
  },
  "question": "the next interview question"
}

Rules:
- Ask one interview question at a time, in the "question" field.
- Set "feedback" to null when the candidate has not answered yet (the first
  question of the interview). Otherwise always fill it in for the answer the
  candidate just gave.
- Judge only the candidate's most recent answer in "feedback".
- Give 2-4 concrete items in "improvements" — name the missing detail,
  structure or example rather than generic advice.
- Do not repeat a question you have already asked.
- Start with easy questions and gradually increase difficulty.
- Keep the interview conversational.
          `,
        },
        ...history,
        ...messages,
      ],
    });

    const raw = res.choices[0]?.message?.content ?? "";

    // The model is asked for JSON, but never trust that it complied — falling
    // back to the raw text keeps the interview running instead of 500ing.
    let nextQuestion = raw;
    let feedback: Feedback | null = null;
    try {
      const parsed = JSON.parse(raw);
      if (typeof parsed?.question === "string" && parsed.question.trim()) {
        nextQuestion = parsed.question;
      }
      if (parsed?.feedback && typeof parsed.feedback === "object") {
        const f = parsed.feedback;
        feedback = {
          score: Number(f.score) || 0,
          strengths: String(f.strengths ?? ""),
          improvements: Array.isArray(f.improvements)
            ? f.improvements.map(String)
            : [],
          improvedAnswer: String(f.improvedAnswer ?? ""),
        };
      }
    } catch {
      console.error("interview POST: model did not return valid JSON");
    }

    // Only attach feedback to a turn the candidate actually answered.
    const answered = Boolean(answer);

    await db.insert(interviewQuestions).values({
      sessionId: interviewSessionId,
      question: nextQuestion,
      answer: answer || "",
      score: answered ? (feedback?.score ?? null) : null,
      feedback: answered ? (feedback?.strengths ?? null) : null,
      improvedAnswer: answered ? (feedback?.improvedAnswer ?? null) : null,
    });

    return NextResponse.json({
      message: { role: "assistant", content: nextQuestion },
      feedback: answered ? feedback : null,
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
