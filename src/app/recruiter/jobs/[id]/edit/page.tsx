'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function EditJob({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [job, setJob] = useState({
        title: '',
        description: '',
        location: '',
        type: 'full-time',
        salaryMin: '',
        salaryMax: '',
        skills: '',
    });

    useEffect(() => {
        async function fetchJob() {
            try {
                const res = await fetch(`/api/jobs/${id}`);
                if (res.ok) {
                    const data = await res.json();
                    if (data.job) {
                        setJob({
                            title: data.job.title,
                            description: data.job.description,
                            location: data.job.location,
                            type: data.job.type,
                            salaryMin: data.job.salaryRange?.min?.toString() || '',
                            salaryMax: data.job.salaryRange?.max?.toString() || '',
                            skills: data.job.skillsRequired?.join(', ') || '',
                        });
                    }
                }
            } catch (error) {
                console.error('Fetch job error:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchJob();
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await fetch(`/api/jobs/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...job,
                    salaryRange: {
                        min: Number(job.salaryMin),
                        max: Number(job.salaryMax),
                    },
                    skillsRequired: job.skills.split(',').map(s => s.trim()),
                }),
            });

            if (res.ok) {
                alert('Job updated successfully!');
                router.push('/recruiter/dashboard');
            } else {
                alert('Failed to update job.');
            }
        } catch (error) {
            alert('An error occurred.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-10 text-center">Loading...</div>;

    return (
        <div className="max-w-3xl mx-auto py-10 px-4">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">Edit Job</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Job Title</label>
                            <Input
                                value={job.title}
                                onChange={(e) => setJob({ ...job, title: e.target.value })}
                                required
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Location</label>
                                <Input
                                    value={job.location}
                                    onChange={(e) => setJob({ ...job, location: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Job Type</label>
                                <select
                                    className="w-full border rounded-md h-10 px-3"
                                    value={job.type}
                                    onChange={(e) => setJob({ ...job, type: e.target.value })}
                                >
                                    <option value="full-time">Full-time</option>
                                    <option value="part-time">Part-time</option>
                                    <option value="internship">Internship</option>
                                    <option value="remote">Remote</option>
                                </select>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Salary Min</label>
                                <Input
                                    type="number"
                                    value={job.salaryMin}
                                    onChange={(e) => setJob({ ...job, salaryMin: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Salary Max</label>
                                <Input
                                    type="number"
                                    value={job.salaryMax}
                                    onChange={(e) => setJob({ ...job, salaryMax: e.target.value })}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Skills (comma separated)</label>
                            <Input
                                value={job.skills}
                                onChange={(e) => setJob({ ...job, skills: e.target.value })}
                                placeholder="React, Node.js, TypeScript"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Job Description</label>
                            <Textarea
                                value={job.description}
                                onChange={(e) => setJob({ ...job, description: e.target.value })}
                                rows={6}
                                required
                            />
                        </div>
                        <Button type="submit" className="w-full" disabled={saving}>
                            {saving ? 'Saving...' : 'Save Job'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
