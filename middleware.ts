export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/analyzer/:path*",
    "/templates/:path*",
    "/interview-prep/:path*",
    "/chat-bot/:path*",
  ],
};
