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
            }
        }
    }
}
