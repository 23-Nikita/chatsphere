# ChatSphere 🚀
A real-time 1-on-1 chat application built for the Tars Fullstack Engineer Challenge 2026.

Live Demo: https://chatsphere-ten.vercel.app/

## 🛠️ Tech Stack
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Backend/Database:** Convex (Real-time subscriptions)
- **Authentication:** Clerk
- **Styling:** Tailwind CSS + Lucide React icons

## ✨ Features Implemented
- **Real-time Messaging:** Instant message delivery using Convex.
- **Typing Indicators:** Real-time "User is typing..." status.
- **Read Receipts:** Track when messages are seen.
- **Unread Badges:** Notification counts for new messages.
- **User Search:** Filter friends by name instantly.
- **Presence:** Online/Offline green indicators.
- **Responsive Design:** Optimized for Mobile and Desktop.
- **Smart Auto-scroll:** Automatically scrolls to the latest message.

## 🚀 Getting Started
1. Clone the repo: `git clone <your-repo-link>`
2. Install dependencies: `npm install`
3. Set up environment variables (.env.local) for Clerk and Convex.
4. Run development server: `npm run dev`
5. Start Convex: `npx convex dev`

## 📂 Project Structure
- `convex/`: Backend functions and schema.
- `src/app/`: Next.js pages and layouts.
- `src/components/`: Reusable UI components (Sidebar, ChatArea, etc.).
