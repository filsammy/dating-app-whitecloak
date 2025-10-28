"use client";
import { Card, CardContent } from "@/components/ui/card";

interface MatchModalProps {
  show: boolean;
  matchedUserName: string;
}

export default function MatchModal({ show, matchedUserName }: MatchModalProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-in fade-in">
      <Card className="max-w-sm mx-4 text-center animate-in zoom-in">
        <CardContent className="pt-8 pb-6">
          <div className="text-6xl mb-4">💖</div>
          <h2 className="text-2xl font-bold text-pink-600 mb-2">
            It's a Match!
          </h2>
          <p className="text-sm text-muted-foreground">
            You and {matchedUserName} liked each other!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
