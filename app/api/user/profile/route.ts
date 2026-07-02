import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/app/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const user = await db.insert(users).values({
      name: body.name,
      email: body.email,
    });

    return NextResponse.json({
      user,
      message: "User profile updated successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update user profile" },
      { status: 500 },
    );
  }
}

export async function GET(
  req: Request,
  { params }: { params: { userId: string } },
) {
  try {
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, parseInt(params.userId)));

    if (!user) {
      return NextResponse.json(
        { error: "User profile not found" },
        { status: 404 },
      );
    }
    return NextResponse.json({
      user,
      message: "User profile fetched successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch user profile" },
      { status: 500 },
    );
  }
}
