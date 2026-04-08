import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import * as pdf from 'pdf-parse';

// Handle potentially missing default export in pdf-parse
const parsePdf = (pdf as any).default || pdf;

export async function POST(req: Request) {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        let text = '';

        if (file.type === 'application/pdf') {
            const data = await parsePdf(buffer);
            text = data.text;
        } else if (file.type === 'text/plain') {
            text = buffer.toString('utf-8');
        } else {
            return NextResponse.json({ error: 'Unsupported file type' }, { status: 400 });
        }

        return NextResponse.json({ text });
    } catch (error) {
        console.error('Parse resume API error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
