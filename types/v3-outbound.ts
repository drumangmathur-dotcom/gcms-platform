// GCMS v3.0 Outbound Stack Types
// Corresponds to db/v3_outbound_schema.sql

// ============================================================================
// Database Enums
// ============================================================================

export type AppStatus =
    | 'eligibility_pending'
    | 'payment_pending'
    | 'compliance_pending'
    | 'visa_pending'
    | 'ready_to_travel';

export type VerificationStatus = 'pending' | 'verified' | 'rejected';

export type ProgramStatus = 'active' | 'waitlist';

export type DocumentType =
    | 'passport'
    | 'deans_letter'
    | 'usmle'
    | 'aamc_form'
    | 'immunization'
    | 'insurance';

// ============================================================================
// Database Tables
// ============================================================================

export interface Program {
    id: string;
    name: string;
    slug: string;
    location: string;
    country: string;
    status: ProgramStatus;
    price: number;
    content_json: ProgramContent;
    created_at: string;
    updated_at: string;
}

export interface ProgramContent {
    images: string[];
    pros: string[];
    cons: string[];
    description: string;
    departments: string[];
    duration: string;
    housing: string;
}

export interface Application {
    id: string;
    user_id: string;
    program_id: string;
    current_step: AppStatus;
    payment_id: string | null;
    payment_verified: boolean;
    admin_notes: string | null;
    created_at: string;
    updated_at: string;
}

export interface Document {
    id: string;
    application_id: string;
    type: DocumentType;
    file_url: string;
    file_name: string;
    file_size: number;
    mime_type: string;
    verified: boolean;
    verification_status: VerificationStatus;
    admin_notes: string | null;
    verified_by: string | null;
    verified_at: string | null;
    created_at: string;
    updated_at: string;
}

export interface Waitlist {
    id: string;
    program_id: string;
    email: string;
    user_id: string | null;
    user_name: string | null;
    notify_when_available: boolean;
    created_at: string;
}

export interface CaseLog {
    id: string;
    application_id: string;
    user_id: string;
    diagnosis: string;
    procedure_performed: string;
    date_of_procedure: string;
    notes: string | null;
    verified: boolean;
    verified_by: string | null;
    verified_at: string | null;
    created_at: string;
    updated_at: string;
}

// ============================================================================
// Extended/Joined Types
// ============================================================================

export interface ApplicationWithProgram extends Application {
    program_name: string;
    program_slug: string;
    program_location: string;
    program_price: number;
    documents_uploaded: number;
    documents_verified: number;
}

export interface ProgramWithApplicationStatus extends Program {
    user_has_application: boolean;
    user_application_id?: string;
    user_application_step?: AppStatus;
}

// ============================================================================
// Progress Stepper Types
// ============================================================================

export interface ProgressStep {
    id: AppStatus;
    label: string;
    description: string;
    locked: boolean;
    completed: boolean;
    active: boolean;
    requiredDocuments?: DocumentType[];
}

export const PROGRESS_STEPS: Record<AppStatus, {
    order: number;
    label: string;
    description: string;
    requiredDocuments?: DocumentType[];
}> = {
    eligibility_pending: {
        order: 0,
        label: 'Eligibility',
        description: 'Upload passport, dean\'s letter, and USMLE score',
        requiredDocuments: ['passport', 'deans_letter', 'usmle']
    },
    payment_pending: {
        order: 1,
        label: 'Payment',
        description: 'Complete program payment',
    },
    compliance_pending: {
        order: 2,
        label: 'Compliance',
        description: 'Upload AAMC form, immunization records, and insurance',
        requiredDocuments: ['aamc_form', 'immunization', 'insurance']
    },
    visa_pending: {
        order: 3,
        label: 'Visa',
        description: 'Visa application and documentation',
    },
    ready_to_travel: {
        order: 4,
        label: 'Ready',
        description: 'All requirements completed',
    }
};

// ============================================================================
// Document Type Metadata
// ============================================================================

