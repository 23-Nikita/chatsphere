"use client";

import { SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      
      {/* Welcome Heading */}
      <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-gray-900 flex items-center justify-center gap-3">
        Welcome to Chatapp
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8 text-indigo-600 animate-bounce"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M7 8h10M7 12h4m1 8a9 9 0 11-8.485-5.657L3 21l3.657-1.515A8.963 8.963 0 0112 21z"
          />
        </svg>
      </h2>

      {/* Subheading */}
      <p className="text-gray-700 mb-8 text-lg sm:text-xl max-w-md">
        Connect and chat in real time with friends or colleagues. Stay updated with live messages and notifications.
      </p>

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Show only if user is signed in */}
        <SignedIn>
          <a
            href="/chat"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded shadow-lg transition transform hover:-translate-y-1"
          >
            Get Started
          </a>
        </SignedIn>

        {/* Show Sign In / Sign Up if user is signed out */}
        <SignedOut>
          <SignInButton mode="modal">
            <button className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded shadow-lg transition transform hover:-translate-y-1">
              Sign In
            </button>
          </SignInButton>
          <SignUpButton mode="modal">
            <button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-3 rounded shadow-lg transition transform hover:-translate-y-1">
              Sign Up
            </button>
          </SignUpButton>
        </SignedOut>
      </div>
    </main>
  );
}