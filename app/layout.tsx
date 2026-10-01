import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";
import { Toaster } from "react-hot-toast";
import { Providers } from "@/components/Providers";
export const metadata: Metadata = {
  title: "Resume Nova",
  description:
    "Build ATS-friendly resumes, analyze your CV, and practice interviews with AI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <head></head>
      <body className="flex flex-col">
        <Providers>
          <Nav />
          <Toaster />
          {children}
        </Providers>
      </body>
    </html>
  );
}
