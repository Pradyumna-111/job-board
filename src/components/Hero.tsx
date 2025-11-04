import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Hero() {
    return (
        <section className="flex flex-col items-center justify-center py-20 bg-gradient-to-b from-blue-100 to-white">
            <h1 className="text-5xl font-bold text-blue-900 mb-4 text-center">Find Your Dream Tech Job</h1>
            <p className="text-xl text-blue-600 mb-8 text-center">
                Discover, track, and apply for the top software and data roles.
            </p>
            <div className="flex gap-2">
                <Input
                    type="text"
                    placeholder="Search jobs (eg: frontend)"
                    className="w-72"
                />
                <Button>Search</Button>
            </div>
        </section>
    );
}
