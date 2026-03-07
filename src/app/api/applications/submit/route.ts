import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { connectToDB } from '@/lib/db';
import Application from '@/models/Application';
import Notification from '@/models/Notification';
import Job from '@/models/Job';

interface ApplicationData {
    jobId: string;
    jobTitle: string;
    name: string;
    email: string;
    coverLetter: string;
    resumeUrl?: string;
    isExternal?: boolean;
    jobData?: object;
}

export async function POST(request: Request) {
    const { userId } = await auth();

    if (!userId) {
        return NextResponse.json({ message: 'Unauthorized. Please log in.' }, { status: 401 });
    }

    try {
        const applicationData = await request.json() as ApplicationData;
        const { jobId, jobTitle, name, email, coverLetter, resumeUrl, isExternal, jobData } = applicationData;

        if (!jobId || !jobTitle || !name || !email) {
            return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
        }

        await connectToDB();

        // Create the application record in MongoDB
        const application = await Application.create({
            userId,
            jobId: isExternal ? null : jobId,
            jobData: isExternal ? jobData : null,
            isExternal,
            applicantName: name,
            applicantEmail: email,
            coverLetter,
            resumeUrl,
            status: 'applied',
        });

        // Notify the recruiter if it's an internal job
        if (!isExternal) {
            const job = await Job.findById(jobId);
            if (job && job.postedBy) {
                await Notification.create({
                    userId: job.postedBy,
                    message: `New application received for "${job.title}" from ${name}.`,
                    type: 'system',
                });
            }
        }

        return NextResponse.json(
            { message: 'Application submitted successfully', application },
            { status: 201 }
        );

    } catch (error) {
        console.error('Error saving application:', error);
        return NextResponse.json(
            { message: 'Failed to process application due to a server error.' },
            { status: 500 }
        );
    }
}
