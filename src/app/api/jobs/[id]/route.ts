import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { connectToDB } from '@/lib/db';
import Job from '@/models/Job';

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    try {
        await connectToDB();
        const job = await Job.findById(id).populate('companyId');
        if (!job) return NextResponse.json({ message: 'Job not found' }, { status: 404 });
        return NextResponse.json({ job });
    } catch (error) {
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { userId } = await auth();
    const { id } = await params;

    if (!userId) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    try {
        const body = await req.json();
        await connectToDB();

        const job = await Job.findOneAndUpdate(
            { _id: id, postedBy: userId },
            { ...body },
            { new: true }
        );

        if (!job) return NextResponse.json({ message: 'Job not found or unauthorized' }, { status: 404 });

        return NextResponse.json({ job });
    } catch (error) {
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { userId } = await auth();
    const { id } = await params;

    if (!userId) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    try {
        await connectToDB();
        const job = await Job.findOneAndDelete({ _id: id, postedBy: userId });

        if (!job) return NextResponse.json({ message: 'Job not found or unauthorized' }, { status: 404 });

        return NextResponse.json({ message: 'Job deleted successfully' });
    } catch (error) {
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
