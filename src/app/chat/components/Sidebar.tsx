"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import UserItem from "./UserItem";
import { SidebarSkeleton } from "./LoadingStates";

// Skeleton import 
import { User } from "../types";
import { Search, ChevronLeft, MessageSquare } from "lucide-react";

type SidebarProps = {
  users: User[];
  onUserClick: (user: User) => void;
  currentUserId: string;
  isMobileView: boolean;
  onBack?: () => void;
};

export default function Sidebar({
  users,
  onUserClick,
  currentUserId,
  isMobileView,
  onBack,
}: SidebarProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const conversations = useQuery(api.functions.conversations.getUserConversations, {
    userId: currentUserId,
  });

  //Loading State Handle karein
  // if conversations and users are still loading, show the skeleton
  if (!users || conversations === undefined) {
    return <SidebarSkeleton />;
  }

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-white border-r border-slate-200 w-full">
      {/* --- Sidebar Header --- */}
      <div className="p-4 pt-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-xl shadow-indigo-200 shadow-lg">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">Chats</h1>
          </div>
          
          {isMobileView && onBack && (
            <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500">
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}
        </div>

        {/* --- Search Bar --- */}
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
          <input
            type="text"
            placeholder="Search friends..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} // Search filter working kar diya
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all placeholder:text-slate-400 text-slate-700"
          />
        </div>
      </div>

      {/* --- User List Section --- */}
      <div className="flex-1 overflow-y-auto px-2 pb-4">
        <div className="mt-2 space-y-1">
          {filteredUsers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
              <p className="text-slate-400 text-sm font-medium">
                {searchTerm ? "No search results" : "No friends found"}
              </p>
            </div>
          ) : (
            filteredUsers.map(u => {
              const userConv = conversations?.find(conv => 
                conv.memberIds.includes(u.clerkId) && conv.memberIds.includes(currentUserId)
              );

              const unreadCount = userConv?.unreadCount || 0;

              return (
                <UserItem
                  key={u._id}
                  user={u}
                  unreadCount={unreadCount} 
                  onClick={() => onUserClick(u)}
                />
              );
            })
          )}
        </div>
      </div>

      {/* --- Footer --- */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">
          Connected to ChatSphere
        </p>
      </div>
    </div>
  );
}