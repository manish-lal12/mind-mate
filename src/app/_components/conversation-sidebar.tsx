"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Trash2, Plus, Menu, X } from "lucide-react";
import { api } from "~/trpc/react";

interface ChatListItem {
  id: string;
  title: string;
  createdAt: Date;
  _count: {
    messages: number;
  };
}

interface ConversationSidebarProps {
  userId: string;
  onNewChat?: () => void;
}

export function ConversationSidebar({
  userId,
  onNewChat,
}: ConversationSidebarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [chats, setChats] = useState<ChatListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch chats
  const getChatsQuery = api.chat.getAll.useQuery(
    { userId },
    {
      enabled: !!userId,
      refetchOnWindowFocus: false,
    },
  );

  const deleteChat = api.chat.delete.useMutation({
    onSuccess: () => {
      void getChatsQuery.refetch();
    },
  });

  useEffect(() => {
    if (getChatsQuery.data) {
      setChats(getChatsQuery.data as ChatListItem[]);
      setIsLoading(false);
    }
  }, [getChatsQuery.data]);

  const handleDelete = async (e: React.MouseEvent, chatId: string) => {
    e.preventDefault();
    if (confirm("Are you sure you want to delete this chat?")) {
      deleteChat.mutate({ id: chatId, userId });
    }
  };

  const formatDate = (date: Date) => {
    const d = new Date(date);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (d.toDateString() === today.toDateString()) {
      return "Today";
    } else if (d.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else if (d.getTime() > today.getTime() - 7 * 24 * 60 * 60 * 1000) {
      return d.toLocaleDateString("en-US", { weekday: "short" });
    } else {
      return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 left-4 z-40 inline-flex items-center justify-center rounded-lg bg-blue-600 p-2 text-white hover:bg-blue-700 md:hidden"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Sidebar Overlay - Mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-30 h-screen w-64 transform border-r border-slate-200/50 bg-white/80 backdrop-blur-md transition-transform duration-300 md:static md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="border-b border-slate-200/50 px-4 py-4">
            <button
              onClick={onNewChat}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-linear-to-r from-blue-600 to-blue-700 px-4 py-2.5 font-medium text-white transition-all duration-200 hover:from-blue-700 hover:to-blue-800 hover:shadow-lg active:scale-95"
            >
              <Plus className="h-4 w-4" />
              <span>New Chat</span>
            </button>
          </div>

          {/* Chat List */}
          <div className="flex-1 overflow-y-auto px-3 py-4">
            {isLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-12 animate-pulse rounded-lg bg-slate-200/30"
                  />
                ))}
              </div>
            ) : chats.length === 0 ? (
              <div className="py-8 text-center text-sm text-slate-600">
                <p>No chats yet.</p>
                <p className="text-xs text-slate-500">
                  Start a new conversation
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {chats.map((chat) => {
                  const isActive = pathname === `/c/${chat.id}`;
                  return (
                    <Link
                      key={chat.id}
                      href={`/c/${chat.id}`}
                      onClick={() => setIsOpen(false)}
                      className={`group relative flex items-start justify-between gap-2 rounded-lg border px-3 py-2.5 transition-all duration-200 ${
                        isActive
                          ? "border-blue-400/50 bg-blue-50/50"
                          : "border-slate-200/30 hover:border-slate-300/60 hover:bg-slate-50/50"
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <p
                          className={`truncate text-sm font-medium ${
                            isActive
                              ? "text-slate-900"
                              : "text-slate-700 group-hover:text-slate-900"
                          }`}
                        >
                          {chat.title}
                        </p>
                        <p className="truncate text-xs text-slate-600">
                          {formatDate(new Date(chat.createdAt))}
                        </p>
                      </div>

                      {/* Delete Button */}
                      <button
                        onClick={(e) => handleDelete(e, chat.id)}
                        className="shrink-0 rounded p-1 text-slate-500 opacity-0 transition-all duration-200 group-hover:opacity-100 hover:bg-red-100/50 hover:text-red-600"
                        title="Delete chat"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-slate-200/50 px-3 py-3 text-center text-xs text-slate-600">
            <p>Your conversations</p>
          </div>
        </div>
      </aside>
    </>
  );
}
