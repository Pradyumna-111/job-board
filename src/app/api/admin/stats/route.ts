import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { connectToDB } from '@/lib/db';
import User from '@/models/User';
import Job from '@/models/Job';
import Application from '@/models/Application';
import Company from '@/models/Company';

export async function GET() {
    const { sessionClaims } = await auth();
    const role = (sessionClaims?.metadata as { role?: string })?.role;

    if (role !== 'admin') {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    try {
        await connectToDB();
        const [users, jobs, applications, companies] = await Promise.all([
            User.countDocuments(),
            Job.countDocuments(),
            Application.countDocuments(),
            Company.countDocuments(),
        ]);

        return NextResponse.json({
            stats: { users, jobs, applications, companies }
        });
    } catch (error) {
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
