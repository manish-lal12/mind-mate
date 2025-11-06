"use client";

import type React from "react";
import { useState } from "react";
import { Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import { useSession } from "~/lib/auth-client";

export default function GreetingPageClient() {
  const [inputValue, setInputValue] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const router = useRouter();
  const { data: session, isPending: isSessionLoading } = useSession();

  // Extract first name from full name
  const getFirstName = (fullName?: string): string => {
    if (!fullName) return "";
    return fullName.split(" ")[0]!;
  };

  const createChat = api.chat.create.useMutation({
    onSuccess: (chat: { id: string }) => {
      setIsCreating(false);
      router.push(`/c/${chat.id}`);
    },
    onError: () => {
      setIsCreating(false);
      alert("Failed to create chat");
    },
  });

  const suggestions = [
    {
      title: "I need help managing my anxiety",
      description: "Get personalized strategies",
    },
    {
      title: "Help me understand my emotions",
      description: "Explore your feelings",
    },
    {
      title: "Daily mindfulness practices",
      description: "Build healthy habits",
    },
    {
      title: "Improve my sleep quality",
      description: "Sleep better tonight",
    },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setInputValue(value);
  };

  const handleSend = () => {
    if (inputValue.trim() && !isCreating && session?.user?.id) {
      setIsCreating(true);
      createChat.mutate({
        message: inputValue,
        userId: session.user.id,
      });
      setInputValue("");
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    if (!session?.user?.id) {
      alert("Please sign in to create a chat");
      return;
    }
    setIsCreating(true);
    createChat.mutate({
      message: suggestion,
      userId: session.user.id,
    });
  };

  // Don't render anything until session is loaded and username is available
  if (isSessionLoading || !session?.user?.name) {
    return null;
  }

  return (
    <div className="flex flex-1 flex-col bg-linear-to-b from-white via-blue-50/30 to-green-50/20">
      {/* Main Content */}
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl space-y-8">
          {/* Header */}
          <div className="space-y-2 text-center">
            <h1 className="text-4xl font-bold text-slate-900 md:text-5xl">
              Welcome,{" "}
              <span className="bg-linear-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                {getFirstName(session?.user?.name)}
              </span>
            </h1>
            <p className="text-base text-slate-600 md:text-lg">
              I&rsquo;m here to listen and support your mental wellness journey
            </p>
          </div>

          {/* Suggestion Cards */}
          <div className="grid gap-4 sm:grid-cols-2">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion.title)}
                disabled={isCreating}
                className="group relative overflow-hidden rounded-lg border border-slate-200/60 bg-white/50 p-4 backdrop-blur-sm transition-all duration-300 hover:border-blue-300/60 hover:bg-blue-50/50 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
              >
                {/* Subtle gradient on hover */}
                <div className="absolute inset-0 bg-linear-to-br from-blue-500/0 to-green-500/0 opacity-0 transition-opacity duration-300 group-hover:from-blue-500/5 group-hover:to-green-500/5 group-hover:opacity-100" />

                <div className="relative space-y-1 text-left">
                  <p className="font-semibold text-slate-900 group-hover:text-blue-700">
                    {suggestion.title}
                  </p>
                  <p className="text-sm text-slate-600 group-hover:text-slate-700">
                    {suggestion.description}
                  </p>
                </div>
              </button>
            ))}
          </div>

          {/* Info Text */}
          <p className="text-center text-sm text-slate-600">
            Or share anything on your mind below
          </p>
        </div>
      </div>

      {/* Input Area - Fixed at Bottom */}
      <div className="border-t border-slate-200/50 bg-white/60 backdrop-blur-md">
        <div className="mx-auto w-full max-w-2xl px-4 py-6">
          <div className="relative space-y-3">
            {/* Text Input */}
            <div className="group relative">
              <textarea
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Share what is on your mind..."
                rows={3}
                disabled={isCreating}
                className="w-full resize-none rounded-lg border border-slate-300/50 bg-white/70 px-4 py-3 text-sm text-slate-900 transition-all duration-200 placeholder:text-slate-500 focus:border-blue-400/50 focus:bg-white focus:ring-1 focus:ring-blue-500/20 focus:outline-none disabled:opacity-50"
              />
              {/* Focus highlight */}
              <div className="pointer-events-none absolute inset-0 rounded-lg bg-linear-to-r from-blue-500/0 to-green-500/0 opacity-0 transition-opacity duration-300 group-focus-within:from-blue-500/5 group-focus-within:to-green-500/5 group-focus-within:opacity-100" />
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-500">
                Press <span className="font-medium">Shift + Enter</span> for new
                line
              </p>
              <button
                onClick={handleSend}
                disabled={!inputValue.trim() || isCreating}
                className="inline-flex items-center gap-2 rounded-lg bg-linear-to-r from-blue-600 to-blue-700 px-5 py-2.5 font-medium text-white transition-all duration-200 hover:from-blue-700 hover:to-blue-800 hover:shadow-lg active:scale-95 disabled:cursor-not-allowed disabled:from-slate-400 disabled:to-slate-400 disabled:shadow-none"
              >
                <Send className="h-4 w-4" />
                <span>{isCreating ? "Creating..." : "Send"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
