"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Spinner } from "@/components/ui/spinner";
import { Heart, X, MapPin, User, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";

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

export default function DiscoverPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [swiping, setSwiping] = useState(false);
  const [matchModal, setMatchModal] = useState(false);
  const [filters, setFilters] = useState({
    maxDistance: "50",
    minAge: "",
    maxAge: "",
  });

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const params = new URLSearchParams();
      if (filters.maxDistance)
        params.append("maxDistance", filters.maxDistance);
      if (filters.minAge) params.append("minAge", filters.minAge);
      if (filters.maxAge) params.append("maxAge", filters.maxAge);
      params.append("limit", "20");

      const res = await fetch(
        `http://localhost:5000/matches/discover?${params.toString()}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.ok) {
        const data = await res.json();
        setProfiles(data.matches);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSwipe = async (liked: boolean) => {
    if (swiping || currentIndex >= profiles.length) return;

    setSwiping(true);
    const currentProfile = profiles[currentIndex];

    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch("http://localhost:5000/matches/swipe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          toUserId: currentProfile.userId,
          liked,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.isMatch) {
          setMatchModal(true);
          setTimeout(() => setMatchModal(false), 3000);
        }
      }

      setCurrentIndex((prev) => prev + 1);
    } catch (err) {
      console.error(err);
    } finally {
      setSwiping(false);
    }
  };

  const applyFilters = () => {
    setCurrentIndex(0);
    setLoading(true);
    fetchProfiles();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Spinner className="size-8 text-pink-600" />
        <p className="mt-3 text-sm text-muted-foreground">Finding matches...</p>
      </div>
    );
  }

  const currentProfile = profiles[currentIndex];

  return (
    <main className="min-h-screen bg-linear-to-b from-pink-50 to-white py-8 px-4">
      <div className="max-w-md mx-auto space-y-4">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center justify-center gap-2">
            <Sparkles className="size-7 text-pink-600" />
            Discover
          </h1>
          <p className="text-muted-foreground text-sm">
            Find your perfect match
          </p>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-xs font-medium mb-1 block">
                  Max Distance (km)
                </label>
                <Input
                  type="number"
                  value={filters.maxDistance}
                  onChange={(e) =>
                    setFilters({ ...filters, maxDistance: e.target.value })
                  }
                  placeholder="50"
                />
              </div>
              <div>
                <label className="text-xs font-medium mb-1 block">
                  Min Age
                </label>
                <Input
                  type="number"
                  value={filters.minAge}
                  onChange={(e) =>
                    setFilters({ ...filters, minAge: e.target.value })
                  }
                  placeholder="18"
                />
              </div>
              <div>
                <label className="text-xs font-medium mb-1 block">
                  Max Age
                </label>
                <Input
                  type="number"
                  value={filters.maxAge}
                  onChange={(e) =>
                    setFilters({ ...filters, maxAge: e.target.value })
                  }
                  placeholder="50"
                />
              </div>
            </div>
            <Button
              onClick={applyFilters}
              className="w-full mt-3 bg-pink-600 hover:bg-pink-700"
              size="sm"
            >
              Apply Filters
            </Button>
          </CardContent>
        </Card>

        {/* Profile Card */}
        {currentProfile ? (
          <Card className="overflow-hidden shadow-lg">
            {/* Profile Image */}
            <div className="relative h-96 bg-linear-to-b from-gray-200 to-gray-300">
              {currentProfile.profilePic ? (
                <img
                  src={currentProfile.profilePic}
                  alt={currentProfile.name}
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
                  {currentProfile.name}, {currentProfile.age}
                </h2>
                <p className="text-sm opacity-90 flex items-center gap-1 mt-1">
                  <MapPin className="size-4" />
                  {Math.round(Math.random() * 10)} km away
                </p>
              </div>
            </div>

            <CardContent className="space-y-4 pt-6">
              {/* Bio */}
              {currentProfile.bio && (
                <div>
                  <h3 className="font-semibold text-sm text-gray-700 mb-1">
                    About
                  </h3>
                  <p className="text-sm text-gray-600">{currentProfile.bio}</p>
                </div>
              )}

              {/* Interests */}
              {currentProfile.interests &&
                currentProfile.interests.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-sm text-gray-700 mb-2">
                      Interests
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {currentProfile.interests.map((interest, idx) => (
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
                  onClick={() => handleSwipe(false)}
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
                  onClick={() => handleSwipe(true)}
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
        ) : (
          <Card className="p-12 text-center">
            <User className="size-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No More Profiles
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              You've seen everyone in your area. Try adjusting your filters!
            </p>
            <Button
              onClick={applyFilters}
              className="bg-pink-600 hover:bg-pink-700"
            >
              Refresh
            </Button>
          </Card>
        )}

        {/* Match Modal */}
        {matchModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-in fade-in">
            <Card className="max-w-sm mx-4 text-center animate-in zoom-in">
              <CardContent className="pt-8 pb-6">
                <div className="text-6xl mb-4">💖</div>
                <h2 className="text-2xl font-bold text-pink-600 mb-2">
                  It's a Match!
                </h2>
                <p className="text-sm text-muted-foreground">
                  You and {currentProfile?.name} liked each other!
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </main>
  );
}
