import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

interface UserProfile {
    skills: string[];
    experience: Array<{ title: string; description: string }>;
}

interface Job {
    id: string;
    title: string;
    description: string;
}

export async function getJobRecommendations(userProfile: UserProfile, jobs: Job[]) {
    try {
        const { text } = await generateText({
            model: google('gemini-1.5-pro'),
            prompt: `
                Based on the user's profile: ${JSON.stringify(userProfile)}
                And the available jobs: ${JSON.stringify(jobs.map(j => ({ id: j.id, title: j.title, description: j.description })))}

                Recommend the top 3 jobs that match the user's skills and experience.
                Return only a JSON array of job IDs.
            `,
        });

        return JSON.parse(text) as string[];
    } catch (error) {
        console.error('AI recommendation error:', error);
        return [];
    }
}
