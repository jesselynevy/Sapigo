"use client";

import { StatCardProps } from "@/src/types/home-components";

export default function StatCard({ value, label }: StatCardProps) {
  return (
    <div className="flex-1 bg-white rounded-xl px-4 py-3 flex flex-col items-center justify-start gap-1 shadow-sm">
      <span className="text-black text-2xl font-jakarta font-bold">
        {value}
      </span>
      <span className="text-gray-500 text-xs text-center">{label}</span>
    </div>
  );
}
