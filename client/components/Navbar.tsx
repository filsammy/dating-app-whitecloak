import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function Header() {
  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/30 dark:bg-black/30 border-b border-white/20 dark:border-black/20 shadow-sm flex items-center justify-center px-6 py-4">
      <ul className="flex items-center gap-6 text-lg font-medium text-gray-800 dark:text-gray-100">
        <li>
          <Link href="/" className="hover:text-pink-600 transition-colors">
            Home
          </Link>
        </li>
        <li>
          <Link
            href="/discover"
            className="hover:text-pink-600 transition-colors"
          >
            Match
          </Link>
        </li>
        <li>
          <Link href="/chat" className="hover:text-pink-600 transition-colors">
            Message
          </Link>
        </li>
        <li>
          <Link
            href="/profile"
            className="hover:text-pink-600 transition-colors"
          >
            Profile
          </Link>
        </li>
        <li>
          <Link
            href="/auth/login"
            className="hover:text-pink-600 transition-colors"
          >
            Login
          </Link>
        </li>
        <li>
          <Link
            href="/auth/register"
            className="hover:text-pink-600 transition-colors"
          >
            Register
          </Link>
        </li>
        <li>
          <Link
            href="/logout"
            className="hover:text-pink-600 transition-colors"
          >
            Logout
          </Link>
        </li>
        <li>
          <ThemeToggle />
        </li>
      </ul>
    </nav>
  );
}
