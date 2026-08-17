"use client";

import PhoneOtpFlow from "@/src/components/auth/PhoneOtpFlow";

export default function RegisterPage() {
  return (
    <PhoneOtpFlow
      title="Daftar"
      bottomText="Sudah punya akun?"
      bottomLinkText="Masuk"
      bottomLinkHref="/login"
      onSubmitPhone={async (phone) => {
        // TODO: call register/send-OTP API
      }}
      onSubmitOtp={async (otp) => {
        // TODO: verify OTP, create account
      }}
      onResendOtp={async () => {
        // TODO: resend OTP
      }}
    />
  );
}
