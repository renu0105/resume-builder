import { NextResponse } from "next/server";

// Next.js 16 renamed the "middleware" file convention to "proxy" (same
// functionality). This is a pass-through — route/page auth is enforced
// server-side via getServerSession, not here.
export function proxy() {
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/analyzer/:path*",
    "/templates/:path*",
    "/interview-prep/:path*",
    "/chat-bot/:path*",
  ],
};
