import React from "react";

// Sidebar Skeleton
export const SidebarSkeleton = () => (
  <div className="flex flex-col h-full bg-white border-r border-slate-200 w-full animate-pulse">
    <div className="p-4 pt-6 space-y-6">
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 bg-slate-200 rounded-xl" />
        <div className="h-6 bg-slate-200 rounded w-24" />
      </div>
      <div className="h-10 bg-slate-100 rounded-2xl w-full" />
    </div>
    <div className="flex-1 px-2 space-y-4 mt-4">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-3">
          <div className="w-12 h-12 bg-slate-200 rounded-full" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-slate-200 rounded w-1/3" />
            <div className="h-3 bg-slate-100 rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Chat Area Skeleton
export const ChatSkeleton = () => (
  <div className="flex flex-col h-full w-full bg-white animate-pulse">
    {/* Header Skeleton */}
    <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-3">
      <div className="w-10 h-10 bg-slate-200 rounded-full" />
      <div className="space-y-2">
        <div className="h-4 bg-slate-200 rounded w-24" />
        <div className="h-3 bg-slate-100 rounded w-16" />
      </div>
    </div>
    
    {/* Messages Skeleton */}
    <div className="flex-1 p-6 space-y-8 bg-slate-50/50">
      <div className="flex justify-start"><div className="h-12 w-64 bg-slate-200 rounded-2xl rounded-tl-none" /></div>
      <div className="flex justify-end"><div className="h-12 w-48 bg-indigo-100 rounded-2xl rounded-tr-none" /></div>
      <div className="flex justify-start"><div className="h-12 w-56 bg-slate-200 rounded-2xl rounded-tl-none" /></div>
      <div className="flex justify-end"><div className="h-12 w-72 bg-indigo-100 rounded-2xl rounded-tr-none" /></div>
    </div>

    {/* Input Skeleton */}
    <div className="p-4 border-t border-slate-100">
      <div className="h-12 bg-slate-100 rounded-2xl w-full" />
    </div>
  </div>
);