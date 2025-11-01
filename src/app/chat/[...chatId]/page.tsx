"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "~/app/_components/ui/button";
import { Input } from "~/app/_components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Loader2 } from "lucide-react";
import { ChatSidebar } from "~/app/_components/chat-sidebar";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const suggestedPrompts = [
  "I'm feeling anxious about work",
  "How can I manage stress better?",
  "I need help with sleep issues",
  "Tell me about mindfulness techniques",
];

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Hello! I'm your MindCare companion. I'm here to listen, support, and help you navigate your mental health journey. How are you feeling today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (text?: string) => {
    const messageText = text ?? input.trim();
    if (!messageText) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: messageText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate AI response delay
    setTimeout(() => {
      const responses = [
        "That sounds challenging. Can you tell me more about what's been on your mind?",
        "I hear you. It's important to acknowledge these feelings. What do you think might help right now?",
        "Thank you for sharing that with me. Have you tried any coping strategies that have worked for you in the past?",
        "It's completely normal to feel this way. Let's explore some self-care techniques that might help.",
        "I appreciate your openness. Remember, seeking support is a sign of strength, not weakness.",
      ];

      const randomResponse =
        responses[Math.floor(Math.random() * responses.length)];

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: randomResponse!,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="from-background via-background to-muted/20 flex min-h-screen flex-col bg-linear-to-br">
      <div className="flex flex-1 overflow-hidden">
        {/* Main Chat Area */}
        <div className="flex flex-1 flex-col">
          {/* Messages Container */}
          <div className="flex-1 space-y-6 overflow-y-auto p-4 md:p-8">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-md rounded-lg px-4 py-3 md:max-w-lg lg:max-w-xl ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground rounded-br-none"
                        : "bg-card border-border/50 text-foreground rounded-bl-none border"
                    }`}
                  >
                    <p className="text-sm leading-relaxed md:text-base">
                      {message.content}
                    </p>
                    <span className="mt-2 block text-xs opacity-70">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="bg-card border-border/50 rounded-lg rounded-bl-none border px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Loader2 className="text-primary h-4 w-4 animate-spin" />
                    <span className="text-foreground/70 text-sm">
                      Thinking...
                    </span>
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Prompts (shown when no messages) */}
          {messages.length === 1 && !isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="px-4 pb-4 md:px-8"
            >
              <p className="text-foreground/70 mb-3 text-sm">
                Try asking about:
              </p>
              <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                {suggestedPrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(prompt)}
                    className="bg-card/50 border-border/50 hover:border-primary/30 hover:bg-card text-foreground/80 hover:text-foreground rounded-lg border p-3 text-left text-sm transition-all"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Input Area */}
          <div className="border-border bg-background/50 border-t p-4 backdrop-blur-sm md:p-8">
            <div className="mx-auto flex max-w-4xl gap-3">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={async (e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    await handleSendMessage();
                  }
                }}
                placeholder="Share what's on your mind..."
                className="bg-card border-border/50 text-foreground placeholder:text-foreground/50 flex-1"
                disabled={isLoading}
              />
              <Button
                onClick={() => handleSendMessage()}
                disabled={isLoading || !input.trim()}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <ChatSidebar />
      </div>
    </div>
  );
}
