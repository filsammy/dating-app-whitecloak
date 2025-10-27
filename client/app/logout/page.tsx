"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/context/AuthContext";

export default function LogoutPage() {
  const router = useRouter();
  const { logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const doLogout = async () => {
      try {
        logout(); // clears user state and token
        router.replace("/auth/login");
      } catch (err) {
        console.error(err);
        setError("Failed to log out. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    doLogout();
  }, [logout, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Spinner className="size-6 text-pink-600" />
        <p className="mt-3 text-sm font-medium text-muted-foreground">
          Logging out...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <p className="text-red-500 font-medium">{error}</p>
        <button
          onClick={() => router.push("/discover")}
          className="mt-4 text-pink-600 underline"
        >
          Go back
        </button>
      </div>
    );
  }

  return null;
}
