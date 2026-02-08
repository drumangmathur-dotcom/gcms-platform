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
        const {
            applicationId,
            type,
            fileUrl,
            fileName,
            fileSize,
            mimeType
        } = body;

        // Validate required fields
        if (!applicationId || !type || !fileUrl || !fileName) {
            return NextResponse.json(
                { error: "Missing required fields" },
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

        // Check if document already exists (upsert behavior)
        const { data: existingDoc } = await supabase
            .from("documents")
            .select("id")
            .eq("application_id", applicationId)
            .eq("type", type)
            .single();

        if (existingDoc) {
            // Update existing document
            const { data: updatedDoc, error: updateError } = await supabase
                .from("documents")
                .update({
                    file_url: fileUrl,
                    file_name: fileName,
                    file_size: fileSize,
                    mime_type: mimeType,
                    verified: false,
                    verification_status: 'pending',
                    admin_notes: null,
                    verified_by: null,
                    verified_at: null
                })
                .eq("id", existingDoc.id)
                .select()
                .single();

            if (updateError) {
                console.error("Error updating document:", updateError);
                return NextResponse.json(
                    { error: "Failed to update document" },
                    { status: 500 }
                );
            }

            return NextResponse.json({
                success: true,
                document: updatedDoc,
                message: "Document updated successfully"
            });
        }

        // Insert new document
        const { data: newDoc, error: insertError } = await supabase
            .from("documents")
            .insert({
                application_id: applicationId,
                type,
                file_url: fileUrl,
                file_name: fileName,
                file_size: fileSize,
                mime_type: mimeType,
                verified: false,
                verification_status: 'pending'
            })
            .select()
            .single();

        if (insertError) {
            console.error("Error inserting document:", insertError);
            return NextResponse.json(
                { error: "Failed to save document" },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            document: newDoc,
            message: "Document uploaded successfully"
        });

    } catch (error) {
        console.error("Document upload API error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
