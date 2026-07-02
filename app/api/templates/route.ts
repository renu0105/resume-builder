import { resumeTemplate } from "@/app/db/schema";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const templates = await db.select().from(resumeTemplate);

    return NextResponse.json({ templates }, { status: 200 });
  } catch (err) {
    console.error("templates GET error:", err);

    return NextResponse.json(
      { error: "Failed to fetch templates" },
      { status: 500 },
    );
  }
};

export const POST = async (req: Request) => {
  try {
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
        name,
        previewImage: previewImage ?? "",
        latexTemplate: latexTemplate ?? "",
      })
      .returning();

    return NextResponse.json({ template }, { status: 201 });
  } catch (err) {
    console.error("templates POST error:", err);

    return NextResponse.json(
      { error: "Failed to save template" },
      { status: 500 },
    );
  }
};
