import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { connectToDB } from '@/lib/db';
import Job from '@/models/Job';

export async function DELETE(
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
        await Job.findByIdAndDelete(id);
        return NextResponse.json({ message: 'Job deleted' });
    } catch (error) {
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
