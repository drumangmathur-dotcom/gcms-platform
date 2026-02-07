"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building, Users, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

// Mock City Manager Context (In real app, fetch from user profile)
const MANAGER_CITY = "New Delhi";

export default function CityManagerDashboard() {
    const [stats, setStats] = useState({
        totalStudents: 0,
        housingOccupancy: 0,
        pendingArrivals: 0
    });
    const [upcomingArrivals, setUpcomingArrivals] = useState<any[]>([]);
    const [housingUnits, setHousingUnits] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const supabase = createClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
            );

            // 1. Fetch Housing Units in City
            const { data: units } = await supabase
                .from('housing_units')
                .select('*')
                .eq('city', MANAGER_CITY);

            if (units) {
                setHousingUnits(units);
                // Calculate occupancy (simplified, ideally query bookings count)
                setStats(s => ({ ...s, housingOccupancy: Math.floor(Math.random() * 100) })); // Mock occu for now
            }

            // 2. Fetch Incoming Applications (Approved/Paid/Active)
            // Note: We need to filter by city. Since programs don't have city yet, 
            // we'll filter by housing_units.city join if booking exists, 
            // OR we'll assuming a way to link program -> city.
            // For now, let's just fetch ALL relevant status apps and mock filter
            const { data: apps } = await supabase
                .from('applications')
                .select(`
                    id, 
                    status, 
                    travel_start_date,
                    users (full_name, citizenship),
                    programs (title)
                `)
                .in('status', ['paid', 'active'])
                .order('travel_start_date', { ascending: true });

            if (apps) {
                // Filter "mockly" or show all for demo
                setUpcomingArrivals(apps.map((app: any) => ({
                    id: app.id,
                    name: app.users?.full_name,
                    program: app.programs?.title,
                    date: app.travel_start_date,
                    status: app.status
                })));
                setStats(s => ({ ...s, totalStudents: apps.length, pendingArrivals: apps.length }));
            }
        };

        fetchData();
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 py-4 px-6 fixed top-0 w-full z-50 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-serif font-bold">C</div>
                    <span className="font-bold text-slate-800">City Command: {MANAGER_CITY}</span>
                </div>
                <div className="text-sm text-slate-500">
                    Logged in as City Manager
                </div>
            </div>

            <div className="pt-20 pb-12 container mx-auto px-6 max-w-6xl">

                {/* Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Card>
                        <CardContent className="p-6 flex items-center gap-4">
                            <div className="p-3 bg-blue-50 rounded-full text-blue-600">
                                <Users className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-500 font-medium uppercase">Active Students</p>
                                <h3 className="text-2xl font-bold text-slate-900">{stats.totalStudents}</h3>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6 flex items-center gap-4">
                            <div className="p-3 bg-amber-50 rounded-full text-amber-600">
                                <Building className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-500 font-medium uppercase">Housing Occupancy</p>
                                <h3 className="text-2xl font-bold text-slate-900">{stats.housingOccupancy}%</h3>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6 flex items-center gap-4">
                            <div className="p-3 bg-emerald-50 rounded-full text-emerald-600">
                                <Calendar className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-500 font-medium uppercase">Arrivals This Week</p>
                                <h3 className="text-2xl font-bold text-slate-900">{stats.pendingArrivals}</h3>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid md:grid-cols-2 gap-8">

                    {/* Incoming Students */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Incoming Arrivals</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {upcomingArrivals.length === 0 ? (
                                    <p className="text-slate-400 text-sm italic">No upcoming arrivals found.</p>
                                ) : (
                                    upcomingArrivals.map((arrival) => (
                                        <div key={arrival.id} className="flex justify-between items-center p-3 border border-slate-100 rounded-lg hover:bg-slate-50 transition-colors">
                                            <div>
                                                <h4 className="font-semibold text-slate-900 text-sm">{arrival.name}</h4>
                                                <p className="text-xs text-slate-500">{arrival.program}</p>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-xs font-medium text-slate-700">{arrival.date || 'TBD'}</div>
                                                <Badge variant="outline" className="text-[10px] uppercase">{arrival.status}</Badge>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Housing Inventory */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-lg">Housing Inventory</CardTitle>
                            <Button size="sm" variant="outline">Manage Units</Button>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {housingUnits.length === 0 ? (
                                    <p className="text-slate-400 text-sm italic">No housing units found in {MANAGER_CITY}.</p>
                                ) : (
                                    housingUnits.map((unit) => (
                                        <div key={unit.id} className="flex justify-between items-center p-3 border border-slate-100 rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-slate-200 rounded flex items-center justify-center text-slate-400">
                                                    <Building className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-slate-900 text-sm">{unit.name}</h4>
                                                    <p className="text-xs text-slate-500">Cap: {unit.capacity} • ${unit.price_per_month}/mo</p>
                                                </div>
                                            </div>
                                            <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200">Active</Badge>
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>

                </div>
            </div>
        </div>
    );
}
