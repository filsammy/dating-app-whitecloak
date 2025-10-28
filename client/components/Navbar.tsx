"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/context/AuthContext";
import { Heart } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const { user, loading } = useAuth();

  const isActive = (path: string) => pathname === path;

  // Don't render until auth is loaded to prevent flicker
  if (loading) {
    return (
      <>
        {/* Spacer to prevent content from being hidden under navbar */}
        <div className="h-20" />

        <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-6xl">
          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-full px-6 py-3 border border-pink-200/50 dark:border-pink-500/30">
            <div className="flex items-center justify-between">
              <Link
                href="/"
                className="flex items-center gap-2 text-2xl font-bold text-pink-600 dark:text-pink-500"
              >
                <Heart className="size-6 fill-pink-600 dark:fill-pink-500" />
                <span>Bemb</span>
              </Link>
              <div className="h-8 w-32 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-full" />
            </div>
          </div>
        </nav>
      </>
    );
  }

  return (
    <>
      {/* Spacer to prevent content from being hidden under navbar */}
      <div className="h-20 bg-linear-to-b from-pink-50 to-pink-50 dark:from-gray-900 dark:to-gray-900" />

      <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-6xl">
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-full px-6 py-3 border border-pink-200/50 dark:border-pink-500/30">
          <div className="flex items-center justify-between">
            {/* Brand Logo */}
            <Link
              href="/"
              className="flex items-center gap-2 text-2xl font-bold text-pink-600 dark:text-pink-500 hover:scale-105 transition-transform"
            >
              <Heart className="size-6 fill-pink-600 dark:fill-pink-500" />
              <span>Bemb</span>
            </Link>

            {/* Navigation Links */}
            <ul className="flex items-center gap-6">
              {user ? (
                <>
                  {/* Authenticated User Links */}
                  <li>
                    <Link
                      href="/discover"
                      className={`text-sm font-medium transition-colors hover:text-pink-600 dark:hover:text-pink-400 ${
                        isActive("/discover")
                          ? "text-pink-600 dark:text-pink-400"
                          : "text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      Match
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/chat"
                      className={`text-sm font-medium transition-colors hover:text-pink-600 dark:hover:text-pink-400 ${
                        isActive("/chat")
                          ? "text-pink-600 dark:text-pink-400"
                          : "text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      Message
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/profile"
                      className={`text-sm font-medium transition-colors hover:text-pink-600 dark:hover:text-pink-400 ${
                        isActive("/profile")
                          ? "text-pink-600 dark:text-pink-400"
                          : "text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      Profile
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/logout"
                      className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                    >
                      Logout
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  {/* Guest User Links */}
                  <li>
                    <Link
                      href="/auth/login"
                      className={`text-sm font-medium transition-colors hover:text-pink-600 dark:hover:text-pink-400 ${
                        isActive("/auth/login")
                          ? "text-pink-600 dark:text-pink-400"
                          : "text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/auth/register"
                      className="text-sm font-medium px-4 py-2 bg-pink-600 hover:bg-pink-700 dark:bg-pink-500 dark:hover:bg-pink-600 text-white rounded-full transition-colors"
                    >
                      Register
                    </Link>
                  </li>
                </>
              )}

              {/* Theme Toggle */}
              <li>
                <ThemeToggle />
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}
