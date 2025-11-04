# Job Board Platform

A modern, full-stack job board application built with Next.js, featuring job search powered by RapidAPI, secure authentication with Clerk, and a polished UI using shadcn/ui components.

## Features

- 🔍 **Job Search Integration** - Real-time job listings via RapidAPI
- 🔐 **Secure Authentication** - User management powered by Clerk
- 🎨 **Modern UI** - Beautiful, accessible components with shadcn/ui
- ⚡ **Server-Side Rendering** - Fast page loads with Next.js
- 📱 **Responsive Design** - Works seamlessly on all devices
- 💾 **Saved Jobs** - Bookmark and manage favorite job listings
- 🔔 **Job Alerts** - Get notified about relevant opportunities

## Tech Stack

- **Framework**: [Next.js 14+](https://nextjs.org/) (App Router)
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
RAPIDAPI_HOST=your_api_host
```

### 4. Run the Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Setting Up Services

### Clerk Authentication

1. Go to [Clerk Dashboard](https://dashboard.clerk.com/)
2. Create a new application
3. Copy your API keys to `.env.local`
4. Configure your authentication options (email, social providers, etc.)

### RapidAPI Setup

1. Visit [RapidAPI Hub](https://rapidapi.com/hub)
2. Search for job board APIs (e.g., "JSearch", "LinkedIn Jobs API")
3. Subscribe to your chosen API
4. Copy the API key and host to `.env.local`

### shadcn/ui Components

Components are already configured. To add new ones:

```bash
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add dialog
```

## Project Structure

```
job-board/
├── app/
│   ├── (auth)/
│   │   ├── sign-in/
│   │   └── sign-up/
│   ├── api/
│   │   └── jobs/
│   ├── jobs/
│   │   └── [id]/
│   ├── saved-jobs/
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/              # shadcn/ui components
│   ├── JobCard.tsx
│   ├── JobFilters.tsx
│   └── SearchBar.tsx
├── lib/
│   ├── utils.ts
│   └── api.ts           # RapidAPI integration
├── public/
└── styles/
```

## Key Features Implementation

### Job Search
Jobs are fetched from RapidAPI with filters for location, title, experience level, and employment type.

### Authentication
Clerk handles user registration, login, and session management with support for email and social providers.

### UI Components
shadcn/ui provides accessible, customizable components built on Radix UI primitives and styled with Tailwind CSS.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project on [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy

### Other Platforms

This Next.js app can be deployed to any platform that supports Node.js:
- Netlify
- AWS Amplify
- Railway
- Render

## Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk public key | Yes |
| `CLERK_SECRET_KEY` | Clerk secret key | Yes |
| `RAPIDAPI_KEY` | RapidAPI authentication key | Yes |
| `RAPIDAPI_HOST` | RapidAPI host endpoint | Yes |

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For issues and questions:
- Open an issue on GitHub
- Check [Clerk Documentation](https://clerk.com/docs)
- Check [Next.js Documentation](https://nextjs.org/docs)
- Check [shadcn/ui Documentation](https://ui.shadcn.com)

## Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing framework
- [Clerk](https://clerk.com/) for authentication
- [shadcn/ui](https://ui.shadcn.com/) for beautiful components
- [RapidAPI](https://rapidapi.com/) for job data access
- [Vercel](https://vercel.com/) for hosting
