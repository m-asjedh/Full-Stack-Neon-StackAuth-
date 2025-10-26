import { SignIn } from "@stackframe/stack";
import Link from "next/link";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-300 to-purple-100">
      <div>
        <SignIn />
        <div className="flex justify-center mt-4 text-black text-sm p-2 bg-gray-50 hover:bg-gray-300  cursor-pointer rounded-lg">
          <Link href="/">Back to Home</Link>
        </div>
      </div>
    </div>
  );
}
