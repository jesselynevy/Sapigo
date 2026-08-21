"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { RotateCw, CheckCircle2 } from "lucide-react";
import StepFlowLayout from "@/src/components/ui/StepFlowLayout";
import PhotoInput from "@/src/components/ui/PhotoInput";
import InfoRow from "@/src/components/ui/InfoRow";
import StatusBadge from "@/src/components/ui/StatusBadge";
import { useDaftarSapiState } from "@/src/lib/hooks/useDaftarSapiState";
import { decodeQrAndFetch } from "@/src/lib/utils/decodeQrAndFetch";

const TOTAL_STEPS = 4;

export default function DaftarSapiStepPage() {
  const router = useRouter();
  const params = useParams<{ step: string }>();
  const step = Number(params.step);
  const [error, setError] = useState<string | null>(null);

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
  const goToStep = (s: number) => router.push(`/daftar-sapi/${s}`);

  // redirect kalau step di URL tidak valid
  useEffect(() => {
    if (!hydrated) return;
    if (isNaN(step) || step < 1 || step > TOTAL_STEPS) {
      router.replace("/daftar-sapi/1");
    }
  }, [step, hydrated, router]);

  useEffect(() => {
    if (step === 1 && qrPhoto && !cowData) {
      decodeQrAndFetch(qrPhoto, setError, setCowData, goToStep, 2);
    }
  }, [step, cowData, qrPhoto, setCowData, goToStep]);

  // auto-run submit saat masuk step 4 (loading) -> lanjut ke step 5
  useEffect(() => {
    if (step === 4) {
      setLoading(true);
      (async () => {
        try {
          // TODO: panggil API submit foto muzzle + cowData ke backend
          await new Promise((resolve) => setTimeout(resolve, 1500));
        } finally {
          setLoading(false);
        }
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  const handleBack = () => {
    router.push("/home");
  };

  const handleStepBack = () => {
    router.push(`/daftar-sapi/${step - 1}`);
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

  useEffect(() => {
    console.log(error);
  }, [error]);

  // hindari render sebelum hydration selesai (avoid flash/mismatch)
  if (!hydrated) return null;

  return (
    <StepFlowLayout
      title="Register a Cow"
      totalSteps={TOTAL_STEPS}
      currentStep={step}
      onBack={handleBack}
      showProgress={step <= 5}
      showPrimaryButton={step < 5}
      primaryDisabled={!canProceed() || loading}
      onPrimaryClick={handleNext}
      showSecondaryButton={step !== 1}
      secondaryLabel="Kembali"
      onSecondaryClick={step === 5 ? handleFinish : handleStepBack}
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
          <PhotoInput
            value={qrPhoto}
            onChange={setQrPhoto}
            placeholder="Take a picture of your cows' QR ear tags"
          />
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
            <InfoRow label="Cow Name" value={`${cowData.display_name}`} />
            <InfoRow label="Breed" value={cowData.breed} />
            <InfoRow label="Sex" value={cowData.sex} />
            <InfoRow label="Status" value={cowData.status} />
            {/* <InfoRow
              label="Status"
              value={<StatusBadge status={cowData.status} />}
            /> */}

            {error && <p className="text-red-400 text-xl">{error}</p>}
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
        <div className="flex-1 w-full flex flex-col items-center justify-center gap-2 border border-[#D6DCE8] rounded-xl ">
          {loading ? (
            <>
              <div className=" flex items-center justify-center min-h-[300px]">
                <span className="text-gray-400">Loading...</span>
              </div>
            </>
          ) : cowData ? (
            <>
              <CheckCircle2 className="w-16 h-16 text-green-700" />
              <p className="text-center font-bold text-black px-8">
                Identity of Cow {cowData.cowCode.split("-")[0]} has been
                successfully saved!
              </p>
              <p className="text-center text-sm text-gray-500 px-8">
                Please have the verification done after the physical cow is
                transferred!
              </p>
            </>
          ) : (
            <>
              <p className="text-center font-bold text-black px-8">
                Cow Data isn't saved successfully
              </p>
            </>
          )}
        </div>
      )}
    </StepFlowLayout>
  );
}
