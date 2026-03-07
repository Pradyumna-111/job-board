import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { connectToDB } from '@/lib/db';
import Notification from '@/models/Notification';

export async function GET() {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    try {
        await connectToDB();
        const notifications = await Notification.find({ userId }).sort({ createdAt: -1 });
        return NextResponse.json({ notifications });
    } catch (error) {
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
