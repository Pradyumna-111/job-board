import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { connectToDB } from '@/lib/db';
import User from '@/models/User';

export async function GET() {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    try {
        await connectToDB();
        const user = await User.findOne({ clerkId: userId });
        return NextResponse.json({ user });
    } catch (error) {
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    try {
        const body = await req.json();
        await connectToDB();

        const user = await User.findOneAndUpdate(
            { clerkId: userId },
            { profile: body.profile },
            { new: true }
        );

        return NextResponse.json({ user });
    } catch (error) {
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
