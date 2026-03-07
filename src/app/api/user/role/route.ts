import { NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs/server';
import { connectToDB } from '@/lib/db';
import User from '@/models/User';

interface RoleUpdateBody {
    role: 'seeker' | 'recruiter';
}

export async function POST(req: Request) {
    const { userId } = await auth();
    if (!userId) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { role } = await req.json() as RoleUpdateBody;

        if (!['seeker', 'recruiter'].includes(role)) {
            return NextResponse.json({ message: 'Invalid role' }, { status: 400 });
        }

        // 1. Update Clerk publicMetadata
        const client = await clerkClient();
        await client.users.updateUser(userId, {
            publicMetadata: { role },
        });

        // 2. Sync with MongoDB
        await connectToDB();
        const user = await client.users.getUser(userId);

        await User.findOneAndUpdate(
            { clerkId: userId },
            {
                clerkId: userId,
                email: user.primaryEmailAddress?.emailAddress,
                firstName: user.firstName,
                lastName: user.lastName,
                role: role,
            },
            { upsert: true, new: true }
        );

        return NextResponse.json({ message: 'Role updated successfully' }, { status: 200 });
    } catch (error) {
        console.error('Role update error:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
