# Job Board Platform

A modern, full-stack job board application built with Next.js, featuring an **AI Job Agent powered by Google Gemini**, job search via RapidAPI, secure authentication with Clerk, and a polished UI using shadcn/ui components.

🚀 **[Live Demo](https://job-board-3g6d.vercel.app/)**

## 🤖 New: AI-Powered Features

- **AI Job Agent**: A specialized chat agent that helps you find jobs, answer questions, and provides career advice.
- **AI Match Score**: Get instant feedback on how well your resume matches a job description, with specific reasons and improvement tips.
- **Resume Parsing**: Upload your PDF or TXT resume, and the AI will use your background to personalize recommendations.
- **Cover Letter Generator**: Generate professional, tailored cover letters in seconds based on your experience and the job role.

## Features

- 🔍 **Job Search Integration** - Real-time job listings via RapidAPI
- 🔐 **Secure Authentication** - User management powered by Clerk
- 🎨 **Modern UI** - Beautiful, accessible components with shadcn/ui
- ⚡ **Server-Side Rendering** - Fast page loads with Next.js
- 📱 **Responsive Design** - Works seamlessly on all devices
- 💾 **Saved Jobs** - Bookmark and manage favorite job listings
- 🔔 **Job Alerts** - Get notified about relevant opportunities

## Tech Stack

- **Framework**: [Next.js 16+](https://nextjs.org/) (App Router)
- **AI**: [Google Gemini 1.5 Flash](https://ai.google.dev/)
- **Authentication**: [Clerk](https://clerk.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Styling**: Tailwind CSS
- **Job Data API**: [RapidAPI](https://rapidapi.com/)
- **Type Safety**: TypeScript

## Prerequisites

Before you begin, ensure you have the following:

- Node.js 18+ installed
- npm or yarn package manager
- A Clerk account ([Sign up here](https://clerk.com/))
- A RapidAPI account ([Sign up here](https://rapidapi.com/))
- A Google AI Studio API key ([Get it here](https://aistudio.google.com/))

## Getting Started

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd job-board
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Environment Variables

Create a `.env.local` file in the root directory and add the following:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Clerk URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

# RapidAPI
RAPIDAPI_KEY=your_rapidapi_key
RAPIDAPI_HOST=jsearch.p.rapidapi.com

# Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key
```

### 4. Run the Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/
│   ├── ai-agent/        # AI Agent Chat Page
│   ├── api/
│   │   ├── agent/       # Gemini Orchestrator
│   │   ├── match/       # Resume Scorer
│   │   ├── coverletter/ # Letter Generator
│   │   └── parse-resume/# PDF Parser
│   ├── jobs/
│   │   └── [id]/        # Job Detail with Match Score
├── components/
│   ├── AIJobAgent.tsx   # Chat UI
│   ├── ResumeUpload.tsx # Dropzone & Parser
│   ├── JobMatchScore.tsx# Visual Score UI
│   └── JobCard.tsx      # Reusable Job Card
├── lib/
│   ├── gemini.ts        # Gemini SDK Wrapper
│   ├── agentTools.ts    # Agent Tool Definitions
│   └── api.ts           # RapidAPI utility
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk public key | Yes |
| `CLERK_SECRET_KEY` | Clerk secret key | Yes |
| `RAPIDAPI_KEY` | RapidAPI authentication key | Yes |
| `GEMINI_API_KEY` | Google Gemini API key | Yes |

## License

This project is licensed under the MIT License.
