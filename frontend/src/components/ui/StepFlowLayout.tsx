"use client";

import { ChevronLeft } from "lucide-react";
import Button from "@/src/components/ui/Button";
interface StepFlowLayoutProps {
  title: string;
  totalSteps: number;
  currentStep: number;
  onBack: () => void;
  children: React.ReactNode;

  // footer control
  showPrimaryButton?: boolean;
  primaryLabel?: string;
  onPrimaryClick?: () => void;
  primaryDisabled?: boolean;

  showSecondaryButton?: boolean;
  secondaryLabel?: string;
  onSecondaryClick?: () => void;

  showProgress?: boolean; // default true
}

export default function StepFlowLayout({
  title,
  totalSteps,
  currentStep,
  onBack,
  children,
  showPrimaryButton = true,
  primaryLabel = "OK",
  onPrimaryClick,
  primaryDisabled = false,
  showSecondaryButton = true,
  secondaryLabel = "Kembali",
  onSecondaryClick,
  showProgress = true,
}: StepFlowLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-primary">
      <div className="relative flex items-center px-4 pt-5 pb-4">
        <button
          onClick={onBack}
          className="absolute left-4 text-white cursor-pointer"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="flex-1 text-center text-white font-jakarta font-bold text-lg">
          {title}
        </h1>
      </div>

      <div className="bg-white rounded-t-[40px] flex-1 flex flex-col  px-7 py-8">
        {showProgress && (
          <div className="flex gap-2 px-4 pt-4">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div
                key={i}
                className={`h-1.5 flex-1 rounded-full ${
                  i < currentStep ? "bg-primary" : "bg-gray-200"
                }`}
              />
            ))}
          </div>
        )}

        {/* step content */}
        <div className="flex-1 px-4 py-6 flex flex-col gap-4">{children}</div>

        {/* footer */}
        <div className="px-4 pb-8 mt-auto flex flex-col gap-3">
          {showPrimaryButton && (
            <Button
              onClick={onPrimaryClick}
              disabled={primaryDisabled}
              className="w-full"
            >
              {primaryLabel}
            </Button>
          )}
          {showSecondaryButton && (
            <Button
              variant="secondary"
              onClick={onSecondaryClick}
              className="w-full"
            >
              {secondaryLabel}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
