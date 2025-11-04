import { NextResponse } from 'next/server';

async function getJobById(jobId: string) {
    if (jobId.startsWith('job-')) {
        return {
            id: jobId,
            title: `Senior Full Stack Developer (ID: ${jobId})`,
            company: "Tech Innovators Inc.",
            location: "Remote (Global)",
            description: `We are looking for a skilled developer to lead our job-board team. Must be proficient in Next.js and Clerk. This is the full description you need for the application form.`,
        };
    }
    return null;
}

export async function GET(
    request: Request,
    { params }: { params: Promise<{ jobId: string }> } // 👈 NOTE: params is a Promise now
) {
    const { jobId } = await params; // ✅ Await to unwrap the Promise

    if (!jobId) {
        return NextResponse.json({ message: 'Job ID is required' }, { status: 400 });
    }

    try {
        const job = await getJobById(jobId);

        if (!job) {
            return NextResponse.json({ message: 'Job not found' }, { status: 404 });
        }

        return NextResponse.json({ job }, { status: 200 });
    } catch (error) {
        console.error('Error fetching job details:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}