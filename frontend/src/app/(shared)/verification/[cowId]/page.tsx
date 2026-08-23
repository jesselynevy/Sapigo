// app/verification/[cowId]/page.tsx
"use client";

import InfoRow from "@/src/components/ui/InfoRow";
import StepFlowLayout from "@/src/components/ui/StepFlowLayout";
import { getCowData } from "@/src/lib/api/sapi";
import { CowData } from "@/src/types/sapi";
import { RotateCw } from "lucide-react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const TOTAL_STEPS = 4;

export default function CowSummaryPage() {
  const router = useRouter();
  const params = useParams<{ cowId: string }>();
  const { cowId } = params;
  const searchParams = useSearchParams();
  const ownerId = searchParams.get("owner_id") ?? undefined;

  const [cowData, setCowData] = useState<CowData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!cowId) return;
    let cancelled = false;

    getCowData(cowId, ownerId)
      .then((data) => {
        if (!cancelled) setCowData(data);
      })
      .catch(() => {
        if (!cancelled) setError("Sapi tidak ditemukan.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [cowId, ownerId]);

  const handleBack = () => router.push("/home");
  const verificationPath = `/verification/${cowId}/3${ownerId ? `?owner_id=${encodeURIComponent(ownerId)}` : ""}`;
  const handleNext = () => router.push(verificationPath);
  const handleRescan = () => router.push("/verification/scan");

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="text-gray-400">Loading...</span>
      </div>
    );
  }

  if (error || !cowData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 p-8">
        <h2 className="font-jakarta font-bold text-black text-center">
          Sapi tidak ditemukan
        </h2>
        <p className="font-jakarta text-gray-500 text-center">
          {error ?? "Data sapi tidak dapat dimuat."}
        </p>
        <button
          onClick={handleRescan}
          className="bg-primary text-white px-6 py-2 rounded-lg"
        >
          Scan Ulang
        </button>
      </div>
    );
  }

  return (
    <StepFlowLayout
      title="Cow Verification"
      totalSteps={TOTAL_STEPS}
      currentStep={2}
      onBack={handleBack}
      showProgress
      showPrimaryButton
      onPrimaryClick={handleNext}
      showSecondaryButton={false}
      secondaryLabel="Kembali"
    >
      <div className="flex flex-col gap-1">
        <h2 className="font-jakarta font-bold text-black text-center">
          Summary of Cow Information
        </h2>
        <h3 className="font-jakarta text-gray-500 text-center">
          Please check if it's the correct cow.
        </h3>
      </div>
      <div className="border border-[#D6DCE8] rounded-xl px-4 py-2 divide-y divide-[#EEF1F6]">
        <InfoRow
          label="Cow Code"
          value={cowData.cowCode}
          action={
            <button
              onClick={handleRescan}
              className="text-primary"
              title="Scan ulang"
            >
              <RotateCw className="w-4 h-4" />
            </button>
          }
        />
        <InfoRow label="Cow Name" value={cowData.display_name} />
        <InfoRow label="Breed" value={cowData.breed} />
        <InfoRow label="Sex" value={cowData.sex} />
        <InfoRow label="Status" value={cowData.status} />
      </div>
    </StepFlowLayout>
  );
}
