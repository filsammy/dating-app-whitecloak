const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface ApiError {
  message?: string;
}

interface AuthResponse {
  access?: string;
  refresh?: string;
  user?: any;
  error?: ApiError;
}

export async function registerUser(email: string, password: string): Promise<AuthResponse> {
  const res = await fetch(`${BASE_URL}/users/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error?.message || "Registration failed");
  }

  return data;
}

export async function loginUser(email: string, password: string): Promise<AuthResponse> {
  const res = await fetch(`${BASE_URL}/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error?.message || "Login failed");
  }

  return data;
}
