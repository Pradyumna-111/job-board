import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function JobFeatureCard({ title, desc }: { title: string, desc: string }) {
    return (
        <Card className="max-w-xs mx-auto">
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-gray-500">{desc}</p>
            </CardContent>
        </Card>
    );
}
