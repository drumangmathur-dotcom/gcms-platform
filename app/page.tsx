"use client";

import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { ArrowRight, CheckCircle2, GraduationCap, Building2, Clock, DollarSign } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";

export default function Home() {
    const [showWaitlistModal, setShowWaitlistModal] = useState(false);
    const [selectedProgram, setSelectedProgram] = useState<string | null>(null);
    const { isSignedIn } = useUser();

    return (
        <div className="min-h-screen flex flex-col font-sans bg-slate-50">
            <Navbar />

            {/* HERO SECTION */}
            <section className="relative pt-32 pb-16 overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
                <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
                <div className="container mx-auto px-6 relative z-10">
                    <div className="text-center max-w-4xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <span className="inline-block py-1 px-3 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold tracking-wide uppercase mb-6">
                                For Indian Medical Students
                            </span>
                            <h1 className="font-serif text-5xl md:text-7xl font-bold text-white leading-tight mb-6">
                                The Global Clinical <br />
                                <span className="text-amber-500 italic">Mobility Standard.</span>
                            </h1>
                            <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed mb-8">
                                Secure clinical rotations at premier US/UK teaching hospitals.
                                Comprehensive visa support, compliance management, and institutional access.
                            </p>
                            <Button
                                size="lg"
                                className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold px-8 py-6 text-lg"
                                asChild
                            >
                                <Link href={isSignedIn ? "/dashboard" : "/sign-in"}>
                                    {isSignedIn ? "Go to Dashboard" : "Student Login / Apply"}
                                    <ArrowRight className="ml-2 w-5 h-5" />
                                </Link>
                            </Button>
                        </motion.div>
                    </div>
                </div>

                {/* University Ticker */}
                <div className="container mx-auto px-6 mt-16">
                    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 backdrop-blur-sm">
                        <p className="text-center text-slate-300 text-sm font-medium">
                            <span className="text-amber-500 font-bold">Partnered with:</span>
                            {" "}University of Wisconsin (Active)
                            {" | "} Johns Hopkins (Coming Soon)
                            {" | "} University of Edinburgh (Coming Soon)
                        </p>
                    </div>
                </div>
            </section>

            {/* PROGRAM INVENTORY GRID */}
            <section className="py-20 bg-slate-50">
                <div className="container mx-auto px-6">
                    <div className="text-center max-w-2xl mx-auto mb-12">
                        <h2 className="font-serif text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                            Available Programs
                        </h2>
                        <p className="text-slate-600">
                            Choose your clinical rotation destination. Each program includes hands-on training,
                            department chair recommendations, and visa support.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {/* Wisconsin - ACTIVE */}
                        <Card className="border-2 border-emerald-500 bg-white hover:shadow-2xl transition-all duration-300 overflow-hidden group">
                            <div className="relative h-48 bg-slate-100">
                                <Image
                                    src="https://images.unsplash.com/photo-1551601651-2a8555f1a136?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                                    alt="University of Wisconsin Madison Campus"
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute top-4 right-4">
                                    <span className="inline-block px-3 py-1 bg-emerald-500 text-white text-xs font-bold rounded-full">
                                        ACTIVE - Apply Now
                                    </span>
                                </div>
                            </div>
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <h3 className="font-bold text-xl text-slate-900">
                                            University of Wisconsin
                                        </h3>
                                        <p className="text-sm text-slate-500">Madison, Wisconsin, USA</p>
                                    </div>
                                    <GraduationCap className="w-6 h-6 text-emerald-600" />
                                </div>

                                <p className="text-slate-600 text-sm mb-4 line-clamp-3">
                                    Premier public research university. Rotations in Ophthalmology, Internal Medicine,
                                    and Surgery with department chair-signed LORs.
                                </p>

                                <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
                                    <div className="flex items-center gap-1">
                                        <Clock className="w-4 h-4" />
                                        <span>4 weeks</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-emerald-600 font-bold">
                                        <DollarSign className="w-4 h-4" />
                                        <span>$3,000</span>
                                    </div>
                                </div>

                                <Button
                                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                                    asChild
                                >
                                    <Link href={isSignedIn ? "/dashboard/programs/wisconsin" : "/sign-in"}>
                                        Start Application
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Hopkins - WAITLIST */}
                        <Card className="border-2 border-slate-200 bg-white hover:shadow-xl transition-all duration-300 overflow-hidden grayscale hover:grayscale-0 group">
                            <div className="relative h-48 bg-slate-100">
                                <Image
                                    src="https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                                    alt="Johns Hopkins Hospital"
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute top-4 right-4">
                                    <span className="inline-block px-3 py-1 bg-slate-500 text-white text-xs font-bold rounded-full">
                                        COMING SOON
                                    </span>
                                </div>
                            </div>
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <h3 className="font-bold text-xl text-slate-900">
                                            Johns Hopkins University
                                        </h3>
                                        <p className="text-sm text-slate-500">Baltimore, Maryland, USA</p>
                                    </div>
                                    <GraduationCap className="w-6 h-6 text-slate-400" />
                                </div>

                                <p className="text-slate-600 text-sm mb-4 line-clamp-3">
                                    #1 ranked hospital in the United States. Unparalleled exposure to world-class
                                    medicine in Oncology, Cardiology, and Neurosurgery.
                                </p>

                                <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
                                    <div className="flex items-center gap-1">
                                        <Clock className="w-4 h-4" />
                                        <span>4 weeks</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <GraduationCap className="w-4 h-4" />
                                        <span>6 Departments</span>
                                    </div>
                                </div>

                                <Button
                                    className="w-full bg-slate-600 hover:bg-slate-700 text-white font-bold"
                                    onClick={() => {
                                        setSelectedProgram('hopkins');
                                        setShowWaitlistModal(true);
                                    }}
                                >
                                    Join Priority Waitlist
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Edinburgh - WAITLIST */}
                        <Card className="border-2 border-slate-200 bg-white hover:shadow-xl transition-all duration-300 overflow-hidden grayscale hover:grayscale-0 group">
                            <div className="relative h-48 bg-slate-100">
                                <Image
                                    src="https://images.unsplash.com/photo-1555604421-68c7e5e7be51?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                                    alt="University of Edinburgh"
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute top-4 right-4">
                                    <span className="inline-block px-3 py-1 bg-slate-500 text-white text-xs font-bold rounded-full">
                                        COMING SOON
                                    </span>
                                </div>
                            </div>
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <h3 className="font-bold text-xl text-slate-900">
                                            University of Edinburgh
                                        </h3>
                                        <p className="text-sm text-slate-500">Edinburgh, Scotland, UK</p>
                                    </div>
                                    <GraduationCap className="w-6 h-6 text-slate-400" />
                                </div>

                                <p className="text-slate-600 text-sm mb-4 line-clamp-3">
                                    Historic prestige in the NHS system. Exposure to General Medicine, Surgery,
                                    and Public Health with GMC-recognized pathways.
                                </p>

                                <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
                                    <div className="flex items-center gap-1">
                                        <Clock className="w-4 h-4" />
                                        <span>4 weeks</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <GraduationCap className="w-4 h-4" />
                                        <span>6 Departments</span>
                                    </div>
                                </div>

                                <Button
                                    className="w-full bg-slate-600 hover:bg-slate-700 text-white font-bold"
                                    onClick={() => {
                                        setSelectedProgram('edinburgh');
                                        setShowWaitlistModal(true);
                                    }}
                                >
                                    Join Priority Waitlist
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* VALUE PROPOSITION */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-6">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <h2 className="font-serif text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                            Why GCMS Outbound?
                        </h2>
                        <p className="text-slate-600">
                            End-to-end support from application to arrival. We handle the complexity so you can focus on clinical excellence.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="p-8 rounded-xl bg-slate-50 border border-slate-100">
                            <div className="w-12 h-12 rounded-lg bg-emerald-100 flex items-center justify-center mb-6">
                                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Gated Progress Tracking</h3>
                            <p className="text-slate-600 leading-relaxed">
                                Step-by-step guidance through Eligibility, Payment, Compliance, and Visa stages.
                                Each gate unlocks only when previous requirements are verified.
                            </p>
                        </div>

                        <div className="p-8 rounded-xl bg-slate-50 border border-slate-100">
                            <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-6">
                                <Building2 className="w-6 h-6 text-blue-600" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Direct Institutional Access</h3>
                            <p className="text-slate-600 leading-relaxed">
                                No middlemen. Direct partnerships with Medical Education departments at top teaching hospitals.
                                Department chair-signed letters of recommendation.
                            </p>
                        </div>

                        <div className="p-8 rounded-xl bg-slate-50 border border-slate-100">
                            <div className="w-12 h-12 rounded-lg bg-amber-100 flex items-center justify-center mb-6">
                                <GraduationCap className="w-6 h-6 text-amber-600" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Visa & Compliance Support</h3>
                            <p className="text-slate-600 leading-relaxed">
                                Automated B1/B2 and J-1 visa workflows. AAMC immunization compliance.
                                Verified invitation letters from host institutions.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Waitlist Modal */}
            {showWaitlistModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-md w-full p-8">
                        <h3 className="text-2xl font-bold text-slate-900 mb-4">Join Priority Waitlist</h3>
                        <p className="text-slate-600 mb-6">
                            Be the first to know when {selectedProgram === 'hopkins' ? 'Johns Hopkins' : 'University of Edinburgh'} rotations become available.
                        </p>
                        <form className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                                <input
                                    type="email"
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                    placeholder="your.email@example.com"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                    placeholder="Your full name"
                                />
                            </div>
                            <div className="flex gap-3 pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="flex-1"
                                    onClick={() => setShowWaitlistModal(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    className="flex-1 bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold"
                                >
                                    Join Waitlist
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
}
