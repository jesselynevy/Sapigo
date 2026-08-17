"use client";

import PhoneOtpFlow from "@/src/components/auth/PhoneOtpFlow";

export default function LoginPage() {
  return (
    <PhoneOtpFlow
      title="Masuk"
      bottomText="Belum punya akun?"
      bottomLinkText="Bikin akun"
      bottomLinkHref="/register"
      onSubmitPhone={async (phone) => {
        // TODO: call login/send-OTP API
      }}
      onSubmitOtp={async (otp) => {
        // TODO: verify OTP, redirect on success
      }}
      onResendOtp={async () => {
        // TODO: resend OTP
      }}
    />
  );
}
