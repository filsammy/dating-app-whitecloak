"use client";
import { useState, useEffect } from "react";
import { Spinner } from "@/components/ui/spinner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, User, Sparkles } from "lucide-react";
import ProfileForm from "@/components/ProfileForm";

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [hasProfile, setHasProfile] = useState(false);
  const [form, setForm] = useState({
    name: "",
    age: "",
    bio: "",
    profilePic: "",
    latitude: "",
    longitude: "",
    gender: "",
    interestedIn: [] as string[],
    interests: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch("http://localhost:5000/profiles/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        const profile = data.profile;
        setHasProfile(true);
        setForm({
          name: profile.name || "",
          age: profile.age?.toString() || "",
          bio: profile.bio || "",
          profilePic: profile.profilePic || "",
          latitude: profile.location?.coordinates[1]?.toString() || "",
          longitude: profile.location?.coordinates[0]?.toString() || "",
          gender: profile.gender || "",
          interestedIn: profile.interestedIn || [],
          interests: profile.interests?.join(", ") || "",
        });
      } else {
        setHasProfile(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSuccess = () => {
    setHasProfile(true);
    fetchProfile();
  };

  const handleDelete = async () => {
    if (
      !confirm(
        "Are you sure you want to delete your profile? This action cannot be undone."
      )
    )
      return;

    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch("http://localhost:5000/profiles", {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setHasProfile(false);
        setForm({
          name: "",
          age: "",
          bio: "",
          profilePic: "",
          latitude: "",
          longitude: "",
          gender: "",
          interestedIn: [],
          interests: "",
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-linear-to-b from-pink-50 to-white dark:from-gray-900 dark:to-gray-800">
        <Spinner className="size-12 text-pink-600 dark:text-pink-400" />
        <p className="mt-4 text-base text-gray-600 dark:text-gray-300 font-medium">
          Loading profile...
        </p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-linear-to-b from-pink-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-3">
            <User className="size-8 text-pink-600 dark:text-pink-400" />
            <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100">
              {hasProfile ? "Edit Profile" : "Create Profile"}
            </h1>
            <Sparkles className="size-8 text-pink-600 dark:text-pink-400 animate-pulse" />
          </div>
          <p className="text-gray-600 dark:text-gray-300">
            {hasProfile
              ? "Update your information to find better matches"
              : "Tell us about yourself to get started"}
          </p>
        </div>

        {/* Profile Form Card */}
        <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-pink-100 dark:border-pink-900/30 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Heart className="size-5 text-pink-600 dark:text-pink-400" />
              {hasProfile ? "Your Profile" : "Build Your Profile"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ProfileForm
              initialData={form}
              hasProfile={hasProfile}
              onSuccess={handleSuccess}
              onDelete={handleDelete}
            />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
