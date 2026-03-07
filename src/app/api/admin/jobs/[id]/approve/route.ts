import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { connectToDB } from '@/lib/db';
import Job from '@/models/Job';

export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { sessionClaims } = await auth();
    const role = (sessionClaims?.metadata as { role?: string })?.role;
    const { id } = await params;

    if (role !== 'admin') {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    try {
        await connectToDB();
        const job = await Job.findByIdAndUpdate(id, { status: 'approved' }, { new: true });
        if (!job) return NextResponse.json({ message: 'Job not found' }, { status: 404 });
        return NextResponse.json({ job });
    } catch (error) {
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
