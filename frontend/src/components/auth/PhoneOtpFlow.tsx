"use client";

import { useRef, useState } from "react";

import AuthScreenLayout from "@/src/components/auth/AuthScreenLayout";
import Button from "@/src/components/ui/Button";
import Input from "@/src/components/ui/Input";

interface PhoneOtpFlowProps {
  title: string;
  onSubmitPhone: (phone: string) => Promise<void>;
  onSubmitOtp: (otp: string) => Promise<void>;
  onResendOtp: () => Promise<void>;
}

export default function PhoneOtpFlow({
  title,
  onSubmitPhone,
  onSubmitOtp,
  onResendOtp,
}: PhoneOtpFlowProps) {
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (step === "phone") {
        await onSubmitPhone(phone);
        setStep("otp");
      } else {
        if (otp.some((digit) => !digit)) {
          throw new Error("Masukkan enam digit kode OTP.");
        }
        await onSubmitOtp(otp.join(""));
      }
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Terjadi kesalahan. Silakan coba lagi.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value && !/^[0-9]$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < otp.length - 1) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (
    index: number,
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleResend = async () => {
    setError(null);
    setLoading(true);
    try {
      await onResendOtp();
    } catch (resendError) {
      setError(
        resendError instanceof Error
          ? resendError.message
          : "Kode OTP belum dapat dikirim ulang.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthScreenLayout title={title}>
      <form
        onSubmit={handleSubmit}
        className="container mx-auto absolute bottom-0 flex h-[83vh] flex-col items-center rounded-t-[40px] bg-white px-4 py-8"
      >
        <div className="flex w-full flex-col gap-4">
          {step === "phone" ? (
            <Input
              label="Masukkan nomor telepon anda"
              placeholder="+62 XXXXXXXXXXXX"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
            />
          ) : (
            <div className="flex w-full flex-col items-center gap-4">
              <p className="text-center text-xl font-bold text-black">
                Masukkan kode OTP
              </p>
              <div className="flex gap-2">
                {otp.map((digit, index) => (
                  <input
                    ref={(element) => {
                      otpRefs.current[index] = element;
                    }}
                    key={index}
                    maxLength={1}
                    value={digit}
                    onChange={(event) => handleOtpChange(index, event.target.value)}
                    onKeyDown={(event) => handleOtpKeyDown(index, event)}
                    className="h-15 w-14 rounded-md border border-[#D6DCE8] text-center text-2xl text-black focus:outline-none focus:ring-[1.5px] focus:ring-primary"
                  />
                ))}
              </div>
              <button
                type="button"
                disabled={loading}
                className="text-sm text-primary underline"
                onClick={handleResend}
              >
                Kirim ulang kode OTP
              </button>
            </div>
          )}
          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>

        <div className="mt-auto flex w-full flex-col items-center gap-4">
          <Button type="submit" disabled={loading} className="w-full">
            OK
          </Button>
          {step === "otp" && (
            <Button
              type="button"
              variant="secondary"
              className="w-full"
              onClick={() => {
                setOtp(["", "", "", "", "", ""]);
                setStep("phone");
              }}
            >
              Kembali
            </Button>
          )}
        </div>
      </form>
    </AuthScreenLayout>
  );
}
