'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface Job {
    _id: string;
    title: string;
    location: string;
    type: string;
    createdAt: string;
}

export default function RecruiterDashboard() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchJobs() {
            try {
                const res = await fetch('/api/jobs');
                const data = await res.json();
                setJobs(data.jobs || []);
            } catch (error) {
                console.error('Fetch jobs error:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchJobs();
    }, []);

    const deleteJob = async (id: string) => {
        if (!confirm('Are you sure you want to delete this job?')) return;
        try {
            const res = await fetch(`/api/jobs/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setJobs(jobs.filter(job => job._id !== id));
            } else {
                alert('Failed to delete job.');
            }
        } catch (error) {
            console.error('Delete error:', error);
            alert('An error occurred.');
        }
    };

    if (loading) return <div className="p-10 text-center">Loading...</div>;

    return (
        <div className="max-w-6xl mx-auto py-10 px-4">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Recruiter Dashboard</h1>
                <div className="space-x-4">
                    <Link href="/recruiter/company">
                        <Button variant="outline">Company Profile</Button>
                    </Link>
                    <Link href="/recruiter/jobs/new">
                        <Button>Post a New Job</Button>
                    </Link>
                </div>
            </div>

            <section>
                <h2 className="text-2xl font-semibold mb-4">Your Job Listings</h2>
                {jobs.length === 0 ? (
                    <Card>
                        <CardContent className="p-10 text-center text-gray-500">
                            No jobs posted yet.
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-6">
                        {jobs.map((job) => (
                            <Card key={job._id}>
                                <CardContent className="p-6 flex justify-between items-center">
                                    <div>
                                        <h3 className="text-xl font-bold text-blue-800">{job.title}</h3>
                                        <p className="text-gray-600">{job.location} &middot; {job.type}</p>
                                        <p className="text-sm text-gray-400 mt-2">Posted on: {new Date(job.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <div className="flex space-x-2">
                                        <Link href={`/recruiter/jobs/${job._id}/applicants`}>
                                            <Button variant="secondary">View Applicants</Button>
                                        </Link>
                                        <Link href={`/recruiter/jobs/${job._id}/edit`}>
                                            <Button variant="outline">Edit</Button>
                                        </Link>
                                        <Button variant="destructive" onClick={() => deleteJob(job._id)}>Delete</Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
