"use client";

import type React from "react";
import { useState } from "react";
import { Send, RefreshCw } from "lucide-react";
import { Button } from "~/app/_components/ui/button";

interface GreetingPageProps {
  onSendMessage: (message: string) => void;
  userName?: string;
}

export default function GreetingPage({
  onSendMessage,
  userName = "John",
}: GreetingPageProps) {
  const [inputValue, setInputValue] = useState("");
  const [charCount, setCharCount] = useState(0);

  const prompts = [
    {
      title: "Write a to-do list for a personal project or task",
      icon: "👤",
    },
    {
      title: "Generate an email to reply to a job offer",
      icon: "✉️",
    },
    {
      title: "Summarise this article or text for me in one paragraph",
      icon: "💬",
    },
    {
      title: "How does AI work in a technical capacity",
      icon: "📊",
    },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    setCharCount(value.length);
  };

  const handleSend = () => {
    if (inputValue.trim()) {
      onSendMessage(inputValue);
      setInputValue("");
      setCharCount(0);
    }
  };

  const handlePromptClick = (prompt: string) => {
    onSendMessage(prompt);
  };

  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-gray-50 p-8">
      <div className="w-full max-w-3xl space-y-8">
        {/* Greeting */}
        <div className="space-y-3">
          <h1 className="text-5xl font-bold">
            <span className="text-gray-900">Hi there, </span>
            <span className="text-purple-600">{userName}</span>
          </h1>
          <h2 className="text-4xl font-bold">
            <span className="text-gray-900">What would </span>
            <span className="text-purple-600">like to know?</span>
          </h2>
          <p className="pt-2 text-base text-gray-600">
            Use one of the most common prompts
            <br />
            below or use your own to begin
          </p>
        </div>

        {/* Prompt Cards */}
        <div className="grid grid-cols-2 gap-4">
          {prompts.map((prompt, index) => (
            <button
              key={index}
              onClick={() => handlePromptClick(prompt.title)}
              className="group rounded-xl border border-gray-200 bg-white p-4 text-left transition-colors hover:bg-gray-50"
            >
              <div className="flex flex-col gap-3">
                <span className="text-2xl">{prompt.icon}</span>
                <p className="text-sm leading-snug font-medium text-gray-900">
                  {prompt.title}
                </p>
              </div>
            </button>
          ))}
        </div>

        {/* Refresh Prompts */}
        <button className="flex items-center gap-2 text-gray-600 transition-colors hover:text-gray-900">
          <RefreshCw className="h-4 w-4" />
          <span className="text-sm">Refresh Prompts</span>
        </button>

        {/* Input Area */}
        <div className="space-y-4">
          <div className="space-y-4 rounded-2xl border border-gray-200 bg-white p-4">
            <div className="flex items-center justify-between">
              <input
                value={inputValue}
                onChange={handleInputChange}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                placeholder="Ask whatever you want...."
                className="flex-1 bg-transparent text-base text-gray-900 outline-none placeholder:text-gray-500"
              />
              <div className="flex items-center gap-3">
                <select className="cursor-pointer bg-transparent text-sm text-gray-600 outline-none">
                  <option>All Web</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-gray-200 pt-2">
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-1 text-sm text-gray-600 transition-colors hover:text-gray-900">
                  <span>📎</span>
                  <span>Add Attachment</span>
                </button>
                <button className="flex items-center gap-1 text-sm text-gray-600 transition-colors hover:text-gray-900">
                  <span>🖼️</span>
                  <span>Use Image</span>
                </button>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-500">{charCount}/1000</span>
                <Button
                  onClick={handleSend}
                  disabled={!inputValue.trim()}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-600 p-0 text-white hover:bg-purple-700 disabled:opacity-50"
                >
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
