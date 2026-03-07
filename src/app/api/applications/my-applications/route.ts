import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { connectToDB } from '@/lib/db';
import Application from '@/models/Application';

export async function GET() {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    try {
        await connectToDB();
        const applications = await Application.find({ userId })
            .populate({
                path: 'jobId',
                populate: { path: 'companyId' },
            })
            .sort({ appliedAt: -1 });

        return NextResponse.json({ applications });
    } catch (error) {
        console.error('Fetch applications error:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
