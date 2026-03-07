'use client';

import { useState, useEffect } from 'react';
import { UserButton, useUser, SignedIn, SignedOut, RedirectToSignIn } from "@clerk/nextjs";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function DashboardClient() {
    const { user } = useUser();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchApplications() {
            try {
                const res = await fetch('/api/applications/my-applications');
                if (res.ok) {
                    const data = await res.json();
                    setApplications(data.applications || []);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
        fetchApplications();
    }, []);

    return (
        <>
            <SignedOut>
                <RedirectToSignIn />
            </SignedOut>

            <SignedIn>
                <main className="max-w-4xl mx-auto py-10 px-6">
                    {/* User Greeting Section */}
                    <section className="flex items-center gap-6 mb-12">
                        <UserButton afterSignOutUrl="/" />
                        <div>
                            <h1 className="text-3xl font-extrabold text-blue-800 leading-tight mb-1">
                                Welcome back, {user?.firstName}!
                            </h1>
                            <p className="text-gray-600 font-medium text-lg">
                                Here&apos;s your personalized job dashboard
                            </p>
                        </div>
                    </section>

                    {/* Applications Status */}
                    <section className="mb-14">
                        <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-2">
                            <h2 className="text-2xl font-semibold text-gray-900">
                                Your Recent Applications
                            </h2>
                            <Link href="/applications">
                                <Button variant="link">View All</Button>
                            </Link>
                        </div>
                        {loading ? (
                            <p>Loading applications...</p>
                        ) : applications.length === 0 ? (
                            <Card>
                                <CardContent className="p-10 text-center text-gray-500">
                                    No applications yet. <Link href="/jobs" className="text-blue-600 hover:underline">Browse jobs</Link>
                                </CardContent>
                            </Card>
                        ) : (
                            <ul className="divide-y divide-gray-200">
                                {applications.slice(0, 5).map((app: any) => (
                                    <li key={app._id} className="py-4 flex justify-between items-center">
                                        <div>
                                            <span className="text-gray-800 font-medium">
                                                {app.isExternal ? app.jobData?.title : app.jobId?.title}
                                            </span>
                                            <p className="text-sm text-gray-500">
                                                {app.isExternal ? app.jobData?.company : app.jobId?.companyId?.name}
                                            </p>
                                        </div>
                                        <span className={`font-semibold ${app.status === 'shortlisted' ? 'text-green-600' : app.status === 'rejected' ? 'text-red-600' : 'text-blue-600'}`}>
                                            {app.status.toUpperCase()}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </section>

                    {/* Recommended Jobs (Static for now, AI integrated in lib/ai.ts) */}
                    <section>
                        <h2 className="mb-6 text-2xl font-semibold text-gray-900 border-b border-gray-200 pb-2">
                            Recommended Jobs
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {[
                                { title: "Frontend Developer", company: "ABC Corp", location: "Remote" },
                                { title: "Backend Engineer", company: "XYZ Ltd.", location: "Bangalore" },
                            ].map((job) => (
                                <div
                                    key={job.title}
                                    className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                                >
                                    <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-400 mb-2">{job.title}</h3>
                                    <p className="text-gray-700 dark:text-gray-300 font-medium">{job.company}</p>
                                    <p className="text-gray-500 mb-4">{job.location}</p>
                                    <Link href="/jobs">
                                        <Button className="w-full bg-blue-600 hover:bg-blue-700">View Jobs</Button>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </section>
                </main>
            </SignedIn>
        </>
    );
}
