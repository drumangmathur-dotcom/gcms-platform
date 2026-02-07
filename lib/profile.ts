import { createClient } from '@supabase/supabase-js';
import { Database, StudentProfile, StudentProfileInsert, StudentProfileUpdate } from '@/types/database';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);

/**
 * Fetch a student profile by user ID
 */
export async function getStudentProfile(userId: string): Promise<StudentProfile | null> {
    const { data, error } = await supabase
        .from('student_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

    if (error) {
        console.error('Error fetching profile:', error);
        return null;
    }

    return data;
}

/**
 * Create or update a student profile
 */
export async function upsertStudentProfile(
    userId: string,
    profileData: Partial<StudentProfileInsert>
): Promise<StudentProfile | null> {
    // Calculate completion percentage
    const completion = calculateProfileCompletion(profileData);

    const dataWithCompletion = {
        ...profileData,
        user_id: userId,
        profile_completion_percentage: completion,
        updated_at: new Date().toISOString(),
    } as any; // Type assertion to bypass Supabase type inference issue

    const { data, error } = await supabase
        .from('student_profiles')
        .upsert(dataWithCompletion, { onConflict: 'user_id' })
        .select()
        .single();

    if (error) {
        console.error('Error upserting profile:', error);
        return null;
    }

    return data;
}

/**
 * Calculate profile completion percentage
 */
export function calculateProfileCompletion(profile: Partial<StudentProfileInsert>): number {
    const requiredFields = [
        'date_of_birth',
        'gender',
        'phone_number',
        'medical_school',
        'graduation_year',
    ];

    const optionalImportantFields = [
        'passport_number',
        'emergency_contact_name',
        'emergency_contact_phone',
        'usmle_step1_score',
        'usmle_step2ck_score',
    ];

    let completedRequired = 0;
    let completedOptional = 0;

    requiredFields.forEach(field => {
        if (profile[field as keyof StudentProfileInsert]) completedRequired++;
    });

    optionalImportantFields.forEach(field => {
        if (profile[field as keyof StudentProfileInsert]) completedOptional++;
    });

    // Required fields = 70%, Optional = 30%
    const requiredPercentage = (completedRequired / requiredFields.length) * 70;
    const optionalPercentage = (completedOptional / optionalImportantFields.length) * 30;

    return Math.round(requiredPercentage + optionalPercentage);
}
