"use client";

import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { ArrowRight, Globe, CheckCircle2, GraduationCap, Building2, ShieldCheck, FileCheck } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

export default function Home() {
    const [activeTab, setActiveTab] = useState<'inbound' | 'outbound'>('inbound');

    return (
        <div className="min-h-screen flex flex-col font-sans">
            <Navbar />

            {/* HERO SECTION */}
            <section className="relative pt-32 pb-20 overflow-hidden bg-slate-50">
                <div className="container mx-auto px-6 relative z-10">
                    <div className="text-center max-w-4xl mx-auto mb-16">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <span className="inline-block py-1 px-3 rounded-full bg-slate-100 border border-slate-200 text-slate-600 text-xs font-semibold tracking-wide uppercase mb-6">
                                The Institutional Logistics OS
                            </span>
                            <h1 className="font-serif text-5xl md:text-7xl font-bold text-slate-900 leading-tight mb-6">
                                The Global Clinical <br />
                                <span className="text-slate-500 italic">Mobility Standard.</span>
                            </h1>
                            <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
                                We manage the complex bi-directional flow of medical talent between the Global North and South.
                                Safety, Compliance, and Institutional Access.
                            </p>
                        </motion.div>
                    </div>

                    {/* FORKED INTERFACE */}
                    <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
                        <div className="flex border-b border-slate-100">
                            <button
                                onClick={() => setActiveTab('inbound')}
                                className={`flex-1 py-4 text-center text-sm font-semibold transition-colors ${activeTab === 'inbound' ? 'bg-slate-900 text-white' : 'bg-white text-slate-500 hover:text-slate-900'}`}
                            >
                                Inbound Flow (To India)
                            </button>
                            <button
                                onClick={() => setActiveTab('outbound')}
                                className={`flex-1 py-4 text-center text-sm font-semibold transition-colors ${activeTab === 'outbound' ? 'bg-slate-900 text-white' : 'bg-white text-slate-500 hover:text-slate-900'}`}
                            >
                                Outbound Flow (To US/UK)
                            </button>
                        </div>

                        <div className="p-8 md:p-12 min-h-[400px] flex items-center">
                            {activeTab === 'inbound' ? (
                                <div className="grid md:grid-cols-2 gap-12 items-center w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div className="space-y-6">
                                        <h3 className="text-3xl font-serif font-bold text-slate-900">
                                            Training at Premier Institutes
                                        </h3>
                                        <p className="text-slate-600">
                                            For Western Students & African Surgeons. Access high-volume clinical pathology at JCI-accredited partners.
                                        </p>

                                        <div className="space-y-4 mt-4">
                                            <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                                                <h4 className="font-bold text-slate-800 flex items-center gap-2">
                                                    <Building2 className="w-4 h-4 text-emerald-600" />
                                                    Amrita Hospital, Faridabad
                                                </h4>
                                                <p className="text-xs text-slate-500 mt-1">
                                                    Faridabad, NCR | India&apos;s Largest Private Hospital
                                                </p>
                                                <p className="text-sm text-slate-600 mt-2">
                                                    Home to advanced robotics (da Vinci Xi, Mako). Hands-on observerships in Robotic Surgery and Molecular Medicine.
                                                </p>
                                            </div>

                                            <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                                                <h4 className="font-bold text-slate-800 flex items-center gap-2">
                                                    <Building2 className="w-4 h-4 text-emerald-600" />
                                                    Amrita Hospital, Kochi
                                                </h4>
                                                <p className="text-xs text-slate-500 mt-1">
                                                    Kochi, Kerala | NABH Accredited
                                                </p>
                                                <p className="text-sm text-slate-600 mt-2">
                                                    Center of Excellence in Cardiac Sciences, Oncology, and Neurosciences. State-of-the-art facilities for clinical training.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex gap-3 pt-2">
                                            <Button className="bg-amber-700 hover:bg-amber-800 text-white" asChild>
                                                <a href="/programs?type=inbound">View Fellowships</a>
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="relative h-96 bg-slate-100 rounded-xl overflow-hidden border border-slate-200 shadow-lg">
                                        <Image
                                            src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                                            alt="Ophthalmology Wet Lab"
                                            fill
                                            className="object-cover"
                                        />
                                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                                            <p className="text-white text-sm font-medium">Advanced Medical Facilities</p>
                                            <p className="text-white/70 text-xs">Amrita Hospitals</p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="grid md:grid-cols-2 gap-12 items-center w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div className="space-y-6">
                                        <h3 className="text-3xl font-serif font-bold text-slate-900">
                                            Train at World-Class Institutions
                                        </h3>
                                        <p className="text-slate-600">
                                            For Indian Medical Students from Amrita. Secure clinical rotations at premier teaching hospitals in the US and UK.
                                        </p>

                                        <div className="space-y-4 mt-4">
                                            <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                                                <h4 className="font-bold text-slate-800 flex items-center gap-2">
                                                    <GraduationCap className="w-4 h-4 text-blue-600" />
                                                    Johns Hopkins University
                                                </h4>
                                                <p className="text-xs text-slate-500 mt-1">
                                                    Baltimore, Maryland, USA | #1 Ranked Medical School
                                                </p>
                                                <p className="text-sm text-slate-600 mt-2">
                                                    Clinical rotations in Internal Medicine, Surgery, and Research opportunities. ECFMG-approved observerships.
                                                </p>
                                            </div>

                                            <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                                                <h4 className="font-bold text-slate-800 flex items-center gap-2">
                                                    <GraduationCap className="w-4 h-4 text-blue-600" />
                                                    University of Edinburgh
                                                </h4>
                                                <p className="text-xs text-slate-500 mt-1">
                                                    Edinburgh, Scotland, UK | Russell Group University
                                                </p>
                                                <p className="text-sm text-slate-600 mt-2">
                                                    Elective placements in Cardiology, Neuroscience, and Global Health. GMC-recognized pathways.
                                                </p>
                                            </div>
                                        </div>
                                        <Button className="mt-4 bg-slate-900 hover:bg-slate-800 text-white px-8" asChild>
                                            <a href="/programs?type=outbound">Find Rotations</a>
                                        </Button>
                                    </div>
                                    <div className="relative h-96 bg-slate-100 rounded-xl overflow-hidden border border-slate-200 shadow-lg">
                                        <Image
                                            src="https://images.unsplash.com/photo-1519494026892-80ba456adc66?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                                            alt="US Hospital Campus"
                                            fill
                                            className="object-cover"
                                        />
                                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                                            <p className="text-white text-sm font-medium">World-Class Medical Training</p>
                                            <p className="text-white/70 text-xs">Johns Hopkins & Edinburgh</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* GLOBAL TICKER */}
            <div className="bg-slate-900 text-white py-4 overflow-hidden">
                <div className="container mx-auto px-6 flex justify-between items-center text-sm font-medium opacity-80">
                    <div className="flex gap-2 items-center">
                        <GraduationCap className="w-4 h-4 text-amber-500" />
                        <span>Students Placed: 142</span>
                    </div>
                    <div className="flex gap-2 items-center">
                        <Building2 className="w-4 h-4 text-emerald-500" />
                        <span>Partner Hospitals: 12</span>
                    </div>
                    <div className="flex gap-2 items-center">
                        <Globe className="w-4 h-4 text-blue-500" />
                        <span>Countries: 6</span>
                    </div>
                </div>
            </div>

            {/* VALUE PROPOSITION */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-6">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <h2 className="font-serif text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                            Why GCMS?
                        </h2>
                        <p className="text-slate-600">
                            The only platform built specifically for the complexities of international medical logistics.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <div className="p-8 rounded-xl bg-slate-50 border border-slate-100 hover:shadow-lg transition-all duration-300 group">
                            <div className="w-12 h-12 rounded-lg bg-emerald-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <ShieldCheck className="w-6 h-6 text-emerald-600" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">JCI-Accredited Safety</h3>
                            <p className="text-slate-600 leading-relaxed">
                                We only partner with Joint Commission International accredited institutions, ensuring global standards of patient safety and student supervision.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="p-8 rounded-xl bg-slate-50 border border-slate-100 hover:shadow-lg transition-all duration-300 group">
                            <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <FileCheck className="w-6 h-6 text-blue-600" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Visa &amp; Compliance</h3>
                            <p className="text-slate-600 leading-relaxed">
                                Automated workflows for B1/B2, J-1, and UK Standard Visitor visas. We generate verified invitation letters directly from host institutions.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="p-8 rounded-xl bg-slate-50 border border-slate-100 hover:shadow-lg transition-all duration-300 group">
                            <div className="w-12 h-12 rounded-lg bg-amber-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Building2 className="w-6 h-6 text-amber-600" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Institutional Access</h3>
                            <p className="text-slate-600 leading-relaxed">
                                No middle-men. Our platform connects you directly with the Medical Education departments of top teaching hospitals.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
