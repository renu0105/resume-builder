"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

function Page() {
  const router = useRouter();
  const session = useSession();

  if (session?.status === "authenticated") {
    router.push("/dashboard");
  } else {
    router.push("/hero-section");
  }
  return null;
}

export default Page;
