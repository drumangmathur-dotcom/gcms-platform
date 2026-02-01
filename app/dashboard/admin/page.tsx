"use client";

import { Navbar } from "@/components/layout/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, DollarSign, Users, Building, AlertCircle } from "lucide-react";

// Mock Kanban Data
const COLUMNS = [
    { id: 'new', title: 'New Applications', color: 'border-slate-200' },
    { id: 'vetting', title: 'Vetting', color: 'border-blue-200' },
    { id: 'payment', title: 'Payment Pending', color: 'border-amber-200' },
    { id: 'active', title: 'Active / Travel', color: 'border-emerald-200' },
];

const APPLICANTS = [
    { id: 1, name: "Dr. John Smith", program: "Phaco Fellowship", status: 'new', country: "UK" },
    { id: 2, name: "Dr. Sarah Lee", program: "Robotics Observership", status: 'vetting', country: "USA" },
    { id: 3, name: "Dr. Amit Patel", program: "Trauma Rotation", status: 'payment', country: "India" },
    { id: 4, name: "Dr. Kemi Ojo", program: "Phaco Fellowship", status: 'active', country: "Nigeria" },
];

import { useState } from "react";
import { processSplitPayment, SplitPaymentResult } from "@/lib/payments";
import { findHousingMatch } from "@/lib/housing";

