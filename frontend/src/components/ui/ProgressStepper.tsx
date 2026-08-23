"use client";

interface ProgressStepperProps {
  steps: string[];
  currentStep: number;
}

export default function ProgressStepper({
  steps,
  currentStep,
}: ProgressStepperProps) {
  return (
    <div className="flex items-center justify-between mb-8">
      {steps.map((step, index) => (
        <div key={step} className="flex items-center flex-1">
          <div
            className={`flex items-center justify-center w-10 h-10 rounded-full font-bold ${
              index < currentStep
                ? "bg-green-500 text-white"
                : index === currentStep
                  ? "bg-orange-600 text-white"
                  : "bg-gray-300 text-gray-600"
            }`}
          >
            {index < currentStep ? "✓" : index + 1}
          </div>
          <span className="ml-2 text-sm font-medium text-gray-700">{step}</span>
          {index < steps.length - 1 && (
            <div className="flex-1 h-1 mx-4 bg-gray-300" />
          )}
        </div>
      ))}
    </div>
  );
}
