"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import ChatArea from "./components/ChatArea";
import { User } from "./types";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

interface ChatLayoutProps {
  children: React.ReactNode;
}

export default function ChatLayout({ children }: ChatLayoutProps) {
  const { user } = useUser();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [usersList, setUsersList] = useState<User[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Detect mobile screen
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  //  Fetch users from Convex
  const allUsersQuery = useQuery(api.functions.users.getAllUsers) as User[] | undefined;

  useEffect(() => {
    if (allUsersQuery && user) {
      setUsersList(allUsersQuery.filter(u => u.clerkId !== user.id));
    }
  }, [allUsersQuery, user]);

  // Handle user click
  const handleUserClick = (clickedUser: User) => {
    setSelectedUser(clickedUser);
    if (isMobile) setIsSidebarOpen(false); // close sidebar on mobile after selecting
  };

  // Toggle sidebar for hamburger
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // Back button for mobile sidebar
  const handleBack = () => setIsSidebarOpen(false);

  return (
    <div className="flex h-screen relative bg-gray-50">
      {/* Hamburger button */}
      {isMobile && !isSidebarOpen && (
        <button
          onClick={toggleSidebar}
          className="absolute top-4 left-4 z-50 p-2 bg-gray-200 text-black rounded shadow-md"
        >
          ☰
        </button>
      )}

      {/* Sidebar */}
      {(isSidebarOpen || !isMobile) && (
        <Sidebar
          users={usersList}
          onUserClick={handleUserClick}
          currentUserId={user?.id || ""}
          isMobileView={isMobile}
          onBack={handleBack}
        />
      )}

      {/* Chat Area */}
      <div className="flex-1">
        {selectedUser && user ? (
          <ChatArea selectedUser={selectedUser} currentUserId={user.id} onBack={() => setSelectedUser(null)} />
        ) : (
          !isMobile && children
        )}
      </div>
    </div>
  );
}