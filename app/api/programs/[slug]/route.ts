import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(
    request: NextRequest,
    { params }: { params: { slug: string } }
) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { slug } = params;

        // Get program by slug
        const { data: program, error: programError } = await supabase
            .from("programs")
            .select("*")
            .eq("slug", slug)
            .single();

        if (programError || !program) {
            return NextResponse.json({ error: "Program not found" }, { status: 404 });
        }

        // Check if user has application for this program
        const { data: application, error: appError } = await supabase
            .from("applications")
            .select("id")
            .eq("user_id", userId)
            .eq("program_id", program.id)
            .single();

        const hasApplication = !!application && !appError;

        return NextResponse.json({ program, hasApplication });
    } catch (error) {
        console.error("Program detail API error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
