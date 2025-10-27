"use client";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Spinner } from "@/components/ui/spinner";
import {
  MessageCircle,
  Send,
  Heart,
  UserX,
  ArrowLeft,
  Users,
} from "lucide-react";

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

export default function ChatPage() {
  const { user } = useAuth();
  const [matches, setMatches] = useState<Match[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchMatches();
  }, []);

  useEffect(() => {
    if (selectedMatch) {
      fetchMessages(selectedMatch.matchId);
      // Poll for new messages every 3 seconds
      const interval = setInterval(() => {
        fetchMessages(selectedMatch.matchId);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [selectedMatch]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchMatches = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch("http://localhost:5000/matches", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setMatches(data.matches);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (matchId: string) => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`http://localhost:5000/messages/${matchId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedMatch || sending) return;

    setSending(true);
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch("http://localhost:5000/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          matchId: selectedMatch.matchId,
          receiverId: selectedMatch.userId,
          content: newMessage.trim(),
        }),
      });

      if (res.ok) {
        setNewMessage("");
        await fetchMessages(selectedMatch.matchId);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  const handleUnmatch = async (matchedUserId: string) => {
    if (!confirm("Are you sure you want to unmatch? This cannot be undone."))
      return;

    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(
        `http://localhost:5000/matches/${matchedUserId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.ok) {
        setSelectedMatch(null);
        await fetchMatches();
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner className="size-8 text-pink-600" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      <div className="max-w-6xl mx-auto h-screen flex">
        {/* Matches Sidebar */}
        <div
          className={`${
            selectedMatch ? "hidden md:block" : "block"
          } w-full md:w-80 border-r bg-white`}
        >
          <div className="p-4 border-b">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <MessageCircle className="size-5 text-pink-600" />
              Your Matches
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              {matches.length} {matches.length === 1 ? "match" : "matches"}
            </p>
          </div>

          <div className="overflow-y-auto h-[calc(100vh-5rem)]">
            {matches.length === 0 ? (
              <div className="p-8 text-center">
                <Users className="size-12 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">
                  No matches yet. Start swiping!
                </p>
              </div>
            ) : (
              matches.map((match) => (
                <button
                  key={match.matchId}
                  onClick={() => setSelectedMatch(match)}
                  className={`w-full p-4 flex items-center gap-3 hover:bg-pink-50 transition-colors border-b ${
                    selectedMatch?.matchId === match.matchId ? "bg-pink-50" : ""
                  }`}
                >
                  <Avatar className="size-12">
                    <AvatarImage src={match.profile?.profilePic} />
                    <AvatarFallback className="bg-pink-100 text-pink-600">
                      {match.profile?.name?.charAt(0).toUpperCase() || "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 text-left">
                    <h3 className="font-semibold text-sm">
                      {match.profile?.name || "Unknown"}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {match.profile?.age && `${match.profile.age} years old`}
                    </p>
                  </div>
                  <Heart className="size-4 text-pink-600" />
                </button>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div
          className={`${
            selectedMatch ? "block" : "hidden md:block"
          } flex-1 flex flex-col bg-white`}
        >
          {selectedMatch ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="md:hidden"
                    onClick={() => setSelectedMatch(null)}
                  >
                    <ArrowLeft className="size-5" />
                  </Button>
                  <Avatar className="size-10">
                    <AvatarImage src={selectedMatch.profile?.profilePic} />
                    <AvatarFallback className="bg-pink-100 text-pink-600">
                      {selectedMatch.profile?.name?.charAt(0).toUpperCase() ||
                        "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">
                      {selectedMatch.profile?.name || "Unknown"}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {selectedMatch.profile?.age &&
                        `${selectedMatch.profile.age} years old`}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => handleUnmatch(selectedMatch.userId)}
                  className="text-red-500 hover:text-red-600 hover:bg-red-50"
                >
                  <UserX className="size-5" />
                </Button>
              </div>

              {/* Messages */}
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
                    const isMe = msg.senderId._id === user?._id;
                    return (
                      <div
                        key={msg._id}
                        className={`flex ${
                          isMe ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                            isMe
                              ? "bg-pink-600 text-white"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          <p className="text-sm">{msg.content}</p>
                          <p
                            className={`text-xs mt-1 ${
                              isMe ? "text-pink-200" : "text-gray-500"
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

              {/* Message Input */}
              <form onSubmit={sendMessage} className="p-4 border-t flex gap-2">
                <Input
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
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
          ) : (
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
          )}
        </div>
      </div>
    </main>
  );
}
