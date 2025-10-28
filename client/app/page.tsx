import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Heart, Sparkles, MessageCircle, Users } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-linear-to-b from-pink-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center min-h-screen px-4">
        <div className="text-center space-y-6 max-w-3xl">
          {/* Animated Heart Icon */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <Heart className="size-20 text-pink-600 dark:text-pink-500 fill-pink-600 dark:fill-pink-500 animate-pulse" />
              <Sparkles
                className="size-8 text-pink-400 dark:text-pink-300 absolute -top-2 -right-2 animate-spin"
                style={{ animationDuration: "3s" }}
              />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-6xl md:text-7xl font-bold text-gray-800 dark:text-gray-100">
            Welcome to{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-pink-600 to-rose-600 dark:from-pink-400 dark:to-rose-400">
              Bemb
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Find real connections, not just matches. Where meaningful
            relationships begin.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            <Link href="/auth/register">
              <Button className="bg-pink-600 hover:bg-pink-700 dark:bg-pink-500 dark:hover:bg-pink-600 text-white px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all">
                Get Started
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button
                variant="outline"
                className="px-8 py-6 text-lg rounded-full border-2 border-pink-600 dark:border-pink-500 text-pink-600 dark:text-pink-400 hover:bg-pink-50 dark:hover:bg-gray-800 transition-all"
              >
                Sign In
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mt-24 px-4">
          <div className="text-center p-6 rounded-2xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-pink-100 dark:border-pink-900/30 hover:scale-105 transition-transform">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-pink-100 dark:bg-pink-900/30 rounded-full">
                <Users className="size-8 text-pink-600 dark:text-pink-400" />
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-100">
              Smart Matching
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Our algorithm finds people who match your interests and
              preferences
            </p>
          </div>

          <div className="text-center p-6 rounded-2xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-pink-100 dark:border-pink-900/30 hover:scale-105 transition-transform">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-pink-100 dark:bg-pink-900/30 rounded-full">
                <MessageCircle className="size-8 text-pink-600 dark:text-pink-400" />
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-100">
              Real Conversations
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Chat with matches and build genuine connections
            </p>
          </div>

          <div className="text-center p-6 rounded-2xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-pink-100 dark:border-pink-900/30 hover:scale-105 transition-transform">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-pink-100 dark:bg-pink-900/30 rounded-full">
                <Heart className="size-8 text-pink-600 dark:text-pink-400 fill-pink-600 dark:fill-pink-400" />
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-100">
              Safe & Secure
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Your privacy and safety are our top priorities
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
