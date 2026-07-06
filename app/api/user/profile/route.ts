import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/app/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, body.email));

    if (existingUser.length > 0) {
      return NextResponse.json(
        { error: "Email already exists. Please use a different email." },
        { status: 400 },
      );
    }

    const hashedPassword = await bcrypt.hash(body.password, 10);

    await db.insert(users).values({
      name: body.name,
      email: body.email,
      password: hashedPassword,
    });

    return NextResponse.json({ message: "Signup successful" }, { status: 201 });
  } catch (error) {
    console.error("Signup Error:", error);

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
