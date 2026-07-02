import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import pdfParse from "pdf-parse/lib/pdf-parse.js";
import mammoth from "mammoth";
import { db } from "@/lib/db";
import { resume, resumeAnalysis, users } from "@/app/db/schema";
import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth/next";
import { and, desc, eq } from "drizzle-orm";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Extract plain text from an uploaded resume. Supports PDF and modern Word
// (.docx). Detection uses the file's magic bytes first (reliable), then falls
// back to the filename extension. Legacy binary .doc is not supported.
async function extractResumeText(
  buffer: Buffer,
  fileName: string,
): Promise<string> {
  const name = fileName.toLowerCase();
  const isPdf = buffer.subarray(0, 4).toString("latin1") === "%PDF";
  // .docx files are ZIP archives, which start with "PK".
  const isDocx =
    buffer.subarray(0, 2).toString("latin1") === "PK" || name.endsWith(".docx");

  if (isPdf || name.endsWith(".pdf")) {
    const pdfData = await pdfParse(buffer);
    return pdfData.text;
  }

  if (isDocx) {
    const { value } = await mammoth.extractRawText({ buffer });
    return value;
  }

  if (name.endsWith(".doc")) {
    throw new UnsupportedFileError(
      "Legacy .doc files aren't supported. Please save your resume as a PDF or .docx and try again.",
    );
  }

  throw new UnsupportedFileError(
    "Unsupported file type. Please upload a PDF or Word (.docx) resume.",
  );
}

// Thrown for user-fixable input problems so the handler can answer with a 400
// and a helpful message instead of a generic 500.
class UnsupportedFileError extends Error {}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [currentUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, session.user.email));
    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let resumeText: string;
    try {
      resumeText = (await extractResumeText(buffer, file.name)).trim();
    } catch (parseError) {
      // Distinguish "we can't read this file" from an unexpected server fault
      // so the user sees an actionable message rather than a blank 500.
      const message =
        parseError instanceof UnsupportedFileError
          ? parseError.message
          : "Could not read this file. It may be corrupted, password-protected, or a scanned image. Please upload a text-based PDF or .docx.";
      return NextResponse.json({ error: message }, { status: 400 });
    }

    if (!resumeText) {
      return NextResponse.json(
        {
          error:
            "No text could be extracted from this file. If it's a scanned or image-only resume, please upload a text-based PDF or .docx.",
        },
        { status: 400 },
      );
    }

    // Skip re-processing when this user already uploaded an identical resume.
    const [existingResume] = await db
      .select()
      .from(resume)
      .where(and(eq(resume.userId, currentUser.id), eq(resume.content, resumeText)));

    if (existingResume) {
      const [existingAnalysis] = await db
        .select()
        .from(resumeAnalysis)
        .where(eq(resumeAnalysis.resumeId, existingResume.id))
        .orderBy(desc(resumeAnalysis.createdAt))
        .limit(1);

      if (existingAnalysis) {
        return NextResponse.json({
          success: true,
          data: existingAnalysis,
          duplicate: true,
          message: "Resume already analyzed; returning existing analysis",
        });
      }
    }

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      response_format: {
        type: "json_object",
      },
      messages: [
        {
          role: "system",
          content: `
Analyze this resume and return ONLY valid JSON.

{
  "score": 0/100,
  "summary": "",
  "matchedKeywords": [],
  "missingKeywords": [],
  "suggestions": [
    {
      "title": "",
      "description": "",
      "priority": "high"
    }
  ]
}

Resume:
${resumeText}
`,
        },
        {
          role: "user",
          content: resumeText,
        },
      ],
    });

    const content = response.choices[0].message.content || "";

    const cleaned = content
      .replace(/```json\s*/g, "")
      .replace(/```/g, "")
      .trim();

    const result = JSON.parse(cleaned);

    // Reuse the existing resume row if the content matched; otherwise persist
    // it first so the analysis FK (resume_id) is valid.
    const resumeId =
      existingResume?.id ??
      (
        await db
          .insert(resume)
          .values({ userId: currentUser.id, content: resumeText })
          .returning({ id: resume.id })
      )[0].id;

    const [savedAnalysis] = await db
      .insert(resumeAnalysis)
      .values({
        resumeId,
        analysisResult: JSON.stringify(result),
        score: String(result.score),
        summary: result.summary,
        missingKeywords: JSON.stringify(result.missingKeywords ?? []),
        suggestions: JSON.stringify(result.suggestions ?? []),
        improvementAreas: JSON.stringify(result.improvementAreas ?? []),
      })
      .returning();

    return NextResponse.json({
      success: true,
      data: savedAnalysis,
      message: "Resume analyzed successfully",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to analyze resume" },
      { status: 500 },
    );
  }
}

export async function GET(req: Request) {
  try {
    const anaylzedResume = await db.select().from(resumeAnalysis);
    return NextResponse.json({
      anaylzedResume,
      message: "Analyzed resume fetched successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to analyze resume" },
      { status: 500 },
    );
  }
}
