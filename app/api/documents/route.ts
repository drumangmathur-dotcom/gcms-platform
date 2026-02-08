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

        const { searchParams } = new URL(request.url);
        const applicationId = searchParams.get('applicationId');

        if (!applicationId) {
            return NextResponse.json(
                { error: "Application ID required" },
                { status: 400 }
            );
        }

        // Verify application belongs to user
        const { data: application, error: appError } = await supabase
            .from("applications")
            .select("id, user_id")
            .eq("id", applicationId)
            .single();

        if (appError || !application) {
            return NextResponse.json(
                { error: "Application not found" },
                { status: 404 }
            );
        }

        if (application.user_id !== userId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 403 }
            );
        }

        // Get all documents for this application
        const { data: documents, error: docsError } = await supabase
            .from("documents")
            .select("*")
            .eq("application_id", applicationId)
            .order("created_at", { ascending: false });

        if (docsError) {
            console.error("Error fetching documents:", docsError);
            return NextResponse.json(
                { error: "Failed to fetch documents" },
                { status: 500 }
            );
        }

        return NextResponse.json({ documents: documents || [] });

    } catch (error) {
        console.error("Documents GET API error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
