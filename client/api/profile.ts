const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export interface Profile {
  _id?: string;
  name: string;
  age: number;
  bio: string;
  profilePic: string;
  gender: string;
  interests: string[];
  interestedIn: string[];
  location?: {
    coordinates: [number, number];
  };
}

interface ProfileResponse {
  profile: Profile;
}

export async function getMyProfile(token: string): Promise<Profile | null> {
  const res = await fetch(`${BASE_URL}/profiles/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (res.ok) {
    const data: ProfileResponse = await res.json();
    return data.profile;
  }

  if (res.status === 404) {
    return null; // No profile found
  }

  throw new Error("Failed to fetch profile");
}

export async function deleteMyProfile(token: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/profiles`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    throw new Error("Failed to delete profile");
  }
}
