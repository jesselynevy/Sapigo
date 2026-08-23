"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { useParams, useSearchParams } from "next/navigation";

import PhotoInput from "@/src/components/ui/PhotoInput";
import { ApiError } from "@/src/lib/api/client";
import { getCowData, VerificationApiResponse, verifyAnimal } from "@/src/lib/api/sapi";
import { CowData } from "@/src/types/sapi";

function requestError(error: unknown): string {
  if (error instanceof ApiError && error.status === 422) {
    const detail = error.detail as { reasons?: string[] };
    return `Photo rejected: ${detail.reasons?.join(", ") ?? "please retake it with better lighting and focus."}`;
  }
  if (error instanceof ApiError && error.status === 400) {
    return "This cow has no enrolled muzzle template yet.";
  }
  return error instanceof Error ? error.message : "Verification failed. Please try again.";
}

export default function PublicVerificationPage() {
  const { cowId } = useParams<{ cowId: string }>();
  const ownerId = useSearchParams().get("owner_id") ?? "";
  const [cow, setCow] = useState<CowData | null>(null);
  const [photo, setPhoto] = useState<File | null>(null);
  const [verification, setVerification] = useState<VerificationApiResponse | null>(null);
  const [loadingCow, setLoadingCow] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!ownerId) {
      setError("This public verification link is invalid.");
      setLoadingCow(false);
      return;
    }
    getCowData(cowId, ownerId)
      .then(setCow)
      .catch(() => setError("Cow not found or this link is no longer valid."))
      .finally(() => setLoadingCow(false));
  }, [cowId, ownerId]);

  const submit = async () => {
    if (!photo || !ownerId) return;
    setLoading(true);
    setError(null);
    setVerification(null);
    try {
      setVerification(await verifyAnimal(cowId, photo, ownerId));
    } catch (cause) {
      setError(requestError(cause));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col bg-white px-6 py-10">
      <h1 className="text-center font-jakarta text-2xl font-bold text-black">Cow Verification</h1>
      {loadingCow ? <p className="mt-12 text-center text-gray-400">Loading cow...</p> : error && !cow ? <p className="mt-12 text-center text-red-600">{error}</p> : cow && <>
        <section className="mt-8 rounded-xl border border-[#D6DCE8] p-5">
          <p className="font-bold text-black">{cow.display_name}</p>
          <p className="mt-1 text-sm text-gray-500">ID: {cow.cowCode}</p>
          <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-[#EEF1F6] pt-4 text-sm">
            <div><p className="text-gray-400">Breed</p><p className="font-medium text-black">{cow.breed || "Not recorded"}</p></div>
            <div><p className="text-gray-400">Sex</p><p className="font-medium text-black">{cow.sex || "Not recorded"}</p></div>
            <div><p className="text-gray-400">Weight</p><p className="font-medium text-black">{cow.weight === null ? "Not recorded" : `${cow.weight} kg`}</p></div>
            <div><p className="text-gray-400">Registered</p><p className="font-medium text-black">{new Date(cow.createdAt).toLocaleDateString()}</p></div>
          </div>
          <div className="mt-4 border-t border-[#EEF1F6] pt-4 text-sm"><p className="text-gray-400">Registered owner</p><p className="font-medium text-black">{cow.ownerName || "Owner information unavailable"}</p></div>
        </section>
        <div className="mt-6">
          <p className="mb-3 text-center text-sm text-gray-500">Take or upload a clear photo of this cow&apos;s muzzle.</p>
          <PhotoInput value={photo} onChange={(file) => { setPhoto(file); setError(null); setVerification(null); }} placeholder="Muzzle photo" />
        </div>
        {verification ? <section className="mt-6 flex flex-col items-center gap-2 rounded-xl border border-[#D6DCE8] p-6 text-center">{verification.decision === "verified" ? <CheckCircle2 className="h-14 w-14 text-green-700" /> : <XCircle className="h-14 w-14 text-amber-600" />}<p className="font-bold text-black">{verification.decision === "verified" ? "Cow identity verified" : "Cow identity does not match"}</p><p className="text-sm text-gray-500">Similarity score: {verification.similarity_score.toFixed(3)}</p></section> : null}
        {error && <p className="mt-4 text-center text-sm text-red-600">{error}</p>}
        <button type="button" disabled={!photo || loading} onClick={() => void submit()} className="mt-6 rounded-full bg-primary px-6 py-3 font-bold text-white disabled:cursor-not-allowed disabled:opacity-50">{loading ? "Verifying..." : verification ? "Verify again" : "Verify muzzle"}</button>
      </>}
    </main>
  );
}
