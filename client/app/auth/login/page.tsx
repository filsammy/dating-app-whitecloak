"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/context/AuthContext";
import { loginUser } from "@/api/users";

export default function LoginPage() {
  const router = useRouter();
  const { user, loading: authLoading, login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ email: "", password: "" });

  // redirect if already logged in
  useEffect(() => {
    if (!authLoading && user) {
      router.replace("/profile");
    }
  }, [user, authLoading, router]);

  async function handleLogin(e: React.FormEvent) {
    console.log("Deployed BASE_URL:", process.env.NEXT_PUBLIC_API_URL);
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await loginUser(form.email, form.password);

      if (data.access) {
        await login(data.access); // update context or token
        router.replace("/discover");
      } else {
        throw new Error("Invalid response from server.");
      }
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-pink-50 to-pink-50 dark:from-gray-900 dark:to-gray-900">
      <form
        onSubmit={handleLogin}
        className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-md w-full max-w-md space-y-4 transition-colors"
      >
        <h1 className="text-2xl font-semibold text-center text-pink-600">
          Login
        </h1>

        <Input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
          className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-300"
        />

        <Input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
          className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-300"
        />

        {error && (
          <p className="text-sm text-red-500 text-center font-medium">
            {error}
          </p>
        )}

        <Button
          type="submit"
          className="w-full bg-pink-600 hover:bg-pink-700 text-white flex items-center justify-center gap-2 disabled:opacity-70"
          disabled={loading}
        >
          {loading ? (
            <>
              <Spinner className="size-5 text-white" />
              <span>Signing in...</span>
            </>
          ) : (
            "Submit"
          )}
        </Button>
      </form>
    </div>
  );
}
