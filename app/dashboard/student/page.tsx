import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { ApplicationTracker } from "@/components/widgets/application-tracker";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, MessagesSquare, FileText, Home } from "lucide-react";

export default function StudentDashboard() {
    // Mock profile completion (replace with real data in production)
    const profileCompletion: number = 75;

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            <Navbar />

            <main className="container mx-auto px-6 pt-24 pb-12">
                <div className="mb-8 flex justify-between items-end">
                    <div>
                        <h1 className="font-serif text-3xl font-bold text-slate-900">Welcome, Dr. Sarah</h1>
                        <p className="text-slate-500 text-sm mt-1">Student ID: GCMS-8821 | Status: <span className="text-emerald-600 font-medium">On Track</span></p>
                    </div>
                    <div className="flex gap-2 items-center">
                        {/* Profile Completion Badge */}
                        <div className="text-right mr-4">
                            <p className="text-xs text-slate-500 mb-1">Profile Completion</p>
                            <div className="flex items-center gap-2">
                                <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full ${profileCompletion === 100 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                                        style={{ width: `${profileCompletion}%` }}
                                    />
                                </div>
                                <span className="text-sm font-semibold text-slate-700">{profileCompletion}%</span>
                            </div>
                        </div>
                        <Link href="/onboarding">
                            <Button variant="outline">Edit Profile</Button>
                        </Link>
                        <Button className="bg-slate-900 text-white">Contact Support</Button>
                    </div>
                </div>

                {/* WIDGET GRID */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    {/* WIDGET 1: APPLICATION TRACKER (Wide) */}
                    <Card className="md:col-span-3 border-t-4 border-t-amber-500 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-lg flex justify-between items-center">
                                <span>Application Status</span>
                                <Badge variant="outline">Fellowship: In Progress</Badge>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ApplicationTracker />
                        </CardContent>
                    </Card>

                    {/* WIDGET 2: DIGITAL LOGBOOK */}
                    <Card className="shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <FileText className="w-5 h-5 text-slate-400" />
                                Digital Logbook
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-center py-8">
                                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <MapPin className="w-6 h-6 text-slate-400" />
                                </div>
                                <p className="text-sm text-slate-500 mb-4">
                                    You are not currently checked in at a hospital facility.
                                </p>
                                <Button disabled className="w-full">Check In to Log Case</Button>
                                <p className="text-xs text-slate-400 mt-2">Geo-fencing active (requires &lt; 500m proximity)</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* WIDGET 3: HOUSING */}
                    <Card className="shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Home className="w-5 h-5 text-slate-400" />
                                Assigned Housing
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="bg-slate-100 rounded-lg h-32 w-full mb-4 flex items-center justify-center text-slate-400 text-xs">
                                Map Embed Placeholder
                            </div>
                            <h4 className="font-semibold text-slate-800">Nizamuddin East, Apt 4B</h4>
                            <p className="text-xs text-slate-500 mb-4">New Delhi, India (2.2km from Hospital)</p>
                            <div className="flex justify-between items-center text-xs text-slate-600 bg-white p-2 rounded border border-slate-100">
                                <span>Check-in: <b>June 1</b></span>
                                <span>Key Code: <b>PENDING</b></span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* WIDGET 4: CONCIERGE CHAT */}
                    <Card className="shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <MessagesSquare className="w-5 h-5 text-slate-400" />
                                Concierge
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex gap-3 items-start">
                                    <div className="w-8 h-8 rounded-full bg-slate-200 flex-shrink-0" />
                                    <div className="bg-slate-100 rounded-lg rounded-tl-none p-3 text-xs text-slate-700">
                                        Hi Dr. Sarah, your visa letter has been uploaded. Let me know if you need help with the flight bookings!
                                    </div>
                                </div>
                                <div className="flex gap-3 items-start flex-row-reverse">
                                    <div className="w-8 h-8 rounded-full bg-amber-100 flex-shrink-0" />
                                    <div className="bg-amber-50 border border-amber-100 rounded-lg rounded-tr-none p-3 text-xs text-amber-900">
                                        Thanks! I will book it this weekend.
                                    </div>
                                </div>
                                <div className="pt-2">
                                    <input
                                        type="text"
                                        placeholder="Message your City Manager..."
                                        className="w-full text-xs p-3 rounded-md border border-slate-200 focus:outline-none focus:border-slate-400 transition-colors"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                </div>
            </main>
        </div>
    );
}
