// job-board/src/app/sign-up/page.tsx
import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-blue-50">
            <SignUp forceRedirectUrl={"/dashboard"}/>
        </div>
    );
}