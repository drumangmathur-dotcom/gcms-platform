"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StudentProfileInsert } from "@/types/database";

interface ProfileFormProps {
    initialData?: Partial<StudentProfileInsert>;
    onSubmit: (data: StudentProfileInsert) => Promise<void>;
}

const TOTAL_STEPS = 4;

export function StudentProfileForm({ initialData, onSubmit }: ProfileFormProps) {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState<Partial<StudentProfileInsert>>(initialData || {});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const updateField = (field: keyof StudentProfileInsert, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleNext = () => {
        if (currentStep < TOTAL_STEPS) setCurrentStep(currentStep + 1);
    };

    const handleBack = () => {
        if (currentStep > 1) setCurrentStep(currentStep - 1);
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            await onSubmit(formData as StudentProfileInsert);
        } finally {
            setIsSubmitting(false);
        }
    };

    const progressPercentage = (currentStep / TOTAL_STEPS) * 100;

    return (
        <div className="max-w-3xl mx-auto py-12 px-4">
            {/* Progress Indicator */}
            <div className="mb-8">
                <div className="flex justify-between mb-2">
                    {[1, 2, 3, 4].map(step => (
                        <div key={step} className="flex flex-col items-center">
                            <div className={`
                                w-10 h-10 rounded-full flex items-center justify-center font-semibold
                                ${step <= currentStep ? 'bg-amber-600 text-white' : 'bg-slate-700 text-slate-400'}
                            `}>
                                {step}
                            </div>
                            <span className="text-xs mt-1 text-slate-400">
                                {step === 1 && 'Demographics'}
                                {step === 2 && 'Academic'}
                                {step === 3 && 'Research'}
                                {step === 4 && 'Documents'}
                            </span>
                        </div>
                    ))}
                </div>
                <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                    <div
                        className="bg-amber-600 h-full transition-all duration-300"
                        style={{ width: `${progressPercentage}%` }}
                    />
                </div>
            </div>

            {/* Form Steps */}
            <Card className="p-8 bg-slate-800 border-slate-700">
                {currentStep === 1 && (
                    <DemographicsStep formData={formData} updateField={updateField} />
                )}
                {currentStep === 2 && (
                    <AcademicStep formData={formData} updateField={updateField} />
                )}
                {currentStep === 3 && (
                    <ResearchStep formData={formData} updateField={updateField} />
                )}
                {currentStep === 4 && (
                    <DocumentsStep formData={formData} updateField={updateField} />
                )}

                {/* Navigation */}
                <div className="flex justify-between mt-8">
                    <Button
                        onClick={handleBack}
                        disabled={currentStep === 1}
                        variant="outline"
                        className="border-slate-600 text-slate-300"
                    >
                        Back
                    </Button>
                    {currentStep < TOTAL_STEPS ? (
                        <Button onClick={handleNext} className="bg-amber-600 hover:bg-amber-700">
                            Next Step
                        </Button>
                    ) : (
                        <Button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="bg-amber-600 hover:bg-amber-700"
                        >
                            {isSubmitting ? 'Saving...' : 'Complete Profile'}
                        </Button>
                    )}
                </div>
            </Card>
        </div>
    );
}

function DemographicsStep({ formData, updateField }: any) {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-playfair text-amber-500">Demographics</h2>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="dob">Date of Birth</Label>
                    <Input
                        id="dob"
                        type="date"
                        value={formData.date_of_birth || ''}
                        onChange={(e) => updateField('date_of_birth', e.target.value)}
                        className="bg-slate-900 border-slate-700"
                    />
                </div>
                <div>
                    <Label htmlFor="gender">Gender</Label>
                    <select
                        id="gender"
                        value={formData.gender || ''}
                        onChange={(e) => updateField('gender', e.target.value)}
                        className="flex h-10 w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
                    >
                        <option value="">Select...</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                        <option value="prefer_not_to_say">Prefer not to say</option>
                    </select>
                </div>
            </div>

            <div>
                <Label htmlFor="passport">Passport Number</Label>
                <Input
                    id="passport"
                    value={formData.passport_number || ''}
                    onChange={(e) => updateField('passport_number', e.target.value)}
                    className="bg-slate-900 border-slate-700"
                />
            </div>

            <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                    id="phone"
                    type="tel"
                    value={formData.phone_number || ''}
                    onChange={(e) => updateField('phone_number', e.target.value)}
                    className="bg-slate-900 border-slate-700"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="emergency_name">Emergency Contact Name</Label>
                    <Input
                        id="emergency_name"
                        value={formData.emergency_contact_name || ''}
                        onChange={(e) => updateField('emergency_contact_name', e.target.value)}
                        className="bg-slate-900 border-slate-700"
                    />
                </div>
                <div>
                    <Label htmlFor="emergency_phone">Emergency Contact Phone</Label>
                    <Input
                        id="emergency_phone"
                        type="tel"
                        value={formData.emergency_contact_phone || ''}
                        onChange={(e) => updateField('emergency_contact_phone', e.target.value)}
                        className="bg-slate-900 border-slate-700"
                    />
                </div>
            </div>
        </div>
    );
}

