import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { connectToDB } from '@/lib/db';
import Application from '@/models/Application';
import Job from '@/models/Job';
import Notification from '@/models/Notification';

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { userId } = await auth();
    const { id: applicationId } = await params;

    if (!userId) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    try {
        const { status } = await req.json();
        await connectToDB();

        const application = await Application.findById(applicationId).populate('jobId');
        if (!application) return NextResponse.json({ message: 'Application not found' }, { status: 404 });

        // Verify that the recruiter owns the job
        const job = await Job.findOne({ _id: application.jobId, postedBy: userId });
        if (!job) return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });

        application.status = status;
        await application.save();

        // Create a notification for the applicant
        await Notification.create({
            userId: application.userId,
            message: `Your application for "${job.title}" has been ${status}.`,
            type: 'application_update',
        });

        return NextResponse.json({ application });
    } catch (error) {
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
