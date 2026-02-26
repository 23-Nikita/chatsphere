"use client";

import { UserItemProps } from "../types";


interface ExtendedUserItemProps extends UserItemProps {
  unreadCount?: number;
}

export default function UserItem({ user, onClick, unreadCount = 0 }: ExtendedUserItemProps) {
  return (
    <div
      className={`
        group relative flex items-center gap-3 p-3 mx-2 my-1
        cursor-pointer rounded-2xl transition-all duration-200
        hover:bg-indigo-50/80 active:scale-[0.98]
      `}
      onClick={() => onClick(user)}
    >
      {/* --- Avatar with Status --- */}
      <div className="relative flex-shrink-0">
        <img
          src={user.imageUrl}
          alt={user.name}
          // Fallback logic: if image is not load then add ui avatars with random background
          onError={(e) => {
            e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random&color=fff`;
          }}
          className="w-12 h-12 rounded-full object-cover border-2 border-transparent group-hover:border-white transition-all shadow-sm"
        />
        
        {/* Online Status Indicator */}
        <span className={`
          absolute bottom-0.5 right-0.5 w-3.5 h-3.5 border-2 border-white rounded-full shadow-sm
          ${user.isOnline ? "bg-green-500 animate-pulse" : "bg-slate-300"}
        `}></span>
      </div>

      {/* --- User Details --- */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-bold text-[15px] text-slate-800 truncate group-hover:text-indigo-700 transition-colors">
            {user.name}
          </h3>
          
          {/* Unread Message Badge */}
          {unreadCount > 0 && (
            <span className="
              flex items-center justify-center 
              bg-indigo-600 text-white text-[10px] font-bold 
              min-w-[20px] h-5 px-1.5 rounded-full 
              shadow-lg shadow-indigo-200 ring-2 ring-white
              animate-bounce-short
            ">
              {unreadCount}
            </span>
          )}
        </div>
        
        <div className="flex items-center justify-between mt-0.5">
          <p className="text-xs text-slate-500 truncate font-medium">
            {user.isOnline ? (
              <span className="text-green-600">Online now</span>
            ) : (
              "Away"
            )}
          </p>
          
          {/* OPEN indicator on hover */}
          <span className="text-[10px] text-indigo-400 font-bold opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
            OPEN
          </span>
        </div>
      </div>

      {/* Subtle border overlay */}
      <div className="absolute inset-0 border border-transparent group-hover:border-indigo-100 rounded-2xl pointer-events-none transition-all"></div>
    </div>
  );
}