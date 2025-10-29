import type { Match, Message } from "@/app/(protected)/chat/page"; // adjust path as needed

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

function getAuthHeader() {
  const token = localStorage.getItem("accessToken");
  return { Authorization: `Bearer ${token}` };
}

export async function fetchMatches(): Promise<Match[]> {
  const res = await fetch(`${BASE_URL}/matches`, {
    headers: getAuthHeader(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || "Failed to fetch matches");
  return data.matches;
}

export async function fetchMessages(matchId: string): Promise<Message[]> {
  const res = await fetch(`${BASE_URL}/messages/${matchId}`, {
    headers: getAuthHeader(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || "Failed to fetch messages");
  return data.messages;
}

export async function sendMessage(matchId: string, receiverId: string, content: string) {
  const res = await fetch(`${BASE_URL}/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify({ matchId, receiverId, content }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || "Failed to send message");
  return data;
}

export async function unmatchUser(matchedUserId: string): Promise<boolean> {
  const res = await fetch(`${BASE_URL}/matches/${matchedUserId}`, {
    method: "DELETE",
    headers: getAuthHeader(),
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error?.message || "Failed to unmatch");
  }

  return true;
}
