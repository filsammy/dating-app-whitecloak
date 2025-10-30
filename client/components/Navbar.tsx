"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/context/AuthContext";
import { Heart, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const { user, loading } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

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
              onClick={closeMenu}
            >
              <Heart className="size-6 fill-pink-600 dark:fill-pink-500" />
              <span>Bemb</span>
            </Link>

            {/* Desktop Navigation Links */}
            <ul className="hidden md:flex items-center gap-6">
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
                      href="/blocked"
                      className={`text-sm font-medium transition-colors hover:text-pink-600 dark:hover:text-pink-400 ${
                        isActive("/blocked")
                          ? "text-pink-600 dark:text-pink-400"
                          : "text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      Blocked
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

            {/* Mobile Menu Button and Theme Toggle */}
            <div className="flex md:hidden items-center gap-3">
              <ThemeToggle />
              <button
                onClick={toggleMenu}
                className="text-gray-700 dark:text-gray-300 hover:text-pink-600 dark:hover:text-pink-400 transition-colors"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? (
                  <X className="size-6" />
                ) : (
                  <Menu className="size-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden mt-2 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-3xl border border-pink-200/50 dark:border-pink-500/30 overflow-hidden">
            <ul className="py-3">
              {user ? (
                <>
                  {/* Authenticated User Links */}
                  <li>
                    <Link
                      href="/discover"
                      onClick={closeMenu}
                      className={`block px-6 py-3 text-sm font-medium transition-colors hover:bg-pink-50 dark:hover:bg-gray-800 ${
                        isActive("/discover")
                          ? "text-pink-600 dark:text-pink-400 bg-pink-50 dark:bg-gray-800"
                          : "text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      Match
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/chat"
                      onClick={closeMenu}
                      className={`block px-6 py-3 text-sm font-medium transition-colors hover:bg-pink-50 dark:hover:bg-gray-800 ${
                        isActive("/chat")
                          ? "text-pink-600 dark:text-pink-400 bg-pink-50 dark:bg-gray-800"
                          : "text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      Message
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/profile"
                      onClick={closeMenu}
                      className={`block px-6 py-3 text-sm font-medium transition-colors hover:bg-pink-50 dark:hover:bg-gray-800 ${
                        isActive("/profile")
                          ? "text-pink-600 dark:text-pink-400 bg-pink-50 dark:bg-gray-800"
                          : "text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      Profile
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/blocked"
                      onClick={closeMenu}
                      className={`block px-6 py-3 text-sm font-medium transition-colors hover:bg-pink-50 dark:hover:bg-gray-800 ${
                        isActive("/blocked")
                          ? "text-pink-600 dark:text-pink-400 bg-pink-50 dark:bg-gray-800"
                          : "text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      Blocked
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/logout"
                      onClick={closeMenu}
                      className="block px-6 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
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
                      onClick={closeMenu}
                      className={`block px-6 py-3 text-sm font-medium transition-colors hover:bg-pink-50 dark:hover:bg-gray-800 ${
                        isActive("/auth/login")
                          ? "text-pink-600 dark:text-pink-400 bg-pink-50 dark:bg-gray-800"
                          : "text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      Login
                    </Link>
                  </li>
                  <li className="px-6 py-2">
                    <Link
                      href="/auth/register"
                      onClick={closeMenu}
                      className="block text-center text-sm font-medium px-4 py-2 bg-pink-600 hover:bg-pink-700 dark:bg-pink-500 dark:hover:bg-pink-600 text-white rounded-full transition-colors"
                    >
                      Register
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        )}
      </nav>
    </>
  );
}
