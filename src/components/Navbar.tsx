"use client";
import Link from "next/link";
import { useState } from "react";
import {
    SignedIn,
    SignedOut,
    UserButton,
    SignOutButton,
} from "@clerk/nextjs";
import { ModeToggle } from "./mode-toggle";

export default function Navbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <nav className="bg-white dark:bg-gray-900 border-b shadow-md fixed top-0 left-0 right-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    {/* Logo / Brand */}
                    <Link href="/" className="text-2xl font-bold text-blue-700 dark:text-blue-400">
                        Job Board
                    </Link>

                    {/* Desktop Menu Links */}
                    <div className="hidden md:flex space-x-6 items-center">
                        <Link href="/dashboard" className="text-gray-700 dark:text-gray-300 hover:text-blue-700 dark:hover:text-blue-400 font-semibold">
                            Dashboard
                        </Link>
                        <Link href="/jobs" className="text-gray-700 dark:text-gray-300 hover:text-blue-700 dark:hover:text-blue-400 font-semibold">
                            Browse Jobs
                        </Link>
                        <Link href="/applications" className="text-gray-700 dark:text-gray-300 hover:text-blue-700 dark:hover:text-blue-400 font-semibold">
                            Applications
                        </Link>
                        <Link href="/profile" className="text-gray-700 dark:text-gray-300 hover:text-blue-700 dark:hover:text-blue-400 font-semibold">
                            Profile
                        </Link>
                        <Link href="/notifications" className="text-gray-700 dark:text-gray-300 hover:text-blue-700 dark:hover:text-blue-400 font-semibold">
                            Notifications
                        </Link>
                        <ModeToggle />
                    </div>

                    {/* Auth Controls */}
                    <div className="flex items-center space-x-4">
                        <SignedOut>
                            <Link href="/sign-in" className="text-blue-700 dark:text-blue-400 font-semibold hover:underline">
                                Login
                            </Link>
                            <Link href="/sign-up" className="bg-blue-700 text-white px-4 py-2 rounded-md font-semibold hover:bg-blue-800">
                                Register
                            </Link>
                        </SignedOut>

                        <SignedIn>
                            <UserButton />
                        </SignedIn>
                    </div>

                    {/* Mobile Hamburger */}
                    <button
                        className="md:hidden p-2 rounded-md text-gray-600 dark:text-gray-300 hover:text-blue-700 focus:outline-none"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {mobileMenuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
                    <Link href="/dashboard" className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-800">
                        Dashboard
                    </Link>
                    <Link href="/jobs" className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-800">
                        Browse Jobs
                    </Link>
                    <Link href="/applications" className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-800">
                        Applications
                    </Link>
                    <Link href="/profile" className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-800">
                        Profile
                    </Link>
                    <Link href="/notifications" className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-800">
                        Notifications
                    </Link>
                    <div className="px-4 py-2">
                        <ModeToggle />
                    </div>
                </div>
            )}
        </nav>
    );
}
