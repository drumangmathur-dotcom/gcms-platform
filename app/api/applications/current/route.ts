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

        // Get user's most recent application
        const { data: application, error: appError } = await supabase
            .from("applications")
            .select("*")
            .eq("user_id", userId)
            .order("created_at", { ascending: false })
            .limit(1)
            .single();

        if (appError && appError.code !== 'PGRST116') { // PGRST116 = no rows found
            console.error("Error fetching application:", appError);
            return NextResponse.json({ error: "Failed to fetch application" }, { status: 500 });
        }

        // If no application, return null
        if (!application) {
            return NextResponse.json({ application: null, program: null });
        }

        // Get the program details
        const { data: program, error: programError } = await supabase
            .from("programs")
            .select("*")
            .eq("id", application.program_id)
            .single();

        if (programError) {
            console.error("Error fetching program:", programError);
            return NextResponse.json({ error: "Failed to fetch program" }, { status: 500 });
        }

        return NextResponse.json({ application, program });
    } catch (error) {
        console.error("Current application API error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
