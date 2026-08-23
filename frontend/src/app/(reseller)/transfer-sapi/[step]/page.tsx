"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { CheckCircle2, XCircle } from "lucide-react";

import Input from "@/src/components/ui/Input";
import PhotoInput from "@/src/components/ui/PhotoInput";
import StepFlowLayout from "@/src/components/ui/StepFlowLayout";
import { ApiError } from "@/src/lib/api/client";
import { listAnimals, TransferApiResponse, transferAnimal } from "@/src/lib/api/sapi";
import { useTransferSapiState } from "@/src/lib/hooks/useTransferSapiState";
import { useCurrentUser } from "@/src/lib/hooks/useCurrentUser";
import { CowData } from "@/src/types/sapi";

const TOTAL_STEPS = 4;

function requestError(error: unknown): string {
  if (error instanceof ApiError && error.status === 422) {
    const detail = error.detail as { reasons?: string[] };
    return `Photo rejected: ${detail.reasons?.join(", ") ?? "retake it with better lighting and focus."}`;
  }
  return error instanceof Error ? error.message : "Transfer could not be completed.";
}

export default function TransferSapiStepPage() {
  const router = useRouter();
  const { step: rawStep } = useParams<{ step: string }>();
  const step = Number(rawStep);
  const { user, loading: loadingUser } = useCurrentUser();
  const [cows, setCows] = useState<CowData[]>([]);
  const [loadingCows, setLoadingCows] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<TransferApiResponse | null>(null);
  const [attempted, setAttempted] = useState(false);
  const { receiverPhone, setReceiverPhone, selectedCow, setSelectedCow, identityPhoto, setIdentityPhoto, clearAll, hydrated } = useTransferSapiState();

  useEffect(() => {
    if (hydrated && (!Number.isInteger(step) || step < 1 || step > TOTAL_STEPS)) router.replace("/transfer-sapi/1");
  }, [hydrated, router, step]);

  useEffect(() => {
    if (loadingUser) return;
    if (!user?.id) {
      setLoadingCows(false);
      return;
    }
    listAnimals(user.id).then(setCows).catch(() => setError("Could not load your cows.")).finally(() => setLoadingCows(false));
  }, [loadingUser, user?.id]);

  useEffect(() => {
    if (step !== 4 || !selectedCow || !identityPhoto || !user?.id || result || loading || attempted) return;
    setAttempted(true);
    setLoading(true);
    setError(null);
    transferAnimal(selectedCow.cowCode, user.id, receiverPhone, identityPhoto)
      .then(setResult)
      .catch((cause) => setError(requestError(cause)))
      .finally(() => setLoading(false));
  }, [attempted, identityPhoto, loading, receiverPhone, result, selectedCow, step, user?.id]);

  const goToStep = (next: number) => router.push(`/transfer-sapi/${next}`);
  const canProceed = step === 1 ? !!selectedCow : step === 2 ? receiverPhone.trim().length >= 6 : step === 3 ? !!identityPhoto : false;
  const handleBack = () => step === 1 ? router.push("/home") : goToStep(step - 1);
  const handleFinish = () => {
    clearAll();
    router.push("/home");
  };

  if (!hydrated) return null;

  return (
    <StepFlowLayout title="Transfer a Cow" totalSteps={TOTAL_STEPS} currentStep={step} onBack={handleBack} showProgress showPrimaryButton={step < TOTAL_STEPS} primaryLabel="Continue" primaryDisabled={!canProceed || loading} onPrimaryClick={() => goToStep(step + 1)} showSecondaryButton={step > 1} secondaryLabel={step === TOTAL_STEPS ? "Finish" : "Back"} onSecondaryClick={step === TOTAL_STEPS ? handleFinish : handleBack}>
      {step === 1 && <><h2 className="text-center font-bold text-black">Select the cow to transfer</h2>{!user?.id ? <p className="text-center text-sm text-amber-700">Sign in as a reseller to transfer a cow.</p> : loadingCows ? <p className="text-center text-sm text-gray-400">Loading your cows...</p> : <div className="flex flex-col gap-3">{cows.map((cow) => <button key={cow.cowCode} onClick={() => { setSelectedCow(cow); setError(null); }} className={`rounded-xl border px-4 py-4 text-left ${selectedCow?.cowCode === cow.cowCode ? "border-primary bg-primary/5" : "border-[#D6DCE8]"}`}><p className="font-bold text-black">{cow.display_name}</p><p className="text-sm text-gray-500">{cow.breed || "Breed not recorded"} · ID: {cow.cowCode}</p></button>)}{cows.length === 0 && <p className="text-center text-sm text-gray-400">No transferable cows available.</p>}</div>}</>}
      {step === 2 && <><h2 className="text-center font-bold text-black">Recipient details</h2><Input label="Recipient phone number" placeholder="+62 XXXXXXXXXXXX" value={receiverPhone} onChange={(event) => setReceiverPhone(event.target.value)} /></>}
      {step === 3 && <><h2 className="text-center font-bold text-black">Verify the cow&apos;s muzzle</h2><p className="text-center text-sm text-gray-500">Take or upload a clear muzzle photo before recording this cow-out.</p><PhotoInput value={identityPhoto} onChange={(file) => { setAttempted(false); setResult(null); setError(null); setIdentityPhoto(file); }} placeholder="Muzzle photo" /></>}
      {step === 4 && <div className="flex min-h-75 flex-col items-center justify-center gap-3 rounded-xl border border-[#D6DCE8] p-6">{loading ? <p className="text-gray-400">Verifying muzzle with AI...</p> : result?.transferred ? <><CheckCircle2 className="h-16 w-16 text-green-700" /><p className="text-center font-bold text-black">{selectedCow?.display_name} is confirmed as cow-out.</p><p className="text-center text-sm text-gray-500">Transferred at {result.transferred_at ? new Date(result.transferred_at).toLocaleString() : "now"}.</p></> : result ? <><XCircle className="h-16 w-16 text-amber-600" /><p className="text-center font-bold text-black">Muzzle verification did not match this cow.</p><p className="text-center text-sm text-gray-500">No cow-out was recorded. Similarity score: {result.verification.similarity_score.toFixed(3)}</p></> : <><XCircle className="h-16 w-16 text-red-600" /><p className="text-center font-bold text-black">{error ?? "Transfer result is unavailable."}</p></>}</div>}
      {error && step !== 4 && <p className="text-sm text-red-600">{error}</p>}
    </StepFlowLayout>
  );
}
