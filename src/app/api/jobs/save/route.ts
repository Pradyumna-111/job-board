import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { connectToDB } from '@/lib/db';
import SavedJob from '@/models/SavedJob';

export async function POST(req: Request) {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    try {
        const { jobId } = await req.json();
        await connectToDB();

        // Check if already saved
        const existing = await SavedJob.findOne({ userId, jobId });
        if (existing) {
            await SavedJob.deleteOne({ _id: existing._id });
            return NextResponse.json({ message: 'Job unsaved' });
        } else {
            const saved = await SavedJob.create({ userId, jobId });
            return NextResponse.json({ message: 'Job saved', saved });
        }
    } catch (error) {
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

export async function GET() {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    try {
        await connectToDB();
        const savedJobs = await SavedJob.find({ userId }).populate('jobId');
        return NextResponse.json({ savedJobs });
    } catch (error) {
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
