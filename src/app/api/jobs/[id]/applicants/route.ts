import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { connectToDB } from '@/lib/db';
import Application from '@/models/Application';
import Job from '@/models/Job';

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { userId } = await auth();
    const { id: jobId } = await params;

    if (!userId) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    try {
        await connectToDB();

        // Verify that the job belongs to the recruiter
        const job = await Job.findOne({ _id: jobId, postedBy: userId });
        if (!job) return NextResponse.json({ message: 'Unauthorized access to job' }, { status: 403 });

        const applicants = await Application.find({ jobId });
        return NextResponse.json({ applicants });
    } catch (error) {
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