export default function AdminDashboard() {
    const [loadingPayment, setLoadingPayment] = useState(false);
    const [paymentResult, setPaymentResult] = useState<SplitPaymentResult | null>(null);
    const [housingResult, setHousingResult] = useState<any | null>(null);

    const runSplitPaymentSim = async () => {
        setLoadingPayment(true);
        const result = await processSplitPayment({
            studentId: "user_123",
            programId: "prog_456",
            facilityFeeShare: 20,
            amountUsd: 2500,
            hospitalStripeId: "acct_hospital_details"
        });
        setPaymentResult(result);
        setLoadingPayment(false);
    };

    const runHousingSim = () => {
        const result = findHousingMatch("New Delhi", new Date("2024-06-01"), new Date("2024-06-30"));
        setHousingResult(result);
    };
    return (
        <div className="min-h-screen bg-slate-100 font-sans">
            <div className="bg-slate-900 text-white py-4 px-6 flex justify-between items-center fixed top-0 w-full z-50">
                <span className="font-serif font-bold text-lg">GCMS Admin Command</span>
                <div className="flex gap-4 text-sm opacity-80">
                    <span>Overview</span>
                    <span>Applications</span>
                    <span>Financials</span>
                    <span>Settings</span>
                </div>
            </div>

            <div className="pt-20 pb-12 container mx-auto px-6">

                <Tabs defaultValue="dashboard" className="w-full">
                    <TabsList className="mb-8">
                        <TabsTrigger value="dashboard">Dashboard Overview</TabsTrigger>
                        <TabsTrigger value="simulations">System Simulations</TabsTrigger>
                    </TabsList>

                    <TabsContent value="dashboard">
                        {/* FINANCIAL PULSE */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                            <Card>
                                <CardContent className="p-6">
                                    <div className="flex justify-between items-start mb-2">
                                        <p className="text-xs font-medium text-slate-500 uppercase">Gross Revenue (MTD)</p>
                                        <DollarSign className="w-4 h-4 text-slate-400" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-900">$42,500</h3>
                                    <p className="text-xs text-emerald-600 mt-1">+12% from last month</p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="p-6">
                                    <div className="flex justify-between items-start mb-2">
                                        <p className="text-xs font-medium text-slate-500 uppercase">Active Students</p>
                                        <Users className="w-4 h-4 text-slate-400" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-900">24</h3>
                                    <p className="text-xs text-slate-500 mt-1">Across 3 Cities</p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="p-6">
                                    <div className="flex justify-between items-start mb-2">
                                        <p className="text-xs font-medium text-slate-500 uppercase">Housing Occu.</p>
                                        <Building className="w-4 h-4 text-slate-400" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-900">85%</h3>
                                    <p className="text-xs text-amber-600 mt-1">2 Units Available</p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="p-6">
                                    <div className="flex justify-between items-start mb-2">
                                        <p className="text-xs font-medium text-slate-500 uppercase">Actions Items</p>
                                        <AlertCircle className="w-4 h-4 text-rose-500" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-900">3</h3>
                                    <p className="text-xs text-rose-600 mt-1">Visa Letters Pending</p>
                                </CardContent>
                            </Card>
                        </div>

                        {/* KANBAN BOARD */}
                        <div className="flex gap-6 overflow-x-auto pb-6">
                            {COLUMNS.map((col) => (
                                <div key={col.id} className="min-w-[300px] flex-1">
                                    <div className={`flex items-center justify-between mb-4 pb-2 border-b-2 ${col.color}`}>
                                        <h4 className="font-semibold text-slate-700 text-sm">{col.title}</h4>
                                        <span className="text-xs bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full">
                                            {APPLICANTS.filter(a => a.status === col.id).length}
                                        </span>
                                    </div>

                                    <div className="space-y-3">
                                        {APPLICANTS.filter(a => a.status === col.id).map((applicant) => (
                                            <Card key={applicant.id} className="cursor-pointer hover:shadow-md transition-shadow">
                                                <CardContent className="p-4">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <Badge variant="outline" className="text-[10px]">{applicant.country}</Badge>
                                                        <button className="text-slate-400 hover:text-slate-600">
                                                            <MoreHorizontal className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                    <h5 className="font-semibold text-slate-800 text-sm">{applicant.name}</h5>
                                                    <p className="text-xs text-slate-500 mt-1">{applicant.program}</p>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="simulations">
                        <div className="grid md:grid-cols-2 gap-8">
                            {/* SIMULATION 1: SPLIT PAYMENTS */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <DollarSign className="w-5 h-5 text-emerald-600" />
                                        Split-Payment Engine
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <p className="text-sm text-slate-500">
                                        Simulate a Stripe Connect split transaction between GCMS Platform and a Hospital Partner.
                                    </p>
                                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 space-y-3">
                                        <div className="flex justify-between text-sm">
                                            <span>Student Pays:</span>
                                            <span className="font-bold">$2,500.00</span>
                                        </div>
                                        <div className="flex justify-between text-sm text-slate-500">
                                            <span>Hospital Share (20%):</span>
                                            <span>$500.00</span>
                                        </div>
                                        <div className="flex justify-between text-sm text-emerald-600 font-medium pt-2 border-t border-slate-200">
                                            <span>Platform Revenue (80%):</span>
                                            <span>$2,000.00</span>
                                        </div>
                                    </div>

                                    {paymentResult ? (
                                        <div className="bg-emerald-50 border border-emerald-200 rounded p-3 text-xs text-emerald-800 animate-in fade-in zoom-in duration-300">
                                            <strong>Transaction Success!</strong><br />
                                            Payment Intent: {paymentResult.paymentIntentId}<br />
                                            Transfer ID: {paymentResult.hospitalTransferId}
                                        </div>
                                    ) : (
                                        <Button
                                            className="w-full bg-slate-900 text-white"
                                            onClick={runSplitPaymentSim}
                                            disabled={loadingPayment}
                                        >
                                            {loadingPayment ? "Processing via Stripe..." : "Run Transaction Simulation"}
                                        </Button>
                                    )}
                                </CardContent>
                            </Card>

                            {/* SIMULATION 2: HOUSING ALGORITHM */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Building className="w-5 h-5 text-blue-600" />
                                        Housing Allocation Logic
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <p className="text-sm text-slate-500">
                                        Test the algorithm that matches students to inventory based on city, dates, and capacity.
                                    </p>
                                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 space-y-2">
                                        <div className="text-xs font-semibold uppercase text-slate-400">Input Parameters</div>
                                        <div className="text-sm"><span className="text-slate-500">City:</span> New Delhi</div>
                                        <div className="text-sm"><span className="text-slate-500">Dates:</span> June 1 - June 30</div>
                                        <div className="mt-4 text-xs font-semibold uppercase text-slate-400">Inventory Status</div>
                                        <div className="text-sm font-medium text-amber-600">Unit h1 (Nizamuddin): FULL</div>
                                        <div className="text-sm font-medium text-emerald-600">Unit h2 (Defence Col): AVAILABLE</div>
                                    </div>

                                    {housingResult ? (
                                        <div className="bg-blue-50 border border-blue-200 rounded p-3 text-xs text-blue-800 animate-in fade-in zoom-in duration-300">
                                            <strong>Match Found!</strong><br />
                                            Unit: {housingResult.assignedUnit?.name}<br />
                                            Status: {housingResult.status}
                                        </div>
                                    ) : (
                                        <Button variant="outline" className="w-full" onClick={runHousingSim}>
                                            Run Allocation Algorithm
                                        </Button>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>
                </Tabs>

            </div>
        </div>
    );
}
