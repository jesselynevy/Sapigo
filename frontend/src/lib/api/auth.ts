import { apiClient } from "./client";

export interface AuthenticatedUser {
  id: string;
  whatsapp_number: string;
  full_name: string | null;
  verified_at: string | null;
  last_login: string | null;
}

function getCsrfToken(): string {
  const cookie = document.cookie
    .split("; ")
    .find((value) => value.startsWith("sapigo_csrf="));

  if (!cookie) {
    throw new Error("Sesi login tidak ditemukan. Silakan masuk kembali.");
  }

  return decodeURIComponent(cookie.split("=", 2)[1]);
}

export function normalizePhoneNumber(value: string): string {
  const normalized = value.replace(/[\s()-]/g, "");

  if (normalized.startsWith("+")) {
    return normalized;
  }
  if (normalized.startsWith("0")) {
    return `+62${normalized.slice(1)}`;
  }
  if (normalized.startsWith("62")) {
    return `+${normalized}`;
  }

  throw new Error("Gunakan nomor WhatsApp dengan awalan +62 atau 08.");
}

export function requestOtp(whatsappNumber: string): Promise<{ message: string }> {
  return apiClient("/api/auth/otp/request", {
    method: "POST",
    body: JSON.stringify({ whatsapp_number: whatsappNumber }),
  });
}

export function verifyOtp(
  whatsappNumber: string,
  code: string,
): Promise<AuthenticatedUser> {
  return apiClient("/api/auth/otp/verify", {
    method: "POST",
    body: JSON.stringify({ whatsapp_number: whatsappNumber, code }),
  });
}

export function getCurrentUser(): Promise<AuthenticatedUser> {
  return apiClient("/api/auth/me");
}

export function updateProfile(fullName: string): Promise<AuthenticatedUser> {
  return apiClient("/api/auth/profile", {
    method: "PATCH",
    headers: { "X-CSRF-Token": getCsrfToken() },
    body: JSON.stringify({ full_name: fullName }),
  });
}

export function logout(): Promise<void> {
  return apiClient("/api/auth/logout", {
    method: "POST",
    headers: { "X-CSRF-Token": getCsrfToken() },
  });
}
