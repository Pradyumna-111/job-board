'use client';

import { useState, useEffect, use } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface Job {
    id: string;
    title: string;
    company: string;
    location: string;
}

export default function ApplicationFormPage({ params }: { params: Promise<{ jobId: string }> }) {
    const { jobId } = use(params);
    const router = useRouter();
    const { user } = useUser();

    const [job, setJob] = useState<Job | null>(null);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.firstName || '',
        email: user?.primaryEmailAddress?.emailAddress || '',
        coverLetter: '',
        resumeUrl: '',
    });

    useEffect(() => {
        async function fetchJobDetails() {
            setLoading(true);
            try {
                // If the job is internal, fetch details from our API
                const res = await fetch(`/api/jobs/${jobId}`);
                if (res.ok) {
                    const data = await res.json();
                    setJob({
                        id: data.job._id,
                        title: data.job.title,
                        company: data.job.companyId?.name || 'Unknown',
                        location: data.job.location,
                    });
                } else {
                    // Handle external job or not found (simplified)
                    setJob({ id: jobId, title: 'Job Details Not Found', company: '', location: '' });
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
        fetchJobDetails();
    }, [jobId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !job) return;

        setIsSubmitting(true);
        try {
            const res = await fetch('/api/applications/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    jobId: job.id,
                    jobTitle: job.title,
                    ...formData,
                    isExternal: false, // Simplified
                }),
            });

            if (res.ok) {
                alert('Application submitted successfully!');
                router.push('/applications');
            } else {
                alert('Failed to submit application.');
            }
        } catch (error) {
            alert('An error occurred.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return <div className="p-10 text-center">Loading job details...</div>;

    return (
        <div className="max-w-3xl mx-auto py-10 px-4">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">Apply for {job?.title}</CardTitle>
                    <p className="text-gray-600">{job?.company} &middot; {job?.location}</p>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Full Name</label>
                            <Input
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Email</label>
                            <Input
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                type="email"
                                required
                                readOnly
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Resume URL</label>
                            <Input
                                value={formData.resumeUrl}
                                onChange={(e) => setFormData({ ...formData, resumeUrl: e.target.value })}
                                placeholder="https://link-to-your-resume.pdf"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Cover Letter</label>
                            <Textarea
                                value={formData.coverLetter}
                                onChange={(e) => setFormData({ ...formData, coverLetter: e.target.value })}
                                rows={6}
                                required
                            />
                        </div>
                        <Button type="submit" className="w-full" disabled={isSubmitting}>
                            {isSubmitting ? 'Submitting...' : 'Submit Application'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
