"use client";

interface StatusBadgeProps {
  status: "verified" | "unverified";
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const statusConfig = {
    verified: {
      label: "Terverifikasi",
      className: "bg-green-100 text-green-700",
    },
    unverified: {
      label: "Menunggu foto",
      className: "bg-orange-100 text-orange-700",
    },
  }[status];

  return (
    <span
      className={`text-xs font-medium px-3 py-1 rounded-full ${statusConfig?.className}`}
    >
      {statusConfig?.label}
    </span>
  );
}
