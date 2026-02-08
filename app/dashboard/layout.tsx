"use client";

import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import {
    Home,
    FileText,
    FolderOpen,
    BookOpen,
    Settings,
    GraduationCap
} from "lucide-react";

interface DashboardLayoutProps {
    children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    const { isLoaded, isSignedIn } = useUser();

    // Force authentication
    if (isLoaded && !isSignedIn) {
        redirect("/sign-in");
    }

    if (!isLoaded) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto"></div>
                    <p className="mt-4 text-slate-400">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 text-white flex flex-col">
                {/* Logo */}
                <div className="p-6 border-b border-slate-800">
                    <Link href="/dashboard" className="flex items-center gap-2">
                        <GraduationCap className="w-8 h-8 text-amber-500" />
                        <div>
                            <h1 className="font-serif text-xl font-bold">GCMS</h1>
                            <p className="text-xs text-slate-400">Mission Control</p>
                        </div>
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-2">
                    <NavLink href="/dashboard" icon={<Home className="w-5 h-5" />}>
                        Home
                    </NavLink>
                    <NavLink href="/dashboard/application" icon={<FileText className="w-5 h-5" />}>
                        My Application
                    </NavLink>
                    <NavLink href="/dashboard/documents" icon={<FolderOpen className="w-5 h-5" />}>
                        Documents
                    </NavLink>
                    <NavLink href="/dashboard/logbook" icon={<BookOpen className="w-5 h-5" />}>
                        Case Logbook
                    </NavLink>
                    <NavLink href="/dashboard/settings" icon={<Settings className="w-5 h-5" />}>
                        Settings
                    </NavLink>
                </nav>

                {/* User Profile */}
                <div className="p-4 border-t border-slate-800">
                    <div className="flex items-center gap-3">
                        <UserButton
                            afterSignOutUrl="/"
                            appearance={{
                                elements: {
                                    avatarBox: "w-10 h-10"
                                }
                            }}
                        />
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">Student Portal</p>
                            <p className="text-xs text-slate-400">Outbound Track</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                {children}
            </main>
        </div>
    );
}

interface NavLinkProps {
    href: string;
    icon: ReactNode;
    children: ReactNode;
}

function NavLink({ href, icon, children }: NavLinkProps) {
    return (
        <Link
            href={href}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
        >
            {icon}
            <span className="font-medium">{children}</span>
        </Link>
    );
}
