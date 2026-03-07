import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { connectToDB } from '@/lib/db';
import Job from '@/models/Job';
import Company from '@/models/Company';

interface ExternalJob {
    job_id: string;
    job_title: string;
    company_name: string;
    job_location: string;
    job_description: string;
}

interface InternalJob {
    _id: { toString: () => string };
    title: string;
    companyId?: { name: string };
    location: string;
    description: string;
}

export async function GET() {
    const { userId, sessionClaims } = await auth();
    const role = (sessionClaims?.metadata as { role?: string })?.role;

    try {
        await connectToDB();

        // If recruiter, return only their jobs
        if (role === 'recruiter') {
            const jobs = await Job.find({ postedBy: userId }).populate('companyId');
            return NextResponse.json({ jobs });
        }

        // Default: Fetch from external API (existing logic) or Internal Database for seekers
        const res = await fetch("https://jsearch.p.rapidapi.com/search?query=developer&num_pages=1", {
            method: "GET",
            headers: {
                "X-RapidAPI-Key": process.env.RAPIDAPI_KEY || '',
                "X-RapidAPI-Host": "jsearch.p.rapidapi.com",
            },
        });

        let externalJobs: any[] = [];
        if (res.ok) {
            const externalData = await res.json();
            externalJobs = (externalData.data || []).map((job: ExternalJob) => ({
                id: job.job_id,
                title: job.job_title,
                company: job.company_name,
                location: job.job_location,
                description: job.job_description,
                isExternal: true,
            }));
        } else {
            console.error("JSearch API error:", res.status);
        }

        const internalJobs = await Job.find({ status: 'approved' }).populate('companyId');
        const formattedInternalJobs = internalJobs.map((job: InternalJob) => ({
            id: job._id.toString(),
            title: job.title,
            company: job.companyId?.name || 'Unknown Company',
            location: job.location,
            description: job.description,
            isExternal: false,
        }));

        return NextResponse.json({ jobs: [...formattedInternalJobs, ...externalJobs] });
    } catch (error) {
        console.error("Error fetching jobs:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    try {
        const body = await req.json();
        await connectToDB();

        const newJob = await Job.create({
            ...body,
            postedBy: userId,
            status: 'pending', // Require admin approval as requested
        });

        return NextResponse.json({ job: newJob }, { status: 201 });
    } catch (error) {
        console.error("Error posting job:", error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
