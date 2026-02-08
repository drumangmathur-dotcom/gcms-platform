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
