"use client";

import { SectionHeaderProps } from "@/src/types/home-components";

export default function SectionHeader({ title, onSeeAll }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="font-jakarta font-bold text-black text-lg">{title}</h2>
      <button
        onClick={onSeeAll}
        className="text-primary cursor-pointer text-sm underline"
      >
        See all
      </button>
    </div>
  );
}
