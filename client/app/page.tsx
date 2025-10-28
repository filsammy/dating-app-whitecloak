import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-linear-to-b from-pink-100 to-white dark:from-gray-900 dark:to-gray-800 text-center">
      <h1 className="text-5xl font-bold mb-6 text-gray-800 dark:text-gray-100">
        Welcome to{" "}
        <span className="text-pink-600 dark:text-pink-400">DateAppWhat</span> 💖
      </h1>
      <p className="text-gray-500 dark:text-gray-300 mb-8">
        Find real connections, not just matches.
      </p>
      <Button className="bg-pink-600 hover:bg-pink-700 dark:bg-pink-500 dark:hover:bg-pink-600">
        <Heart className="mr-2 h-4 w-4" /> Get Started
      </Button>
    </main>
  );
}
