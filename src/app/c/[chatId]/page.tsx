"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Send } from "lucide-react";
import { api } from "~/trpc/react";
import { useSession } from "~/lib/auth-client";
import { ConversationSidebar } from "~/app/_components/conversation-sidebar";
import { Button } from "~/app/_components/ui/button";

interface Message {
  id: string;
  content: string;
  role: string;
  createdAt: Date;
}

interface Chat {
  id: string;
  title: string;
  messages: Message[];
}

export default function ChatPage() {
  const params = useParams();
  const chatId = params.chatId as string;
  const { data: session } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [isLLMProcessing, setIsLLMProcessing] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState(false);

  // Set timeout to stop loading if session takes too long
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!session?.user?.id) {
        setSessionTimeout(true);
      }
    }, 5000); // 5 second timeout

    return () => clearTimeout(timeout);
  }, [session?.user?.id]);

  // Fetch chat
  const getChatQuery = api.chat.getById.useQuery(
    { id: chatId, userId: session?.user?.id ?? "" },
    {
      enabled: !!session?.user?.id && !!chatId,
      refetchOnWindowFocus: false,
    },
  );

  const addMessage = api.chat.addMessage.useMutation({
    onSuccess: (message) => {
      setMessages((prev) => [...prev, message as Message]);
      setInputValue("");
      setIsSending(false);
      // Don't generate response here - do it separately after user message is confirmed
    },
    onError: () => {
      alert("Failed to send message");
      setIsSending(false);
    },
  });

  const generateResponse = api.chat.generateResponse.useMutation({
    onSuccess: (assistantMessage) => {
      setMessages((prev) => [...prev, assistantMessage as Message]);
      setIsLLMProcessing(false);
    },
    onError: (error) => {
      console.error("Failed to generate response:", error);
      alert("Failed to generate AI response");
      setIsLLMProcessing(false);
    },
  });

  useEffect(() => {
    if (getChatQuery.data) {
      setMessages((getChatQuery.data as Chat).messages);
      setIsLoading(false);

      // Auto-generate response for first user message if no assistant response exists yet
      const chat = getChatQuery.data as Chat;
      const hasAssistantMessage = chat.messages.some(
        (m) => m.role === "assistant",
      );

      if (
        !hasAssistantMessage &&
        chat.messages.length > 0 &&
        session?.user?.id
      ) {
        // Delay slightly to ensure state updates
        setTimeout(() => {
          const allMessages = chat.messages.map((msg) => ({
            role: msg.role as "user" | "assistant",
            content: msg.content,
          }));

          setIsLLMProcessing(true);
          generateResponse.mutate({
            chatId,
            userId: session.user.id,
            messages: allMessages,
            model: process.env.NEXT_PUBLIC_LLM_MODEL ?? "gemini-2.0-flash",
          });
        }, 500);
      }
    }
  }, [getChatQuery.data, session?.user?.id, chatId, generateResponse]);

  const handleSend = async () => {
    if (!inputValue.trim() || isSending || !session?.user?.id) return;

    setIsSending(true);
    const userMessage = inputValue;

    // First, add the user message
    addMessage.mutate(
      {
        chatId,
        userId: session.user.id,
        content: userMessage,
        role: "user",
      },
      {
        onSuccess: (savedMessage) => {
          setIsSending(false);
          // Now generate AI response
          generateAIResponse(userMessage, savedMessage as Message);
        },
      },
    );
  };

  const generateAIResponse = (userMessage: string, userMessageObj: Message) => {
    if (!session?.user?.id) return;

    setIsLLMProcessing(true);

    // Prepare messages for LLM (all previous messages + the new user message)
    const allMessages = [...messages, userMessageObj].map((msg) => ({
      role: msg.role as "user" | "assistant",
      content: msg.content,
    }));

    generateResponse.mutate({
      chatId,
      userId: session.user.id,
      messages: allMessages,
      model: process.env.NEXT_PUBLIC_LLM_MODEL ?? "gemini-2.0-flash",
    });
  };

  if (isLoading && !sessionTimeout) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="space-y-3 text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
          <p className="text-slate-600">Loading chat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <ConversationSidebar
        userId={session?.user?.id ?? ""}
        onNewChat={() => {
          // Navigation handled by link in sidebar
        }}
      />

      {/* Main Chat Area */}
      <div className="flex flex-1 flex-col bg-linear-to-b from-white via-blue-50/30 to-green-50/20 md:ml-0">
        {/* Header */}
        <div className="border-b border-slate-200/50 bg-white/60 px-6 py-4 backdrop-blur-md">
          <h1 className="text-lg font-semibold text-slate-900">
            {(getChatQuery.data as Chat)?.title ?? "Chat"}
          </h1>
        </div>

        {/* Messages Area */}
        <div className="flex-1 space-y-4 overflow-y-auto px-6 py-6">
          {messages.length === 0 ? (
            <div className="flex h-full items-center justify-center">
              <div className="space-y-2 text-center">
                <p className="text-slate-600">No messages yet</p>
                <p className="text-sm text-slate-500">
                  Start the conversation below
                </p>
              </div>
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-md rounded-lg px-4 py-3 ${
                    msg.role === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-slate-200/50 text-slate-900"
                  }`}
                >
                  <p className="text-sm">{msg.content}</p>
                </div>
              </div>
            ))
          )}

          {/* AI Processing Indicator */}
          {isLLMProcessing && (
            <div className="flex justify-start">
              <div className="max-w-md rounded-lg bg-slate-200/50 px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 animate-bounce rounded-full bg-slate-600" />
                  <div
                    className="h-2 w-2 animate-bounce rounded-full bg-slate-600"
                    style={{ animationDelay: "0.1s" }}
                  />
                  <div
                    className="h-2 w-2 animate-bounce rounded-full bg-slate-600"
                    style={{ animationDelay: "0.2s" }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="border-t border-slate-200/50 bg-white/60 px-6 py-4 backdrop-blur-md">
          <div className="mx-auto max-w-3xl space-y-3">
            <div className="group relative">
              <textarea
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                }}
                onKeyDown={async (e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    await handleSend();
                  }
                }}
                placeholder="Type your message..."
                rows={3}
                disabled={isSending || isLLMProcessing}
                className="w-full resize-none rounded-lg border border-slate-300/50 bg-white/70 px-4 py-3 text-sm text-slate-900 transition-all duration-200 placeholder:text-slate-500 focus:border-blue-400/50 focus:bg-white focus:ring-1 focus:ring-blue-500/20 focus:outline-none disabled:opacity-50"
              />
              <div className="pointer-events-none absolute inset-0 rounded-lg bg-linear-to-r from-blue-500/0 to-green-500/0 opacity-0 transition-opacity duration-300 group-focus-within:from-blue-500/5 group-focus-within:to-green-500/5 group-focus-within:opacity-100" />
            </div>

            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-500">
                Press <span className="font-medium">Shift + Enter</span> for new
                line
              </p>
              <Button
                onClick={handleSend}
                disabled={!inputValue.trim() || isSending || isLLMProcessing}
                className="inline-flex items-center gap-2 rounded-lg bg-linear-to-r from-blue-600 to-blue-700 px-5 py-2.5 font-medium text-white transition-all duration-200 hover:from-blue-700 hover:to-blue-800 hover:shadow-lg active:scale-95 disabled:cursor-not-allowed disabled:from-slate-400 disabled:to-slate-400 disabled:shadow-none"
              >
                <Send className="h-4 w-4" />
                <span>
                  {isSending
                    ? "Sending..."
                    : isLLMProcessing
                      ? "Generating..."
                      : "Send"}
                </span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
