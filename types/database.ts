export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            users: {
                Row: {
                    id: string
                    clerk_id: string
                    role: 'student_inbound' | 'student_outbound' | 'admin' | 'hospital_coord' | 'city_manager'
                    full_name: string
                    email: string
                    citizenship: string
                    medical_license_number: string | null
                    home_institution: string | null
                    city: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    clerk_id: string
                    role?: 'student_inbound' | 'student_outbound' | 'admin' | 'hospital_coord' | 'city_manager'
                    full_name: string
                    email: string
                    citizenship: string
                    medical_license_number?: string | null
                    home_institution?: string | null
                    city?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    clerk_id?: string
                    role?: 'student_inbound' | 'student_outbound' | 'admin' | 'hospital_coord' | 'city_manager'
                    full_name?: string
                    email?: string
                    citizenship?: string
                    medical_license_number?: string | null
                    home_institution?: string | null
                    city?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
            programs: {
                Row: {
                    id: string
                    hospital_id: string
                    title: string
                    type: 'observership' | 'fellowship' | 'hands_on'
                    duration_weeks: number
                    price_usd: number
                    requires_nmc_registration: boolean
                    housing_included: boolean
                    description: string | null
                    created_at: string
                }
            }
            applications: {
                Row: {
                    id: string
                    user_id: string
                    program_id: string
                    status: 'draft' | 'submitted' | 'approved' | 'paid' | 'active' | 'completed'
                    travel_start_date: string | null
                    travel_end_date: string | null
                    nmc_doc_status: 'pending' | 'submitted_to_govt' | 'approved'
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    program_id: string
                    status?: 'draft' | 'submitted' | 'approved' | 'paid' | 'active' | 'completed'
                    travel_start_date?: string | null
                    travel_end_date?: string | null
                    nmc_doc_status?: 'pending' | 'submitted_to_govt' | 'approved'
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    program_id?: string
                    status?: 'draft' | 'submitted' | 'approved' | 'paid' | 'active' | 'completed'
                    travel_start_date?: string | null
                    travel_end_date?: string | null
                    nmc_doc_status?: 'pending' | 'submitted_to_govt' | 'approved'
                    created_at?: string
                    updated_at?: string
                }
            }
            student_profiles: {
                Row: {
                    id: string
                    user_id: string
                    date_of_birth: string | null
                    gender: string | null
                    passport_number: string | null
                    phone_number: string | null
                    emergency_contact_name: string | null
                    emergency_contact_phone: string | null
                    medical_school: string | null
                    graduation_year: number | null
                    usmle_step1_score: number | null
                    usmle_step2ck_score: number | null
                    usmle_step2cs_passed: boolean
                    usmle_step3_score: number | null
                    publications_count: number
                    h_index: number
                    orcid_id: string | null
                    research_interests: string[] | null
                    spoken_languages: Json | null
                    cv_url: string | null
                    medical_diploma_url: string | null
                    transcript_url: string | null
                    profile_completion_percentage: number
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    date_of_birth?: string | null
                    gender?: string | null
                    passport_number?: string | null
                    phone_number?: string | null
                    emergency_contact_name?: string | null
                    emergency_contact_phone?: string | null
                    medical_school?: string | null
                    graduation_year?: number | null
                    usmle_step1_score?: number | null
                    usmle_step2ck_score?: number | null
                    usmle_step2cs_passed?: boolean
                    usmle_step3_score?: number | null
                    publications_count?: number
                    h_index?: number
                    orcid_id?: string | null
                    research_interests?: string[] | null
                    spoken_languages?: Json | null
                    cv_url?: string | null
                    medical_diploma_url?: string | null
                    transcript_url?: string | null
                    profile_completion_percentage?: number
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    date_of_birth?: string | null
                    gender?: string | null
                    passport_number?: string | null
                    phone_number?: string | null
                    emergency_contact_name?: string | null
                    emergency_contact_phone?: string | null
                    medical_school?: string | null
                    graduation_year?: number | null
                    usmle_step1_score?: number | null
                    usmle_step2ck_score?: number | null
                    usmle_step2cs_passed?: boolean
                    usmle_step3_score?: number | null
                    publications_count?: number
                    h_index?: number
                    orcid_id?: string | null
                    research_interests?: string[] | null
                    spoken_languages?: Json | null
                    cv_url?: string | null
                    medical_diploma_url?: string | null
                    transcript_url?: string | null
                    profile_completion_percentage?: number
                    created_at?: string
                    updated_at?: string
                }
            }
            housing_units: {
                Row: {
                    id: string
                    name: string
                    address: string | null
                    city: string
                    capacity: number
                    price_per_month: number
                    images: string[] | null
                    amenities: string[] | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    address?: string | null
                    city: string
                    capacity?: number
                    price_per_month?: number
                    images?: string[] | null
                    amenities?: string[] | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    address?: string | null
                    city?: string
                    capacity?: number
                    price_per_month?: number
                    images?: string[] | null
                    amenities?: string[] | null
                    created_at?: string
                }
            }
            housing_bookings: {
                Row: {
                    id: string
                    unit_id: string | null
                    user_id: string
                    application_id: string | null
                    check_in: string
                    check_out: string
                    status: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    unit_id?: string | null
                    user_id: string
                    application_id?: string | null
                    check_in: string
                    check_out: string
                    status?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    unit_id?: string | null
                    user_id?: string
                    application_id?: string | null
                    check_in?: string
                    check_out?: string
                    status?: string | null
                    created_at?: string
                }
            }
        }
    }
}

export type StudentProfile = Database['public']['Tables']['student_profiles']['Row']
export type StudentProfileInsert = Database['public']['Tables']['student_profiles']['Insert']
export type StudentProfileUpdate = Database['public']['Tables']['student_profiles']['Update']

