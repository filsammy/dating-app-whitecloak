import { ArrowLeft, MoreVertical, Send, Ban, UserX } from "lucide-react";
import { format } from "date-fns";
import { useState, useRef, useEffect } from "react";
import type { Match, Message } from "@/app/(protected)/chat/page";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ChatWindowProps {
  match: Match | null;
  messages: Message[];
  newMessage: string;
  sending: boolean;
  currentUserId: string;
  onBack: () => void;
  onUnmatch: (userId: string) => void;
  onBlock: (userId: string) => void;
  onSendMessage: (e: React.FormEvent) => void;
  onMessageChange: (value: string) => void;
  onLoadMore: () => void;
  hasMore: boolean;
  loadingMore?: boolean;
}

export default function ChatWindow({
  match,
  messages,
  newMessage,
  sending,
  currentUserId,
  onBack,
  onUnmatch,
  onBlock,
  onSendMessage,
  onMessageChange,
  onLoadMore,
  hasMore,
  loadingMore = false,
}: ChatWindowProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [prevScrollHeight, setPrevScrollHeight] = useState(0);
  const [prevMessagesLength, setPrevMessagesLength] = useState(0);
  const [isAtBottom, setIsAtBottom] = useState(true);

  // Track if user is at bottom of chat
  const checkIfAtBottom = () => {
    if (!messagesContainerRef.current) return true;
    const container = messagesContainerRef.current;
    const threshold = 100; // pixels from bottom
    return (
      container.scrollHeight - container.scrollTop - container.clientHeight <
      threshold
    );
  };

  // Only scroll to bottom on initial load or when new messages arrive (not when loading old ones)
  useEffect(() => {
    if (messages.length === 0) return;

    // Check if messages were added at the end (new messages)
    const messagesIncreased = messages.length > prevMessagesLength;
    const shouldScrollToBottom =
      messagesIncreased && isAtBottom && !loadingMore;

    if (shouldScrollToBottom) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    setPrevMessagesLength(messages.length);
  }, [messages.length]);

  // Maintain scroll position when loading older messages
  useEffect(() => {
    if (loadingMore && messagesContainerRef.current) {
      const container = messagesContainerRef.current;
      const newScrollHeight = container.scrollHeight;
      const scrollDiff = newScrollHeight - prevScrollHeight;
      container.scrollTop = container.scrollTop + scrollDiff;
    }
  }, [messages, loadingMore, prevScrollHeight]);

  const handleScroll = () => {
    if (!messagesContainerRef.current) return;
    const container = messagesContainerRef.current;

    // Update isAtBottom state
    setIsAtBottom(checkIfAtBottom());

    // Check if scrolled to top
    if (container.scrollTop === 0 && hasMore && !loadingMore) {
      setPrevScrollHeight(container.scrollHeight);
      onLoadMore();
    }
  };

  if (!match) {
    return (
      <div className="flex-1 flex items-center justify-center text-muted-foreground">
        Select a match to start chatting
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="p-4 border-b flex items-center justify-between bg-white dark:bg-gray-900">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="md:hidden"
          >
            <ArrowLeft className="size-5" />
          </Button>
          <img
            src={match.profile.profilePic || "/placeholder-avatar.png"}
            alt={match.profile.name}
            className="size-10 rounded-full object-cover"
          />
          <div>
            <h3 className="font-semibold">{match.profile.name}</h3>
            <p className="text-xs text-muted-foreground">
              {match.profile.age} years old
            </p>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="size-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => onUnmatch(match.userId)}
              className="text-orange-600 focus:text-orange-600"
            >
              <UserX className="size-4 mr-2" />
              Unmatch
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onBlock(match.userId)}
              className="text-red-600 focus:text-red-600"
            >
              <Ban className="size-4 mr-2" />
              Block User
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Messages */}
      <div
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4 space-y-3"
      >
        {hasMore && (
          <div className="text-center py-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onLoadMore}
              disabled={loadingMore}
            >
              {loadingMore ? "Loading..." : "Load older messages"}
            </Button>
          </div>
        )}

        {messages.map((msg) => {
          const isOwn = msg.senderId._id === currentUserId;
          return (
            <div
              key={msg._id}
              className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                  isOwn
                    ? "bg-pink-600 text-white"
                    : "bg-gray-100 dark:bg-gray-800"
                }`}
              >
                <p className="text-sm">{msg.content}</p>
                <p
                  className={`text-xs mt-1 ${
                    isOwn ? "text-pink-100" : "text-muted-foreground"
                  }`}
                >
                  {format(new Date(msg.createdAt), "p")}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={onSendMessage}
        className="p-4 border-t bg-white dark:bg-gray-900"
      >
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => onMessageChange(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-pink-600 dark:bg-gray-800 dark:border-gray-700"
            disabled={sending}
          />
          <Button
            type="submit"
            size="icon"
            className="rounded-full bg-pink-600 hover:bg-pink-700"
            disabled={sending || !newMessage.trim()}
          >
            <Send className="size-5" />
          </Button>
        </div>
      </form>
    </>
  );
}
