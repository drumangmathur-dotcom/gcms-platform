"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import {
    ArrowLeft,
    CheckCircle2,
    XCircle,
    Clock,
    DollarSign,
    GraduationCap,
    MapPin
} from "lucide-react";
import Link from "next/link";
import { Program } from "@/types/v3-outbound";

export default function ProgramDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [program, setProgram] = useState<Program | null>(null);
    const [hasApplication, setHasApplication] = useState(false);
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);

    useEffect(() => {
        async function loadProgram() {
            try {
                const response = await fetch(`/api/programs/${params.slug}`);
                if (response.ok) {
                    const data = await response.json();
                    setProgram(data.program);
                    setHasApplication(data.hasApplication);
                }
            } catch (error) {
                console.error("Failed to load program:", error);
            } finally {
                setLoading(false);
            }
        }

        loadProgram();
    }, [params.slug]);

    async function handleStartApplication() {
        if (!program) return;

        setCreating(true);
        try {
            const response = await fetch("/api/applications/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ programId: program.id })
            });

            const data = await response.json();

            if (data.success && data.redirect) {
                router.push(data.redirect);
            }
        } catch (error) {
            console.error("Failed to create application:", error);
        } finally {
            setCreating(false);
        }
    }

    if (loading) {
        return (
            <div className="p-8">
                <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-slate-200 rounded w-1/3"></div>
                    <div className="h-96 bg-slate-200 rounded"></div>
                </div>
            </div>
        );
    }

    if (!program) {
        return (
            <div className="p-8">
                <p className="text-slate-600">Program not found.</p>
            </div>
        );
    }

    const isActive = program.status === "active";
    const content = program.content_json;

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <div className="bg-slate-900 text-white py-6">
                <div className="container mx-auto px-6">
                    <Link
                        href="/dashboard/programs"
                        className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 mb-4"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Programs
                    </Link>
                    <div className="flex items-start justify-between">
                        <div>
                            <h1 className="font-serif text-4xl font-bold mb-2">{program.name}</h1>
                            <p className="flex items-center gap-2 text-slate-300">
                                <MapPin className="w-4 h-4" />
                                {program.location}, {program.country}
                            </p>
                        </div>
                        <div className="text-right">
                            {isActive ? (
                                <Badge className="bg-emerald-500 text-white text-lg px-4 py-1">
                                    ACTIVE
                                </Badge>
                            ) : (
                                <Badge variant="secondary" className="text-lg px-4 py-1">
                                    COMING SOON
                                </Badge>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Hero Image Gallery */}
            <div className="container mx-auto px-6 py-8">
                {content.images && content.images.length > 0 && (
                    <div className="grid grid-cols-3 gap-4 mb-8">
                        {content.images.map((image, index) => (
                            <div key={index} className="relative h-64 bg-slate-100 rounded-xl overflow-hidden">
                                <Image
                                    src={image}
                                    alt={`${program.name} - Image ${index + 1}`}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        ))}
                    </div>
                )}

                <div className="grid md:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="md:col-span-2 space-y-6">
                        {/* Description */}
                        <Card>
                            <CardContent className="p-6">
                                <h2 className="font-serif text-2xl font-bold text-slate-900 mb-4">
                                    About This Program
                                </h2>
                                <p className="text-slate-700 leading-relaxed">
                                    {content.description}
                                </p>
                            </CardContent>
                        </Card>

                        {/* Pros */}
                        {content.pros && content.pros.length > 0 && (
                            <Card>
                                <CardContent className="p-6">
                                    <h3 className="font-bold text-lg text-slate-900 mb-4 flex items-center gap-2">
                                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                                        Advantages
                                    </h3>
                                    <ul className="space-y-2">
                                        {content.pros.map((pro, index) => (
                                            <li key={index} className="flex items-start gap-2">
                                                <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                                                <span className="text-slate-700">{pro}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                        )}

                        {/* Cons */}
                        {content.cons && content.cons.length > 0 && (
                            <Card>
                                <CardContent className="p-6">
                                    <h3 className="font-bold text-lg text-slate-900 mb-4 flex items-center gap-2">
                                        <XCircle className="w-5 h-5 text-amber-600" />
                                        Considerations
                                    </h3>
                                    <ul className="space-y-2">
                                        {content.cons.map((con, index) => (
                                            <li key={index} className="flex items-start gap-2">
                                                <XCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                                                <span className="text-slate-700">{con}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Application Card */}
                        <Card className="sticky top-6 border-2 border-slate-200">
                            <CardContent className="p-6">
                                <div className="space-y-4">
                                    <div className="border-b pb-4">
                                        <h3 className="font-bold text-slate-900 mb-3">Program Details</h3>

                                        <div className="space-y-3">
                                            <div className="flex items-center gap-2 text-slate-700">
                                                <Clock className="w-4 h-4 text-slate-500" />
                                                <span className="text-sm"><span className="font-semibold">Duration:</span> {content.duration}</span>
                                            </div>

                                            <div className="flex items-center gap-2 text-slate-700">
                                                <MapPin className="w-4 h-4 text-slate-500" />
                                                <span className="text-sm"><span className="font-semibold">Location:</span> {program.location}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {content.departments && content.departments.length > 0 && (
                                        <div className="border-b pb-4">
                                            <p className="text-sm font-semibold text-slate-700 mb-2">
                                                Available Departments:
                                            </p>
                                            <div className="flex flex-wrap gap-2">
                                                {content.departments.map((dept, index) => (
                                                    <Badge key={index} variant="secondary" className="text-xs">
                                                        {dept}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {hasApplication ? (
                                        <Button className="w-full" asChild>
                                            <Link href="/dashboard/application">
                                                View Your Application
                                            </Link>
                                        </Button>
                                    ) : isActive ? (
                                        <Button
                                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                                            onClick={handleStartApplication}
                                            disabled={creating}
                                        >
                                            {creating ? "Creating Application..." : "Start Application"}
                                        </Button>
                                    ) : (
                                        <Button className="w-full" variant="secondary" disabled>
                                            Join Waitlist (Coming Soon)
                                        </Button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Housing Info */}
                        {content.housing && (
                            <Card>
                                <CardContent className="p-6">
                                    <h3 className="font-bold text-slate-900 mb-2">Housing</h3>
                                    <p className="text-sm text-slate-600">{content.housing}</p>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
