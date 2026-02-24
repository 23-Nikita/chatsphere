"use client";
import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { User } from "../types";
import { SendHorizontal, ChevronLeft, MoreVertical, RefreshCcw } from "lucide-react";
import { ChatSkeleton } from "./LoadingStates"; //Skeleton import

export default function ChatArea({ selectedUser, currentUserId, onBack }: { selectedUser: User | null, currentUserId: string, onBack: () => void }) {
  const [messageText, setMessageText] = useState("");
  const [isSending, setIsSending] = useState(false); //Sending state
  const [error, setError] = useState<string | null>(null); // Error state
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Queries
  const conversation = useQuery(api.functions.conversations.getConversationWithUser, 
    selectedUser ? { currentUserId, otherUserId: selectedUser.clerkId } : "skip"
  );

  const messages = useQuery(api.functions.conversations.getMessagesByConversation, 
    conversation?._id ? { conversationId: conversation._id } : "skip"
  );

  // Mutations
  const sendMessageMutation = useMutation(api.functions.messages.sendMessage);
  const typingMutation = useMutation(api.functions.conversations.setTypingStatus);
  const markAsSeenMutation = useMutation(api.functions.messages.markAsSeen);

  // Mark as seen logic
  useEffect(() => {
    if (conversation?._id && currentUserId) {
      markAsSeenMutation({ 
        conversationId: conversation._id, 
        currentUserId: currentUserId 
      }).catch(console.error);
    }
  }, [conversation?._id, messages?.length, currentUserId, markAsSeenMutation]);

  // Typing Indicator Logic
  const isOtherTyping = conversation?.typingStatus?.isTyping && conversation?.typingStatus?.userId === selectedUser?.clerkId;

  const handleSendMessage = async () => {
    if (!messageText.trim() || !selectedUser || !conversation?._id) return;
    
    setIsSending(true);
    setError(null);

    try {
      await sendMessageMutation({ 
        conversationId: conversation._id, 
        senderId: currentUserId, 
        text: messageText 
      });
      setMessageText("");
      await typingMutation({ conversationId: conversation._id, senderId: currentUserId, isTyping: false });
    } catch (err) {
      setError("Failed to send message. Please try again."); // 🔹 Error handling
    } finally {
      setIsSending(false);
    }
  };

  const handleTyping = (text: string) => {
    setMessageText(text);
    if (conversation?._id) {
      typingMutation({ conversationId: conversation._id, senderId: currentUserId, isTyping: text.length > 0 });
    }
  };

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, isOtherTyping]);

  // Loading State 
  if (selectedUser && messages === undefined) {
    return <ChatSkeleton />;
  }

  if (!selectedUser) return <div className="flex-1 flex items-center justify-center text-slate-400 font-medium bg-slate-50">Select a friend to start chatting</div>;

  return (
    <div className="flex flex-col h-full w-full bg-white relative">
      {/* Header */}
      <header className="px-4 py-3 border-b border-slate-100 flex items-center justify-between sticky top-0 z-20 bg-white/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="md:hidden p-2 -ml-2 hover:bg-slate-100 rounded-full transition-colors"><ChevronLeft className="w-6 h-6 text-slate-600" /></button>
          <div className="relative">
            <img src={selectedUser?.imageUrl} className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-100" alt="" />
            <span className={`absolute bottom-0 right-0 w-3 h-3 border-2 border-white rounded-full ${selectedUser?.isOnline ? "bg-green-500" : "bg-slate-300"}`}></span>
          </div>
          <div>
            <h2 className="font-bold text-slate-800 leading-tight">{selectedUser?.name}</h2>
            <p className={`text-[11px] font-semibold ${selectedUser?.isOnline ? "text-green-600" : "text-slate-400"}`}>
              {selectedUser?.isOnline ? "Active now" : "Away"}
            </p>
          </div>
        </div>
        <button className="p-2 hover:bg-slate-100 rounded-full transition-colors">
          <MoreVertical className="w-5 h-5 text-slate-400" />
        </button>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#F8FAFC]">
        {messages && messages.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center py-20 opacity-40 text-slate-500">
            <p className="text-sm font-medium text-center">No messages yet.<br/>Say hi to {selectedUser.name}! 👋</p>
          </div>
        )}
        
        {messages?.map((msg: any) => (
          <div key={msg._id} className={`flex ${msg.senderId === currentUserId ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[75%] px-4 py-2 rounded-2xl shadow-sm ${msg.senderId === currentUserId ? "bg-indigo-600 text-white rounded-tr-none" : "bg-white border border-slate-200 text-slate-700 rounded-tl-none"}`}>
              <p className="text-[15px] leading-relaxed">{msg.text}</p>
              {msg.senderId === currentUserId && (
                <p className="text-[9px] text-right mt-1 opacity-70 font-medium">
                  {msg.seen ? "Read" : "Sent"}
                </p>
              )}
            </div>
          </div>
        ))}
        
        {isOtherTyping && (
          <div className="flex items-center gap-2 px-2 py-1">
            <div className="flex gap-1">
              <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
              <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
              <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce"></span>
            </div>
            <span className="text-xs italic text-slate-400 font-medium">{selectedUser.name} is typing...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Error State with Retry  */}
      {error && (
        <div className="mx-4 mb-2 p-2 bg-red-50 border border-red-100 rounded-lg flex items-center justify-between animate-in fade-in slide-in-from-bottom-1">
          <p className="text-xs text-red-600 font-medium">{error}</p>
          <button onClick={handleSendMessage} className="flex items-center gap-1 text-[10px] font-bold text-red-700 uppercase tracking-wider hover:underline">
            <RefreshCcw className="w-3 h-3" /> Retry
          </button>
        </div>
      )}

      {/* Input Section */}
      <div className="p-4 bg-white border-t border-slate-100">
        <div className={`flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-1.5 transition-all ${isSending ? "opacity-50" : "focus-within:ring-2 focus-within:ring-indigo-100 focus-within:bg-white"}`}>
          <input 
            value={messageText} 
            disabled={isSending}
            onChange={(e) => handleTyping(e.target.value)} 
            onKeyDown={(e) => e.key === "Enter" && !isSending && handleSendMessage()}
            placeholder={isSending ? "Sending..." : "Type your message..."} 
            className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-2 placeholder:text-slate-400 text-slate-700" 
          />
          <button 
            onClick={handleSendMessage} 
            disabled={!messageText.trim() || isSending}
            className="p-2 bg-indigo-600 text-white rounded-xl shadow-md hover:bg-indigo-700 disabled:bg-slate-300 transition-all active:scale-90"
          >
            <SendHorizontal className={`w-5 h-5 ${isSending ? "animate-pulse" : ""}`} />
          </button>
        </div>
      </div>
    </div>
  );
}