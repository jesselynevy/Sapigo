"use client";

import { ActivityCardProps } from "@/src/types/home-components";

export default function ActivityCard({ title, subtitle }: ActivityCardProps) {
  return (
    <div className="bg-white border border-[#D6DCE8] rounded-xl px-4 py-3">
      <p className="font-bold text-black">{title}</p>
      <p className="text-sm text-gray-400">{subtitle}</p>
    </div>
  );
}
