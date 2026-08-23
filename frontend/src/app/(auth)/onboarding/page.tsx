"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import AuthScreenLayout from "@/src/components/auth/AuthScreenLayout";
import Button from "@/src/components/ui/Button";
import Input from "@/src/components/ui/Input";
import { getCurrentUser, updateProfile } from "@/src/lib/api/auth";

export default function OnboardingPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const user = await getCurrentUser();
        if (user.full_name) {
          router.replace("/home");
          return;
        }
        setLoading(false);
      } catch {
        router.replace("/login");
      }
    };

    void loadUser();
  }, [router]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await updateProfile(fullName);
      router.replace("/home");
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Profil belum dapat disimpan. Silakan coba lagi.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthScreenLayout title="Lengkapi profil">
      <form
        onSubmit={handleSubmit}
        className="container mx-auto absolute bottom-0 flex h-[83vh] flex-col items-center rounded-t-[40px] bg-white px-4 py-8"
      >
        {!loading && (
          <div className="flex w-full flex-col gap-4">
            <div>
              <h2 className="text-xl font-bold text-black">Siapa nama Anda?</h2>
              <p className="mt-2 text-sm text-gray-600">
                Nama ini akan digunakan untuk akun SapiGo Anda.
              </p>
            </div>
            <Input
              label="Nama lengkap"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              placeholder="Contoh: Budi Santoso"
              autoComplete="name"
              required
            />
            {error && <p className="text-sm text-red-600">{error}</p>}
          </div>
        )}
        <div className="mt-auto flex w-full flex-col items-center gap-4">
          <Button type="submit" disabled={loading || submitting} className="w-full">
            {submitting ? "Menyimpan..." : "Lanjutkan"}
          </Button>
        </div>
      </form>
    </AuthScreenLayout>
  );
}
