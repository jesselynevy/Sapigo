"use client";

interface StatusBadgeProps {
  status: "verified" | "mismatch" | "pending";
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const statusConfig = {
    verified: {
      label: "Verified",
      className: "bg-green-100 text-green-700",
    },
    mismatch: {
      label: "Verification Mismatch",
      className: "bg-red-100 text-red-700",
    },
    pending: {
      label: "Pending Verification",
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
