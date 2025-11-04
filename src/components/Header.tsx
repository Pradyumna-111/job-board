import Link from "next/link";
import {
    SignedIn,
    SignedOut,
    SignInButton,
    SignUpButton,
    UserButton,
} from "@clerk/nextjs";

export default function Header() {
    return (
        <header className="flex justify-between items-center p-4 h-16 shadow bg-white">
            {/* Left: Site Branding */}
            <Link href="/" className="text-2xl font-bold text-blue-700">
                Recruitment Board
            </Link>

            {/* Right: Auth Buttons */}
            <div className="flex items-center gap-4">
                <SignedOut>
                    <SignInButton>
                        <button className="bg-blue-600 text-white rounded px-4 py-2 font-semibold">
                            Login
                        </button>
                    </SignInButton>
                    <SignUpButton>
                        <button className="bg-white border border-blue-600 text-blue-600 rounded px-4 py-2 font-semibold ml-2">
                            Register
                        </button>
                    </SignUpButton>
                </SignedOut>
                <SignedIn>
                    <UserButton />
                </SignedIn>
            </div>
        </header>
    );
}
