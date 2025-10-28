"use client";
import { useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Spinner } from "@/components/ui/spinner";
import { Send, UserX, ArrowLeft, MessageCircle } from "lucide-react";

interface Profile {
  _id: string;
  userId: string;
  name: string;
  age: number;
  profilePic: string;
}

interface Match {
  matchId: string;
  userId: string;
  profile: Profile;
  matchedAt: string;
}

interface Message {
  _id: string;
  matchId: string;
  senderId: {
    _id: string;
    email: string;
  };
  receiverId: {
    _id: string;
    email: string;
  };
  content: string;
  createdAt: string;
}

interface ChatWindowProps {
  match: Match | null;
  messages: Message[];
  newMessage: string;
  sending: boolean;
  currentUserId: string;
  onBack: () => void;
  onUnmatch: (userId: string) => void;
  onSendMessage: (e: React.FormEvent) => void;
  onMessageChange: (message: string) => void;
}

export default function ChatWindow({
  match,
  messages,
  newMessage,
  sending,
  currentUserId,
  onBack,
  onUnmatch,
  onSendMessage,
  onMessageChange,
}: ChatWindowProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  if (!match) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center p-8">
          <MessageCircle className="size-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Select a Match
          </h3>
          <p className="text-sm text-muted-foreground">
            Choose a conversation from the left to start chatting
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Chat Header */}
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon-sm"
            className="md:hidden"
            onClick={onBack}
          >
            <ArrowLeft className="size-5" />
          </Button>
          <Avatar className="size-10">
            <AvatarImage src={match.profile?.profilePic} />
            <AvatarFallback className="bg-pink-100 text-pink-600">
              {match.profile?.name?.charAt(0).toUpperCase() || "?"}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold">
              {match.profile?.name || "Unknown"}
            </h3>
            <p className="text-xs text-muted-foreground">
              {match.profile?.age && `${match.profile.age} years old`}
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => onUnmatch(match.userId)}
          className="text-red-500 hover:text-red-600 hover:bg-red-50"
        >
          <UserX className="size-5" />
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Scrollable messages area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <MessageCircle className="size-12 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">
                  No messages yet. Say hi! 👋
                </p>
              </div>
            </div>
          ) : (
            messages.map((msg) => {
              const isMe = msg.senderId._id === currentUserId;
              return (
                <div
                  key={msg._id}
                  className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl wrap-break-word ${
                      isMe
                        ? "bg-pink-600 text-white"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                    }`}
                  >
                    <p className="text-sm">{msg.content}</p>
                    <p
                      className={`text-xs mt-1 ${
                        isMe
                          ? "text-pink-200"
                          : "text-gray-500 dark:text-gray-400"
                      }`}
                    >
                      {new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message Input */}
      <form onSubmit={onSendMessage} className="p-4 border-t flex gap-2">
        <Input
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => onMessageChange(e.target.value)}
          disabled={sending}
          className="flex-1"
        />
        <Button
          type="submit"
          disabled={sending || !newMessage.trim()}
          className="bg-pink-600 hover:bg-pink-700"
        >
          {sending ? (
            <Spinner className="size-4" />
          ) : (
            <Send className="size-4" />
          )}
        </Button>
      </form>
    </>
  );
}
