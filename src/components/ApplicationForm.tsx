'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

interface Job {
    id: string;
    title: string;
    company: string;
    location: string;
    description: string;
}

// 👈 Receives jobId as a direct prop from the Server Component wrapper
export default function ApplicationForm({ jobId }: { jobId: string }) {
    const router = useRouter();
    const { user } = useUser();

    const [job, setJob] = useState<Job | null>(null);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        name: user?.firstName || '',
        email: user?.primaryEmailAddress?.emailAddress || '',
        coverLetter: '',
    });

    // 1. Fetch the specific job details using the jobId prop
    useEffect(() => {
        if (!jobId) return;

        async function fetchJobDetails() {
            setLoading(true); // Ensure loading is true on fetch start
            try {
                // 🚨 Your API route must be implemented here: /api/job-details/[jobId]
                const res = await fetch(`/api/job-details/${jobId}`);

                if (!res.ok) {
                    throw new Error('Failed to fetch job details');
                }

                const data = await res.json();

                // Ensure data.job is present as returned by your API Route
                const fetchedJob = data.job;
                if (!fetchedJob) {
                    throw new Error('Job data is missing from API response');
                }

                setJob({
                    id: fetchedJob.id || jobId,
                    title: fetchedJob.title || 'Job Title Not Found',
                    company: fetchedJob.company || 'Unknown Company',
                    location: fetchedJob.location || 'Unknown Location',
                    description: fetchedJob.description || 'No description available',
                });

            } catch (error) {
                console.error("Job detail fetch error:", error);
                alert(`Error loading job details: ${String(error)}`);
                setJob(null);
            } finally {
                setLoading(false);
            }
        }
        fetchJobDetails();
    }, [jobId]); // Re-run only when jobId changes

    // 2. Handle the form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !job) return;

        setIsSubmitting(true);

        const submissionData = {
            userId: user.id,
            jobId: job.id,
            jobTitle: job.title,
            ...formData,
        };

        try {
            // 🚨 Your application submission API route must be implemented here
            const res = await fetch('/api/applications/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(submissionData),
            });

            if (res.ok) {
                alert(`Application for "${job.title}" submitted successfully!`);
                // 3. Redirect to the Applications Listing page
                router.push('/applications');
            } else {
                const errorData = await res.json();
                alert(`Submission failed: ${errorData.message || 'Server error'}`);
            }
        } catch (error) {
            alert(`Network error during submission: ${String(error)}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    if (loading) {
        return <p className="text-center mt-10 text-xl font-medium">Loading job details...</p>;
    }

    if (!job) {
        return <p className="text-center mt-10 text-red-600 text-xl font-medium">Job not found. Check API route implementation.</p>;
    }

    // 4. Render the application form
    return (
        <div className="max-w-4xl mx-auto py-10 px-6">
            <h1 className="text-3xl font-bold mb-2 text-blue-800">Apply for: **{job.title}**</h1>
            <p className="text-xl text-gray-700 mb-6">{job.company} &middot; {job.location}</p>

            {/* ... (Rest of your form JSX) ... */}
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-xl border">
                <div className="mb-4">
                    <label htmlFor="name" className="block text-gray-700 font-semibold mb-2">Full Name</label>
                    <input
                        type="text" id="name" name="name"
                        value={formData.name} onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">Email</label>
                    <input
                        type="email" id="email" name="email"
                        value={formData.email} onChange={handleChange}
                        required readOnly
                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                    />
                </div>

                <div className="mb-6">
                    <label htmlFor="coverLetter" className="block text-gray-700 font-semibold mb-2">Cover Letter</label>
                    <textarea
                        id="coverLetter" name="coverLetter" rows={5}
                        value={formData.coverLetter} onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    ></textarea>
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-3 rounded-md font-bold text-white transition ${
                        isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
                    }`}
                >
                    {isSubmitting ? 'Submitting Application...' : 'Submit Application'}
                </button>
            </form>
        </div>
    );
}