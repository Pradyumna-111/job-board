import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getModel } from '@/lib/gemini';

export async function POST(req: Request) {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const { jobDescription, resumeText } = await req.json();
        const model = getModel();

        const prompt = `Compare this resume to the job description. Return ONLY valid JSON with keys: score (0-100 integer), reasons (array of 3 strings), improvements (array of 3 strings).
        Job Description: ${jobDescription}
        Resume: ${resumeText}`;

        const result = await model.generateContent(prompt);
        const text = result.response.text();

        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return NextResponse.json(JSON.parse(jsonMatch[0]));
        } else {
            return NextResponse.json({ error: 'Failed to parse AI response' }, { status: 500 });
        }
    } catch (error) {
        console.error('Match API error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
