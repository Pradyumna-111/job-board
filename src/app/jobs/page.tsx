'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation'; // 👈 New Import

interface Job {
    id: string;
    title: string;
    company: string;
    location: string;
    description: string;
}

export default function JobsPage() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    // 🗑️ Removed: applyingJobId state
    const { user } = useUser();
    const router = useRouter(); // 👈 Initialized Router

    useEffect(() => {
        async function fetchJobs() {
            try {
                // ... (Your existing job fetching logic from /api/jobs) ...
                const res = await fetch('/api/jobs');
                if (!res.ok) {
                    throw new Error('Failed to fetch jobs');
                }
                const data = await res.json();
                const jobsWithIds = (data.jobs || []).map((job: any, index: number) => ({
                    id: job.id || job.job_id || `job-${index}`,
                    title: job.title || job.job_title || 'No Title',
                    company: job.company || job.company_name || 'Unknown Company',
                    location: job.location || job.job_location || 'Unknown Location',
                    description: job.description || job.job_description || 'No description available',
                }));
                setJobs(jobsWithIds);
            } catch (error) {
                alert(String(error));
                setJobs([]);
            }
            setLoading(false);
        }
        fetchJobs();
    }, []);

    // 🎯 New Handler: Redirects user to the application form
    const redirectToApplication = (job: Job) => {
        if (!user) {
            alert('Please log in to apply.');
            return;
        }
        // Redirects to the new application form path
        router.push(`/applications/apply/${job.id}`);
    };

    if (loading) return <p className="text-center mt-10">Loading jobs...</p>;

    return (
        <div className="max-w-6xl mx-auto py-10 px-6 grid grid-cols-1 md:grid-cols-2 gap-8">
            {jobs.map((job) => (
                <div key={job.id} className="border rounded-lg shadow-md p-6 flex flex-col justify-between bg-white">
                    <div>
                        <h3 className="text-2xl font-semibold mb-1 text-blue-800">{job.title}</h3>
                        <p className="text-gray-700 font-medium">{job.company} &middot; {job.location}</p>
                        <p className="mt-3 text-gray-600 text-sm whitespace-pre-line line-clamp-4">
                            {job.description}
                        </p>
                    </div>
                    <button
                        // 👈 Using the new redirection handler
                        onClick={() => redirectToApplication(job)}
                        className={`mt-6 w-full py-2 rounded-md font-semibold text-white bg-blue-600 hover:bg-blue-700 transition`}
                    >
                        Apply Now
                    </button>
                </div>
            ))}
        </div>
    );
}