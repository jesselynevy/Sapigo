"use client";

import { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export default function Input({
  label,
  error,
  className = "",
  ...props
}: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-gray-700 font-jakarta font-bold mb-1">
          {label}
        </label>
      )}
      <input
        className={`w-full px-4 py-2 text-black placeholder:text-gray-400 placeholder:font-jakarta bg-white border border-[#D6DCE8] rounded-md focus:outline-none focus:ring-[1.5px] focus:ring-primary transition-colors ${className}`}
        {...props}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
