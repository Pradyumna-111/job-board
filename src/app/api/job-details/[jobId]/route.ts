import { NextResponse } from 'next/server';
import { connectToDB } from '@/lib/db';
import Job from '@/models/Job';
import { searchJobs } from '@/lib/api';

async function getJobById(jobId: string, isExternal: boolean) {
    if (isExternal) {
        // For external jobs, we search by ID (JSearch usually supports this via search with ID but here we simplified)
        // Since searchJobs is a general search, we might need a specific getJobDetails.
        // For now, let's assume we search for the specific job title/company if we had them.
        // Actually, JSearch has a /job-details endpoint. Let's add it to src/lib/api.ts.
        return null;
    }

    try {
        await connectToDB();
        const job = await Job.findById(jobId).populate('companyId');
        if (!job) return null;
        return {
            id: job._id.toString(),
            title: job.title,
            company: job.companyId?.name || 'Unknown Company',
            location: job.location,
            description: job.description,
        };
    } catch (error) {
        console.error("Error fetching internal job:", error);
        return null;
    }
}

export async function GET(
    request: Request,
    { params }: { params: Promise<{ jobId: string }> }
) {
    const { jobId } = await params;
    const { searchParams } = new URL(request.url);
    const isExternal = searchParams.get('external') === 'true';

    if (!jobId) {
        return NextResponse.json({ message: 'Job ID is required' }, { status: 400 });
    }

    try {
        let job;
        if (isExternal) {
            // Re-fetch search results and find the job (inefficient but works for this demo)
            // Ideally we'd call the /job-details endpoint of JSearch
            const res = await fetch(`https://jsearch.p.rapidapi.com/job-details?job_id=${jobId}`, {
                method: "GET",
                headers: {
                    "X-RapidAPI-Key": process.env.RAPIDAPI_KEY || '',
                    "X-RapidAPI-Host": "jsearch.p.rapidapi.com",
                },
            });
            if (res.ok) {
                const data = await res.json();
                const externalJob = data.data?.[0];
                if (externalJob) {
                    job = {
                        id: externalJob.job_id,
                        title: externalJob.job_title,
                        company: externalJob.company_name,
                        location: externalJob.job_location,
                        description: externalJob.job_description,
                    };
                }
            }
        } else {
            job = await getJobById(jobId, false);
        }

        if (!job) {
            return NextResponse.json({ message: 'Job not found' }, { status: 404 });
        }

        return NextResponse.json({ job }, { status: 200 });
    } catch (error) {
        console.error('Error fetching job details:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}