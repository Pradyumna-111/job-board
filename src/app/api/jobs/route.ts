import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const res = await fetch("https://jsearch.p.rapidapi.com/search?query=developer&num_pages=1", {
            method: "GET",
            headers: {
                "X-RapidAPI-Key": process.env.RAPIDAPI_KEY!,
                "X-RapidAPI-Host": "jsearch.p.rapidapi.com",
            },
        });

        if (!res.ok) {
            const errorText = await res.text();
            console.error("JSearch API error:", res.status, errorText);
            return new Response("Failed to fetch jobs from external API", { status: res.status });
        }

        const data = await res.json();
        const jobs = data.data || [];
        return new Response(JSON.stringify({ jobs }), { status: 200 });
    } catch (error) {
        console.error("Error fetching jobs:", error);
        return new Response("Internal Server Error", { status: 500 });
    }
}
