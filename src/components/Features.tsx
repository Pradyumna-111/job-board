const features = [
    { title: "Personalized Job Matching", desc: "Get recommendations using AI that suit your skills." },
    { title: "Instant Alerts", desc: "Notifications for new jobs and interview calls." },
    { title: "Simple Application", desc: "Quickly apply from any device, anytime." }
];

import JobFeatureCard from "./JobFeatureCard";

export default function Features() {
    return (
        <section className="py-16 bg-blue-50 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {features.map(f => (
                <JobFeatureCard key={f.title} {...f} />
            ))}
        </section>
    );
}
