"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { getCurrentUser } from "@/src/lib/api/auth";

export default function CompletedProfileGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const checkProfile = async () => {
      try {
        const user = await getCurrentUser();
        if (!user.full_name) {
          router.replace("/onboarding");
          return;
        }
        setAllowed(true);
      } catch {
        router.replace("/login");
      }
    };

    void checkProfile();
  }, [router]);

  if (!allowed) {
    return <main className="min-h-screen bg-primary" />;
  }

  return children;
}
