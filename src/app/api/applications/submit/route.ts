import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

// ... (saveApplicationToDatabase function remains the same) ...
async function saveApplicationToDatabase(data: any) {
    // ... (MOCK IMPLEMENTATION) ...
    console.log(`[DB MOCK] Application submitted for Job: ${data.jobId} by User: ${data.userId}`);
    await new Promise(resolve => setTimeout(resolve, 500));
    return true;
}

// Route Handler for POST requests
export async function POST(request: Request) {
    // 1. Correct Authentication Check (Synchronous Call)
    // Destructure the object returned by auth() to get userId
    const{userId}=await auth();

    if (!userId) {
        // Return a 401 Unauthorized response
        return NextResponse.json({ message: 'Unauthorized. Please log in.' }, { status: 401 });
    }

    // 2. Parse the Request Body
    const applicationData = await request.json();

    // ... (Rest of the logic remains the same) ...
    const { jobId, jobTitle, name, email, coverLetter } = applicationData;

    if (!jobId || !jobTitle || !name || !email) {
        return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    try {
        const finalApplicationRecord = {
            userId: userId,
            jobId: jobId,
            jobTitle: jobTitle,
            applicantName: name,
            applicantEmail: email,
            coverLetter: coverLetter,
            status: 'Submitted',
            appliedAt: new Date().toISOString(),
        };

        await saveApplicationToDatabase(finalApplicationRecord);

        return NextResponse.json(
            { message: 'Application submitted successfully', data: { jobId: jobId } },
            { status: 201 }
        );

    } catch (error) {
        console.error('Error saving application:', error);
        return NextResponse.json(
            { message: 'Failed to process application due to a server error.' },
            { status: 500 }
        );
    }
}