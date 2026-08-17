"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { RotateCw, CheckCircle2 } from "lucide-react";
import StepFlowLayout from "@/src/components/ui/StepFlowLayout";
import PhotoInput from "@/src/components/ui/PhotoInput";
import InfoRow from "@/src/components/ui/InfoRow";
import StatusBadge from "@/src/components/ui/StatusBadge";
import { useDaftarSapiState } from "@/src/lib/hooks/useDaftarSapiState";
import router from "next/router";

const TOTAL_STEPS = 5;

export default function DaftarSapiStepPage() {
  const router = useRouter();
  const params = useParams<{ step: string }>();
  const step = Number(params.step);

  const {
    qrPhoto,
    setQrPhoto,
    muzzlePhoto,
    setMuzzlePhoto,
    cowData,
    setCowData,
    clearAll,
    hydrated,
  } = useDaftarSapiState();

  const [loading, setLoading] = useState(false);

  // redirect kalau step di URL tidak valid
  useEffect(() => {
    if (!hydrated) return;
    if (isNaN(step) || step < 1 || step > TOTAL_STEPS) {
      router.replace("/daftar-sapi/1");
    }
  }, [step, hydrated, router]);

  // simulasi lookup data sapi begitu masuk step 2 (kalau belum ada cowData)
  useEffect(() => {
    if (step === 2 && !cowData) {
      // TODO: ganti dengan API call sesungguhnya berdasarkan qrPhoto
      setCowData({
        cowCode: "X-ASJAAJAJA-AJAJAJAJJA",
        ownership: "Farmer ABC",
        weight: 3,
        breed: "Limousine",
        verification: "unverified",
      });
    }
  }, [step, cowData, setCowData]);

  // auto-run submit saat masuk step 4 (loading) -> lanjut ke step 5
  useEffect(() => {
    if (step === 4) {
      setLoading(true);
      (async () => {
        try {
          // TODO: panggil API submit foto muzzle + cowData ke backend
          await new Promise((resolve) => setTimeout(resolve, 1500));
          router.push("/daftar-sapi/5");
        } finally {
          setLoading(false);
        }
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  const goToStep = (s: number) => router.push(`/daftar-sapi/${s}`);

  const handleBack = () => {
    if (step === 1) {
      router.push("/home");
      return;
    }
    goToStep(step - 1);
  };

  const handleRescan = () => goToStep(1);

  const handleNext = () => {
    if (step === 3) {
      goToStep(4); // step 4 auto-handles submit + redirect ke 5
      return;
    }
    goToStep(step + 1);
  };

  const handleFinish = () => {
    clearAll(); // bersihkan sessionStorage begitu flow selesai
    router.push("/home");
  };

  const canProceed = () => {
    if (step === 1) return !!qrPhoto;
    if (step === 3) return !!muzzlePhoto;
    return true;
  };

  // hindari render sebelum hydration selesai (avoid flash/mismatch)
  if (!hydrated) return null;

  return (
    <StepFlowLayout
      title="Register a Cow"
      totalSteps={TOTAL_STEPS}
      currentStep={step}
      onBack={handleBack}
      showProgress={step <= 4}
      showPrimaryButton={step < 5}
      primaryDisabled={!canProceed() || loading}
      onPrimaryClick={handleNext}
      showSecondaryButton={step !== 1}
      secondaryLabel="Kembali"
      onSecondaryClick={step === 5 ? handleFinish : handleBack}
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

      {step === 2 && cowData && (
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
              Biometric Identity of Cow Creation
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

      {step === 5 && cowData && (
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
