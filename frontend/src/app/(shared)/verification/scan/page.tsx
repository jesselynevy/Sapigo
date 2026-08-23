"use client";

import PhotoInput from "@/src/components/ui/PhotoInput";
import StepFlowLayout from "@/src/components/ui/StepFlowLayout";
import { useSapiFlowState } from "@/src/lib/hooks/useSapiFlowState";
import { decodeQrAndFetch } from "@/src/lib/utils/decodeQrAndFetch";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const TOTAL_STEPS = 4;

export default function ScanQrStep() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [decodedCowId, setDecodedCowId] = useState<string | null>(null);

  const { qrPhoto, setQrPhoto, cowData, setCowData, hydrated } =
    useSapiFlowState();

  const handleBack = () => {
    router.push("/home");
  };

  const canProceed = () => !!decodedCowId;

  useEffect(() => {
    if (qrPhoto) {
      decodeQrAndFetch(qrPhoto, setError, setCowData, (cowId) => {
        setDecodedCowId(cowId);
      });
    }
  }, [qrPhoto, cowData, setCowData]);

  const handleNext = () => {
    if (decodedCowId) {
      router.push(`/verification/${decodedCowId}`);
    }
  };

  if (!hydrated) return null;

  return (
    <StepFlowLayout
      title="Cow Verification"
      totalSteps={TOTAL_STEPS}
      currentStep={1}
      onBack={handleBack}
      showProgress
      showPrimaryButton
      primaryDisabled={!canProceed()}
      onPrimaryClick={handleNext}
      showSecondaryButton={false}
      secondaryLabel="Kembali"
    >
      <div className="flex flex-col gap-1">
        <h2 className="font-jakarta font-bold text-black text-center">
          Identification of QR Code
        </h2>
        <h3 className="font-jakarta text-gray-500 text-center">
          Please point your camera to the QR Code of the ear tags
        </h3>
      </div>
      <PhotoInput value={qrPhoto} onChange={setQrPhoto} />
      {error && <p className="text-red-500 text-xs">{error}</p>}
    </StepFlowLayout>
  );
}
