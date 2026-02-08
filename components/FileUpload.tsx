"use client";

import { useState } from "react";
import { Upload, FileText, CheckCircle2, AlertCircle, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";

interface FileUploadProps {
    applicationId: string;
    documentType: string;
    label: string;
    description?: string;
    acceptedFormats?: string;
    maxSizeMB?: number;
    onUploadComplete?: () => void;
}

export function FileUpload({
    applicationId,
    documentType,
    label,
    description,
    acceptedFormats = ".pdf,.jpg,.jpeg,.png",
    maxSizeMB = 10,
    onUploadComplete
}: FileUploadProps) {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;

        // Validate file size
        const fileSizeMB = selectedFile.size / (1024 * 1024);
        if (fileSizeMB > maxSizeMB) {
            setError(`File size must be less than ${maxSizeMB}MB`);
            return;
        }

        setFile(selectedFile);
        setError(null);
        setSuccess(false);
    };

    const handleUpload = async () => {
        if (!file) return;

        setUploading(true);
        setError(null);
        setUploadProgress(0);

        try {
            // Generate unique filename
            const timestamp = Date.now();
            const fileExt = file.name.split('.').pop();
            const fileName = `${applicationId}/${documentType}_${timestamp}.${fileExt}`;

            // Upload to Supabase Storage
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('documents')
                .upload(fileName, file, {
                    cacheControl: '3600',
                    upsert: false
                });

            if (uploadError) throw uploadError;

            // Get public URL
            const { data: urlData } = supabase.storage
                .from('documents')
                .getPublicUrl(fileName);

            // Save document metadata to database
            const response = await fetch('/api/documents/upload', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    applicationId,
                    type: documentType,
                    fileUrl: urlData.publicUrl,
                    fileName: file.name,
                    fileSize: file.size,
                    mimeType: file.type
                })
            });

            if (!response.ok) {
                throw new Error('Failed to save document metadata');
            }

            setSuccess(true);
            setUploadProgress(100);
            onUploadComplete?.();

            // Reset after 2 seconds
            setTimeout(() => {
                setFile(null);
                setSuccess(false);
                setUploadProgress(0);
            }, 2000);

        } catch (err: any) {
            console.error('Upload error:', err);
            setError(err.message || 'Upload failed. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    const handleRemove = () => {
        setFile(null);
        setError(null);
        setSuccess(false);
    };

    return (
        <Card className="p-6">
            <div className="space-y-4">
                {/* Header */}
                <div>
                    <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-amber-600" />
                        {label}
                    </h3>
                    {description && (
                        <p className="text-sm text-slate-600 mt-1">{description}</p>
                    )}
                </div>

                {/* File Input */}
                {!file && !success && (
                    <label className="block">
                        <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center cursor-pointer hover:border-amber-500 hover:bg-amber-50/50 transition-colors">
                            <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                            <p className="text-sm font-medium text-slate-700">
                                Click to upload or drag and drop
                            </p>
                            <p className="text-xs text-slate-500 mt-1">
                                {acceptedFormats.replace(/\./g, '').toUpperCase()} (max {maxSizeMB}MB)
                            </p>
                        </div>
                        <input
                            type="file"
                            accept={acceptedFormats}
                            onChange={handleFileChange}
                            className="hidden"
                            disabled={uploading}
                        />
                    </label>
                )}

                {/* Selected File Preview */}
                {file && !success && (
                    <div className="border border-slate-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <FileText className="w-5 h-5 text-blue-600" />
                                <div>
                                    <p className="text-sm font-medium text-slate-900">
                                        {file.name}
                                    </p>
                                    <p className="text-xs text-slate-500">
                                        {(file.size / 1024).toFixed(0)} KB
                                    </p>
                                </div>
                            </div>
                            {!uploading && (
                                <button
                                    onClick={handleRemove}
                                    className="text-slate-400 hover:text-slate-600"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            )}
                        </div>

                        {/* Progress Bar */}
                        {uploading && (
                            <div className="mt-3">
                                <div className="w-full bg-slate-200 rounded-full h-2">
                                    <div
                                        className="bg-amber-500 h-2 rounded-full transition-all duration-300"
                                        style={{ width: `${uploadProgress}%` }}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Upload Button */}
                        {!uploading && (
                            <Button
                                onClick={handleUpload}
                                className="w-full mt-3 bg-amber-500 hover:bg-amber-600 text-slate-900 font-medium"
                            >
                                Upload Document
                            </Button>
                        )}

                        {uploading && (
                            <div className="flex items-center justify-center gap-2 mt-3 text-amber-600">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span className="text-sm font-medium">Uploading...</span>
                            </div>
                        )}
                    </div>
                )}

                {/* Success State */}
                {success && (
                    <div className="border border-emerald-200 bg-emerald-50 rounded-lg p-4">
                        <div className="flex items-center gap-3">
                            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                            <div>
                                <p className="text-sm font-medium text-emerald-900">
                                    Upload Successful!
                                </p>
                                <p className="text-xs text-emerald-700">
                                    Your document is being reviewed by our team.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="border border-red-200 bg-red-50 rounded-lg p-4">
                        <div className="flex items-center gap-3">
                            <AlertCircle className="w-5 h-5 text-red-600" />
                            <div>
                                <p className="text-sm font-medium text-red-900">
                                    Upload Failed
                                </p>
                                <p className="text-xs text-red-700">{error}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Card>
    );
}
