"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Spinner } from "@/components/ui/spinner";
import { MessageCircle } from "lucide-react";
import MatchList from "@/components/MatchList";
import ChatWindow from "@/components/ChatWindow";
import {
  fetchMatches,
  fetchMessages,
  sendMessage,
  unmatchUser,
} from "@/api/messages";

// ---------- TYPES ----------
interface Profile {
  _id: string;
  userId: string;
  name: string;
  age: number;
  profilePic: string;
}

export interface Match {
  matchId: string;
  userId: string;
  profile: Profile;
  matchedAt: string;
}

export interface Message {
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

// ---------- COMPONENT ----------
export default function ChatPage() {
  const { user } = useAuth();
  const [matches, setMatches] = useState<Match[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  // ---------- LOAD MATCHES ----------
  useEffect(() => {
    loadMatches();
  }, []);

  // ---------- LOAD MESSAGES ----------
  useEffect(() => {
    if (!selectedMatch) return;

    loadMessages(selectedMatch.matchId);
    const interval = setInterval(() => {
      loadMessages(selectedMatch.matchId);
    }, 3000);

    return () => clearInterval(interval);
  }, [selectedMatch]);

  // ---------- HANDLERS ----------
  const loadMatches = async () => {
    try {
      const data = await fetchMatches();
      setMatches(data);
    } catch (err) {
      console.error("Failed to load matches:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (matchId: string) => {
    try {
      const data = await fetchMessages(matchId);
      setMessages(data);
    } catch (err) {
      console.error("Failed to load messages:", err);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedMatch || sending) return;

    setSending(true);
    try {
      await sendMessage(
        selectedMatch.matchId,
        selectedMatch.userId,
        newMessage.trim()
      );
      setNewMessage("");
      await loadMessages(selectedMatch.matchId);
    } catch (err) {
      console.error("Failed to send message:", err);
    } finally {
      setSending(false);
    }
  };

  const handleUnmatch = async (matchedUserId: string) => {
    if (!confirm("Are you sure you want to unmatch? This cannot be undone."))
      return;

    try {
      await unmatchUser(matchedUserId);
      setSelectedMatch(null);
      await loadMatches();
    } catch (err) {
      console.error("Failed to unmatch:", err);
    }
  };

  // ---------- LOADING STATE ----------
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner className="size-8 text-pink-600" />
      </div>
    );
  }

  // ---------- UI ----------
  return (
    <main className="min-h-screen bg-linear-to-b from-pink-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-6xl mx-auto h-screen flex">
        {/* Sidebar */}
        <div
          className={`${
            selectedMatch ? "hidden md:block" : "block"
          } w-full md:w-80 border-r bg-white dark:bg-gray-900`}
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

          <MatchList
            matches={matches}
            selectedMatchId={selectedMatch?.matchId || null}
            onSelectMatch={setSelectedMatch}
          />
        </div>

        {/* Chat Area */}
        <div
          className={`${
            selectedMatch ? "block" : "hidden md:block"
          } flex-1 flex flex-col bg-white dark:bg-gray-900`}
        >
          <ChatWindow
            match={selectedMatch}
            messages={messages}
            newMessage={newMessage}
            sending={sending}
            currentUserId={user?._id || ""}
            onBack={() => setSelectedMatch(null)}
            onUnmatch={handleUnmatch}
            onSendMessage={handleSendMessage}
            onMessageChange={setNewMessage}
          />
        </div>
      </div>
    </main>
  );
}
