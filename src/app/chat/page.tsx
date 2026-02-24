"use client";

import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import ChatArea from "./components/ChatArea";
import { MessageSquareText } from "lucide-react";

type User = {
  _id: string;
  clerkId: string;
  name: string;
  email: string;
  imageUrl: string;
  isOnline: boolean;
};

export default function ChatPage() {
  const { user } = useUser();
  const createUser = useMutation(api.functions.users.createUser);
  const createConversation = useMutation(api.functions.conversations.createConversation);
  const setOnlineStatus = useMutation(api.functions.users.setOnlineStatus);
  
  const allUsersQuery = useQuery(api.functions.users.getAllUsers) as User[] | undefined;

  const [usersList, setUsersList] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (user) {
      createUser({
        clerkId: user.id,
        name: user.fullName || "No Name",
        email: user.primaryEmailAddress?.emailAddress || "",
        imageUrl: user.imageUrl,
      }).catch((err) => console.error("Error creating user:", err));
    }
  }, [user, createUser]);

  // Updated Presence Logic
  useEffect(() => {
    if (!user) return;

    const updateStatus = (status: boolean) => {
      setOnlineStatus({ clerkId: user.id, isOnline: status }).catch(() => {});
    };

    // Initial Online
    updateStatus(true);

    // Visibility change handle k
    const handleVisibilityChange = () => {
      updateStatus(document.visibilityState === "visible");
    };

    // When Browser Tab is closed or refreshed
    const handleBeforeUnload = () => {
      updateStatus(false);
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("beforeunload", handleBeforeUnload);


    const interval = setInterval(() => {
      if (document.visibilityState === "visible") updateStatus(true);
    }, 60000);

    return () => {
      updateStatus(false); // Cleanup on logout
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      clearInterval(interval);
    };
  }, [user?.id, setOnlineStatus]); 

  useEffect(() => {
    if (allUsersQuery && user) {
      setUsersList(allUsersQuery.filter((u) => u.clerkId !== user.id));
    }
  }, [allUsersQuery, user]);

  const handleUserClick = (otherUser: User) => {
    if (!user) return;
    setSelectedUser(otherUser);
  };

  const handleBack = () => setSelectedUser(null);

  return (
    <div className="flex h-[100dvh] bg-[#F8FAFC] text-slate-900 overflow-hidden font-sans">
      <div className="flex w-full h-full mx-auto overflow-hidden relative">
        <aside className={`${isMobile && selectedUser ? 'hidden' : 'flex'} w-full md:w-[350px] lg:w-[380px] border-r border-slate-200 bg-white flex-col z-10`}>
          <Sidebar
            users={usersList}
            onUserClick={handleUserClick}
            currentUserId={user?.id || ""}
            isMobileView={isMobile}
            onBack={handleBack}
          />
        </aside>

        <main className={`flex-1 relative bg-[#F1F5F9] transition-all duration-300 ${isMobile && !selectedUser ? 'hidden' : 'flex'} flex-col`}>
          {selectedUser ? (
            <ChatArea
              selectedUser={selectedUser}
              currentUserId={user?.id || ""}
              onBack={handleBack}
            />
          ) : (
            <div className="hidden md:flex flex-col items-center justify-center h-full text-center p-8 bg-white/50 backdrop-blur-sm">
              <div className="w-24 h-24 rounded-[2rem] bg-indigo-600 flex items-center justify-center mb-6 shadow-2xl shadow-indigo-200">
                <MessageSquareText className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-3xl font-extrabold text-slate-800 mb-3 tracking-tight italic">ChatSphere<span className="text-indigo-600">.</span></h2>
              <p className="text-slate-500 max-w-xs leading-relaxed font-medium">
                Connect with your friends in real-time. Select a contact to start messaging.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}