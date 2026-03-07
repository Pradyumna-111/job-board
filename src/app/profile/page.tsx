'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface Experience {
    title: string;
    company: string;
    duration: string;
    description: string;
}

interface Profile {
    skills: string;
    resumeUrl: string;
    experience: Experience[];
}

export default function SeekerProfile() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [profile, setProfile] = useState<Profile>({
        skills: '',
        resumeUrl: '',
        experience: [{ title: '', company: '', duration: '', description: '' }],
    });

    useEffect(() => {
        async function fetchProfile() {
            try {
                const res = await fetch('/api/user/profile');
                if (res.ok) {
                    const data = await res.json();
                    if (data.user?.profile) {
                        setProfile({
                            skills: data.user.profile.skills?.join(', ') || '',
                            resumeUrl: data.user.profile.resumeUrl || '',
                            experience: data.user.profile.experience?.length > 0
                                ? data.user.profile.experience
                                : [{ title: '', company: '', duration: '', description: '' }],
                        });
                    }
                }
            } catch (error) {
                console.error('Fetch profile error:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchProfile();
    }, []);

    const handleAddExperience = () => {
        setProfile({
            ...profile,
            experience: [...profile.experience, { title: '', company: '', duration: '', description: '' }]
        });
    };

    const handleExperienceChange = (index: number, field: keyof Experience, value: string) => {
        const updatedExp = [...profile.experience];
        updatedExp[index][field] = value;
        setProfile({ ...profile, experience: updatedExp });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await fetch('/api/user/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    profile: {
                        skills: profile.skills.split(',').map(s => s.trim()),
                        resumeUrl: profile.resumeUrl,
                        experience: profile.experience,
                    }
                }),
            });

            if (res.ok) {
                alert('Profile updated successfully!');
            } else {
                alert('Failed to update profile.');
            }
        } catch (error) {
            console.error('Submit error:', error);
            alert('An error occurred.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-10 text-center">Loading...</div>;

    return (
        <div className="max-w-4xl mx-auto py-10 px-4">
            <h1 className="text-3xl font-bold mb-8 text-blue-900">Job Seeker Profile</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Skills & Resume</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Skills (comma separated)</label>
                            <Input
                                value={profile.skills}
                                onChange={(e) => setProfile({ ...profile, skills: e.target.value })}
                                placeholder="React, Next.js, TypeScript"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Resume URL</label>
                            <Input
                                value={profile.resumeUrl}
                                onChange={(e) => setProfile({ ...profile, resumeUrl: e.target.value })}
                                placeholder="https://link-to-your-resume.pdf"
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Experience</CardTitle>
                        <Button type="button" variant="outline" size="sm" onClick={handleAddExperience}>Add Experience</Button>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {profile.experience.map((exp, index) => (
                            <div key={index} className="border-b pb-4 last:border-0 last:pb-0 space-y-3">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Job Title</label>
                                        <Input
                                            value={exp.title}
                                            onChange={(e) => handleExperienceChange(index, 'title', e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Company</label>
                                        <Input
                                            value={exp.company}
                                            onChange={(e) => handleExperienceChange(index, 'company', e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Duration</label>
                                    <Input
                                        value={exp.duration}
                                        onChange={(e) => handleExperienceChange(index, 'duration', e.target.value)}
                                        placeholder="Jan 2022 - Present"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Description</label>
                                    <Textarea
                                        value={exp.description}
                                        onChange={(e) => handleExperienceChange(index, 'description', e.target.value)}
                                        rows={3}
                                    />
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <Button type="submit" className="w-full" disabled={saving}>
                    {saving ? 'Updating...' : 'Update Profile'}
                </Button>
            </form>
        </div>
    );
}
