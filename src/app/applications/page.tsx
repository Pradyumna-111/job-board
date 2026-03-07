'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Application {
    _id: string;
    jobId?: { title: string; companyId?: { name: string } };
    jobData?: { title: string; company: string };
    status: string;
    appliedAt: string;
    isExternal: boolean;
}

export default function SeekerApplications() {
    const [applications, setApplications] = useState<Application[]>([]);
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

    if (loading) return <div className="p-10 text-center">Loading...</div>;

    return (
        <div className="max-w-6xl mx-auto py-10 px-6">
            <h1 className="text-3xl font-bold mb-8">My Applications</h1>
            <div className="grid gap-4">
                {applications.length === 0 ? (
                    <Card>
                        <CardContent className="p-10 text-center text-gray-500">
                            You haven&apos;t applied for any jobs yet.
                        </CardContent>
                    </Card>
                ) : (
                    applications.map((app) => (
                        <Card key={app._id}>
                            <CardContent className="p-6 flex justify-between items-center">
                                <div>
                                    <h3 className="text-xl font-bold">
                                        {app.isExternal ? app.jobData?.title : app.jobId?.title}
                                    </h3>
                                    <p className="text-gray-600">
                                        {app.isExternal ? app.jobData?.company : app.jobId?.companyId?.name}
                                    </p>
                                    <p className="text-sm text-gray-400 mt-1">Applied on: {new Date(app.appliedAt).toLocaleDateString()}</p>
                                </div>
                                <Badge variant={app.status === 'shortlisted' ? 'success' : app.status === 'rejected' ? 'destructive' : 'outline'}>
                                    {app.status.toUpperCase()}
                                </Badge>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
