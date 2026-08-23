"use client";

import { CowCardProps } from "@/src/types/home-components";
import StatusBadge from "@/src/components/ui/StatusBadge";

export default function CowCard({ name, subtitle, status }: CowCardProps) {
  return (
    <div className="flex items-center justify-between bg-white border border-[#D6DCE8] rounded-xl px-4 py-3">
      <div>
        <p className="font-bold text-black">{name}</p>
        <p className="text-sm text-gray-400">{subtitle}</p>
      </div>
      <StatusBadge status={status} />
    </div>
  );
}
