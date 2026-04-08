import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import ResumeUpload from '@/components/ResumeUpload';
import AIJobAgent from '@/components/AIJobAgent';

export default async function AIAgentPage() {
    const { userId } = await auth();
    if (!userId) redirect('/sign-in');

    return (
        <div className="max-w-6xl mx-auto py-10 px-6 space-y-10">
            <header className="text-center space-y-3">
                <h1 className="text-4xl font-extrabold text-blue-900 dark:text-blue-400">Your AI Job Agent</h1>
                <p className="text-xl text-gray-600 dark:text-gray-400">
                    Upload your resume, then chat to find, match, and apply to jobs
                </p>
            </header>

            <section>
                <ResumeUpload />
            </section>

            <section className="flex-grow">
                <AIJobAgent />
            </section>
        </div>
    );
}
