import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { resume } from "@/app/db/schema";
import { eq } from "drizzle-orm";

export const GET = async (
  request: Request,
  { params }: { params: { id: string } },
) => {
  try {
    const getResumeById = await db
      .select()
      .from(resume)
      .where(eq(resume.id, parseInt(params.id)));

    if (!getResumeById || getResumeById.length === 0) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 });
    }
    return NextResponse.json({
      getResumeById,
      message: "Resume fetched successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch resume" },
      { status: 500 },
    );
  }
};

export const DELETE = async (
  request: Request,
  { params }: { params: { id: string } },
) => {
  try {
    const DeletedResume = await db
      .delete(resume)
      .where(eq(resume.id, parseInt(params.id)));
    return NextResponse.json({
      message: "Resume deleted successfully",
      resume: DeletedResume,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete resume" },
      { status: 500 },
    );
  }
};
