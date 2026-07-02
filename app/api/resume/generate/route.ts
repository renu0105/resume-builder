import { NextRequest } from "next/server";
import { generateResume, type ResumeData } from "@/lib/generateResume";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      template?: string;
      data?: ResumeData;
      resumeData?: ResumeData;
    };
    // Accept either `data` or `resumeData` so older clients keep working.
    const bytes = await generateResume(
      body.template ?? "modern",
      body.data ?? body.resumeData ?? {},
    );

    // Buffer is an ArrayBufferView, accepted directly as a Response body.
    return new Response(Buffer.from(bytes), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'inline; filename="resume.pdf"',
      },
    });
  } catch (err) {
    console.error("resume generation failed:", err);
    return Response.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    );
  }
}
