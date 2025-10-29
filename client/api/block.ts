export async function blockUser(targetUserId: string) {
  const token = localStorage.getItem("accessToken");
  const res = await fetch("http://localhost:5000/users/block", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ targetUserId }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || "Failed to block user");
  return data;
}
