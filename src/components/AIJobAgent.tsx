'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Send, Sparkles } from 'lucide-react';
import JobCard, { Job } from './JobCard';

interface Message {
    role: 'user' | 'model';
    parts: { text: string }[];
    jobs?: Job[];
}

const SUGGESTED_PROMPTS = [
    "Find me remote frontend jobs",
    "Score my resume against this job",
    "Draft a cover letter for me",
    "Find senior backend roles in Hyderabad",
];

export default function AIJobAgent() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    const sendMessage = async (text: string) => {
        if (!text.trim()) return;

        const userResume = localStorage.getItem('userResume');
        const userMessage: Message = { role: 'user', parts: [{ text }] };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const res = await fetch('/api/agent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: text,
                    resume: userResume,
                    history: messages.map(m => ({ role: m.role, parts: m.parts })),
                }),
            });

            if (!res.ok) throw new Error('Failed to get agent response');

            const data = await res.json();
            const assistantMessage: Message = {
                role: 'model',
                parts: [{ text: data.response }],
                jobs: data.jobs,
            };
            setMessages(prev => [...prev, assistantMessage]);
        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, { role: 'model', parts: [{ text: "Sorry, I encountered an error. Please try again." }] }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-[600px] border rounded-xl overflow-hidden bg-white dark:bg-gray-900 shadow-xl">
            {/* Suggested Prompts */}
            <div className="p-4 border-b bg-gray-50 dark:bg-gray-800/50 overflow-x-auto">
                <div className="flex gap-2 min-w-max">
                    {SUGGESTED_PROMPTS.map((prompt) => (
                        <Badge
                            key={prompt}
                            variant="outline"
                            className="cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors py-1.5 px-3 text-sm border-blue-200 dark:border-blue-800"
                            onClick={() => sendMessage(prompt)}
                        >
                            {prompt}
                        </Badge>
                    ))}
                </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-grow overflow-y-auto p-4 space-y-4 custom-scrollbar">
                {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-center space-y-4 text-gray-500">
                        <Sparkles className="h-12 w-12 text-blue-400" />
                        <p className="text-lg font-medium">I'm your AI Job Agent. How can I help you today?</p>
                    </div>
                )}
                {messages.map((m, i) => (
                    <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] space-y-2`}>
                            <div className={`p-4 rounded-2xl ${
                                m.role === 'user'
                                ? 'bg-blue-600 text-white rounded-tr-none'
                                : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-tl-none border dark:border-gray-700'
                            }`}>
                                <p className="whitespace-pre-wrap leading-relaxed">{m.parts[0].text}</p>
                            </div>

                            {m.jobs && m.jobs.length > 0 && (
                                <div className="grid grid-cols-1 gap-4 mt-2">
                                    {m.jobs.map((job) => (
                                        <JobCard key={job.id} job={job} />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-2xl rounded-tl-none border dark:border-gray-700 flex items-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                            <span className="text-sm font-medium animate-pulse">Agent is thinking...</span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <div className="p-4 border-t bg-gray-50 dark:bg-gray-800/50">
                <form
                    onSubmit={(e) => { e.preventDefault(); sendMessage(input); }}
                    className="flex gap-2"
                >
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type your message..."
                        disabled={isLoading}
                        className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 focus-visible:ring-blue-500"
                    />
                    <Button type="submit" disabled={isLoading || !input.trim()} className="bg-blue-600 hover:bg-blue-700 text-white px-6">
                        {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                    </Button>
                </form>
            </div>
        </div>
    );
}
