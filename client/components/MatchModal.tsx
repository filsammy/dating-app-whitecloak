"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, X } from "lucide-react";
import { useRouter } from "next/navigation";

interface MatchModalProps {
  show: boolean;
  matchedUserName: string;
  onClose: () => void;
}

export default function MatchModal({
  show,
  matchedUserName,
  onClose,
}: MatchModalProps) {
  const router = useRouter();

  if (!show) return null;

  const handleChatNow = () => {
    onClose();
    router.push("/chat");
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in px-4">
      <Card className="max-w-md w-full text-center animate-in zoom-in shadow-2xl border-pink-200 dark:border-pink-800">
        <CardContent className="pt-8 pb-6 space-y-6">
          {/* Animated Heart Icon */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="text-8xl animate-bounce">💖</div>
              <div className="absolute inset-0 text-8xl animate-ping opacity-30">
                💖
              </div>
            </div>
          </div>

          {/* Match Text */}
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-pink-600 dark:text-pink-400">
              It's a Match!
            </h2>
            <p className="text-base text-gray-600 dark:text-gray-300">
              You and{" "}
              <span className="font-semibold text-pink-600 dark:text-pink-400">
                {matchedUserName}
              </span>{" "}
              liked each other!
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              onClick={handleChatNow}
              className="flex-1 bg-pink-600 hover:bg-pink-700 dark:bg-pink-500 dark:hover:bg-pink-600 text-white py-6 text-base rounded-full shadow-lg hover:shadow-xl transition-all"
            >
              <MessageCircle className="mr-2 size-5" />
              Chat Now
            </Button>
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1 py-6 text-base rounded-full border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
            >
              <X className="mr-2 size-5" />
              Keep Swiping
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
