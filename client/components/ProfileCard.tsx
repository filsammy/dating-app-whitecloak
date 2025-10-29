"use client";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { Heart, X, MapPin, User } from "lucide-react";

interface Profile {
  _id: string;
  userId: string;
  name: string;
  age: number;
  bio: string;
  profilePic: string;
  gender: string;
  interests: string[];
  location: {
    coordinates: [number, number];
  };
}

interface ProfileCardProps {
  profile: Profile;
  onSwipe: (liked: boolean) => void;
  swiping: boolean;
}

export default function ProfileCard({
  profile,
  onSwipe,
  swiping,
}: ProfileCardProps) {
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(
    null
  );
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleDragStart = (clientX: number, clientY: number) => {
    if (swiping) return;
    setDragStart({ x: clientX, y: clientY });
    setIsDragging(true);
  };

  const handleDragMove = (clientX: number, clientY: number) => {
    if (!dragStart || !isDragging || swiping) return;
    const deltaX = clientX - dragStart.x;
    const deltaY = clientY - dragStart.y;
    setDragOffset({ x: deltaX, y: deltaY });
  };

  const handleDragEnd = () => {
    if (!isDragging || swiping) return;

    const swipeThreshold = 100;

    if (Math.abs(dragOffset.x) > swipeThreshold) {
      // Swiped left (reject) or right (like)
      const liked = dragOffset.x > 0;
      onSwipe(liked);
    }

    // Reset
    setDragStart(null);
    setDragOffset({ x: 0, y: 0 });
    setIsDragging(false);
  };

  // Calculate rotation and opacity based on drag
  const rotation = dragOffset.x / 20;
  const opacity = Math.max(0.5, 1 - Math.abs(dragOffset.x) / 300);

  return (
    <Card
      ref={cardRef}
      className="overflow-hidden shadow-2xl border-pink-100 dark:border-pink-900/30 cursor-grab active:cursor-grabbing"
      style={{
        transform: isDragging
          ? `translateX(${dragOffset.x}px) translateY(${dragOffset.y}px) rotate(${rotation}deg)`
          : "none",
        opacity: isDragging ? opacity : 1,
        transition: isDragging
          ? "none"
          : "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
      onMouseDown={(e) => handleDragStart(e.clientX, e.clientY)}
      onMouseMove={(e) => handleDragMove(e.clientX, e.clientY)}
      onMouseUp={handleDragEnd}
      onMouseLeave={handleDragEnd}
      onTouchStart={(e) =>
        handleDragStart(e.touches[0].clientX, e.touches[0].clientY)
      }
      onTouchMove={(e) =>
        handleDragMove(e.touches[0].clientX, e.touches[0].clientY)
      }
      onTouchEnd={handleDragEnd}
    >
      {/* Swipe Indicators */}
      {isDragging && (
        <>
          {/* Like Indicator (Right) */}
          <div
            className="absolute top-8 right-8 z-10 pointer-events-none"
            style={{
              opacity: Math.max(0, dragOffset.x / 150),
              transform: `scale(${Math.max(1, dragOffset.x / 100)})`,
            }}
          >
            <div className="bg-green-500 text-white px-6 py-3 rounded-2xl font-bold text-2xl border-4 border-white shadow-xl rotate-12">
              LIKE
            </div>
          </div>

          {/* Reject Indicator (Left) */}
          <div
            className="absolute top-8 left-8 z-10 pointer-events-none"
            style={{
              opacity: Math.max(0, -dragOffset.x / 150),
              transform: `scale(${Math.max(1, -dragOffset.x / 100)})`,
            }}
          >
            <div className="bg-red-500 text-white px-6 py-3 rounded-2xl font-bold text-2xl border-4 border-white shadow-xl -rotate-12">
              NOPE
            </div>
          </div>
        </>
      )}

      {/* Profile Image */}
      <div className="relative h-[500px] bg-linear-to-b from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800">
        {profile.profilePic ? (
          <img
            src={profile.profilePic}
            alt={profile.name}
            className="w-full h-full object-cover"
            draggable="false"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <User className="size-32 text-gray-400 dark:text-gray-600" />
          </div>
        )}

        {/* linear Overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent" />

        {/* Profile Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <h2 className="text-4xl font-bold drop-shadow-lg">
            {profile.name}, {profile.age}
          </h2>
          <p className="text-base opacity-90 flex items-center gap-2 mt-2 drop-shadow-md">
            <MapPin className="size-5" />
            {Math.round(Math.random() * 10)} km away
          </p>
        </div>
      </div>

      <CardContent className="space-y-4 pt-6 pb-6 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm">
        {/* Bio */}
        {profile.bio && (
          <div>
            <h3 className="font-semibold text-base text-gray-800 dark:text-gray-200 mb-2">
              About
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              {profile.bio}
            </p>
          </div>
        )}

        {/* Interests */}
        {profile.interests && profile.interests.length > 0 && (
          <div>
            <h3 className="font-semibold text-base text-gray-800 dark:text-gray-200 mb-3">
              Interests
            </h3>
            <div className="flex flex-wrap gap-2">
              {profile.interests.map((interest, idx) => (
                <span
                  key={idx}
                  className="bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-400 text-sm px-4 py-2 rounded-full font-medium"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4 pt-4">
          <Button
            onClick={() => onSwipe(false)}
            disabled={swiping}
            variant="outline"
            className="flex-1 h-16 border-2 border-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-2xl shadow-lg hover:shadow-xl transition-all"
          >
            {swiping ? (
              <Spinner className="size-6" />
            ) : (
              <X className="size-10 text-red-500" strokeWidth={3} />
            )}
          </Button>
          <Button
            onClick={() => onSwipe(true)}
            disabled={swiping}
            className="flex-1 h-16 bg-linear-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 dark:from-pink-500 dark:to-rose-500 rounded-2xl shadow-lg hover:shadow-xl transition-all"
          >
            {swiping ? (
              <Spinner className="size-6 text-white" />
            ) : (
              <Heart className="size-10 text-white" strokeWidth={3} />
            )}
          </Button>
        </div>

        {/* Swipe Hint */}
        <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-2">
          Swipe or use buttons to like or pass
        </p>
      </CardContent>
    </Card>
  );
}
