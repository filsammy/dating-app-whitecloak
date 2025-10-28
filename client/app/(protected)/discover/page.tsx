"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { User, Sparkles } from "lucide-react";
import ProfileCard from "@/components/ProfileCard";
import MatchModal from "@/components/MatchModal";
import DiscoverFilters from "@/components/DiscoverFilters";

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
  const [matchedName, setMatchedName] = useState("");
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
          toUserId: currentProfile.userId, // ✅ Fixed: using userId from profile
          liked,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.isMatch) {
          setMatchedName(currentProfile.name);
          setMatchModal(true);
          setTimeout(() => setMatchModal(false), 3000);
        }
      } else {
        const errorData = await res.json();
        console.error("Swipe error:", errorData);
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
    <main className="min-h-screen bg-linear-to-b from-pink-50 to-white dark:from-gray-900 dark:to-gray-800 py-8 px-4">
      <div className="max-w-md mx-auto space-y-4">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
            <Sparkles className="size-7 text-pink-600" />
            Discover
          </h1>
          <p className="text-muted-foreground text-sm">
            Find your perfect match
          </p>
        </div>

        {/* Filters */}
        <DiscoverFilters
          filters={filters}
          onFilterChange={setFilters}
          onApply={applyFilters}
        />

        {/* Profile Card */}
        {currentProfile ? (
          <ProfileCard
            profile={currentProfile}
            onSwipe={handleSwipe}
            swiping={swiping}
          />
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
        <MatchModal show={matchModal} matchedUserName={matchedName} />
      </div>
    </main>
  );
}
