const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

function getAuthHeader() {
  const token = localStorage.getItem("accessToken");
  return { Authorization: `Bearer ${token}` };
}

export async function blockUser(targetUserId: string) {
  const res = await fetch(`${BASE_URL}/users/block`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify({ targetUserId }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || "Failed to block user");
  return data;
}

export async function unblockUser(targetUserId: string) {
  const res = await fetch(`${BASE_URL}/users/unblock`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify({ targetUserId }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || "Failed to unblock user");
  return data;
}

export async function getBlockedUsers() {
  const res = await fetch(`${BASE_URL}/users/blocked`, {
    headers: getAuthHeader(),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || "Failed to fetch blocked users");
  return data.blocked;
}