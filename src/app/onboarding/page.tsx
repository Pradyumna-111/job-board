'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function Onboarding() {
    const { user } = useUser();
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleRoleSelection = async (role: 'seeker' | 'recruiter') => {
        setLoading(true);
        try {
            const res = await fetch('/api/user/role', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ role }),
            });

            if (res.ok) {
                // Force a reload of user data to get updated publicMetadata
                await user?.reload();
                router.push(role === 'recruiter' ? '/recruiter/company' : '/dashboard');
            } else {
                const error = await res.json();
                alert(`Error: ${error.message}`);
            }
        } catch (error) {
            console.error('Role selection error:', error);
            alert('An unexpected error occurred.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-64px)] bg-gray-50 p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center">Welcome!</CardTitle>
                    <CardDescription className="text-center text-lg">
                        Tell us how you&apos;d like to use our platform.
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 pt-4">
                    <Button
                        variant="outline"
                        className="h-24 text-xl font-semibold hover:border-blue-600 hover:bg-blue-50 transition-all"
                        onClick={() => handleRoleSelection('seeker')}
                        disabled={loading}
                    >
                        I am a Job Seeker
                    </Button>
                    <Button
                        variant="outline"
                        className="h-24 text-xl font-semibold hover:border-green-600 hover:bg-green-50 transition-all"
                        onClick={() => handleRoleSelection('recruiter')}
                        disabled={loading}
                    >
                        I am a Recruiter
                    </Button>
                </CardContent>
                <CardFooter>
                    <p className="text-sm text-center w-full text-gray-500">
                        Don&apos;t worry, you can always change this later.
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}
