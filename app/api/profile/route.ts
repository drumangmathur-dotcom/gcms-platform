import { NextRequest, NextResponse } from 'next/server';
import { auth as clerkAuth } from '@clerk/nextjs/server';
import { supabaseServer } from '@/lib/supabase-server';
import { StudentProfileInsert } from '@/types/database';
import { calculateProfileCompletion } from '@/lib/profile';

/**
 * GET /api/profile
 * Fetch the current user's profile
 */
export async function GET() {
    try {
        const { userId } = clerkAuth();

        if (!userId) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Fetch user's profile
        const { data: profile, error } = await supabaseServer
            .from('student_profiles')
            .select('*')
            .eq('user_id', userId)
            .single();

        if (error && error.code !== 'PGRST116') {
            // PGRST116 is "not found" - expected for new users
            console.error('Error fetching profile:', error);
            return NextResponse.json(
                { error: 'Failed to fetch profile' },
                { status: 500 }
            );
        }

        return NextResponse.json({ profile: profile || null });
    } catch (error) {
        console.error('Profile API error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

/**
 * POST /api/profile
 * Create or update the current user's profile
 */
export async function POST(request: NextRequest) {
    try {
        const { userId } = clerkAuth();

        if (!userId) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const profileData: Partial<StudentProfileInsert> = body;

        // Calculate completion percentage
        const completion = calculateProfileCompletion(profileData);

        // Prepare data for upsert
        const dataToUpsert = {
            ...profileData,
            user_id: userId,
            profile_completion_percentage: completion,
            updated_at: new Date().toISOString(),
        };

        // Upsert profile
        const { data: profile, error } = await supabaseServer
            .from('student_profiles')
            .upsert(dataToUpsert as any, { onConflict: 'user_id' })
            .select()
            .single();

        if (error) {
            console.error('Error upserting profile:', error);
            return NextResponse.json(
                { error: 'Failed to save profile' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            profile,
            completion
        });
    } catch (error) {
        console.error('Profile API error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
