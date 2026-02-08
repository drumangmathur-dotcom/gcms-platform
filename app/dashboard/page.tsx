"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Clock, AlertCircle, GraduationCap } from "lucide-react";
import { Application, Program } from "@/types/v3-outbound";

export default function DashboardHome() {
    const { user } = useUser();
    const [application, setApplication] = useState<Application | null>(null);
    const [program, setProgram] = useState<Program | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadApplication() {
            try {
                const response = await fetch("/api/applications/current");
                if (response.ok) {
                    const data = await response.json();
                    setApplication(data.application);
                    setProgram(data.program);
                }
            } catch (error) {
                console.error("Failed to load application:", error);
            } finally {
                setLoading(false);
            }
        }

        loadApplication();
    }, []);

    if (loading) {
        return (
            <div className="p-8">
                <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-slate-200 rounded w-1/3"></div>
                    <div className="h-32 bg-slate-200 rounded"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="font-serif text-4xl font-bold text-slate-900 mb-2">
                    Welcome back, {user?.firstName || "Student"}
                </h1>
                <p className="text-slate-600">
                    {application
                        ? "Track your progress and manage your application."
                        : "Select a program to begin your clinical rotation journey."}
                </p>
            </div>

            {/* State Zero: No Application */}
            {!application && (
                <Card className="border-2 border-amber-500 bg-gradient-to-br from-amber-50 to-white">
                    <CardContent className="p-8 text-center">
                        <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <GraduationCap className="w-8 h-8 text-amber-600" />
                        </div>
                        <h2 className="font-serif text-2xl font-bold text-slate-900 mb-2">
                            Ready to Start Your Journey?
                        </h2>
                        <p className="text-slate-600 mb-6 max-w-lg mx-auto">
                            Browse our available programs and choose the clinical rotation that best fits your career goals.
                            We'll guide you through every step of the process.
                        </p>
                        <Button
                            size="lg"
                            className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold"
                            asChild
                        >
                            <Link href="/dashboard/programs">
                                Browse Programs
                                <ArrowRight className="ml-2 w-5 h-5" />
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            )}

            {/* State Active: Has Application */}
            {application && program && (
                <div className="space-y-6">
                    {/* Program Info Card */}
                    <Card className="border-emerald-500 border-2">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                                Active Application
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-bold text-xl text-slate-900">{program.name}</h3>
                                    <p className="text-slate-600">{program.location}</p>
                                    <p className="text-sm text-slate-500 mt-1">
                                        Current Step: <span className="font-medium capitalize">{application.current_step.replace(/_/g, ' ')}</span>
                                    </p>
                                </div>
                                <Button asChild>
                                    <Link href="/dashboard/application">
                                        View Details
                                        <ArrowRight className="ml-2 w-4 h-4" />
                                    </Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Quick Actions */}
                    <div className="grid md:grid-cols-3 gap-6">
                        <Card className="hover:shadow-lg transition-shadow cursor-pointer" asChild>
                            <Link href="/dashboard/documents">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <AlertCircle className="w-5 h-5 text-amber-600" />
                                        Upload Documents
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-slate-600">
                                        Complete your eligibility requirements
                                    </p>
                                </CardContent>
                            </Link>
                        </Card>

                        <Card className="hover:shadow-lg transition-shadow cursor-pointer" asChild>
                            <Link href="/dashboard/application">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <Clock className="w-5 h-5 text-blue-600" />
                                        Track Progress
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-slate-600">
                                        View your application timeline
                                    </p>
                                </CardContent>
                            </Link>
                        </Card>

                        <Card className="hover:shadow-lg transition-shadow cursor-pointer" asChild>
                            <Link href="/dashboard/logbook">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                                        Case Logbook
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-slate-600">
                                        Document your clinical cases
                                    </p>
                                </CardContent>
                            </Link>
                        </Card>
                    </div>

                    {/* Next Steps */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Next Steps</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {application.current_step === 'eligibility_pending' && (
                                    <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                                        <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
                                        <div>
                                            <p className="font-medium text-amber-900">Complete Eligibility Documents</p>
                                            <p className="text-sm text-amber-700 mt-1">
                                                Upload your passport, dean's letter, and USMLE score report to proceed to payment.
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {application.current_step === 'payment_pending' && (
                                    <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                        <Clock className="w-5 h-5 text-blue-600 mt-0.5" />
                                        <div>
                                            <p className="font-medium text-blue-900">Payment Required</p>
                                            <p className="text-sm text-blue-700 mt-1">
                                                Your eligibility documents have been verified. Complete payment to unlock compliance requirements.
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {application.current_step === 'compliance_pending' && (
                                    <div className="flex items-start gap-3 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                                        <AlertCircle className="w-5 h-5 text-purple-600 mt-0.5" />
                                        <div>
                                            <p className="font-medium text-purple-900">Complete Compliance Documents</p>
                                            <p className="text-sm text-purple-700 mt-1">
                                                Upload AAMC immunization form, vaccination records, and health insurance proof.
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
