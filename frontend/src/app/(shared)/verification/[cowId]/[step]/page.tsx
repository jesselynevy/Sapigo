"use client";

import PhotoInput from "@/src/components/ui/PhotoInput";
import StepFlowLayout from "@/src/components/ui/StepFlowLayout";
import { getCowData } from "@/src/lib/api/sapi";
import { useSapiFlowState } from "@/src/lib/hooks/useSapiFlowState";
import { CheckCircle2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const TOTAL_STEPS = 4;

export default function VerificationStepPage() {
  const router = useRouter();
  const params = useParams<{ cowId: string; step: string }>();
  const { cowId } = params;
  const step = Number(params.step);
  const [error, setError] = useState<string | null>(null);

  const {
    muzzlePhoto,
    setMuzzlePhoto,
    cowData,
    setCowData,
    clearAll,
    hydrated,
  } = useSapiFlowState();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!hydrated) return;
    if (isNaN(step) || step < 3 || step > TOTAL_STEPS) {
      router.replace(`/verification/${cowId}`);
    }
  }, [step, hydrated, router, cowId]);

  useEffect(() => {
    if (!hydrated || cowData || !cowId) return;
    let cancelled = false;

    getCowData(cowId)
      .then((data) => !cancelled && setCowData(data))
      .catch(() => !cancelled && setError("Failed to fetch cow data."));

    return () => {
      cancelled = true;
    };
  }, [cowData, cowId, hydrated, setCowData]);

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

  const goToStep = (s: number) => router.push(`/verification/${cowId}/${s}`);

  const handleBack = () => {
    if (step === 3) {
      router.push(`/verification/${cowId}`);
      return;
    }
    goToStep(step - 1);
  };

  const handleRescan = () => router.push("/verification/scan");

  const handleNext = () => {
    if (step === 3) {
      goToStep(4);
      return;
    }
    goToStep(step + 1);
  };

  const handleFinish = () => {
    clearAll();
    router.push("/home");
  };

  const canProceed = () => {
    if (step === 3) return !!muzzlePhoto;
    return true;
  };

  if (!hydrated) return null;

  return (
    <StepFlowLayout
      title="Cow Verification"
      totalSteps={TOTAL_STEPS}
      currentStep={step}
      onBack={handleBack}
      showProgress={step <= 5}
      showPrimaryButton={step < 5}
      primaryDisabled={!canProceed() || loading}
      onPrimaryClick={handleNext}
      showSecondaryButton={step !== 3}
      secondaryLabel="Kembali"
      onSecondaryClick={step === 5 ? handleFinish : handleBack}
    >
      {step === 3 && (
        <>
          <div className="flex flex-col gap-1">
            <h2 className="font-jakarta font-bold text-black text-center">
              Biometric Identity of Cow Verification
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
          {error && <p className="text-red-400 text-xl">{error}</p>}
        </>
      )}

      {step === 4 && (
        <div className="flex-1 w-full flex flex-col items-center justify-center gap-2 border border-[#D6DCE8] rounded-xl ">
          {loading ? (
            <div className="flex items-center justify-center min-h-[300px]">
              <span className="text-gray-400">Loading...</span>
            </div>
          ) : cowData ? (
            <>
              <CheckCircle2 className="w-16 h-16 text-green-700" />
              <p className="text-center font-bold text-black px-8">
                Cow {cowData.cowCode.split("-")[0]}'s Identity is successfully
                verified!
              </p>
              <p className="text-center text-sm text-gray-500 px-8">
                Output of verification here?
              </p>
            </>
          ) : (
            <p className="text-center font-bold text-black px-8">
              Cow Data isn't loaded successfully
            </p>
          )}
        </div>
      )}
    </StepFlowLayout>
  );
}
