import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { authOptions } from "@/lib/authOptions";
import { resume, users } from "@/app/db/schema";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const allResumes = await db.select().from(resume);
    return NextResponse.json({
      allResumes,
      message: "All resumes fetched successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch user profile" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Derive the user from the session — never trust a client-supplied userId.
    const [currentUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, session.user.email));
    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await req.json();
    const content: string = (body.content ?? "").trim();
    if (!content) {
      return NextResponse.json(
        { error: "Resume content is required" },
        { status: 400 },
      );
    }

    // Don't store a duplicate when the same user re-submits identical content.
    const [existingResume] = await db
      .select()
      .from(resume)
      .where(
        and(eq(resume.userId, currentUser.id), eq(resume.content, content)),
      );

    if (existingResume) {
      return NextResponse.json(
        {
          message: "Resume already exists; no changes saved",
          resume: existingResume,
          duplicate: true,
        },
        { status: 200 },
      );
    }

    const [newResume] = await db
      .insert(resume)
      .values({ userId: currentUser.id, content })
      .returning();
    console.log("New Resume Created:", newResume);
    return NextResponse.json(
      { message: "Resume created successfully", resume: newResume },
      { status: 201 },
    );
  } catch (error) {
    console.error("resume POST error:", error);
    return NextResponse.json(
      { error: "Failed to create resume" },
      { status: 500 },
    );
  }
}
