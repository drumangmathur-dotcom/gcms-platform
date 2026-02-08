import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { programId } = body;

        if (!programId) {
            return NextResponse.json({ error: "Program ID is required" }, { status: 400 });
        }

        // Check if user already has an application for this program
        const { data: existingApp, error: checkError } = await supabase
            .from("applications")
            .select("id")
            .eq("user_id", userId)
            .eq("program_id", programId)
            .single();

        if (existingApp) {
            return NextResponse.json({
                success: true,
                redirect: "/dashboard/application",
                message: "You already have an application for this program"
            });
        }

        // Create new application
        const { data: newApp, error: createError } = await supabase
            .from("applications")
            .insert({
                user_id: userId,
                program_id: programId,
                current_step: "eligibility_pending"
            })
            .select()
            .single();

        if (createError) {
            console.error("Error creating application:", createError);
            return NextResponse.json({
                success: false,
                error: "Failed to create application"
            }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            applicationId: newApp.id,
            redirect: "/dashboard/application"
        });
    } catch (error) {
        console.error("Create application API error:", error);
        return NextResponse.json({
            success: false,
            error: "Internal server error"
        }, { status: 500 });
    }
}
