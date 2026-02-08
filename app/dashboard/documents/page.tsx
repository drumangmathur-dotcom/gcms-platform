"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileUpload } from "@/components/FileUpload";
import { Application, Document, DOCUMENT_REQUIREMENTS } from "@/types/v3-outbound";
import {
    FileText,
    CheckCircle2,
    Clock,
    XCircle,
    Download,
    AlertCircle
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function DocumentsPage() {
    const [application, setApplication] = useState<Application | null>(null);
    const [documents, setDocuments] = useState<Document[]>([]);
    const [loading, setLoading] = useState(true);

    const loadData = async () => {
        try {
            // Load application
            const appResponse = await fetch("/api/applications/current");
            if (appResponse.ok) {
                const appData = await appResponse.json();
                setApplication(appData.application);

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
            console.error("Failed to load data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleUploadComplete = () => {
        // Reload documents after upload
        loadData();
    };

    const getDocumentStatus = (docType: string) => {
        const doc = documents.find(d => d.type === docType);
        return doc;
    };

    const getRequiredDocuments = () => {
        if (!application) return [];

        const step = application.current_step;

        if (step === 'eligibility_pending' || step === 'payment_pending') {
            return ['passport', 'deans_letter', 'usmle'];
        }

        if (step === 'compliance_pending' || step === 'visa_pending' || step === 'ready_to_travel') {
            return ['passport', 'deans_letter', 'usmle', 'aamc_form', 'immunization', 'insurance'];
        }

        return [];
    };

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

    if (!application) {
        return (
            <div className="p-8">
                <Card>
                    <CardContent className="p-12 text-center">
                        <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                        <h2 className="font-serif text-2xl font-bold text-slate-900 mb-2">
                            No Active Application
                        </h2>
                        <p className="text-slate-600 mb-6">
                            Start an application to upload documents.
                        </p>
                        <Button asChild>
                            <Link href="/dashboard/programs">Browse Programs</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const requiredDocs = getRequiredDocuments();

    return (
        <div className="p-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="font-serif text-4xl font-bold text-slate-900 mb-2">
                    Document Vault
                </h1>
                <p className="text-slate-600">
                    Upload and manage your application documents. All documents are reviewed by our team.
                </p>
            </div>

            {/* Current Step Info */}
            <Card className="mb-6 border-amber-200 bg-amber-50">
                <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                        <FileText className="w-5 h-5 text-amber-600 mt-0.5" />
                        <div>
                            <p className="font-medium text-amber-900">
                                {application.current_step === 'eligibility_pending' && 'Eligibility Documents Required'}
                                {application.current_step === 'payment_pending' && 'Payment Required - Documents Under Review'}
                                {application.current_step === 'compliance_pending' && 'Compliance Documents Required'}
                                {(application.current_step === 'visa_pending' || application.current_step === 'ready_to_travel') && 'All Documents Submitted'}
                            </p>
                            <p className="text-sm text-amber-700 mt-1">
                                {application.current_step === 'eligibility_pending' && 'Upload passport, dean\'s letter, and USMLE score report to proceed.'}
                                {application.current_step === 'payment_pending' && 'Your eligibility documents are being reviewed. Payment will unlock after verification.'}
                                {application.current_step === 'compliance_pending' && 'Upload AAMC form, immunization records, and insurance proof.'}
                                {(application.current_step === 'visa_pending' || application.current_step === 'ready_to_travel') && 'Your document vault is complete. Download copies as needed.'}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid lg:grid-cols-2 gap-6">
                {/* Document Upload Cards */}
                {requiredDocs.map((docType) => {
                    const existingDoc = getDocumentStatus(docType);
                    const docInfo = DOCUMENT_REQUIREMENTS[docType as keyof typeof DOCUMENT_REQUIREMENTS];

                    return (
                        <div key={docType}>
                            {/* Show upload interface if not uploaded or rejected */}
                            {(!existingDoc || existingDoc.verification_status === 'rejected') && (
                                <FileUpload
                                    applicationId={application.id}
                                    documentType={docType}
                                    label={docInfo.label}
                                    description={docInfo.description}
                                    acceptedFormats={docInfo.acceptedFormats}
                                    maxSizeMB={docInfo.maxSizeMB}
                                    onUploadComplete={handleUploadComplete}
                                />
                            )}

                            {/* Show status card if document exists */}
                            {existingDoc && existingDoc.verification_status !== 'rejected' && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg flex items-center justify-between">
                                            <span className="flex items-center gap-2">
                                                <FileText className="w-5 h-5 text-blue-600" />
                                                {docInfo.label}
                                            </span>
                                            {existingDoc.verification_status === 'verified' && (
                                                <Badge className="bg-emerald-500">
                                                    <CheckCircle2 className="w-3 h-3 mr-1" />
                                                    Verified
                                                </Badge>
                                            )}
                                            {existingDoc.verification_status === 'pending' && (
                                                <Badge variant="secondary">
                                                    <Clock className="w-3 h-3 mr-1" />
                                                    Under Review
                                                </Badge>
                                            )}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-slate-600">File Name</span>
                                                <span className="font-medium text-slate-900 truncate max-w-[200px]">
                                                    {existingDoc.file_name}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-slate-600">Size</span>
                                                <span className="text-slate-900">
                                                    {existingDoc.file_size ? (existingDoc.file_size / 1024).toFixed(0) : '—'} KB
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-slate-600">Uploaded</span>
                                                <span className="text-slate-900">
                                                    {new Date(existingDoc.created_at).toLocaleDateString()}
                                                </span>
                                            </div>

                                            {existingDoc.admin_notes && (
                                                <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded-lg">
                                                    <p className="text-xs font-semibold text-slate-700 mb-1">
                                                        Admin Notes:
                                                    </p>
                                                    <p className="text-sm text-slate-600">
                                                        {existingDoc.admin_notes}
                                                    </p>
                                                </div>
                                            )}

                                            <Button
                                                variant="outline"
                                                className="w-full mt-3"
                                                asChild
                                            >
                                                <a href={existingDoc.file_url} target="_blank" rel="noopener noreferrer">
                                                    <Download className="w-4 h-4 mr-2" />
                                                    Download
                                                </a>
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Help Section */}
            <Card className="mt-8">
                <CardHeader>
                    <CardTitle>Document Guidelines</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-2 text-sm text-slate-700">
                        <li className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                            <span>All documents must be clear, legible, and in color (if original is colored)</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                            <span>Passport must have minimum 6 months validity from rotation start date</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                            <span>Dean's letter must be on official university letterhead with signature and stamp</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                            <span>USMLE scores must be official transcripts (screenshots not accepted)</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                            <span>Review typically takes 2-3 business days</span>
                        </li>
                    </ul>
                </CardContent>
            </Card>
        </div>
    );
}
