// 📄 app/applications/apply/[jobId]/page.tsx
import ApplicationForm from '@/components/ApplicationForm';

export default async function ApplicationPage({ params }: { params: Promise<{ jobId: string }> }) {
    const { jobId } = await params; // ✅ Unwrap the Promise

    return (
        <div className="container mx-auto">
            <ApplicationForm jobId={jobId} />
        </div>
    );
}
