// src/app/api/applications/route.ts

import { NextResponse } from 'next/server';

// This function handles GET requests to /api/applications
export async function GET(request: Request) {
    // ⚠️ Replace this mock with actual database fetch logic later
    const mockApplications = [
        { id: 1, userId: 'user_123', jobTitle: 'Mock Job 1' },
        { id: 2, userId: 'user_456', jobTitle: 'Mock Job 2' },
    ];

    return NextResponse.json({ applications: mockApplications }, { status: 200 });
}

// You can define other handlers (POST, DELETE, etc.) here if needed.
/*
export async function POST(request: Request) {
    // Logic to create a new application (if not using /applications/submit)
    return NextResponse.json({ message: 'Application created' }, { status: 201 });
}
*/
