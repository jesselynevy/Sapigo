"use client";

import { useEffect, useState } from "react";
import { Check, Link as LinkIcon } from "lucide-react";
import PageHeader from "@/src/components/ui/PageHeader";
import Button from "@/src/components/ui/Button";
import StatusBadge from "@/src/components/ui/StatusBadge";
import CowDetailModal, {
  CowDetail,
} from "@/src/components/sapi/CowDetailModal";
import { listAnimals } from "@/src/lib/api/sapi";
import { useCurrentUser } from "@/src/lib/hooks/useCurrentUser";

interface Cow extends CowDetail {
  id: string;
  ownerId: string;
  displayName: string;
}

export default function SapiAndaPage() {
  const [cows, setCows] = useState<Cow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedCow, setSelectedCow] = useState<Cow | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [copiedCowId, setCopiedCowId] = useState<string | null>(null);
  const { user, loading: loadingUser } = useCurrentUser();

  useEffect(() => {
    if (loadingUser) return;
    if (!user?.id) {
      setError("Sign in as a reseller to see your cows.");
      setLoading(false);
      return;
    }
    listAnimals(user.id)
      .then((animals) => setCows(animals.map((animal) => ({
        id: animal.cowCode,
        ownerId: animal.ownerId,
        displayName: animal.display_name,
        cowCode: animal.cowCode,
        ownership: user.full_name ?? "Not available",
        weight: animal.weight,
        breed: animal.breed || "Not available",
        sex: animal.sex || "Not recorded",
        verification: animal.verification,
        registeredAt: animal.createdAt,
      }))))
      .catch(() => setError("Could not load cows from the backend."))
      .finally(() => setLoading(false));
  }, [loadingUser, user?.id, user?.full_name]);

  const handleViewDetail = (cow: Cow) => {
    setSelectedCow(cow);
    setModalOpen(true);
  };

  const handleCreateLink = async (cow: Cow) => {
    const url = `${window.location.origin}/public/verification/${cow.cowCode}?owner_id=${encodeURIComponent(cow.ownerId)}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopiedCowId(cow.id);
      window.setTimeout(() => setCopiedCowId(null), 2000);
    } catch {
      setError("Could not copy the public verification link.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-primary">
      <PageHeader title="My Cows" />

      <div className="bg-white rounded-t-[40px] flex-1  px-7 py-8 flex flex-col gap-3">
        {loading ? (
          <p className="text-gray-400 text-sm text-center py-8">Loading cows...</p>
        ) : error ? (
          <p className="text-red-600 text-sm text-center py-8">{error}</p>
        ) : cows.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-8">
            You don't have any registered cows yet.
          </p>
        ) : (
          cows.map((cow) => (
            <div
              key={cow.id}
              className="border border-[#D6DCE8] rounded-xl px-4 py-5 flex flex-col gap-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-bold text-black">{cow.displayName}</p>
                  <p className="text-sm text-gray-400">Registered: {new Date(cow.registeredAt).toLocaleDateString()}</p>
                  <p className="mt-1 text-xs text-gray-500">{cow.breed} · {cow.sex} · {cow.weight === null ? "Weight not recorded" : `${cow.weight} kg`}</p>
                </div>
                <StatusBadge status={cow.verification} />
              </div>

              <Button
                onClick={() => handleViewDetail(cow)}
                className="w-full mb-3"
              >
                View Details
              </Button>

              <button
                type="button"
                onClick={() => void handleCreateLink(cow)}
                className="flex self-center items-center gap-1 text-sm text-primary underline"
              >
                {copiedCowId === cow.id ? <><Check className="h-4 w-4" />Link copied</> : <><LinkIcon className="h-4 w-4" />Create public verification link</>}
              </button>

            </div>
          ))
        )}
      </div>

      <CowDetailModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        cow={selectedCow}
      />
    </div>
  );
}
