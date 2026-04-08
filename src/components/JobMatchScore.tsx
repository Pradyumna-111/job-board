'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface JobMatchScoreProps {
    jobDescription: string;
}

interface MatchResult {
    score: number;
    reasons: string[];
    improvements: string[];
}

export default function JobMatchScore({ jobDescription }: JobMatchScoreProps) {
    const [match, setMatch] = useState<MatchResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const analyzeMatch = async () => {
        const resumeText = localStorage.getItem('userResume');
        if (!resumeText) {
            setError('Please upload your resume in the AI Agent page first.');
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const res = await fetch('/api/match', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ jobDescription, resumeText }),
            });

            if (!res.ok) throw new Error('Failed to analyze match');
            const data = await res.json();
            setMatch(data);
        } catch (err) {
            setError('Analysis failed. Try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const getScoreColor = (score: number) => {
        if (score < 40) return 'text-red-600 border-red-200 bg-red-50';
        if (score < 70) return 'text-yellow-600 border-yellow-200 bg-yellow-50';
        return 'text-green-600 border-green-200 bg-green-50';
    };

    return (
        <Card className="mt-8 overflow-hidden border-2 border-blue-100 dark:border-blue-900/30 shadow-lg">
            <CardHeader className="bg-blue-50/50 dark:bg-blue-900/20">
                <CardTitle className="flex items-center gap-2 text-xl font-bold text-blue-800 dark:text-blue-400">
                    AI Match Score
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
                {!match && !loading && (
                    <div className="text-center py-4">
                        <Button onClick={analyzeMatch} className="bg-blue-600 hover:bg-blue-700">
                            Analyze with AI
                        </Button>
                        {error && <p className="mt-2 text-red-600 text-sm font-medium">{error}</p>}
                    </div>
                )}

                {loading && (
                    <div className="space-y-4">
                        <div className="flex justify-center">
                            <Skeleton className="h-24 w-24 rounded-full" />
                        </div>
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4 mx-auto" />
                    </div>
                )}

                {match && (
                    <div className="space-y-6">
                        <div className="flex justify-center">
                            <div className={`h-24 w-24 rounded-full border-4 flex items-center justify-center text-3xl font-bold ${getScoreColor(match.score)}`}>
                                {match.score}%
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <h4 className="font-semibold text-green-800 dark:text-green-400 flex items-center gap-2">
                                    <CheckCircle2 className="h-5 w-5" /> Why you match
                                </h4>
                                <ul className="space-y-2">
                                    {match.reasons.map((reason, i) => (
                                        <li key={i} className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2">
                                            <span className="text-green-500 mt-1">•</span> {reason}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="space-y-3">
                                <h4 className="font-semibold text-orange-800 dark:text-orange-400 flex items-center gap-2">
                                    <AlertCircle className="h-5 w-5" /> How to improve
                                </h4>
                                <ul className="space-y-2">
                                    {match.improvements.map((improvement, i) => (
                                        <li key={i} className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2">
                                            <span className="text-orange-500 mt-1">•</span> {improvement}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => setMatch(null)} className="w-full">
                            Re-analyze
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
