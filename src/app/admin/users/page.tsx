'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface User {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
}

export default function ManageUsers() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchUsers() {
            try {
                const res = await fetch('/api/admin/users');
                if (res.ok) {
                    const data = await res.json();
                    setUsers(data.users || []);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
        fetchUsers();
    }, []);

    if (loading) return <div className="p-10 text-center">Loading...</div>;

    return (
        <div className="max-w-6xl mx-auto py-10 px-6">
            <h1 className="text-3xl font-bold mb-8">Manage Users</h1>
            <div className="grid gap-4">
                {users.map((user) => (
                    <Card key={user._id}>
                        <CardContent className="p-6 flex justify-between items-center">
                            <div>
                                <h3 className="text-xl font-bold">{user.firstName} {user.lastName}</h3>
                                <p className="text-gray-600">{user.email}</p>
                                <Badge variant={user.role === 'admin' ? 'destructive' : user.role === 'recruiter' ? 'secondary' : 'outline'}>
                                    {user.role.toUpperCase()}
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
