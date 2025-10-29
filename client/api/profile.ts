const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

function getAuthHeader() {
  const token = localStorage.getItem("accessToken");
  return { Authorization: `Bearer ${token}` };
}

export interface Profile {
  _id?: string;
  userId?: string;
  name: string;
  age: number;
  bio: string;
  profilePic: string;
  gender: string;
  interests: string[];
  interestedIn: string[];
  location?: {
    type: string;
    coordinates: [number, number];
  };
}

interface ProfileResponse {
  profile: Profile;
  error?: {
    message?: string;
  };
}

export interface SaveProfilePayload {
  name: string;
  age: number;
  bio: string;
  profilePic: string;
  location: {
    type: string;
    coordinates: [number, number];
  };
  gender: string;
  interestedIn: string[];
  interests: string[];
}

// Get the current user's profile
export async function getMyProfile(): Promise<Profile | null> {
  const res = await fetch(`${BASE_URL}/profiles/me`, {
    headers: getAuthHeader(),
  });

  if (res.ok) {
    const data: ProfileResponse = await res.json();
    return data.profile;
  }

  if (res.status === 404) {
    return null; // No profile found
  }

  const data = await res.json();
  throw new Error(data.error?.message || "Failed to fetch profile");
}

// Create or update profile
export async function saveProfile(payload: SaveProfilePayload): Promise<Profile> {
  const res = await fetch(`${BASE_URL}/profiles`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify(payload),
  });

  const data: ProfileResponse = await res.json();

  if (!res.ok) {
    throw new Error(data.error?.message || "Failed to save profile");
  }

  return data.profile;
}

// Delete profile
export async function deleteMyProfile(): Promise<void> {
  const res = await fetch(`${BASE_URL}/profiles`, {
    method: "DELETE",
    headers: getAuthHeader(),
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error?.message || "Failed to delete profile");
  }
}