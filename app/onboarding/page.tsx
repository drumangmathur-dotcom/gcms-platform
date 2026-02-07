"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { StudentProfileForm } from "@/components/forms/student-profile-form";
import { StudentProfileInsert } from "@/types/database";

export default function OnboardingPage() {
    const router = useRouter();
    const { user, isLoaded } = useUser();
    const [initialData, setInitialData] = useState<Partial<StudentProfileInsert> | undefined>();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function loadProfile() {
            if (!isLoaded) return;

            if (!user) {
                router.push('/sign-in');
                return;
            }

            try {
                const response = await fetch('/api/profile');
                if (response.ok) {
                    const data = await response.json();
                    if (data.profile) {
                        setInitialData(data.profile);
                    }
                }
            } catch (error) {
                console.error('Failed to load profile:', error);
            } finally {
                setIsLoading(false);
            }
        }
        loadProfile();
    }, [user, isLoaded, router]);

    const handleSubmit = async (data: StudentProfileInsert) => {
        try {
            const response = await fetch('/api/profile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                router.push('/dashboard/student');
            } else {
                alert('Error saving profile. Please try again.');
            }
        } catch (error) {
            console.error('Error submitting profile:', error);
            alert('Network error. Please try again.');
        }
    };

    if (!isLoaded || isLoading) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
                    <p className="mt-4 text-slate-400">Loading your profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-900">
            <div className="container mx-auto">
                <div className="pt-8 pb-4 text-center">
                    <h1 className="text-4xl font-playfair text-amber-500 mb-2">
                        Complete Your Profile
                    </h1>
                    <p className="text-slate-400">
                        Help us match you with the perfect clinical opportunities
                    </p>
                </div>

                <StudentProfileForm
                    initialData={initialData}
                    onSubmit={handleSubmit}
                />
            </div>
        </div>
    );
}