export const DOCUMENT_TYPES: Record<DocumentType, {
    label: string;
    description: string;
    acceptedFormats: string[];
    step: AppStatus;
}> = {
    passport: {
        label: 'Passport',
        description: 'Valid passport (minimum 6 months validity)',
        acceptedFormats: ['application/pdf', 'image/jpeg', 'image/png'],
        step: 'eligibility_pending'
    },
    deans_letter: {
        label: 'Dean\'s Letter of Good Standing',
        description: 'Letter from your medical school dean',
        acceptedFormats: ['application/pdf'],
        step: 'eligibility_pending'
    },
    usmle: {
        label: 'USMLE Score Report',
        description: 'Official USMLE transcript or score report',
        acceptedFormats: ['application/pdf'],
        step: 'eligibility_pending'
    },
    aamc_form: {
        label: 'AAMC Standardized Immunization Form',
        description: 'Completed and signed immunization form',
        acceptedFormats: ['application/pdf'],
        step: 'compliance_pending'
    },
    immunization: {
        label: 'Immunization Records',
        description: 'Complete vaccination history',
        acceptedFormats: ['application/pdf'],
        step: 'compliance_pending'
    },
    insurance: {
        label: 'Health Insurance',
        description: 'Proof of health insurance coverage',
        acceptedFormats: ['application/pdf'],
        step: 'compliance_pending'
    }
};

// ============================================================================
// API Request/Response Types
// ============================================================================

export interface CreateApplicationRequest {
    programId: string;
}

export interface CreateApplicationResponse {
    success: boolean;
    applicationId?: string;
    redirect?: string;
    error?: string;
}

export interface UploadDocumentRequest {
    applicationId: string;
    documentType: DocumentType;
    file: File;
}

export interface UploadDocumentResponse {
    success: boolean;
    documentId?: string;
    fileUrl?: string;
    error?: string;
}

export interface JoinWaitlistRequest {
    programId: string;
    email: string;
    userName?: string;
}

export interface JoinWaitlistResponse {
    success: boolean;
    message: string;
}

export interface VerifyDocumentRequest {
    documentId: string;
    status: VerificationStatus;
    adminNotes?: string;
}

export interface UpdateApplicationStepRequest {
    applicationId: string;
    newStep: AppStatus;
}

// ============================================================================
// UI Component Props
// ============================================================================

export interface ProgramCardProps {
    program: Program;
    onClick: () => void;
    userHasApplication?: boolean;
}

export interface ProgressStepperProps {
    currentStep: AppStatus;
    completedSteps: AppStatus[];
    onStepClick: (step: AppStatus) => void;
}

export interface FileUploadProps {
    documentType: DocumentType;
    applicationId: string;
    existingDocument?: Document;
    onUploadComplete: (document: Document) => void;
}

export interface DocumentListItemProps {
    document: Document;
    onVerificationChange?: (status: VerificationStatus) => void;
    isAdminView?: boolean;
}
// Add this to the end of types/v3-outbound.ts

export const DOCUMENT_REQUIREMENTS = {
    passport: {
        label: 'Passport',
        description: 'Valid passport (minimum 6 months validity)',
        acceptedFormats: '.pdf,.jpg,.jpeg,.png',
        maxSizeMB: 10,
        required: true,
        step: 'eligibility_pending' as AppStatus
    },
    deans_letter: {
        label: "Dean's Letter",
        description: 'Letter of Good Standing from your medical school dean',
        acceptedFormats: '.pdf',
        maxSizeMB: 5,
        required: true,
        step: 'eligibility_pending' as AppStatus
    },
    usmle: {
        label: 'USMLE Score Report',
        description: 'Official USMLE score transcript or pass certificate',
        acceptedFormats: '.pdf',
        maxSizeMB: 5,
        required: true,
        step: 'eligibility_pending' as AppStatus
    },
    aamc_form: {
        label: 'AAMC Immunization Form',
        description: 'Standardized AAMC immunization documentation',
        acceptedFormats: '.pdf',
        maxSizeMB: 5,
        required: true,
        step: 'compliance_pending' as AppStatus
    },
    immunization: {
        label: 'Vaccination Records',
        description: 'Complete vaccination history and proof of immunizations',
        acceptedFormats: '.pdf,.jpg,.jpeg,.png',
        maxSizeMB: 10,
        required: true,
        step: 'compliance_pending' as AppStatus
    },
    insurance: {
        label: 'Health Insurance Proof',
        description: 'Valid health insurance coverage documentation',
        acceptedFormats: '.pdf',
        maxSizeMB: 5,
        required: true,
        step: 'compliance_pending' as AppStatus
    }
} as const;
