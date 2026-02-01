import { CheckCircle2, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

const steps = [
    { id: 1, name: "Applied", status: "completed" },
    { id: 2, name: "Interview", status: "completed" },
    { id: 3, name: "Payment", status: "current" },
    { id: 4, name: "Visa Docs", status: "pending" },
    { id: 5, name: "Housing", status: "pending" },
    { id: 6, name: "Arrival", status: "pending" },
];

export function ApplicationTracker() {
    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center mb-6">
                {steps.map((step, index) => (
                    <div key={step.id} className="flex flex-col items-center relative z-10">
                        <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors",
                            step.status === "completed" ? "bg-emerald-600 border-emerald-600 text-white" :
                                step.status === "current" ? "bg-white border-amber-500 text-amber-500 animate-pulse" :
                                    "bg-white border-slate-200 text-slate-300"
                        )}>
                            {step.status === "completed" ? <CheckCircle2 className="w-5 h-5" /> :
                                step.status === "current" ? <Circle className="w-5 h-5 fill-current" /> :
                                    <span className="text-xs">{step.id}</span>
                            }
                        </div>
                        <span className={cn(
                            "text-xs font-medium mt-2",
                            step.status === "completed" ? "text-emerald-700" :
                                step.status === "current" ? "text-amber-700" :
                                    "text-slate-400"
                        )}>{step.name}</span>

                        {/* Connector Line (except for last item) */}
                        {index < steps.length - 1 && (
                            <div className={cn(
                                "absolute top-4 left-1/2 w-full h-0.5 -z-10",
                                step.status === "completed" ? "bg-emerald-600" : "bg-slate-200"
                            )} style={{ width: "calc(100% + 2rem)"/* Approximate spacing logic for mockup */ }} />
                        )}
                        {/* Note: The CSS connector line logic in flexbox is tricky without absolute positioning wrapper, 
                            so for this mockup we will just use a simple flex gap approach or a progress bar underneath.
                            Let's keep it simple for now without the complex lines.
                         */}
                    </div>
                ))}
            </div>

            {/* Status Message */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-4">
                <div className="bg-amber-100 p-2 rounded-full text-amber-600">
                    <Circle className="w-5 h-5" />
                </div>
                <div>
                    <h4 className="font-semibold text-amber-900 text-sm">Action Required: Complete Payment</h4>
                    <p className="text-amber-700 text-xs mt-1">
                        Your application for &quot;Advanced Phaco Fellowship&quot; has been approved. Please complete the split-payment to secure your slot.
                    </p>
                </div>
            </div>
        </div>
    )
}
