"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RotateCw, CheckCircle2 } from "lucide-react";
import StepFlowLayout from "@/src/components/ui/StepFlowLayout";
import PhotoInput from "@/src/components/ui/PhotoInput";
import InfoRow from "@/src/components/ui/InfoRow";
import StatusBadge from "@/src/components/ui/StatusBadge";

type Step = 1 | 2 | 3 | 4 | 5;

export default function DaftarSapiFlow() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [qrPhoto, setQrPhoto] = useState<File | null>(null);
  const [muzzlePhoto, setMuzzlePhoto] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const [cowData] = useState({
    cowCode: "X-ASJAAJAJA-AJAJAJAJJA",
    ownership: "Farmer ABC",
    weight: 3,
    breed: "Limousine",
    verification: "unverified" as const,
  });

  const handleBack = () => {
    if (step === 1) {
      router.push("/home");
      return;
    }
    setStep((s) => (s - 1) as Step);
  };

  const handleRescan = () => setStep(1);

  const handleNext = async () => {
    if (step === 3) {
      setStep(4);
      setLoading(true);
      try {
        await new Promise((r) => setTimeout(r, 1500));
        setStep(5);
      } finally {
        setLoading(false);
      }
      return;
    }
    setStep((s) => (s + 1) as Step);
  };

  const canProceed = () => {
    if (step === 1) return !!qrPhoto;
    if (step === 3) return !!muzzlePhoto;
    return true;
  };

  return (
    <StepFlowLayout
      title="Daftar Sapi"
      totalSteps={5}
      currentStep={step}
      onBack={handleBack}
      showProgress={step <= 5}
      showPrimaryButton={step < 5}
      primaryDisabled={!canProceed() || loading}
      onPrimaryClick={handleNext}
      showSecondaryButton={step !== 1}
      secondaryLabel="Kembali"
      onSecondaryClick={step === 5 ? () => router.push("/home") : handleBack}
    >
      {step === 1 && (
        <>
          <div className="flex flex-col gap-1">
            <h2 className="font-jakarta font-bold text-black text-center">
              Identification of QR Code
            </h2>
            <h3 className="font-jakarta text-gray-500 text-center">
              Please point your camera to the QR Code of the ear tags
            </h3>
          </div>
          <PhotoInput value={qrPhoto} onChange={setQrPhoto} />
        </>
      )}

      {step === 2 && (
        <>
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
            <InfoRow label="Ownership" value={cowData.ownership} />
            <InfoRow label="Weight" value={`${cowData.weight} kg`} />
            <InfoRow label="Breed" value={cowData.breed} />
            <InfoRow
              label="Verification"
              value={<StatusBadge status={cowData.verification} />}
            />
          </div>
        </>
      )}

      {step === 3 && (
        <>
          <div className="flex flex-col gap-1">
            <h2 className="font-jakarta font-bold text-black text-center">
              Creation of Cow Biometric Identity
            </h2>
            <h3 className="font-jakarta text-gray-500 text-center">
              Please point your camera towards the muzzle of the cow.
            </h3>
          </div>
          <PhotoInput
            value={muzzlePhoto}
            onChange={setMuzzlePhoto}
            placeholder="Foto muzzle sapi"
          />
        </>
      )}

      {step === 4 && (
        <>
          <div className="flex flex-col gap-1">
            <h2 className="font-jakarta font-bold text-black text-center">
              Biometric Identity of Cow Creation
            </h2>
          </div>
          <div className="flex-1 flex items-center justify-center min-h-[300px] border border-[#D6DCE8] rounded-xl">
            <span className="text-gray-400">Loading...</span>
          </div>
        </>
      )}

      {step === 5 && (
        <div className="flex-1 flex flex-col items-center justify-center gap-2 border bg-white border-[#D6DCE8] rounded-xl min-h-[350px]">
          <CheckCircle2 className="w-16 h-16 text-green-700" />
          <p className="text-center font-bold text-black px-8">
            Identitas untuk Sapi {cowData.cowCode.split("-")[0]} telah berhasil
            dicatat!
          </p>
          <p className="text-center text-sm text-gray-500 px-8">
            Silahkan melakukan verifikasi ketika sapinya sudah diterima!
          </p>
        </div>
      )}
    </StepFlowLayout>
  );
}
