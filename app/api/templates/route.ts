import { resumeTemplate } from "@/app/db/schema";
import { getUserId, UnauthorizedError } from "@/lib/auth";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const userId = await getUserId();

    // These rows are this user's template-usage log, so the dashboard's
    // "Templates Used" count must exclude everyone else's saves.
    const templates = await db
      .select()
      .from(resumeTemplate)
      .where(eq(resumeTemplate.userId, userId));

    return NextResponse.json({ templates }, { status: 200 });
  } catch (err) {
    if (err instanceof UnauthorizedError) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("templates GET error:", err);

    return NextResponse.json(
      { error: "Failed to fetch templates" },
      { status: 500 },
    );
  }
};

export const POST = async (req: Request) => {
  try {
    const userId = await getUserId();
    const { name, previewImage, latexTemplate } = await req.json();

    // We log which template was used, so only the template name is required.
    // previewImage/latexTemplate are optional here (the columns are NOT NULL,
    // so they default to empty strings when a usage log doesn't supply them).
    if (!name) {
      return NextResponse.json(
        { error: "Template name is required" },
        { status: 400 },
      );
    }

    const [template] = await db
      .insert(resumeTemplate)
      .values({
        userId,
        name,
        previewImage: previewImage ?? "",
        latexTemplate: latexTemplate ?? "",
      })
      .returning();

    return NextResponse.json({ template }, { status: 201 });
  } catch (err) {
    if (err instanceof UnauthorizedError) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("templates POST error:", err);

    return NextResponse.json(
      { error: "Failed to save template" },
      { status: 500 },
    );
  }
};
