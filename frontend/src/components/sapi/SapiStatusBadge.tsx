"use client";

interface SapiStatusBadgeProps {
  status: "tersedia" | "ditawar" | "terjual" | "pending";
}

export default function SapiStatusBadge({ status }: SapiStatusBadgeProps) {
  const statusConfig = {
    tersedia: { bg: "bg-green-100", text: "text-green-800", label: "Tersedia" },
    ditawar: {
      bg: "bg-yellow-100",
      text: "text-yellow-800",
      label: "Ditawar",
    },
    terjual: { bg: "bg-gray-100", text: "text-gray-800", label: "Terjual" },
    pending: { bg: "bg-blue-100", text: "text-blue-800", label: "Pending" },
  };

  const config = statusConfig[status];

  return (
    <span
      className={`px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.text}`}
    >
      {config.label}
    </span>
  );
}
