"use client";

import { AppStatus, PROGRESS_STEPS } from "@/types/v3-outbound";
import { CheckCircle2, Circle, Lock } from "lucide-react";

interface ProgressStepperProps {
    currentStep: AppStatus;
    paymentVerified?: boolean;
    onStepClick?: (step: AppStatus) => void;
}

export function ProgressStepper({ currentStep, paymentVerified = false, onStepClick }: ProgressStepperProps) {
    const steps: AppStatus[] = [
        'eligibility_pending',
        'payment_pending',
        'compliance_pending',
        'visa_pending',
        'ready_to_travel'
    ];

    const currentIndex = steps.indexOf(currentStep);

    const isStepAccessible = (stepIndex: number): boolean => {
        // Eligibility is always accessible
        if (stepIndex === 0) return true;

        // Payment is accessible if eligibility is complete
        if (stepIndex === 1) return currentIndex >= 1;

        // Compliance requires payment verification
        if (stepIndex === 2) return paymentVerified && currentIndex >= 2;

        // Visa and Ready require previous steps
        return stepIndex <= currentIndex;
    };

    const isStepCompleted = (stepIndex: number): boolean => {
        return stepIndex < currentIndex;
    };

    return (
        <div className="w-full bg-white border border-slate-200 rounded-xl p-6">
            <h3 className="font-bold text-lg text-slate-900 mb-6">Application Progress</h3>

            <div className="relative">
                {/* Progress Line */}
                <div className="absolute top-5 left-0 right-0 h-0.5 bg-slate-200" />
                <div
                    className="absolute top-5 left-0 h-0.5 bg-emerald-500 transition-all duration-500"
                    style={{ width: `${(currentIndex / (steps.length - 1)) * 100}%` }}
                />

                {/* Steps */}
                <div className="relative flex justify-between">
                    {steps.map((step, index) => {
                        const stepInfo = PROGRESS_STEPS[step];
                        const isAccessible = isStepAccessible(index);
                        const isCompleted = isStepCompleted(index);
                        const isCurrent = index === currentIndex;
                        const isLocked = !isAccessible;

                        return (
                            <button
                                key={step}
                                onClick={() => isAccessible && onStepClick?.(step)}
                                disabled={isLocked}
                                className={`flex flex-col items-center gap-2 group ${isAccessible ? 'cursor-pointer' : 'cursor-not-allowed'
                                    }`}
                            >
                                {/* Circle */}
                                <div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${isCompleted
                                            ? 'bg-emerald-500 border-emerald-500'
                                            : isCurrent
                                                ? 'bg-white border-amber-500 ring-4 ring-amber-100'
                                                : isLocked
                                                    ? 'bg-slate-100 border-slate-300'
                                                    : 'bg-white border-slate-300 group-hover:border-amber-400'
                                        }`}
                                >
                                    {isCompleted ? (
                                        <CheckCircle2 className="w-6 h-6 text-white" />
                                    ) : isLocked ? (
                                        <Lock className="w-5 h-5 text-slate-400" />
                                    ) : isCurrent ? (
                                        <Circle className="w-5 h-5 text-amber-500 fill-amber-500" />
                                    ) : (
                                        <Circle className="w-5 h-5 text-slate-300" />
                                    )}
                                </div>

                                {/* Label */}
                                <div className="text-center max-w-[120px]">
                                    <p
                                        className={`text-sm font-semibold ${isCurrent
                                                ? 'text-amber-600'
                                                : isCompleted
                                                    ? 'text-emerald-600'
                                                    : isLocked
                                                        ? 'text-slate-400'
                                                        : 'text-slate-600'
                                            }`}
                                    >
                                        {stepInfo.label}
                                    </p>
                                    <p className="text-xs text-slate-500 mt-1 hidden md:block">
                                        {stepInfo.description}
                                    </p>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Current Step Info */}
            <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-sm font-medium text-amber-900">
                    Current Step: {PROGRESS_STEPS[currentStep].label}
                </p>
                <p className="text-sm text-amber-700 mt-1">
                    {PROGRESS_STEPS[currentStep].description}
                </p>
            </div>
        </div>
    );
}
