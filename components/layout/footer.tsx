import { ShieldCheck, Building2, Globe } from "lucide-react"

export function Footer() {
    return (
        <footer className="bg-slate-950 text-slate-400 py-12 border-t border-slate-800">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                    <div>
                        <span className="font-serif font-bold text-xl text-slate-100 block mb-4">GCMS</span>
                        <p className="text-sm leading-relaxed">
                            The Global Clinical Mobility Standard is the institutional logistics operating system for the next generation of medical talent.
                        </p>
                    </div>

                    <div>
                        <h4 className="text-slate-100 font-semibold mb-4">Platform</h4>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="hover:text-white transition-colors">Browse Programs</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Student Dashboard</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Hospital Partners</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-slate-100 font-semibold mb-4">Legal</h4>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Compliance</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-slate-100 font-semibold mb-4">Trust & Safety</h4>
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-2 text-xs">
                                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                                <span>JCI Accredited Facility Access</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs">
                                <Building2 className="w-4 h-4 text-amber-500" />
                                <span>Official Hospital Partner</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs">
                                <Globe className="w-4 h-4 text-blue-500" />
                                <span>NMC Regulatory Compliant</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs">
                    <p>&copy; 2024 Global Clinical Mobility Standard. All rights reserved.</p>
                    <p>Designed for Clinical Excellence.</p>
                </div>
            </div>
        </footer>
    )
}
