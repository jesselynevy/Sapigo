"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import PageHeader from "@/src/components/ui/PageHeader";
import Button from "@/src/components/ui/Button";
import StatusBadge from "@/src/components/ui/StatusBadge";
import CowDetailModal, {
  CowDetail,
} from "@/src/components/sapi/CowDetailModal";
import { useCopyToClipboard } from "@/src/components/ui/useCopyToClipboard";

interface Cow extends CowDetail {
  id: string;
  displayName: string;
}

export default function SapiAndaPage() {
  // TODO: fetch dari API
  const [cows] = useState<Cow[]>([
    {
      id: "1",
      displayName: "Sapi ABCDE #ASDSD",
      cowCode: "X-ASJAAJAJA-AJAJAJAJJA",
      ownership: "Farmer ABC",
      weight: 3,
      breed: "Limousine",
      verification: "verified",
      receivedInfo: "Received on 12 Aug 2026",
    },
    {
      id: "2",
      displayName: "Sapi ABCDE #ASDSD",
      cowCode: "X-ASJAAJAJA-AJAJAJAJJB",
      ownership: "Farmer ABC",
      weight: 3,
      breed: "Limousine",
      verification: "verified",
      receivedInfo: "Received on 10 Aug 2026",
    },
    {
      id: "3",
      displayName: "Sapi ABCDE #ASDSD",
      cowCode: "X-ASJAAJAJA-AJAJAJAJJC",
      ownership: "Farmer ABC",
      weight: 3,
      breed: "Limousine",
      verification: "verified",
      receivedInfo: "Received on 5 Aug 2026",
    },
  ]);

  const [selectedCow, setSelectedCow] = useState<Cow | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const { copy, copied } = useCopyToClipboard();
  const [copiedCowId, setCopiedCowId] = useState<string | null>(null);

  const handleViewDetail = (cow: Cow) => {
    setSelectedCow(cow);
    setModalOpen(true);
  };

  const handleCreateLink = async (cow: Cow) => {
    // TODO: ganti dengan generate link sesungguhnya dari backend
    const link = `https://yourapp.com/sapi/${cow.cowCode}`;
    await copy(link);
    setCopiedCowId(cow.id);
    setTimeout(() => setCopiedCowId(null), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-primary">
      <PageHeader title="My Cows" />

      <div className="bg-white rounded-t-[40px] flex-1  px-7 py-8 flex flex-col gap-3">
        {cows.length === 0 ? (
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
