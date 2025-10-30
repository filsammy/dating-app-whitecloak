const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

interface ApiError {
  message?: string;
}

export interface Profile {
  _id: string;
  userId: string;
  name: string;
  age: number;
  bio: string;
  profilePic: string;
  gender: string;
  interests: string[];
  location: {
    coordinates: [number, number];
  };
}

export interface DiscoverFilters {
  maxDistance?: string;
  minAge?: string;
  maxAge?: string;
}

interface DiscoverResponse {
  matches: Profile[];
  error?: ApiError;
}

interface SwipeResponse {
  isMatch: boolean;
  error?: ApiError;
}

export async function fetchDiscoverProfiles(
  filters: DiscoverFilters = {},
  token: string | null
): Promise<Profile[]> {
  const params = new URLSearchParams();
  if (filters.maxDistance) params.append("maxDistance", filters.maxDistance);
  if (filters.minAge) params.append("minAge", filters.minAge);
  if (filters.maxAge) params.append("maxAge", filters.maxAge);
  params.append("limit", "20");

  const res = await fetch(`${BASE_URL}/matches/discover?${params.toString()}`, {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  });

  const data: DiscoverResponse = await res.json();

  if (!res.ok) {
    throw new Error(data.error?.message || "Failed to fetch discover profiles");
  }

  return data.matches;
}

export async function swipeProfile(
  toUserId: string,
  liked: boolean,
  token: string | null
): Promise<SwipeResponse> {
  const res = await fetch(`${BASE_URL}/matches/swipe`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
    body: JSON.stringify({ toUserId, liked }),
  });

  const data: SwipeResponse = await res.json();

  if (!res.ok) {
    throw new Error(data.error?.message || "Swipe failed");
  }

  return data;
}
