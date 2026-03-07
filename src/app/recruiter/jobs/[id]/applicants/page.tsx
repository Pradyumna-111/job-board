'use client';

import { useState, useEffect, use } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Applicant {
    _id: string;
    applicantName: string;
    applicantEmail: string;
    coverLetter: string;
    resumeUrl?: string;
    status: string;
}

interface Job {
    title: string;
    location: string;
    type: string;
}

export default function JobApplicants({ params }: { params: Promise<{ id: string }> }) {
    const { id: jobId } = use(params);
    const [applicants, setApplicants] = useState<Applicant[]>([]);
    const [job, setJob] = useState<Job | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const [jobRes, applicantsRes] = await Promise.all([
                    fetch(`/api/jobs/${jobId}`),
                    fetch(`/api/jobs/${jobId}/applicants`)
                ]);
                const jobData = await jobRes.json();
                const applicantsData = await applicantsRes.json();
                setJob(jobData.job);
                setApplicants(applicantsData.applicants || []);
            } catch (error) {
                console.error('Fetch error:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [jobId]);

    const updateStatus = async (applicationId: string, status: string) => {
        try {
            const res = await fetch(`/api/applications/${applicationId}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status }),
            });
            if (res.ok) {
                setApplicants(applicants.map(app =>
                    app._id === applicationId ? { ...app, status } : app
                ));
            }
        } catch (error) {
            console.error('Update status error:', error);
            alert('Failed to update status');
        }
    };

    if (loading) return <div className="p-10 text-center">Loading...</div>;

    return (
        <div className="max-w-6xl mx-auto py-10 px-4">
            <h1 className="text-3xl font-bold mb-2">Applicants for {job?.title}</h1>
            <p className="text-gray-600 mb-8">{job?.location} &middot; {job?.type}</p>

            <div className="grid gap-6">
                {applicants.length === 0 ? (
                    <Card>
                        <CardContent className="p-10 text-center text-gray-500">
                            No applicants yet.
                        </CardContent>
                    </Card>
                ) : (
                    applicants.map((app) => (
                        <Card key={app._id}>
                            <CardContent className="p-6">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-xl font-bold">{app.applicantName}</h3>
                                        <p className="text-gray-600">{app.applicantEmail}</p>
                                        <div className="mt-4">
                                            <h4 className="font-semibold mb-1">Cover Letter:</h4>
                                            <p className="text-sm text-gray-700 whitespace-pre-line">{app.coverLetter}</p>
                                        </div>
                                        {app.resumeUrl && (
                                            <a
                                                href={app.resumeUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:underline mt-2 inline-block"
                                            >
                                                View Resume
                                            </a>
                                        )}
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <Badge variant={app.status === 'shortlisted' ? 'success' : app.status === 'rejected' ? 'destructive' : 'default'}>
                                            {app.status.toUpperCase()}
                                        </Badge>
                                        <div className="flex gap-2 mt-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="border-green-600 text-green-600 hover:bg-green-50"
                                                onClick={() => updateStatus(app._id, 'shortlisted')}
                                                disabled={app.status === 'shortlisted'}
                                            >
                                                Shortlist
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="border-red-600 text-red-600 hover:bg-red-50"
                                                onClick={() => updateStatus(app._id, 'rejected')}
                                                disabled={app.status === 'rejected'}
                                            >
                                                Reject
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
