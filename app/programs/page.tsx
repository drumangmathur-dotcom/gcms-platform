"use client";

import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Calendar, MapPin, Building2, Search, Filter } from "lucide-react";
import { useState } from "react";

// Mock Data
const PROGRAMS = [
    {
        id: 1,
        title: "Glaucoma Training Fellowship",
        hospital: "Dr. Shroff Charity Eye Hospital",
        city: "New Delhi",
        duration: "12 Weeks",
        price: 2500,
        type: "Fellowship",
        features: ["Manual SICS Training", "Glaucoma Diagnostics", "Housing Included"],
        image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    {
        id: 2,
        title: "Robotic Surgery Observership (da Vinci Xi)",
        hospital: "Amrita Hospital",
        city: "Faridabad",
        duration: "4 Weeks",
        price: 1800,
        type: "Observership",
        features: ["Robotic Console Access", "Multi-disciplinary Rounds", "Campus Housing"],
        image: "https://images.unsplash.com/photo-1551076805-e1869033e561?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    {
        id: 3,
        title: "Clinical Elective: Trauma Surgery",
        hospital: "University of Wisconsin System",
        city: "Madison, USA",
        duration: "8 Weeks",
        price: 4500,
        type: "Hands-on",
        features: ["Level 1 Trauma Center", "ACGME Accredited", "LOR Guaranteed"],
        image: "https://images.unsplash.com/photo-1519494026892-80ba456adc66?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    }
];

export default function ProgramsPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [filterType, setFilterType] = useState("All");

    const filteredPrograms = PROGRAMS.filter(program => {
        const matchesSearch = program.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            program.hospital.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterType === "All" || program.type === filterType;
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            <Navbar />

            <div className="pt-24 pb-12 container mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-end mb-8">
                    <div>
                        <h1 className="font-serif text-4xl font-bold text-slate-900 mb-2">Clinical Fellowships</h1>
                        <p className="text-slate-500 max-w-xl">
                            Curated opportunities at JCI-accredited institutions. Filter by specialty, location, or duration.
                        </p>
                    </div>
                    <div className="flex gap-2 mt-4 md:mt-0">
                        <div className="flex bg-white border border-slate-200 rounded-md overflow-hidden">
                            {["All", "Fellowship", "Observership", "Hands-on"].map((type) => (
                                <button
                                    key={type}
                                    onClick={() => setFilterType(type)}
                                    className={`px-4 py-2 text-sm transition-colors ${filterType === type
                                        ? "bg-slate-900 text-white"
                                        : "text-slate-600 hover:bg-slate-50"
                                        }`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search programs..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-md focus:outline-none focus:border-slate-400 w-64"
                            />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPrograms.length > 0 ? (
                        filteredPrograms.map((program) => (
                            <Card key={program.id} className="group hover:shadow-lg transition-all duration-300 border-slate-200 overflow-hidden">
                                <div className="h-48 w-full relative">
                                    <Image
                                        src={program.image}
                                        alt={program.title}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <div className="absolute top-4 left-4 z-10">
                                        <Badge className="bg-white/90 text-slate-900 hover:bg-white backdrop-blur-sm">
                                            {program.type}
                                        </Badge>
                                    </div>
                                </div>
                                <CardHeader className="pb-2">
                                    <div className="flex justify-between items-start">
                                        <div className="text-xs font-semibold text-emerald-600 mb-1 flex items-center gap-1">
                                            <Building2 className="w-3 h-3" />
                                            {program.hospital}
                                        </div>
                                        <div className="text-xs text-slate-400 flex items-center gap-1">
                                            <MapPin className="w-3 h-3" />
                                            {program.city}
                                        </div>
                                    </div>
                                    <CardTitle className="text-xl font-serif leading-tight">
                                        {program.title}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex gap-4 text-sm text-slate-500 mb-4 border-b border-slate-100 pb-4">
                                        <div className="flex items-center gap-1">
                                            <Calendar className="w-4 h-4" />
                                            {program.duration}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <ShieldCheck className="w-4 h-4 text-amber-500" />
                                            <span className="text-amber-700 font-medium">Verified</span>
                                        </div>
                                    </div>

                                    <div className="space-y-2 mb-6">
                                        {program.features.map((feature, i) => (
                                            <div key={i} className="text-xs text-slate-600 flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                                                {feature}
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex items-center justify-between mt-auto">
                                        <div>
                                            <span className="text-xs text-slate-400 block">Total Tuition</span>
                                            <span className="text-lg font-bold text-slate-900">${program.price.toLocaleString()}</span>
                                        </div>
                                        <Button className="bg-slate-900 text-white group-hover:bg-slate-800" asChild>
                                            <Link href={`/programs/${program.id}`}>View Details</Link>
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <div className="col-span-3 text-center py-20 text-slate-500">
                            No programs found matching your criteria.
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
}