function AcademicStep({ formData, updateField }: any) {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-playfair text-amber-500">Academic Credentials</h2>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="medical_school">Medical School</Label>
                    <Input
                        id="medical_school"
                        value={formData.medical_school || ''}
                        onChange={(e) => updateField('medical_school', e.target.value)}
                        placeholder="e.g., Johns Hopkins University"
                        className="bg-slate-900 border-slate-700"
                    />
                </div>
                <div>
                    <Label htmlFor="graduation_year">Graduation Year</Label>
                    <Input
                        id="graduation_year"
                        type="number"
                        value={formData.graduation_year || ''}
                        onChange={(e) => updateField('graduation_year', parseInt(e.target.value))}
                        placeholder="e.g., 2024"
                        className="bg-slate-900 border-slate-700"
                    />
                </div>
            </div>

            <div className="p-4 bg-slate-900 rounded-lg border border-slate-700">
                <h3 className="text-lg font-semibold mb-4 text-amber-400">USMLE Scores</h3>
                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <Label htmlFor="step1">Step 1</Label>
                        <Input
                            id="step1"
                            type="number"
                            value={formData.usmle_step1_score || ''}
                            onChange={(e) => updateField('usmle_step1_score', parseInt(e.target.value))}
                            placeholder="0-300"
                            className="bg-slate-800 border-slate-600"
                        />
                    </div>
                    <div>
                        <Label htmlFor="step2ck">Step 2 CK</Label>
                        <Input
                            id="step2ck"
                            type="number"
                            value={formData.usmle_step2ck_score || ''}
                            onChange={(e) => updateField('usmle_step2ck_score', parseInt(e.target.value))}
                            placeholder="0-300"
                            className="bg-slate-800 border-slate-600"
                        />
                    </div>
                    <div>
                        <Label htmlFor="step3">Step 3</Label>
                        <Input
                            id="step3"
                            type="number"
                            value={formData.usmle_step3_score || ''}
                            onChange={(e) => updateField('usmle_step3_score', parseInt(e.target.value))}
                            placeholder="0-300"
                            className="bg-slate-800 border-slate-600"
                        />
                    </div>
                </div>
                <div className="mt-4 flex items-center">
                    <input
                        id="step2cs"
                        type="checkbox"
                        checked={formData.usmle_step2cs_passed || false}
                        onChange={(e) => updateField('usmle_step2cs_passed', e.target.checked)}
                        className="mr-2"
                    />
                    <Label htmlFor="step2cs">Step 2 CS Passed</Label>
                </div>
            </div>
        </div>
    );
}

function ResearchStep({ formData, updateField }: any) {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-playfair text-amber-500">Research Portfolio</h2>

            <div className="grid grid-cols-3 gap-4">
                <div>
                    <Label htmlFor="publications">Publications</Label>
                    <Input
                        id="publications"
                        type="number"
                        value={formData.publications_count || 0}
                        onChange={(e) => updateField('publications_count', parseInt(e.target.value))}
                        className="bg-slate-900 border-slate-700"
                    />
                </div>
                <div>
                    <Label htmlFor="hindex">H-Index</Label>
                    <Input
                        id="hindex"
                        type="number"
                        value={formData.h_index || 0}
                        onChange={(e) => updateField('h_index', parseInt(e.target.value))}
                        className="bg-slate-900 border-slate-700"
                    />
                </div>
                <div>
                    <Label htmlFor="orcid">ORCID</Label>
                    <Input
                        id="orcid"
                        value={formData.orcid_id || ''}
                        onChange={(e) => updateField('orcid_id', e.target.value)}
                        placeholder="0000-0000-0000-0000"
                        className="bg-slate-900 border-slate-700"
                    />
                </div>
            </div>

            <div>
                <Label htmlFor="interests">Research Interests (comma-separated)</Label>
                <Input
                    id="interests"
                    value={(formData.research_interests || []).join(', ')}
                    onChange={(e) => updateField('research_interests', e.target.value.split(',').map(s => s.trim()))}
                    placeholder="e.g., Cardiology, Neuroscience, Oncology"
                    className="bg-slate-900 border-slate-700"
                />
            </div>
        </div>
    );
}

function DocumentsStep({ formData, updateField }: any) {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-playfair text-amber-500">Documents</h2>
            <p className="text-slate-400">Upload your credentials (optional - can be added later)</p>

            <div className="space-y-4">
                <div>
                    <Label htmlFor="cv">CV / Resume URL</Label>
                    <Input
                        id="cv"
                        type="url"
                        value={formData.cv_url || ''}
                        onChange={(e) => updateField('cv_url', e.target.value)}
                        placeholder="https://..."
                        className="bg-slate-900 border-slate-700"
                    />
                    <p className="text-xs text-slate-500 mt-1">Paste a link to your CV (Google Drive, Dropbox, etc.)</p>
                </div>

                <div>
                    <Label htmlFor="diploma">Medical Diploma URL</Label>
                    <Input
                        id="diploma"
                        type="url"
                        value={formData.medical_diploma_url || ''}
                        onChange={(e) => updateField('medical_diploma_url', e.target.value)}
                        placeholder="https://..."
                        className="bg-slate-900 border-slate-700"
                    />
                </div>

                <div>
                    <Label htmlFor="transcript">Transcript URL</Label>
                    <Input
                        id="transcript"
                        type="url"
                        value={formData.transcript_url || ''}
                        onChange={(e) => updateField('transcript_url', e.target.value)}
                        placeholder="https://..."
                        className="bg-slate-900 border-slate-700"
                    />
                </div>
            </div>

            <Badge className="bg-amber-600 text-white">
                💡 You can skip this step and upload documents later from your dashboard
            </Badge>
        </div>
    );
}
