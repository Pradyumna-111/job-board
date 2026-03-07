'use client';

import { useState, useEffect, use } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Job {
    _id: string;
    title: string;
    companyId?: { name: string };
    status: string;
}

export default function ModerateJobs() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchJobs() {
            try {
                const res = await fetch('/api/admin/jobs');
                if (res.ok) {
                    const data = await res.json();
                    setJobs(data.jobs || []);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
        fetchJobs();
    }, []);

    const approveJob = async (id: string) => {
        try {
            const res = await fetch(`/api/admin/jobs/${id}/approve`, { method: 'POST' });
            if (res.ok) {
                setJobs(jobs.map(j => j._id === id ? { ...j, status: 'approved' } : j));
            }
        } catch (error) {
            console.error('Approve error:', error);
            alert('Failed to approve');
        }
    };

    const deleteJob = async (id: string) => {
        if (!confirm('Are you sure?')) return;
        try {
            const res = await fetch(`/api/admin/jobs/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setJobs(jobs.filter(j => j._id !== id));
            }
        } catch (error) {
            console.error('Delete error:', error);
            alert('Failed to delete');
        }
    };

    if (loading) return <div className="p-10 text-center">Loading...</div>;

    return (
        <div className="max-w-6xl mx-auto py-10 px-6">
            <h1 className="text-3xl font-bold mb-8">Moderate Jobs</h1>
            <div className="grid gap-4">
                {jobs.map((job) => (
                    <Card key={job._id}>
                        <CardContent className="p-6 flex justify-between items-center">
                            <div>
                                <h3 className="text-xl font-bold">{job.title}</h3>
                                <p className="text-gray-600">{job.companyId?.name || 'Unknown'}</p>
                                <Badge variant={job.status === 'approved' ? 'success' : 'outline'}>
                                    {job.status.toUpperCase()}
                                </Badge>
                            </div>
                            <div className="flex gap-2">
                                {job.status !== 'approved' && (
                                    <Button onClick={() => approveJob(job._id)}>Approve</Button>
                                )}
                                <Button variant="destructive" onClick={() => deleteJob(job._id)}>Remove</Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
