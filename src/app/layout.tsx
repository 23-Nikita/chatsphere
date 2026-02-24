import type { Metadata } from "next";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  UserButton,
  SignInButton,
  SignUpButton,
} from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ConvexClientProvider } from "./ConvexClientProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ChatSphere",
  description: "Real-time chat application",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50`}
        >
          <ConvexClientProvider>
            {/* Header */}
            <header className="flex flex-col sm:flex-row justify-between items-center p-4 border-b bg-white shadow-md">
              <h1 className="text-2xl font-bold text-indigo-600 flex items-center gap-2">
                ChatSphere
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-indigo-500"
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
              </h1>

              {/* User Auth Buttons */}
              <div className="flex items-center gap-4 mt-2 sm:mt-0">
                <SignedOut>
                  <SignInButton
                    mode="modal"
                    forceRedirectUrl="/chat"
                    children={
                      <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded shadow">
                        Sign In
                      </button>
                    }
                  />
                  <SignUpButton
                    mode="modal"
                    forceRedirectUrl="/chat"
                    children={
                      <button className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded shadow">
                        Sign Up
                      </button>
                    }
                  />
                </SignedOut>

                <SignedIn>
                  <UserButton afterSignOutUrl="/" />
                </SignedIn>
              </div>
            </header>

            {/* Page Content */}
            <main className="min-h-[80vh]">{children}</main>
          </ConvexClientProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}