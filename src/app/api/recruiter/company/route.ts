import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { connectToDB } from '@/lib/db';
import Company from '@/models/Company';

export async function GET() {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    try {
        await connectToDB();
        const company = await Company.findOne({ recruiterId: userId });
        return NextResponse.json({ company });
    } catch (error) {
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    try {
        const body = await req.json();
        await connectToDB();

        const company = await Company.findOneAndUpdate(
            { recruiterId: userId },
            { ...body, recruiterId: userId },
            { upsert: true, new: true }
        );

        return NextResponse.json({ company });
    } catch (error) {
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
