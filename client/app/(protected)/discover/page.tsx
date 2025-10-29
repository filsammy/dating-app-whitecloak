"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { User, Sparkles } from "lucide-react";
import ProfileCard from "@/components/ProfileCard";
import MatchModal from "@/components/MatchModal";
import DiscoverFilters from "@/components/DiscoverFilters";

// 🧩 Import API functions + types
import { fetchDiscoverProfiles, swipeProfile, Profile } from "@/api/discover";

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
    loadProfiles();
  }, []);

  const loadProfiles = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");
      const data = await fetchDiscoverProfiles(filters, token);
      setProfiles(data);
    } catch (err) {
      console.error("Error loading profiles:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle swipe using the API service
  const handleSwipe = async (liked: boolean) => {
    if (swiping || currentIndex >= profiles.length) return;
    setSwiping(true);

    const currentProfile = profiles[currentIndex];
    const token = localStorage.getItem("accessToken");

    try {
      const result = await swipeProfile(currentProfile.userId, liked, token);
      if (result.isMatch) {
        setMatchedName(currentProfile.name);
        setMatchModal(true);
      }
    } catch (err) {
      console.error("Swipe failed:", err);
    } finally {
      setCurrentIndex((prev) => prev + 1);
      setSwiping(false);
    }
  };

  // Reapply filters
  const applyFilters = () => {
    setCurrentIndex(0);
    loadProfiles();
  };

  const handleCloseModal = () => {
    setMatchModal(false);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-linear-to-b from-pink-50 to-white dark:from-gray-900 dark:to-gray-800">
        <Spinner className="size-12 text-pink-600 dark:text-pink-400" />
        <p className="mt-4 text-base text-gray-600 dark:text-gray-300 font-medium">
          Finding matches...
        </p>
      </div>
    );
  }

  const currentProfile = profiles[currentIndex];

  return (
    <main className="min-h-screen bg-linear-to-b from-pink-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 px-4">
      <div className="max-w-lg mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-3">
            <Sparkles className="size-8 text-pink-600 dark:text-pink-400 animate-pulse" />
            <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100">
              Discover
            </h1>
            <Sparkles className="size-8 text-pink-600 dark:text-pink-400 animate-pulse" />
          </div>
          <p className="text-gray-600 dark:text-gray-300">
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
          <Card className="p-16 text-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-pink-100 dark:border-pink-900/30">
            <div className="space-y-4">
              <User className="size-20 text-gray-300 dark:text-gray-600 mx-auto" />
              <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                No More Profiles
              </h3>
              <p className="text-base text-gray-600 dark:text-gray-400 max-w-xs mx-auto">
                You've seen everyone in your area. Try adjusting your filters!
              </p>
              <Button
                onClick={applyFilters}
                className="bg-pink-600 hover:bg-pink-700 dark:bg-pink-500 dark:hover:bg-pink-600 text-white px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all mt-4"
              >
                <Sparkles className="mr-2 size-5" />
                Refresh
              </Button>
            </div>
          </Card>
        )}

        {/* Match Modal */}
        <MatchModal
          show={matchModal}
          matchedUserName={matchedName}
          onClose={handleCloseModal}
        />
      </div>
    </main>
  );
}
