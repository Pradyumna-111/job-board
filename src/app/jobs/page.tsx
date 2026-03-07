'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Job {
    id: string;
    title: string;
    company: string;
    location: string;
    description: string;
    isExternal?: boolean;
}

export default function JobsPage() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');

    const { user } = useUser();
    const router = useRouter();

    useEffect(() => {
        async function fetchJobs() {
            try {
                const res = await fetch('/api/jobs');
                if (!res.ok) throw new Error('Failed to fetch jobs');
                const data = await res.json();
                setJobs(data.jobs || []);
                setFilteredJobs(data.jobs || []);
            } catch (error) {
                console.error(error);
                setJobs([]);
                setFilteredJobs([]);
            }
            setLoading(false);
        }
        fetchJobs();
    }, []);

    useEffect(() => {
        let results = jobs.filter(job =>
            job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.location.toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (filterType !== 'all') {
            // Since external jobs might not have the 'type' field consistently,
            // we'll filter based on internal jobs having it or skip for external.
            // For a better implementation, we'd need more consistent data.
            results = results.filter(job => job.isExternal || (job as any).type === filterType);
        }

        setFilteredJobs(results);
    }, [searchTerm, filterType, jobs]);

    const redirectToApplication = (job: Job) => {
        if (!user) {
            alert('Please log in to apply.');
            return;
        }
        router.push(`/applications/apply/${job.id}${job.isExternal ? '?external=true' : ''}`);
    };

    const toggleSaveJob = async (jobId: string) => {
        try {
            const res = await fetch('/api/jobs/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ jobId }),
            });
            if (res.ok) {
                alert('Job saved!');
            } else {
                alert('Failed to save job');
            }
        } catch (error) {
            console.error(error);
        }
    };

    if (loading) return <p className="text-center mt-10">Loading jobs...</p>;

    return (
        <div className="max-w-6xl mx-auto py-10 px-6">
            <div className="flex flex-col md:flex-row gap-4 mb-10">
                <Input
                    placeholder="Search by title, company, or location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-grow"
                />
                <select
                    className="border rounded-md px-3 h-10"
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                >
                    <option value="all">All Types</option>
                    <option value="full-time">Full-time</option>
                    <option value="part-time">Part-time</option>
                    <option value="internship">Internship</option>
                    <option value="remote">Remote</option>
                </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {filteredJobs.length === 0 ? (
                    <div className="col-span-full text-center text-gray-500 py-10">
                        No jobs found matching your criteria.
                    </div>
                ) : (
                    filteredJobs.map((job) => (
                        <div key={job.id} className="border rounded-lg shadow-md p-6 flex flex-col justify-between bg-white hover:shadow-lg transition-shadow">
                            <div>
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-2xl font-semibold text-blue-800">{job.title}</h3>
                                    {job.isExternal && <Badge variant="secondary">External</Badge>}
                                </div>
                                <p className="text-gray-700 font-medium">{job.company} &middot; {job.location}</p>
                                <p className="mt-3 text-gray-600 text-sm whitespace-pre-line line-clamp-4">
                                    {job.description}
                                </p>
                            </div>
                            <div className="flex gap-2 mt-6">
                                <Button
                                    onClick={() => redirectToApplication(job)}
                                    className="flex-grow bg-blue-600 hover:bg-blue-700"
                                >
                                    Apply Now
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => toggleSaveJob(job.id)}
                                >
                                    Save
                                </Button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
