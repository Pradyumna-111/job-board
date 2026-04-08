'use client';

import { useState, useEffect, use } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Loader2, Copy, FileText } from 'lucide-react';
import JobMatchScore from '@/components/JobMatchScore';

interface Job {
    id: string;
    title: string;
    company: string;
    location: string;
    description: string;
}

export default function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const searchParams = useSearchParams();
    const isExternal = searchParams.get('external') === 'true';
    const { user } = useUser();
    const router = useRouter();

    const [job, setJob] = useState<Job | null>(null);
    const [loading, setLoading] = useState(true);
    const [coverLetter, setCoverLetter] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);

    useEffect(() => {
        async function fetchJobDetails() {
            setLoading(true);
            try {
                const res = await fetch(`/api/job-details/${id}${isExternal ? '?external=true' : ''}`);
                if (res.ok) {
                    const data = await res.json();
                    setJob(data.job);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
        fetchJobDetails();
    }, [id, isExternal]);

    const generateCoverLetter = async () => {
        if (!job) return;
        setIsGenerating(true);
        const userBackground = localStorage.getItem('userResume') || '';

        try {
            const res = await fetch('/api/coverletter', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    jobTitle: job.title,
                    company: job.company,
                    jobDescription: job.description,
                    userBackground
                }),
            });
            const data = await res.json();
            setCoverLetter(data.coverLetter);
        } catch (error) {
            console.error(error);
        } finally {
            setIsGenerating(false);
        }
    };

    const copyToClipboard = () => {
        if (coverLetter) {
            navigator.clipboard.writeText(coverLetter);
            alert('Copied to clipboard!');
        }
    };

    if (loading) return <div className="p-10 text-center"><Loader2 className="animate-spin mx-auto h-10 w-10 text-blue-600" /></div>;
    if (!job) return <div className="p-10 text-center text-red-600 font-bold text-2xl">Job Not Found</div>;

    return (
        <div className="max-w-5xl mx-auto py-10 px-6">
            <Card className="mb-8">
                <CardHeader className="border-b">
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle className="text-3xl font-bold text-blue-900 dark:text-blue-400">{job.title}</CardTitle>
                            <p className="text-xl text-gray-600 dark:text-gray-400 mt-2">{job.company} &middot; {job.location}</p>
                        </div>
                        {isExternal && <Badge className="text-lg py-1 px-3">External</Badge>}
                    </div>
                </CardHeader>
                <CardContent className="pt-8">
                    <h3 className="text-xl font-semibold mb-4 border-l-4 border-blue-600 pl-3">Job Description</h3>
                    <div className="text-gray-700 dark:text-gray-300 whitespace-pre-line leading-relaxed">
                        {job.description}
                    </div>

                    <div className="mt-10 flex flex-wrap gap-4">
                        <Button
                            onClick={() => router.push(`/applications/apply/${job.id}${isExternal ? '?external=true' : ''}`)}
                            className="bg-blue-600 hover:bg-blue-700 h-12 px-8 text-lg"
                        >
                            Apply Now
                        </Button>

                        <Dialog>
                            <DialogTrigger asChild>
                                <Button
                                    variant="outline"
                                    onClick={generateCoverLetter}
                                    className="h-12 px-8 text-lg border-blue-600 text-blue-600 hover:bg-blue-50"
                                >
                                    <FileText className="mr-2 h-5 w-5" /> Generate Cover Letter
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                                <DialogHeader>
                                    <DialogTitle>AI-Generated Cover Letter</DialogTitle>
                                    <DialogDescription>
                                        Customized for {job.title} at {job.company}
                                    </DialogDescription>
                                </DialogHeader>
                                {isGenerating ? (
                                    <div className="py-20 text-center">
                                        <Loader2 className="animate-spin mx-auto h-10 w-10 text-blue-600 mb-4" />
                                        <p className="text-gray-600 font-medium animate-pulse">Our AI is drafting your letter...</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg border text-sm leading-relaxed whitespace-pre-line">
                                            {coverLetter}
                                        </div>
                                        <Button onClick={copyToClipboard} className="w-full bg-green-600 hover:bg-green-700 text-white">
                                            <Copy className="mr-2 h-4 w-4" /> Copy to Clipboard
                                        </Button>
                                    </div>
                                )}
                            </DialogContent>
                        </Dialog>
                    </div>
                </CardContent>
            </Card>

            <JobMatchScore jobDescription={job.description} />
        </div>
    );
}
