"use client";

import PhotoInput from "@/src/components/ui/PhotoInput";
import StepFlowLayout from "@/src/components/ui/StepFlowLayout";
import { ApiError } from "@/src/lib/api/client";
import { getCowData, VerificationApiResponse, verifyAnimal } from "@/src/lib/api/sapi";
import { useSapiFlowState } from "@/src/lib/hooks/useSapiFlowState";
import { CheckCircle2 } from "lucide-react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

const TOTAL_STEPS = 4;

export default function VerificationStepPage() {
  const router = useRouter();
  const params = useParams<{ cowId: string; step: string }>();
  const { cowId } = params;
  const searchParams = useSearchParams();
  const ownerId = searchParams.get("owner_id") ?? undefined;
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
  const [verification, setVerification] = useState<VerificationApiResponse | null>(null);

  useEffect(() => {
    if (!hydrated) return;
    if (isNaN(step) || step < 3 || step > TOTAL_STEPS) {
      router.replace(`/verification/${cowId}`);
    }
  }, [step, hydrated, router, cowId]);

  useEffect(() => {
    if (!hydrated || cowData || !cowId) return;
    let cancelled = false;

    getCowData(cowId, ownerId)
      .then((data) => !cancelled && setCowData(data))
      .catch(() => !cancelled && setError("Failed to fetch cow data."));

    return () => {
      cancelled = true;
    };
  }, [cowData, cowId, hydrated, ownerId, setCowData]);

  useEffect(() => {
    if (step === 4 && muzzlePhoto && !verification) {
      setLoading(true);
      setError(null);
      (async () => {
        try {
          if (!ownerId) {
            throw new Error("This verification link is missing its owner identity. Scan the QR code again.");
          }
          setVerification(await verifyAnimal(cowId, muzzlePhoto, ownerId));
        } catch (err) {
          if (err instanceof ApiError && err.status === 422) {
            const detail = err.detail as { reasons?: string[] };
            setError(`Photo rejected: ${detail.reasons?.join(", ") ?? "please retake it with better lighting and focus."}`);
          } else if (err instanceof ApiError && err.status === 400) {
            setError("This cow has no enrolled muzzle template yet. Enroll 2–3 reference photos first.");
          } else {
            setError(err instanceof Error ? err.message : "Verification failed. Please try again.");
          }
        } finally {
          setLoading(false);
        }
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  const goToStep = (s: number) => router.push(`/verification/${cowId}/${s}${ownerId ? `?owner_id=${encodeURIComponent(ownerId)}` : ""}`);

  const handleBack = () => {
    if (step === 3) {
      router.push(`/verification/${cowId}`);
      return;
    }
    goToStep(step - 1);
  };

  const handleRescan = () => router.push("/verification");

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
      showProgress={step <= TOTAL_STEPS}
      showPrimaryButton={step < TOTAL_STEPS}
      primaryDisabled={!canProceed() || loading || (step === 4 && !!error)}
      onPrimaryClick={handleNext}
      showSecondaryButton={step !== 3}
      secondaryLabel={step === TOTAL_STEPS ? "Selesai" : "Kembali"}
      onSecondaryClick={step === TOTAL_STEPS ? handleFinish : handleBack}
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
            <div className="flex items-center justify-center min-h-75">
              <span className="text-gray-400">Loading...</span>
            </div>
          ) : verification && cowData ? (
            <>
              <CheckCircle2
                className={`w-16 h-16 ${verification.decision === "verified" ? "text-green-700" : "text-amber-600"}`}
              />
              <p className="text-center font-bold text-black px-8">
                {verification.decision === "verified"
                  ? `Cow ${cowData.cowCode}'s identity is verified!`
                  : `Cow ${cowData.cowCode}'s identity needs review.`}
              </p>
              <p className="text-center text-sm text-gray-500 px-8">
                Similarity score: {verification.similarity_score.toFixed(3)}
              </p>
            </>
          ) : (
            <p className="text-center font-bold text-black px-8">{error ?? "Verification result is unavailable."}</p>
          )}
        </div>
      )}
    </StepFlowLayout>
  );
}
