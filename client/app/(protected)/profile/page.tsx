"use client";
import { useState, useEffect } from "react";
import { Spinner } from "@/components/ui/spinner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "lucide-react";
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
    if (!confirm("Are you sure you want to delete your profile?")) return;

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
      <div className="flex items-center justify-center min-h-screen">
        <Spinner className="size-8 text-pink-600" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-linear-to-b from-pink-50 to-white dark:from-gray-900 dark:to-gray-800 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="size-5 text-pink-600" />
              {hasProfile ? "Edit Your Profile" : "Create Your Profile"}
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
