const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function fetchFromBackend(
  endpoint: string,
  options?: RequestInit,
) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!response.ok) throw new Error("API Error");
  return response.json();
}

export const health = () => fetchFromBackend("/health");
