import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { resume } from "@/app/db/schema";
import { and, eq } from "drizzle-orm";
import { getUserId, UnauthorizedError } from "@/lib/auth";

export const GET = async (
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) => {
  try {
    const userId = await getUserId();
    const { id } = await params;
    const resumeId = Number(id);

    if (!Number.isInteger(resumeId)) {
      return NextResponse.json({ error: "Invalid resume id" }, { status: 400 });
    }

    // Match on owner as well as id: without it any signed-out caller could read
    // any user's resume by guessing a serial id.
    const getResumeById = await db
      .select()
      .from(resume)
      .where(and(eq(resume.id, resumeId), eq(resume.userId, userId)));

    if (getResumeById.length === 0) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 });
    }
    return NextResponse.json({
      getResumeById,
      message: "Resume fetched successfully",
    });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("resume [id] GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch resume" },
      { status: 500 },
    );
  }
};

export const DELETE = async (
  request: Request,
  context: {
    params: Promise<{ id: string }>;
  },
) => {
  try {
    const userId = await getUserId();
    const { id } = await context.params;
    const resumeId = Number(id);

    if (!Number.isInteger(resumeId)) {
      return NextResponse.json({ error: "Invalid resume id" }, { status: 400 });
    }

    // Ownership is part of the WHERE clause, so a request for someone else's
    // resume deletes nothing and reports 404 rather than destroying their row.
    const deleted = await db
      .delete(resume)
      .where(and(eq(resume.id, resumeId), eq(resume.userId, userId)))
      .returning({ id: resume.id });

    if (deleted.length === 0) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Resume deleted successfully",
      resume: deleted[0],
    });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("resume [id] DELETE error:", error);
    return NextResponse.json(
      { error: "Failed to delete resume" },
      { status: 500 },
    );
  }
};
