"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Spinner } from "@/components/ui/spinner";
import { MessageCircle } from "lucide-react";
import MatchList from "@/components/MatchList";
import ChatWindow from "@/components/ChatWindow";

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

  const uniqueMatches = Array.from(
    new Map(matches.map((m) => [m.userId, m])).values()
  );

  useEffect(() => {
    fetchMatches();
  }, []);

  useEffect(() => {
    if (selectedMatch) {
      fetchMessages(selectedMatch.matchId);
      const interval = setInterval(() => {
        fetchMessages(selectedMatch.matchId);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [selectedMatch]);

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
    <main className="min-h-screen bg-linear-to-b from-pink-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-6xl mx-auto h-screen flex">
        {/* Matches Sidebar */}
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
              {uniqueMatches.length}{" "}
              {uniqueMatches.length === 1 ? "match" : "matches"}
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
            onSendMessage={sendMessage}
            onMessageChange={setNewMessage}
          />
        </div>
      </div>
    </main>
  );
}
