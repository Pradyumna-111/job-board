# 🚀 AI-Powered Next.js Job Board

Welcome to the future of job searching. This application is a high-performance, full-stack job board platform built with **Next.js 16**, **TypeScript**, and **Tailwind CSS**, now supercharged with **Google Gemini 1.5 Flash** for an agentic, AI-first user experience.

---

## 🌟 Key Features

### 🤖 Agentic AI Job Assistant
*   **Natural Language Search**: Find jobs by chatting—e.g., "Find me remote React roles in Europe."
*   **Context-Aware**: The agent automatically uses your uploaded resume to tailor its search results and advice.
*   **Smart Tools**: The AI can search jobs, save listings, score matches, and draft letters autonomously.

### 📊 AI Match Scoring & Analysis
*   **Dynamic Matching**: Instantly see how well you fit a role with a 0-100% match score.
*   **Actionable Feedback**: Get 3 specific reasons why you're a good fit and 3 concrete ways to improve your resume for that specific role.

### 📝 Professional Cover Letter Generator
*   **One-Click Drafting**: Generate a professional, 3-paragraph cover letter tailored to the job description and your unique background.
*   **Copy to Clipboard**: Fast and efficient workflow for applying to multiple roles.

### 📄 Intelligent Resume Parsing
*   **PDF/TXT Support**: Drag-and-drop your resume for instant text extraction.
*   **Local Persistence**: Your resume is stored securely in your browser's local storage for privacy and convenience.

### 🔍 Core Job Board Functionality
*   **RapidAPI Integration**: Fetches real-time, global job listings from the JSearch API.
*   **Secure Auth**: User management and role-based access control (Seeker/Recruiter) via **Clerk**.
*   **Responsive UI**: A polished, dark-mode-ready interface built with **shadcn/ui**.

---

## 🛠 Tech Stack

| Category | Technology |
| :--- | :--- |
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router) |
| **AI / LLM** | [Google Gemini 1.5 Flash](https://ai.google.dev/) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) & [shadcn/ui](https://ui.shadcn.com/) |
| **Authentication** | [Clerk](https://clerk.com/) |
| **Data Fetching** | [RapidAPI JSearch](https://rapidapi.com/letscrape-6bR47QBD7/api/jsearch) |
| **Database** | [MongoDB](https://www.mongodb.com/) with Mongoose |
| **PDF Parsing** | [pdf-parse](https://www.npmjs.com/package/pdf-parse) |

---

## 🚀 Getting Started

### 1. Prerequisites
*   Node.js 18.17 or later
*   npm, yarn, or pnpm
*   Accounts for: [Clerk](https://clerk.com/), [RapidAPI](https://rapidapi.com/), [Google AI Studio](https://aistudio.google.com/)

### 2. Installation
```bash
git clone https://github.com/your-username/job-board-ai.git
cd job-board-ai
npm install
```

### 3. Environment Setup
Create a `.env.local` file in the root and populate it with your credentials:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# Database
MONGODB_URI=mongodb+srv://...

# External APIs
RAPIDAPI_KEY=your_rapidapi_key
GEMINI_API_KEY=your_google_gemini_key

# Email (Optional)
RESEND_API_KEY=re_...
```

### 4. Running the App
```bash
npm run dev
```
Visit `http://localhost:3000` to see the application in action.

---

## 📂 Project Architecture

```text
src/
├── app/
│   ├── ai-agent/        # The central AI chat experience
│   ├── api/             # Backend endpoints (Agent, Match, Parse, Jobs)
│   ├── jobs/            # Job browsing and detailed match pages
│   └── applications/    # Application management system
├── components/
│   ├── ui/              # Radix UI primitives (shadcn)
│   ├── AIJobAgent.tsx   # Core Chat UI and logic
│   ├── JobMatchScore.tsx# Visual analysis component
│   └── ResumeUpload.tsx # File handling and parsing logic
├── lib/
│   ├── gemini.ts        # AI SDK wrapper and agent orchestrator
│   ├── agentTools.ts    # Custom tools for Gemini function calling
│   └── api.ts           # Reusable data fetching utilities
└── models/              # Mongoose database schemas
```

---

## 🤖 AI Implementation Details

The AI Agent utilizes a **Reason-and-Act (ReAct)** loop implemented in `src/lib/gemini.ts`. It leverages Gemini's native **Function Calling** capabilities to interact with the platform.

### Supported Tools:
1.  `search_jobs`: Queries external job data with filters for location, type, and level.
2.  `save_job`: Markers jobs for future interest.
3.  `score_resume_match`: Compares specific descriptions against user resumes.
4.  `draft_cover_letter`: Generates professional correspondence.

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

## 🙌 Acknowledgments

*   [Google AI SDK](https://github.com/google/generative-ai-js) for the Gemini integration.
*   [shadcn](https://twitter.com/shadcn) for the incredible UI components.
*   [Lucide React](https://lucide.dev/) for the beautiful icons.

---

Built with ❤️ for a better career search experience.
