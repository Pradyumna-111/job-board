import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/db";
import Application from "@/models/Application";

export async function POST(request: Request) {
    const { userId, job, coverLetter, resume } = await request.json();

    await connectToDB();

    const existing = await Application.findOne({ userId, "job.id": job.id });
    if (existing) {
        return NextResponse.json({ message: "Already applied" }, { status: 409 });
    }

    const newApp = new Application({ userId, job, coverLetter, resume });
    await newApp.save();

    return NextResponse.json({ message: "Application saved" }, { status: 201 });
}
