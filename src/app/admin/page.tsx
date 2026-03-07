'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function AdminDashboard() {
    const [stats, setStats] = useState({ users: 0, jobs: 0, applications: 0, companies: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchStats() {
            try {
                const res = await fetch('/api/admin/stats');
                if (res.ok) {
                    const data = await res.json();
                    setStats(data.stats);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
        fetchStats();
    }, []);

    if (loading) return <div className="p-10 text-center">Loading...</div>;

    return (
        <div className="max-w-6xl mx-auto py-10 px-6">
            <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                <Card>
                    <CardHeader><CardTitle>Users</CardTitle></CardHeader>
                    <CardContent><p className="text-4xl font-bold">{stats.users}</p></CardContent>
                </Card>
                <Card>
                    <CardHeader><CardTitle>Jobs</CardTitle></CardHeader>
                    <CardContent><p className="text-4xl font-bold">{stats.jobs}</p></CardContent>
                </Card>
                <Card>
                    <CardHeader><CardTitle>Applications</CardTitle></CardHeader>
                    <CardContent><p className="text-4xl font-bold">{stats.applications}</p></CardContent>
                </Card>
                <Card>
                    <CardHeader><CardTitle>Companies</CardTitle></CardHeader>
                    <CardContent><p className="text-4xl font-bold">{stats.companies}</p></CardContent>
                </Card>
            </div>

            <div className="flex gap-4">
                <Link href="/admin/users"><Button>Manage Users</Button></Link>
                <Link href="/admin/jobs"><Button variant="outline">Moderate Jobs</Button></Link>
            </div>
        </div>
    );
}
