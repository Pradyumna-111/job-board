import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export interface Job {
    id: string;
    title: string;
    company: string;
    location: string;
    description: string;
    isExternal?: boolean;
}

interface JobCardProps {
    job: Job;
    onApply?: (job: Job) => void;
    onSave?: (jobId: string) => void;
}

export default function JobCard({ job, onApply, onSave }: JobCardProps) {
    return (
        <div className="border rounded-lg shadow-md p-6 flex flex-col justify-between bg-white dark:bg-gray-800 hover:shadow-lg transition-shadow">
            <div>
                <div className="flex justify-between items-start mb-2">
                    <Link href={`/jobs/${job.id}${job.isExternal ? '?external=true' : ''}`}>
                        <h3 className="text-2xl font-semibold text-blue-800 dark:text-blue-400 hover:underline">{job.title}</h3>
                    </Link>
                    {job.isExternal && <Badge variant="secondary">External</Badge>}
                </div>
                <p className="text-gray-700 dark:text-gray-300 font-medium">{job.company} &middot; {job.location}</p>
                <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm whitespace-pre-line line-clamp-4">
                    {job.description}
                </p>
            </div>
            <div className="flex gap-2 mt-6">
                {onApply && (
                    <Button
                        onClick={() => onApply(job)}
                        className="flex-grow bg-blue-600 hover:bg-blue-700 text-white"
                    >
                        Apply Now
                    </Button>
                )}
                {!onApply && (
                    <Link href={`/jobs/${job.id}${job.isExternal ? '?external=true' : ''}`} className="flex-grow">
                        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">View Details</Button>
                    </Link>
                )}
                {onSave && (
                    <Button
                        variant="outline"
                        onClick={() => onSave(job.id)}
                    >
                        Save
                    </Button>
                )}
            </div>
        </div>
    );
}
