"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Clock, DollarSign, GraduationCap, ArrowRight } from "lucide-react";
import { Program, ProgramWithApplicationStatus } from "@/types/v3-outbound";

export default function ProgramsPage() {
    const [programs, setPrograms] = useState<ProgramWithApplicationStatus[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadPrograms() {
            try {
                const response = await fetch("/api/programs");
                if (response.ok) {
                    const data = await response.json();
                    setPrograms(data.programs);
                }
            } catch (error) {
                console.error("Failed to load programs:", error);
            } finally {
                setLoading(false);
            }
        }

        loadPrograms();
    }, []);

    if (loading) {
        return (
            <div className="p-8">
                <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-slate-200 rounded w-1/3"></div>
                    <div className="grid md:grid-cols-3 gap-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-96 bg-slate-200 rounded"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="font-serif text-4xl font-bold text-slate-900 mb-2">
                    Available Programs
                </h1>
                <p className="text-slate-600">
                    Choose your clinical rotation destination. Each program includes comprehensive support
                    from application through arrival.
                </p>
            </div>

            {/* Programs Grid */}
            <div className="grid md:grid-cols-3 gap-6">
                {programs.map((program) => (
                    <ProgramCard key={program.id} program={program} />
                ))}
            </div>
        </div>
    );
}

function ProgramCard({ program }: { program: ProgramWithApplicationStatus }) {
    const isActive = program.status === 'active';
    const hasApplication = program.user_has_application;
    const mainImage = program.content_json.images?.[0] || '';

    return (
        <Card className={`overflow-hidden hover:shadow-xl transition-all duration-300 ${isActive ? 'border-2 border-emerald-500' : 'border-2 border-slate-200 grayscale'
            }`}>
            {/* Image */}
            <div className="relative h-48 bg-slate-100">
                {mainImage && (
                    <Image
                        src={mainImage}
                        alt={program.name}
                        fill
                        className="object-cover"
                    />
                )}
                <div className="absolute top-4 right-4">
                    {isActive ? (
                        <Badge className="bg-emerald-500 text-white">ACTIVE</Badge>
                    ) : (
                        <Badge variant="secondary">COMING SOON</Badge>
                    )}
                </div>
                {hasApplication && (
                    <div className="absolute top-4 left-4">
                        <Badge className="bg-amber-500 text-slate-900">YOUR APPLICATION</Badge>
                    </div>
                )}
            </div>

            <CardHeader>
                <div className="flex items-start justify-between">
                    <div>
                        <CardTitle className="text-xl">{program.name}</CardTitle>
                        <p className="text-sm text-slate-500 mt-1">{program.location}</p>
                    </div>
                    <GraduationCap className={`w-6 h-6 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                {/* Description */}
                <p className="text-slate-600 text-sm line-clamp-3">
                    {program.content_json.description}
                </p>

                {/* Metadata */}
                <div className="flex items-center gap-4 text-sm text-slate-500">
                    <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{program.content_json.duration}</span>
                    </div>
                    <div className={`flex items-center gap-1 font-bold ${isActive ? 'text-emerald-600' : 'text-slate-500'
                        }`}>
                        <DollarSign className="w-4 h-4" />
                        <span>${program.price.toLocaleString()}</span>
                    </div>
                </div>

                {/* Pros Preview */}
                {program.content_json.pros && program.content_json.pros.length > 0 && (
                    <div className="space-y-1">
                        <p className="text-xs font-semibold text-slate-700">Highlights:</p>
                        <ul className="text-xs text-slate-600 space-y-0.5">
                            {program.content_json.pros.slice(0, 2).map((pro, index) => (
                                <li key={index} className="flex items-start gap-1">
                                    <span className="text-emerald-600 mt-0.5">•</span>
                                    <span>{pro}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Action Button */}
                {hasApplication ? (
                    <Button className="w-full bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold" asChild>
                        <Link href="/dashboard/application">
                            View Your Application
                            <ArrowRight className="ml-2 w-4 h-4" />
                        </Link>
                    </Button>
                ) : isActive ? (
                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold" asChild>
                        <Link href={`/dashboard/programs/${program.slug}`}>
                            View Program Details
                            <ArrowRight className="ml-2 w-4 h-4" />
                        </Link>
                    </Button>
                ) : (
                    <Button className="w-full" variant="secondary" disabled>
                        Join Waitlist (Coming Soon)
                    </Button>
                )}
            </CardContent>
        </Card>
    );
}
