"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, Users } from "lucide-react";

interface Profile {
  _id: string;
  userId: string;
  name: string;
  age: number;
  profilePic: string;
}

interface Match {
  matchId: string;
  userId: string;
  profile: Profile;
  matchedAt: string;
}

interface MatchListProps {
  matches: Match[];
  selectedMatchId: string | null;
  onSelectMatch: (match: Match) => void;
}

export default function MatchList({
  matches,
  selectedMatchId,
  onSelectMatch,
}: MatchListProps) {
  // ✅ Remove duplicate users (based on userId)
  const uniqueMatches = Array.from(
    new Map(matches.map((m) => [m.userId, m])).values()
  );

  if (uniqueMatches.length === 0) {
    return (
      <div className="p-8 text-center">
        <Users className="size-12 text-gray-300 mx-auto mb-3" />
        <p className="text-sm text-muted-foreground">
          No matches yet. Start swiping!
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-y-auto h-[calc(100vh-5rem)]">
      {uniqueMatches.map((match) => (
        <button
          key={match.matchId}
          onClick={() => onSelectMatch(match)}
          className={`w-full p-4 flex items-center gap-3 transition-colors border-b
        ${
          selectedMatchId === match.matchId
            ? "bg-pink-50 dark:bg-gray-700"
            : "bg-white dark:bg-gray-800"
        }
        hover:bg-pink-100 dark:hover:bg-gray-700
        text-gray-800 dark:text-gray-200
      `}
        >
          <Avatar className="size-12">
            <AvatarImage src={match.profile?.profilePic} />
            <AvatarFallback className="bg-pink-100 text-pink-600 dark:bg-gray-600 dark:text-gray-200">
              {match.profile?.name?.charAt(0).toUpperCase() || "?"}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 text-left">
            <h3 className="font-semibold text-sm">
              {match.profile?.name || "Unknown"}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {match.profile?.age && `${match.profile.age} years old`}
            </p>
          </div>

          <Heart className="size-4 text-pink-600 dark:text-pink-400" />
        </button>
      ))}
    </div>
  );
}
