// job-board/src/app/sign-in/page.tsx
import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-blue-50">
            <SignIn forceRedirectUrl={"/dashboard"} />
        </div>
    );
}

