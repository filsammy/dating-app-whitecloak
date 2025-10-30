"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface UserType {
  _id: string;
  email: string;
}

interface AuthContextType {
  user: UserType | null;
  loading: boolean;
  login: (token: string, redirectTo?: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);

  // ✅ Use the environment variable for the backend URL
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

  const fetchProfile = async (token: string) => {
    try {
      const res = await fetch(`${BASE_URL}/users/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to fetch profile");

      const data = await res.json();
      setUser(data.user);
    } catch (err) {
      console.error("Profile fetch error:", err);
      setUser(null);
      localStorage.removeItem("accessToken");
    } finally {
      setLoading(false);
    }
  };

  const login = async (token?: string, redirectTo: string = "/discover") => {
    if (!token) return;
    localStorage.setItem("accessToken", token);
    await fetchProfile(token);
    router.replace(redirectTo);
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    setUser(null);
    router.replace("/login");
  };

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) fetchProfile(token);
    else setLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
