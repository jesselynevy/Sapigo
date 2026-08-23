"use client";

import { QuickActionProps } from "@/src/types/home-components";

export default function QuickAction({
  icon,
  label,
  onClick,
}: QuickActionProps) {
  return (
    <button
      onClick={onClick}
      className="flex cursor-pointer flex-col items-center gap-2 w-16"
    >
      <div className="w-full h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary transition hover:bg-primary/20">
        {icon}
      </div>
      <span className="text-sm w-full font-bold text-black text-center leading-tight">
        {label}
      </span>
    </button>
  );
}
