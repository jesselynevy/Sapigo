"use client";

import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface PageHeaderProps {
  title: string;
  onBack?: () => void;
}

export default function PageHeader({ title, onBack }: PageHeaderProps) {
  const router = useRouter();

  return (
    <div className="relative flex items-center px-4 pt-5 pb-4">
      <button
        onClick={onBack ?? (() => router.push("/home"))}
        className="absolute left-4 text-white cursor-pointer"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <h1 className="flex-1 text-center text-white font-jakarta font-bold text-lg">
        {title}
      </h1>
    </div>
  );
}
