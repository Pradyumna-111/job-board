'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function CompanyProfile() {
    const { user } = useUser();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [company, setCompany] = useState({
        name: '',
        description: '',
        website: '',
        location: '',
        industry: '',
    });

    useEffect(() => {
        async function fetchCompany() {
            try {
                const res = await fetch('/api/recruiter/company');
                if (res.ok) {
                    const data = await res.json();
                    if (data.company) {
                        setCompany(data.company);
                    }
                }
            } catch (error) {
                console.error('Fetch company error:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchCompany();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await fetch('/api/recruiter/company', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(company),
            });

            if (res.ok) {
                alert('Company profile updated successfully!');
                router.push('/recruiter/dashboard');
            } else {
                alert('Failed to update company profile.');
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
                    <CardTitle className="text-2xl font-bold">Company Profile</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Company Name</label>
                            <Input
                                value={company.name}
                                onChange={(e) => setCompany({ ...company, name: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Website</label>
                            <Input
                                value={company.website}
                                onChange={(e) => setCompany({ ...company, website: e.target.value })}
                                type="url"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Industry</label>
                            <Input
                                value={company.industry}
                                onChange={(e) => setCompany({ ...company, industry: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Location</label>
                            <Input
                                value={company.location}
                                onChange={(e) => setCompany({ ...company, location: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Description</label>
                            <Textarea
                                value={company.description}
                                onChange={(e) => setCompany({ ...company, description: e.target.value })}
                                rows={4}
                            />
                        </div>
                        <Button type="submit" className="w-full" disabled={saving}>
                            {saving ? 'Saving...' : 'Save Profile'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
