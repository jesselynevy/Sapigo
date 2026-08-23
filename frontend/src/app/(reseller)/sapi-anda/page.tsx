"use client";

import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import PageHeader from "@/src/components/ui/PageHeader";
import Button from "@/src/components/ui/Button";
import StatusBadge from "@/src/components/ui/StatusBadge";
import CowDetailModal, {
  CowDetail,
} from "@/src/components/sapi/CowDetailModal";
import { useCopyToClipboard } from "@/src/components/ui/useCopyToClipboard";
import { getVerificationLink, listAnimals } from "@/src/lib/api/sapi";
import { useAuthStore } from "@/src/store/useAuthStore";

interface Cow extends CowDetail {
  id: string;
  displayName: string;
}

export default function SapiAndaPage() {
  const [cows, setCows] = useState<Cow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedCow, setSelectedCow] = useState<Cow | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const { copy, copied } = useCopyToClipboard();
  const [copiedCowId, setCopiedCowId] = useState<string | null>(null);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (!user?.id) {
      setError("Sign in as a reseller to see your cows.");
      setLoading(false);
      return;
    }
    listAnimals(user.id)
      .then((animals) => setCows(animals.map((animal) => ({
        id: animal.cowCode,
        displayName: animal.display_name,
        cowCode: animal.cowCode,
        ownership: user.name,
        weight: animal.weight,
        breed: animal.breed || "Not available",
        verification: "unverified",
        receivedInfo: `Status: ${animal.status}`,
      }))))
      .catch(() => setError("Could not load cows from the backend."))
      .finally(() => setLoading(false));
  }, [user?.id, user?.name]);

  const handleViewDetail = (cow: Cow) => {
    setSelectedCow(cow);
    setModalOpen(true);
  };

  const handleCreateLink = async (cow: Cow) => {
    try {
      const { url } = await getVerificationLink(cow.cowCode);
      await copy(url);
      setCopiedCowId(cow.id);
      setTimeout(() => setCopiedCowId(null), 2000);
    } catch {
      setError("Could not create the verification link. Please try again.");
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
                  <p className="text-sm text-gray-400">Reception info: when?</p>
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
                onClick={() => handleCreateLink(cow)}
                className="text-primary text-sm underline self-center flex items-center gap-1"
              >
                {copiedCowId === cow.id ? (
                  <>
                    <Check className="w-4 h-4" />
                    Link copied!
                  </>
                ) : (
                  "Create info link"
                )}
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
