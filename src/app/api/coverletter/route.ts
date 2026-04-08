import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getModel } from '@/lib/gemini';

export async function POST(req: Request) {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const { jobTitle, company, jobDescription, userBackground } = await req.json();
        const model = getModel();

        const prompt = `Write a professional 3-paragraph cover letter for a ${jobTitle} role at ${company}.
        Job Description: ${jobDescription}
        User Background: ${userBackground}`;

        const result = await model.generateContent(prompt);
        return NextResponse.json({ coverLetter: result.response.text() });
    } catch (error) {
        console.error('Cover letter API error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
