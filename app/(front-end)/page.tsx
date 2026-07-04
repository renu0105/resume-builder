"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

function Page() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") {
      return;
    }

    router.push(status === "authenticated" ? "/dashboard" : "/hero-section");
  }, [status, router]);
  return null;
}

export default Page;
