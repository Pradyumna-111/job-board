'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface SavedJob {
    _id: string;
    jobId: {
        _id: string;
        title: string;
        location: string;
    };
}

export default function SavedJobs() {
    const [savedJobs, setSavedJobs] = useState<SavedJob[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchSavedJobs() {
            try {
                const res = await fetch('/api/jobs/save');
                if (res.ok) {
                    const data = await res.json();
                    setSavedJobs(data.savedJobs || []);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
        fetchSavedJobs();
    }, []);

    const unsaveJob = async (jobId: string) => {
        try {
            const res = await fetch('/api/jobs/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ jobId }),
            });
            if (res.ok) {
                setSavedJobs(savedJobs.filter(s => s.jobId._id !== jobId));
            }
        } catch (error) {
            console.error(error);
        }
    };

    if (loading) return <div className="p-10 text-center">Loading...</div>;

    return (
        <div className="max-w-6xl mx-auto py-10 px-6">
            <h1 className="text-3xl font-bold mb-8">Saved Jobs</h1>
            <div className="grid gap-6">
                {savedJobs.length === 0 ? (
                    <Card>
                        <CardContent className="p-10 text-center text-gray-500">
                            No saved jobs yet.
                        </CardContent>
                    </Card>
                ) : (
                    savedJobs.map((item) => (
                        <Card key={item._id}>
                            <CardContent className="p-6 flex justify-between items-center">
                                <div>
                                    <h3 className="text-xl font-bold text-blue-800">{item.jobId?.title || 'Unknown Job'}</h3>
                                    <p className="text-gray-600">{item.jobId?.location || 'Unknown'}</p>
                                </div>
                                <div className="flex gap-2">
                                    <Link href={`/jobs/${item.jobId?._id}`}>
                                        <Button variant="outline">View</Button>
                                    </Link>
                                    <Button variant="destructive" onClick={() => unsaveJob(item.jobId?._id)}>Unsave</Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
