import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { runAgent } from '@/lib/gemini';
import { toolDeclarations, toolImplementations } from '@/lib/agentTools';

export async function POST(req: Request) {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const { message, resume, history = [] } = await req.json();

        // The tool implementation for search_jobs returns the job listings.
        // We need to capture those specifically if they were fetched.
        // runAgent currently returns text and toolCalls names.
        // We might need to modify runAgent or handle the results here.

        // Let's enhance the tool implementations to store results temporarily or return them differently.
        // For now, I'll stick to the core runAgent and if search_jobs was called,
        // we might want the actual data.

        // I'll wrap the implementation of search_jobs to capture its output.
        let lastSearchResults: any[] = [];
        const wrappedImplementations = {
            ...toolImplementations,
            search_jobs: async (args: any) => {
                const results = await toolImplementations.search_jobs(args);
                lastSearchResults = results;
                return results;
            }
        };

        // Inject resume into tools if available
        const messageWithResume = resume ? `${message}\n\nUser's Resume: ${resume}` : message;

        const result = await runAgent(messageWithResume, { declarations: toolDeclarations, implementations: wrappedImplementations }, history);

        return NextResponse.json({
            response: result.text,
            toolsUsed: result.toolCalls,
            jobs: lastSearchResults.length > 0 ? lastSearchResults : undefined
        });
    } catch (error) {
        console.error('Agent API error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
