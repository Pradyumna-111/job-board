'use client';

import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, UploadCloud } from 'lucide-react';

export const useResume = () => {
    const [resumeText, setResumeText] = useState<string | null>(null);

    useEffect(() => {
        const stored = localStorage.getItem('userResume');
        if (stored) setResumeText(stored);
    }, []);

    const saveResume = (text: string) => {
        localStorage.setItem('userResume', text);
        setResumeText(text);
    };

    const clearResume = () => {
        localStorage.removeItem('userResume');
        setResumeText(null);
    };

    return { resumeText, saveResume, clearResume };
};

export default function ResumeUpload() {
    const { resumeText, saveResume, clearResume } = useResume();
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (!file) return;

        setIsUploading(true);
        setError(null);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('/api/parse-resume', {
                method: 'POST',
                body: formData,
            });

            if (!res.ok) throw new Error('Failed to parse resume');

            const data = await res.json();
            saveResume(data.text);
        } catch (err) {
            setError('Error uploading resume. Please try again.');
            console.error(err);
        } finally {
            setIsUploading(false);
        }
    }, [saveResume]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/pdf': ['.pdf'],
            'text/plain': ['.txt'],
        },
        multiple: false,
    });

    if (resumeText) {
        return (
            <div className="border-2 border-green-500 bg-green-50 dark:bg-green-900/20 p-6 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <CheckCircle className="text-green-600 h-8 w-8" />
                    <div>
                        <p className="font-semibold text-green-800 dark:text-green-400">Resume uploaded</p>
                        <p className="text-sm text-green-700 dark:text-green-500">AI agent will use this to match jobs and draft letters.</p>
                    </div>
                </div>
                <Button variant="ghost" size="sm" onClick={clearResume} className="text-red-600 hover:text-red-700 hover:bg-red-50">
                    Remove
                </Button>
            </div>
        );
    }

    return (
        <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-colors
                ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}
                ${error ? 'border-red-500 bg-red-50' : ''}
            `}
        >
            <input {...getInputProps()} />
            <UploadCloud className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            {isUploading ? (
                <p className="text-blue-600 font-medium animate-pulse">Parsing resume...</p>
            ) : (
                <>
                    <p className="text-lg font-medium text-gray-700">
                        {isDragActive ? "Drop your resume here" : "Drag & drop your resume, or click to select"}
                    </p>
                    <p className="text-sm text-gray-500 mt-2">Supports .pdf and .txt files</p>
                </>
            )}
            {error && <p className="text-red-600 mt-2 flex items-center justify-center gap-1"><XCircle className="h-4 w-4" /> {error}</p>}
        </div>
    );
}
