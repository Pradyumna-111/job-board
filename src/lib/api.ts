export interface ExternalJob {
    job_id: string;
    job_title: string;
    company_name: string;
    job_location: string;
    job_description: string;
    job_employment_type?: string;
    job_highlights?: {
        Qualifications?: string[];
        Responsibilities?: string[];
        Benefits?: string[];
    };
}

export interface FormattedJob {
    id: string;
    title: string;
    company: string;
    location: string;
    description: string;
    isExternal: boolean;
    type?: string;
}

export async function searchJobs(query: string, location?: string, employmentType?: string, experienceLevel?: string): Promise<FormattedJob[]> {
    const params = new URLSearchParams({
        query: `${query}${location ? ` in ${location}` : ''}`,
        num_pages: '1',
    });

    if (employmentType) params.append('employment_types', employmentType);
    if (experienceLevel) params.append('job_requirements', experienceLevel);

    try {
        const res = await fetch(`https://jsearch.p.rapidapi.com/search?${params.toString()}`, {
            method: "GET",
            headers: {
                "X-RapidAPI-Key": process.env.RAPIDAPI_KEY || '',
                "X-RapidAPI-Host": "jsearch.p.rapidapi.com",
            },
        });

        if (!res.ok) {
            console.error("JSearch API error:", res.status);
            return [];
        }

        const data = await res.json();
        return (data.data || []).map((job: ExternalJob) => ({
            id: job.job_id,
            title: job.job_title,
            company: job.company_name,
            location: job.job_location,
            description: job.job_description,
            isExternal: true,
            type: job.job_employment_type?.toLowerCase(),
        }));
    } catch (error) {
        console.error("Error searching jobs:", error);
        return [];
    }
}
