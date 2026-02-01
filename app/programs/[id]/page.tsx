"use client";

import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, MapPin, Calendar, Clock, Building2, FileCheck, ShieldCheck, ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { CheckoutButton } from "@/components/widgets/checkout-button";

// Mock Data (Shared source of truth in real app)
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
        image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        description: "A comprehensive hands-on fellowship designed for ophthalmologists seeking advanced training in Glaucoma management and Manual SICS. Validated by the medical board.",
        curriculum: [
            { week: "1-2", focus: "Diagnostics & Evaluation", custom: "Gonioscopy, OCT interpretation, and VF analysis." },
            { week: "3-8", focus: "Surgical Skills (Wet Lab)", custom: "SICS tunnels, Capsulorhexis, and Trabeculectomy basics." },
            { week: "9-12", focus: "OR Rotations", custom: "Assisted surgeries and case management." },
        ]
    },
    {
        id: 2,
        title: "Robotic Surgery Observership",
        hospital: "Amrita Hospital",
        city: "Faridabad",
        duration: "4 Weeks",
        price: 1800,
        type: "Observership",
        features: ["Robotic Console Access", "Multi-disciplinary Rounds", "Campus Housing"],
        image: "https://images.unsplash.com/photo-1551076805-e1869033e561?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        description: "Observe high-volume robotic procedures using the da Vinci Xi system. Ideal for residents and junior consultants looking to understand robotic workflows.",
        curriculum: [
            { week: "1", focus: "System Orientation", custom: "Docking, instrument insertion, and safety protocols." },
            { week: "2-3", focus: "Live Case Observation", custom: "Urology and GI oncology cases." },
            { week: "4", focus: "Simulation Lab", custom: "Basic skills exercises on the simulator." },
        ]
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
        image: "https://images.unsplash.com/photo-1519494026892-80ba456adc66?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        description: "An intense rotation at a Level 1 Trauma Center. Participate in rounds, trauma activations, and operative management of complex injuries.",
        curriculum: [
            { week: "1-2", focus: "Trauma Bay & Resuscitation", custom: "ATLS protocols and primary survey." },
            { week: "3-6", focus: "Operative Management", custom: "Exploratory laparotomy, fracture fixation, and wound care." },
            { week: "7-8", focus: "SICU Rotation", custom: "Critical care management of trauma patients." },
        ]
    }
];

