'use client';

import { UserButton, useUser, SignedIn, SignedOut, RedirectToSignIn } from "@clerk/nextjs";

export default function DashboardClient() {
    const { user } = useUser();

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
                                Here's your personalized job dashboard
                            </p>
                        </div>
                    </section>

                    {/* Recommended Jobs */}
                    <section className="mb-14">
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
                                    className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                                    role="button"
                                    tabIndex={0}
                                >
                                    <h3 className="text-xl font-semibold text-blue-900 mb-2">{job.title}</h3>
                                    <p className="text-gray-700 font-medium">{job.company}</p>
                                    <p className="text-gray-500 mb-4">{job.location}</p>
                                    <button
                                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                                        // onClick={() => handleApply(job.id)} // Placeholder for apply handler
                                    >
                                        Apply Now
                                    </button>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Applications Status */}
                    <section>
                        <h2 className="mb-6 text-2xl font-semibold text-gray-900 border-b border-gray-200 pb-2">
                            Your Applications
                        </h2>
                        <ul className="divide-y divide-gray-200">
                            {[
                                { job: "Frontend Developer", company: "ABC Corp", status: "In Review", color: "text-green-600" },
                                { job: "Backend Engineer", company: "XYZ Ltd.", status: "Interview Scheduled", color: "text-orange-500" },
                            ].map(({ job, company, status, color }) => (
                                <li key={job} className="py-4 flex justify-between items-center">
                  <span className="text-gray-800 font-medium">
                    {job} at {company}
                  </span>
                                    <span className={`${color} font-semibold`}>{status}</span>
                                </li>
                            ))}
                        </ul>
                    </section>
                </main>
            </SignedIn>
        </>
    );
}
