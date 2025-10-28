"use client";
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
  return (
    <Card className="overflow-hidden shadow-lg">
      {/* Profile Image */}
      <div className="relative h-96 bg-linear-to-b from-gray-200 to-gray-300">
        {profile.profilePic ? (
          <img
            src={profile.profilePic}
            alt={profile.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <User className="size-24 text-gray-400" />
          </div>
        )}
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />

        {/* Profile Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <h2 className="text-3xl font-bold">
            {profile.name}, {profile.age}
          </h2>
          <p className="text-sm opacity-90 flex items-center gap-1 mt-1">
            <MapPin className="size-4" />
            {Math.round(Math.random() * 10)} km away
          </p>
        </div>
      </div>

      <CardContent className="space-y-4 pt-6">
        {/* Bio */}
        {profile.bio && (
          <div>
            <h3 className="font-semibold text-sm text-gray-700 mb-1">About</h3>
            <p className="text-sm text-gray-600">{profile.bio}</p>
          </div>
        )}

        {/* Interests */}
        {profile.interests && profile.interests.length > 0 && (
          <div>
            <h3 className="font-semibold text-sm text-gray-700 mb-2">
              Interests
            </h3>
            <div className="flex flex-wrap gap-2">
              {profile.interests.map((interest, idx) => (
                <span
                  key={idx}
                  className="bg-pink-100 text-pink-700 text-xs px-3 py-1 rounded-full"
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
            className="flex-1 h-14 border-2 hover:border-red-500 hover:bg-red-50"
          >
            {swiping ? (
              <Spinner className="size-6" />
            ) : (
              <X className="size-8 text-red-500" />
            )}
          </Button>
          <Button
            onClick={() => onSwipe(true)}
            disabled={swiping}
            className="flex-1 h-14 bg-pink-600 hover:bg-pink-700"
          >
            {swiping ? (
              <Spinner className="size-6 text-white" />
            ) : (
              <Heart className="size-8" />
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
