"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Heart, Trash2, Sparkles } from "lucide-react";
import ImageUpload from "@/components/ImageUpload";
import LocationSelector from "@/components/LocationSelector";
import InterestsSelector from "@/components/InterestsSelector";

interface ProfileFormProps {
  initialData: {
    name: string;
    age: string;
    bio: string;
    profilePic: string;
    latitude: string;
    longitude: string;
    gender: string;
    interestedIn: string[];
    interests: string;
  };
  hasProfile: boolean;
  onSuccess: () => void;
  onDelete: () => void;
}

export default function ProfileForm({
  initialData,
  hasProfile,
  onSuccess,
  onDelete,
}: ProfileFormProps) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState({
    ...initialData,
    interestsArray: initialData.interests
      ? initialData.interests.split(",").map((i) => i.trim())
      : [],
  });

  useEffect(() => {
    setForm({
      ...initialData,
      interestsArray: initialData.interests
        ? initialData.interests.split(",").map((i) => i.trim())
        : [],
    });
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);

    try {
      const token = localStorage.getItem("accessToken");
      const payload = {
        name: form.name.trim(),
        age: parseInt(form.age),
        bio: form.bio.trim(),
        profilePic: form.profilePic.trim(),
        location: {
          type: "Point",
          coordinates: [parseFloat(form.longitude), parseFloat(form.latitude)],
        },
        gender: form.gender,
        interestedIn: form.interestedIn,
        interests: form.interestsArray,
      };

      const res = await fetch("http://localhost:5000/profiles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error?.message || "Failed to save profile");
        return;
      }

      setSuccess(hasProfile ? "Profile updated!" : "Profile created!");
      onSuccess();
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleGenderInterestToggle = (gender: string) => {
    setForm((prev) => ({
      ...prev,
      interestedIn: prev.interestedIn.includes(gender)
        ? prev.interestedIn.filter((g) => g !== gender)
        : [...prev.interestedIn, gender],
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Profile Picture Upload */}
      <ImageUpload
        currentImage={form.profilePic}
        userName={form.name}
        onImageSelect={(imageUrl) => setForm({ ...form, profilePic: imageUrl })}
      />

      {/* Name */}
      <div>
        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">
          Name *
        </label>
        <Input
          placeholder="Your name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
          className="border-pink-200 dark:border-pink-800 focus:border-pink-500"
        />
      </div>

      {/* Age */}
      <div>
        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">
          Age *
        </label>
        <Input
          type="number"
          placeholder="18"
          min="18"
          max="100"
          value={form.age}
          onChange={(e) => setForm({ ...form, age: e.target.value })}
          required
          className="border-pink-200 dark:border-pink-800 focus:border-pink-500"
        />
      </div>

      {/* Gender */}
      <div>
        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">
          Gender *
        </label>
        <div className="flex gap-2 flex-wrap">
          {["male", "female", "non-binary", "other"].map((gender) => (
            <Button
              key={gender}
              type="button"
              variant={form.gender === gender ? "default" : "outline"}
              onClick={() => setForm({ ...form, gender })}
              className={
                form.gender === gender
                  ? "bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 border-0"
                  : "border-pink-200 dark:border-pink-800 hover:bg-pink-50 dark:hover:bg-pink-900/20"
              }
            >
              {gender}
            </Button>
          ))}
        </div>
      </div>

      {/* Interested In */}
      <div>
        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">
          Interested In *
        </label>
        <div className="flex gap-2 flex-wrap">
          {["male", "female", "non-binary", "other"].map((gender) => (
            <Button
              key={gender}
              type="button"
              variant={
                form.interestedIn.includes(gender) ? "default" : "outline"
              }
              onClick={() => handleGenderInterestToggle(gender)}
              className={
                form.interestedIn.includes(gender)
                  ? "bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 border-0"
                  : "border-pink-200 dark:border-pink-800 hover:bg-pink-50 dark:hover:bg-pink-900/20"
              }
            >
              {gender}
            </Button>
          ))}
        </div>
      </div>

      {/* Bio */}
      <div>
        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">
          Bio
        </label>
        <textarea
          placeholder="Tell us about yourself..."
          value={form.bio}
          onChange={(e) => setForm({ ...form, bio: e.target.value })}
          className="w-full min-h-28 px-4 py-3 border-2 border-pink-200 dark:border-pink-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 dark:focus:ring-pink-400 focus:border-transparent bg-white dark:bg-gray-900 resize-none"
          maxLength={500}
        />
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {form.bio.length}/500 characters
        </p>
      </div>

      {/* Location Selector */}
      <LocationSelector
        latitude={form.latitude}
        longitude={form.longitude}
        onLocationChange={(lat, lng) =>
          setForm({ ...form, latitude: lat, longitude: lng })
        }
      />

      {/* Interests Selector */}
      <InterestsSelector
        selectedInterests={form.interestsArray}
        onInterestsChange={(interests) =>
          setForm({ ...form, interestsArray: interests })
        }
      />

      {/* Error/Success Messages */}
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-600 dark:text-red-400 font-medium">
            {error}
          </p>
        </div>
      )}
      {success && (
        <div className="p-4 bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800 rounded-lg">
          <p className="text-sm text-green-600 dark:text-green-400 font-medium flex items-center gap-2">
            <Sparkles className="size-4" />
            {success}
          </p>
        </div>
      )}

      {/* Submit Buttons */}
      <div className="flex gap-3 pt-4">
        <Button
          type="submit"
          className="flex-1 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 dark:from-pink-500 dark:to-rose-500 py-6 rounded-full shadow-lg hover:shadow-xl transition-all"
          disabled={saving}
        >
          {saving ? (
            <>
              <Spinner className="size-5 text-white" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Heart className="size-5" />
              {hasProfile ? "Update Profile" : "Create Profile"}
            </>
          )}
        </Button>
        {hasProfile && (
          <Button
            type="button"
            variant="destructive"
            onClick={onDelete}
            className="px-6 py-6 rounded-full"
          >
            <Trash2 className="size-5" />
          </Button>
        )}
      </div>
    </form>
  );
}
