"use client";
import { SignIn } from "@clerk/nextjs";
export default function SignInPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-[80vh]">
      <h2 className="text-4xl font-bold mb-4">Sign In to ChatSphere 💬</h2>
      <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" />
    </main>
  );
}