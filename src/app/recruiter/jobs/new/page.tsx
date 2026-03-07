'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function NewJob() {
    const router = useRouter();
    const [saving, setSaving] = useState(false);
    const [companyId, setCompanyId] = useState<string | null>(null);
    const [job, setJob] = useState({
        title: '',
        description: '',
        location: '',
        type: 'full-time',
        salaryMin: '',
        salaryMax: '',
        skills: '',
        qualifications: '',
        deadline: '',
    });

    useEffect(() => {
        async function fetchCompany() {
            const res = await fetch('/api/recruiter/company');
            const data = await res.json();
            if (data.company) {
                setCompanyId(data.company._id);
            } else {
                alert('Please set up your company profile first.');
                router.push('/recruiter/company');
            }
        }
        fetchCompany();
    }, [router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!companyId) return;

        setSaving(true);
        try {
            const res = await fetch('/api/jobs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...job,
                    companyId,
                    salaryRange: {
                        min: Number(job.salaryMin),
                        max: Number(job.salaryMax),
                    },
                    skillsRequired: job.skills.split(',').map(s => s.trim()),
                    qualifications: job.qualifications.split('\n').map(q => q.trim()),
                    deadline: job.deadline ? new Date(job.deadline).toISOString() : null,
                }),
            });

            if (res.ok) {
                alert('Job posted successfully!');
                router.push('/recruiter/dashboard');
            } else {
                alert('Failed to post job.');
            }
        } catch (error) {
            alert('An error occurred.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto py-10 px-4">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">Post a New Job</CardTitle>
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
                            <label className="block text-sm font-medium mb-1">Application Deadline</label>
                            <Input
                                type="date"
                                value={job.deadline}
                                onChange={(e) => setJob({ ...job, deadline: e.target.value })}
                            />
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
                            <label className="block text-sm font-medium mb-1">Qualifications (one per line)</label>
                            <Textarea
                                value={job.qualifications}
                                onChange={(e) => setJob({ ...job, qualifications: e.target.value })}
                                rows={3}
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
                            {saving ? 'Posting...' : 'Post Job'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
