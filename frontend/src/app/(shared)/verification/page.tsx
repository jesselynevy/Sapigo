"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import PageHeader from "@/src/components/ui/PageHeader";
import { listAnimals } from "@/src/lib/api/sapi";
import { useCurrentUser } from "@/src/lib/hooks/useCurrentUser";
import { CowData } from "@/src/types/sapi";

export default function SelectCowForVerificationPage() {
  const router = useRouter();
  const { user, loading: loadingUser } = useCurrentUser();
  const [cows, setCows] = useState<CowData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (loadingUser) return;
    if (!user?.id) {
      setError("Sign in as a reseller to verify one of your cows.");
      setLoading(false);
      return;
    }
    listAnimals(user.id)
      .then(setCows)
      .catch(() => setError("Could not load your cows."))
      .finally(() => setLoading(false));
  }, [loadingUser, user?.id]);

  return (
    <div className="min-h-screen flex flex-col bg-primary">
      <PageHeader title="Cow Verification" />
      <main className="flex-1 rounded-t-[40px] bg-white px-7 py-8">
        <h1 className="text-center font-jakarta text-lg font-bold text-black">Select your cow</h1>
        <p className="mt-1 text-center text-sm text-gray-500">Choose the cow in your inventory, then photograph or upload its muzzle.</p>
        <div className="mt-6 flex flex-col gap-3">
          {loading && <p className="text-center text-sm text-gray-400">Loading your cows...</p>}
          {error && <p className="text-center text-sm text-red-600">{error}</p>}
          {!loading && !error && cows.length === 0 && <p className="text-center text-sm text-gray-400">You do not have registered cows yet.</p>}
          {cows.map((cow) => (
            <button key={cow.cowCode} onClick={() => router.push(`/verification/${cow.cowCode}/3?owner_id=${encodeURIComponent(cow.ownerId)}`)} className="rounded-xl border border-[#D6DCE8] px-4 py-4 text-left transition hover:border-primary hover:bg-primary/5">
              <p className="font-bold text-black">{cow.display_name}</p>
              <p className="mt-1 text-sm text-gray-500">{cow.breed || "Breed not recorded"} · ID: {cow.cowCode}</p>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}
