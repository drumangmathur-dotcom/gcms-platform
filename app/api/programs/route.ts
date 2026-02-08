import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Get all programs
        const { data: programs, error: programsError } = await supabase
            .from("programs")
            .select("*")
            .order("status", { ascending: false }); // Active programs first

        if (programsError) {
            console.error("Error fetching programs:", programsError);
            return NextResponse.json({ error: "Failed to fetch programs" }, { status: 500 });
        }

        // Get user's applications
        const { data: userApplications, error: appsError } = await supabase
            .from("applications")
            .select("id, program_id, current_step")
            .eq("user_id", userId);

        if (appsError) {
            console.error("Error fetching applications:", appsError);
        }

        // Enhance programs with application status
        const programsWithStatus = programs?.map(program => {
            const userApp = userApplications?.find(app => app.program_id === program.id);
            return {
                ...program,
                user_has_application: !!userApp,
                user_application_id: userApp?.id,
                user_application_step: userApp?.current_step
            };
        });

        return NextResponse.json({ programs: programsWithStatus });
    } catch (error) {
        console.error("Programs API error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
