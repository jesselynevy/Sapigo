"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import PhoneOtpFlow from "@/src/components/auth/PhoneOtpFlow";
import {
  normalizePhoneNumber,
  getCurrentUser,
  requestOtp,
  verifyOtp,
} from "@/src/lib/api/auth";

export default function LoginPage() {
  const router = useRouter();
  const submittedPhoneNumber = useRef("");
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    const redirectAuthenticatedUser = async () => {
      try {
        const user = await getCurrentUser();
        router.replace(user.full_name ? "/home" : "/onboarding");
      } catch {
        setCheckingSession(false);
      }
    };

    void redirectAuthenticatedUser();
  }, [router]);

  if (checkingSession) {
    return <main className="min-h-screen bg-primary" />;
  }

  return (
    <PhoneOtpFlow
      title="Masuk"
      onSubmitPhone={async (phone) => {
        submittedPhoneNumber.current = normalizePhoneNumber(phone);
        await requestOtp(submittedPhoneNumber.current);
      }}
      onSubmitOtp={async (otp) => {
        if (!submittedPhoneNumber.current) {
          throw new Error("Masukkan nomor WhatsApp terlebih dahulu.");
        }
        const user = await verifyOtp(submittedPhoneNumber.current, otp);
        if (user.full_name) {
          router.replace("/home");
          return;
        }
        router.replace("/onboarding");
      }}
      onResendOtp={async () => {
        if (!submittedPhoneNumber.current) {
          throw new Error("Masukkan nomor WhatsApp terlebih dahulu.");
        }
        await requestOtp(submittedPhoneNumber.current);
      }}
    />
  );
}
