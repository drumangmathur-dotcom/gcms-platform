"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProgressStepper } from "@/components/ProgressStepper";
import { Application, Program, Document } from "@/types/v3-outbound";
import { CheckCircle2, Clock, FileText, AlertCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ApplicationPage() {
    const [application, setApplication] = useState<Application | null>(null);
    const [program, setProgram] = useState<Program | null>(null);
    const [documents, setDocuments] = useState<Document[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            try {
                // Load application
                const appResponse = await fetch("/api/applications/current");
                if (appResponse.ok) {
                    const appData = await appResponse.json();
                    setApplication(appData.application);
                    setProgram(appData.program);

                    // Load documents if application exists
                    if (appData.application) {
                        const docsResponse = await fetch(`/api/documents?applicationId=${appData.application.id}`);
                        if (docsResponse.ok) {
                            const docsData = await docsResponse.json();
                            setDocuments(docsData.documents || []);
                        }
                    }
                }
            } catch (error) {
                console.error("Failed to load application:", error);
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, []);

    if (loading) {
        return (
            <div className="p-8">
                <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-slate-200 rounded w-1/3"></div>
                    <div className="h-64 bg-slate-200 rounded"></div>
                </div>
            </div>
        );
    }

    if (!application || !program) {
        return (
            <div className="p-8">
                <Card>
                    <CardContent className="p-12 text-center">
                        <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                        <h2 className="font-serif text-2xl font-bold text-slate-900 mb-2">
                            No Active Application
                        </h2>
                        <p className="text-slate-600 mb-6">
                            You haven't started an application yet. Browse programs to get started.
                        </p>
                        <Button asChild>
                            <Link href="/dashboard/programs">Browse Programs</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Count verified documents
    const requiredDocsCount = {
        eligibility: 3, // passport, deans_letter, usmle
        compliance: 3   // aamc_form, immunization, insurance
    };

    const eligibilityDocs = documents.filter(d =>
        ['passport', 'deans_letter', 'usmle'].includes(d.type)
    );
    const eligibilityVerified = eligibilityDocs.filter(d => d.verified).length;

    const complianceDocs = documents.filter(d =>
        ['aamc_form', 'immunization', 'insurance'].includes(d.type)
    );
    const complianceVerified = complianceDocs.filter(d => d.verified).length;

    return (
        <div className="p-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="font-serif text-4xl font-bold text-slate-900 mb-2">
                    My Application
                </h1>
                <p className="text-slate-600">
                    Track your progress for {program.name}
                </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Progress Stepper */}
                    <ProgressStepper
                        currentStep={application.current_step}
                        paymentVerified={application.payment_verified}
                    />

                    {/* Step Details */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Current Requirements</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {application.current_step === 'eligibility_pending' && (
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 bg-amber-50 border border-amber-200 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <FileText className="w-5 h-5 text-amber-600" />
                                            <div>
                                                <p className="font-medium text-amber-900">Upload Required Documents</p>
                                                <p className="text-sm text-amber-700">
                                                    {eligibilityVerified}/{requiredDocsCount.eligibility} documents verified
                                                </p>
                                            </div>
                                        </div>
                                        <Button asChild>
                                            <Link href="/dashboard/documents">Upload</Link>
                                        </Button>
                                    </div>
                                    <div className="text-sm text-slate-600">
                                        <p className="font-medium mb-2">Required documents:</p>
                                        <ul className="space-y-1 list-disc list-inside">
                                            <li>Valid Passport (min. 6 months validity)</li>
                                            <li>Dean's Letter of Good Standing</li>
                                            <li>USMLE Score Report or Transcript</li>
                                        </ul>
                                    </div>
                                </div>
                            )}

                            {application.current_step === 'payment_pending' && (
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <CheckCircle2 className="w-5 h-5 text-blue-600" />
                                            <div>
                                                <p className="font-medium text-blue-900">Payment Required</p>
                                                <p className="text-sm text-blue-700">
                                                    Amount: ${program.price.toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                        <Button className="bg-blue-600 hover:bg-blue-700">
                                            Pay Now
                                        </Button>
                                    </div>
                                    <div className="text-sm text-slate-600">
                                        <p>Your eligibility documents have been verified. Complete payment to unlock compliance requirements.</p>
                                    </div>
                                </div>
                            )}

                            {application.current_step === 'compliance_pending' && (
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 bg-purple-50 border border-purple-200 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <FileText className="w-5 h-5 text-purple-600" />
                                            <div>
                                                <p className="font-medium text-purple-900">Upload Compliance Documents</p>
                                                <p className="text-sm text-purple-700">
                                                    {complianceVerified}/{requiredDocsCount.compliance} documents verified
                                                </p>
                                            </div>
                                        </div>
                                        <Button asChild>
                                            <Link href="/dashboard/documents">Upload</Link>
                                        </Button>
                                    </div>
                                    <div className="text-sm text-slate-600">
                                        <p className="font-medium mb-2">Required documents:</p>
                                        <ul className="space-y-1 list-disc list-inside">
                                            <li>AAMC Standardized Immunization Form</li>
                                            <li>Complete Vaccination Records</li>
                                            <li>Health Insurance Proof</li>
                                        </ul>
                                    </div>
                                </div>
                            )}

                            {application.current_step === 'visa_pending' && (
                                <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
                                    <p className="font-medium text-indigo-900">Visa Application in Progress</p>
                                    <p className="text-sm text-indigo-700 mt-1">
                                        We're processing your visa documentation. You'll receive updates via email.
                                    </p>
                                </div>
                            )}

                            {application.current_step === 'ready_to_travel' && (
                                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                                    <p className="font-medium text-emerald-900 flex items-center gap-2">
                                        <CheckCircle2 className="w-5 h-5" />
                                        Ready for Your Rotation!
                                    </p>
                                    <p className="text-sm text-emerald-700 mt-1">
                                        All requirements completed. Download your travel packet from the documents section.
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Admin Notes */}
                    {application.admin_notes && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Administrator Notes</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-slate-700">{application.admin_notes}</p>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Program Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Program Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div>
                                <p className="text-sm text-slate-500">Institution</p>
                                <p className="font-medium text-slate-900">{program.name}</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">Location</p>
                                <p className="font-medium text-slate-900">{program.location}</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">Duration</p>
                                <p className="font-medium text-slate-900">{program.content_json.duration}</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">Program Fee</p>
                                <p className="font-medium text-slate-900">${program.price.toLocaleString()}</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Application Status */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Application Status</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-600">Created</span>
                                <span className="text-sm text-slate-900">
                                    {new Date(application.created_at).toLocaleDateString()}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-600">Last Updated</span>
                                <span className="text-sm text-slate-900">
                                    {new Date(application.updated_at).toLocaleDateString()}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-600">Payment Status</span>
                                <Badge variant={application.payment_verified ? "default" : "secondary"}>
                                    {application.payment_verified ? "Verified" : "Pending"}
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Quick Actions */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <Button variant="outline" className="w-full justify-start" asChild>
                                <Link href="/dashboard/documents">
                                    <FileText className="w-4 h-4 mr-2" />
                                    View Documents
                                </Link>
                            </Button>
                            <Button variant="outline" className="w-full justify-start" asChild>
                                <Link href="/dashboard/logbook">
                                    <Clock className="w-4 h-4 mr-2" />
                                    Logbook
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
