import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Navbar() {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10">
            <div className="container mx-auto px-6 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-slate-900 rounded-sm flex items-center justify-center">
                        <span className="text-white font-serif font-bold text-lg">G</span>
                    </div>
                    <span className="font-serif font-bold text-lg tracking-tight text-slate-900">
                        GCMS
                    </span>
                </Link>

                {/* Desktop Links */}
                <div className="hidden md:flex items-center gap-8">
                    <Link href="/programs" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
                        All Programs
                    </Link>
                    <Link href="/dashboard/student" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
                        Student Dashboard
                    </Link>
                    <Link href="/dashboard/admin" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
                        Admin View
                    </Link>
                </div>

                {/* Auth Buttons */}
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" className="hidden md:flex" asChild>
                        <Link href="/dashboard/student">Log in</Link>
                    </Button>
                    <Button size="sm" className="bg-slate-900 text-white hover:bg-slate-800" asChild>
                        <Link href="/programs">Apply Now</Link>
                    </Button>
                </div>
            </div>
        </nav>
    )
}
