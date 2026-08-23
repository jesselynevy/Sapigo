"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import StepFlowLayout from "@/src/components/ui/StepFlowLayout";
import PhotoInput from "@/src/components/ui/PhotoInput";
import InfoRow from "@/src/components/ui/InfoRow";
import { ApiError } from "@/src/lib/api/client";
import { createAnimal, enrollAnimalFromPhotos, ReferencePhotoUploadError } from "@/src/lib/api/sapi";
import { useSapiFlowState } from "@/src/lib/hooks/useSapiFlowState";
import { useAuthStore } from "@/src/store/useAuthStore";

const TOTAL_STEPS = 4;

function requestError(error: unknown): string {
  if (error instanceof ApiError && error.status === 422) {
    const detail = error.detail as { reasons?: string[] };
    return `Photo rejected: ${detail.reasons?.join(", ") ?? "retake it with better lighting and focus."}`;
  }
  return error instanceof Error ? error.message : "The request could not be completed.";
}

export default function DaftarSapiStepPage() {
  const router = useRouter();
  const { step: rawStep } = useParams<{ step: string }>();
  const step = Number(rawStep);
  const [displayName, setDisplayName] = useState("");
  const [breed, setBreed] = useState("");
  const [sex, setSex] = useState("");
  const [weight, setWeight] = useState("");
  const [leftReferencePhoto, setLeftReferencePhoto] = useState<File | null>(null);
  const [rightReferencePhoto, setRightReferencePhoto] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [enrolled, setEnrolled] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const user = useAuthStore((state) => state.user);
  const { muzzlePhoto, setMuzzlePhoto, cowData, setCowData, clearAll, hydrated } = useSapiFlowState();

  useEffect(() => {
    if (hydrated && (!Number.isInteger(step) || step < 1 || step > TOTAL_STEPS)) {
      router.replace("/daftar-sapi/1");
    }
  }, [hydrated, router, step]);

  const goToStep = (nextStep: number) => router.push(`/daftar-sapi/${nextStep}`);

  const createAndContinue = async () => {
    if (!displayName.trim() || !user?.id) {
      setError("Sign in as a reseller before registering a cow.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const animal = await createAnimal({
        owner_id: user.id,
        display_name: displayName.trim(),
        breed: breed.trim() || undefined,
        sex: sex || undefined,
        weight: weight ? Number(weight) : undefined,
      });
      setCowData(animal);
      goToStep(2);
    } catch (err) {
      setError(requestError(err));
    } finally {
      setLoading(false);
    }
  };

  const enrollAndContinue = async () => {
    if (!cowData || !muzzlePhoto || !leftReferencePhoto || !rightReferencePhoto) return;
    setLoading(true);
    setError(null);
    try {
      await enrollAnimalFromPhotos(cowData.cowCode, [muzzlePhoto, leftReferencePhoto, rightReferencePhoto]);
      setEnrolled(true);
      goToStep(4);
    } catch (err) {
      if (err instanceof ReferencePhotoUploadError) {
        const labels = ["middle", "left", "right"];
        const cause = err.cause;
        const detail = cause instanceof ApiError ? cause.detail as { reasons?: string[] } : undefined;
        const reasons = detail?.reasons?.join(", ");
        setError(`${labels[err.photoIndex]} muzzle photo was rejected${reasons ? `: ${reasons}` : ""}. Retake that photo with better lighting and focus, then upload again.`);
      } else {
        setError(requestError(err));
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePrimary = () => {
    if (step === 1) void createAndContinue();
    else if (step === 3) void enrollAndContinue();
    else goToStep(step + 1);
  };

  const handleBack = () => {
    if (step === 1) router.push("/home");
    else goToStep(step - 1);
  };

  if (!hydrated) return null;

  return (
    <StepFlowLayout
      title="Register a Cow"
      totalSteps={TOTAL_STEPS}
      currentStep={step}
      onBack={handleBack}
      showPrimaryButton={step < TOTAL_STEPS}
      primaryLabel={step === 1 ? "Create animal" : step === 3 ? "Upload & enroll" : "Continue"}
      primaryDisabled={loading || (step === 1 && (!displayName.trim() || !user?.id)) || (step === 3 && (!muzzlePhoto || !leftReferencePhoto || !rightReferencePhoto))}
      onPrimaryClick={handlePrimary}
      showSecondaryButton={step > 1}
      secondaryLabel={step === TOTAL_STEPS ? "Finish" : "Back"}
      onSecondaryClick={step === TOTAL_STEPS ? () => { clearAll(); router.push("/home"); } : handleBack}
    >
      {step === 1 && (
        <>
          <div className="flex flex-col gap-1">
            <h2 className="font-jakarta font-bold text-black text-center">Create animal</h2>
            <p className="font-jakarta text-gray-500 text-center">These details are saved to the backend before photos are collected.</p>
          </div>
          {!user?.id && <p className="text-sm text-amber-700">Sign in as a reseller to save this cow under your ownership.</p>}
          <label className="flex flex-col gap-1 text-sm text-gray-700">Name<input className="rounded-lg border border-[#D6DCE8] px-3 py-2" value={displayName} onChange={(event) => setDisplayName(event.target.value)} placeholder="Example: Bessie" /></label>
          <label className="flex flex-col gap-1 text-sm text-gray-700">Breed<input className="rounded-lg border border-[#D6DCE8] px-3 py-2" value={breed} onChange={(event) => setBreed(event.target.value)} placeholder="Example: Brahman" /></label>
          <label className="flex flex-col gap-1 text-sm text-gray-700">Sex<select className="rounded-lg border border-[#D6DCE8] px-3 py-2" value={sex} onChange={(event) => setSex(event.target.value)}><option value="">Select Female or Male</option><option value="F">Female (F)</option><option value="M">Male (M)</option></select></label>
          <label className="flex flex-col gap-1 text-sm text-gray-700">Weight (kg)<input type="number" min="0" step="0.1" className="rounded-lg border border-[#D6DCE8] px-3 py-2" value={weight} onChange={(event) => setWeight(event.target.value)} placeholder="Example: 450" /></label>
          {error && <p className="text-sm text-red-600">{error}</p>}
        </>
      )}

      {step === 2 && cowData && (
        <>
          <div className="flex flex-col gap-1"><h2 className="font-jakarta font-bold text-black text-center">Animal created</h2><p className="font-jakarta text-gray-500 text-center">Confirm the details stored in the database.</p></div>
          <div className="border border-[#D6DCE8] rounded-xl px-4 py-2 divide-y divide-[#EEF1F6]"><InfoRow label="Animal ID" value={cowData.cowCode} /><InfoRow label="Name" value={cowData.display_name} /><InfoRow label="Breed" value={cowData.breed || "—"} /><InfoRow label="Sex" value={cowData.sex || "—"} /><InfoRow label="Weight" value={cowData.weight === null ? "—" : `${cowData.weight} kg`} /></div>
        </>
      )}

      {step === 3 && (
        <>
          <div className="flex flex-col gap-1"><h2 className="font-jakarta font-bold text-black text-center">Capture reference photos</h2><p className="font-jakarta text-gray-500 text-center">Take these in order: middle, left, then right. Keep the muzzle centered, sharp, and well lit.</p></div>
          <PhotoInput value={muzzlePhoto} onChange={(file) => { setMuzzlePhoto(file); setError(null); }} placeholder="1. Middle — face the muzzle straight on" />
          <PhotoInput value={leftReferencePhoto} onChange={(file) => { setLeftReferencePhoto(file); setError(null); }} placeholder="2. Left — photograph the left side of the muzzle" />
          <PhotoInput value={rightReferencePhoto} onChange={(file) => { setRightReferencePhoto(file); setError(null); }} placeholder="3. Right — photograph the right side of the muzzle" />
          {error && <p className="text-sm text-red-600">{error}</p>}
        </>
      )}

      {step === 4 && (
        <div className="flex-1 w-full flex flex-col items-center justify-center gap-2 border border-[#D6DCE8] rounded-xl">
          {enrolled || cowData ? <><CheckCircle2 className="w-16 h-16 text-green-700" /><p className="text-center font-bold text-black px-8">{cowData?.display_name}&apos;s muzzle template is enrolled.</p><p className="text-center text-sm text-gray-500 px-8">Cow-in recorded. You can now verify or transfer this cow using a live muzzle photo.</p></> : <p className="text-center text-red-600">Enrollment result is unavailable. Please try again.</p>}
        </div>
      )}
    </StepFlowLayout>
  );
}