export default function ProgramDetails() {
    const params = useParams();
    const id = Number(params.id);
    const program = PROGRAMS.find(p => p.id === id);

    if (!program) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-slate-900">Program Not Found</h1>
                    <Button asChild className="mt-4" variant="outline"><Link href="/programs">Return to Catalog</Link></Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            <Navbar />

            {/* HERO HERO */}
            <div className="relative h-[50vh] min-h-[400px]">
                <Image
                    src={program.image}
                    alt={program.title}
                    fill
                    className="object-cover brightness-50"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent" />

                <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 text-white">
                    <div className="container mx-auto">
                        <Link href="/programs" className="inline-flex items-center text-slate-300 hover:text-white mb-6 transition-colors font-medium text-sm">
                            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Programs
                        </Link>
                        <Badge className="bg-emerald-600 text-white border-none mb-4 hover:bg-emerald-700">
                            {program.type}
                        </Badge>
                        <h1 className="font-serif text-3xl md:text-5xl font-bold mb-4">{program.title}</h1>
                        <div className="flex flex-wrap gap-6 text-sm md:text-base text-slate-200">
                            <div className="flex items-center gap-2">
                                <Building2 className="w-5 h-5 text-emerald-400" />
                                {program.hospital}
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-emerald-400" />
                                {program.city}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 py-12">
                <div className="grid md:grid-cols-3 gap-12">

                    {/* LEFT COLUMN: DETAILS */}
                    <div className="md:col-span-2 space-y-12">

                        {/* Overview */}
                        <section>
                            <h2 className="font-serif text-2xl font-bold text-slate-900 mb-4">Program Overview</h2>
                            <p className="text-slate-600 leading-relaxed text-lg">
                                {program.description}
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                                {program.features.map((feature, i) => (
                                    <div key={i} className="flex items-center gap-3 p-4 bg-white rounded-lg border border-slate-100 shadow-sm">
                                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                                        <span className="text-sm font-medium text-slate-700">{feature}</span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Curriculum */}
                        <section>
                            <h2 className="font-serif text-2xl font-bold text-slate-900 mb-6">Clinical Curriculum</h2>
                            <div className="space-y-4">
                                {program.curriculum.map((item, i) => (
                                    <div key={i} className="flex gap-6 p-6 bg-white rounded-xl border border-slate-100 hover:border-slate-200 transition-colors">
                                        <div className="shrink-0 w-16 h-16 bg-slate-100 rounded-lg flex flex-col items-center justify-center text-slate-600">
                                            <span className="text-xs font-semibold uppercase">Week</span>
                                            <span className="text-lg font-bold">{item.week}</span>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-900 text-lg mb-1">{item.focus}</h3>
                                            <p className="text-slate-600">{item.custom}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Housing & Logistics */}
                        <section>
                            <h2 className="font-serif text-2xl font-bold text-slate-900 mb-6">Logistics & Housing</h2>
                            <div className="bg-slate-900 text-slate-300 p-8 rounded-2xl relative overflow-hidden">
                                <div className="relative z-10 grid md:grid-cols-2 gap-8">
                                    <div>
                                        <h3 className="text-white font-bold text-lg mb-2 flex items-center gap-2">
                                            <Building2 className="w-5 h-5 text-amber-500" />
                                            Housing Included
                                        </h3>
                                        <p className="text-sm">
                                            fully furnished on-campus housing is provided for the duration of the fellowship. Includes high-speed WiFi and laundry.
                                        </p>
                                    </div>
                                    <div>
                                        <h3 className="text-white font-bold text-lg mb-2 flex items-center gap-2">
                                            <FileCheck className="w-5 h-5 text-blue-500" />
                                            Visa Support
                                        </h3>
                                        <p className="text-sm">
                                            We provide official invitation letters and visa sponsorship documentation for {program.city.includes('USA') ? 'J-1' : 'Medical'} Visas.
                                        </p>
                                    </div>
                                </div>
                                {/* Decorative elements */}
                                <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                                    <ShieldCheck className="w-64 h-64" />
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* RIGHT COLUMN: STICKY SIDEBAR */}
                    <div className="md:col-span-1">
                        <div className="sticky top-24">
                            <Card className="border-slate-200 shadow-xl overflow-hidden">
                                <CardContent className="p-0">
                                    <div className="bg-slate-50 p-6 border-b border-slate-100">
                                        <div className="flex justify-between items-end mb-2">
                                            <div>
                                                <p className="text-sm text-slate-500 font-medium">Total Tuition</p>
                                                <p className="text-3xl font-serif font-bold text-slate-900">${program.price.toLocaleString()}</p>
                                            </div>
                                            <Badge variant="outline" className="bg-white border-slate-200 text-slate-600">
                                                USD
                                            </Badge>
                                        </div>
                                        <p className="text-xs text-slate-500">
                                            Includes tuition, housing, and malpractice insurance.
                                        </p>
                                    </div>

                                    <div className="p-6 space-y-6">
                                        <div className="space-y-4">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-slate-600 flex items-center gap-2">
                                                    <Clock className="w-4 h-4" /> Duration
                                                </span>
                                                <span className="font-semibold text-slate-900">{program.duration}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-slate-600 flex items-center gap-2">
                                                    <Calendar className="w-4 h-4" /> Next Intake
                                                </span>
                                                <span className="font-semibold text-slate-900">July 2024</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-slate-600 flex items-center gap-2">
                                                    <ShieldCheck className="w-4 h-4" /> Certification
                                                </span>
                                                <span className="font-semibold text-slate-900">University Verified</span>
                                            </div>
                                        </div>

                                        <div className="pt-4 border-t border-slate-100">
                                            <CheckoutButton
                                                programId={program.id}
                                                title={program.title}
                                                price={program.price}
                                                country={program.city.includes("India") || program.city.includes("Delhi") || program.city.includes("Faridabad") ? "India" : "USA"}
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100 flex gap-3">
                                <div className="shrink-0">
                                    <ShieldCheck className="w-5 h-5 text-blue-600" />
                                </div>
                                <p className="text-xs text-blue-800 leading-snug">
                                    <strong>Satisfaction Guarantee:</strong> If the clinical volume matches less than 80% of our promise, we refund your placement fee.
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            <Footer />
        </div>
    );
}
