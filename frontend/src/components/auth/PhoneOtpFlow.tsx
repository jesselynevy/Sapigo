"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import Button from "@/src/components/ui/Button";
import Input from "@/src/components/ui/Input";

interface PhoneOtpFlowProps {
  title: string; // "Masuk" | "Daftar"
  bottomText: string; // "Belum punya akun?" | "Sudah punya akun?"
  bottomLinkText: string; // "Bikin akun" | "Masuk"
  bottomLinkHref: string; // "/daftar" | "/masuk"
  onSubmitPhone: (phone: string) => Promise<void>;
  onSubmitOtp: (otp: string) => Promise<void>;
  onResendOtp: () => Promise<void>;
}

export default function PhoneOtpFlow({
  title,
  bottomText,
  bottomLinkText,
  bottomLinkHref,
  onSubmitPhone,
  onSubmitOtp,
  onResendOtp,
}: PhoneOtpFlowProps) {
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (step === "phone") {
        await onSubmitPhone(phone);
        setStep("otp");
      } else {
        await onSubmitOtp(otp.join(""));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value && !/^[0-9]$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // pindah ke field berikutnya kalau ada isinya
    if (value && index < otp.length - 1) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="min-h-screen relative flex items-start justify-center py-12 px-4 sm:px-6 lg:px-8 bg-primary">
      <h1 className="text-white text-3xl font-jakarta font-bold mt-4">
        {title}
      </h1>

      <form
        onSubmit={handleSubmit}
        className="container mx-auto flex bg-white py-8 px-4 absolute bottom-0 flex-col rounded-t-[40px] items-center h-[83vh]"
      >
        <div className="w-full flex flex-col gap-4">
          {step === "phone" ? (
            <Input
              label="Masukkan nomor telepon anda"
              placeholder="+62 XXXXXXXXXXXX"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          ) : (
            <div className="w-full flex flex-col items-center gap-4">
              <p className="font-bold text-xl text-black text-center">
                Masukkan kode OTP
              </p>
              <div className="flex gap-2">
                {otp.map((digit, i) => (
                  <input
                    ref={(el) => {
                      otpRefs.current[i] = el;
                    }}
                    key={i}
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    className="w-14 h-15 text-black text-2xl text-center border border-[#D6DCE8] rounded-md focus:outline-none focus:ring-[1.5px] focus:ring-primary"
                  />
                ))}
              </div>
              <button
                type="button"
                className="text-primary text-sm underline"
                onClick={onResendOtp}
              >
                Kirim ulang kode OTP
              </button>
            </div>
          )}
        </div>

        <div className="w-full mt-auto flex flex-col items-center gap-4">
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

          <p className="text-sm text-gray-500">
            {bottomText}{" "}
            <Link href={bottomLinkHref} className="text-primary underline">
              {bottomLinkText}
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
