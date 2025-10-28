"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Heart, Trash2 } from "lucide-react";

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
  const [form, setForm] = useState(initialData);

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
        interests: form.interests
          .split(",")
          .map((i) => i.trim())
          .filter((i) => i),
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
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Profile Picture Preview */}
      <div className="flex justify-center">
        <Avatar className="size-24">
          <AvatarImage src={form.profilePic} />
          <AvatarFallback className="bg-pink-100 text-pink-600 text-2xl">
            {form.name.charAt(0).toUpperCase() || "?"}
          </AvatarFallback>
        </Avatar>
      </div>

      {/* Name */}
      <div>
        <label className="text-sm font-medium mb-1 block">Name</label>
        <Input
          placeholder="Your name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
      </div>

      {/* Age */}
      <div>
        <label className="text-sm font-medium mb-1 block">Age</label>
        <Input
          type="number"
          placeholder="18"
          min="18"
          max="100"
          value={form.age}
          onChange={(e) => setForm({ ...form, age: e.target.value })}
          required
        />
      </div>

      {/* Gender */}
      <div>
        <label className="text-sm font-medium mb-1 block">Gender</label>
        <div className="flex gap-2 flex-wrap">
          {["male", "female", "non-binary", "other"].map((gender) => (
            <Button
              key={gender}
              type="button"
              variant={form.gender === gender ? "default" : "outline"}
              onClick={() => setForm({ ...form, gender })}
              className={
                form.gender === gender ? "bg-pink-600 hover:bg-pink-700" : ""
              }
            >
              {gender}
            </Button>
          ))}
        </div>
      </div>

      {/* Interested In */}
      <div>
        <label className="text-sm font-medium mb-1 block">Interested In</label>
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
                  ? "bg-pink-600 hover:bg-pink-700"
                  : ""
              }
            >
              {gender}
            </Button>
          ))}
        </div>
      </div>

      {/* Bio */}
      <div>
        <label className="text-sm font-medium mb-1 block">Bio</label>
        <textarea
          placeholder="Tell us about yourself..."
          value={form.bio}
          onChange={(e) => setForm({ ...form, bio: e.target.value })}
          className="w-full min-h-24 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
        />
      </div>

      {/* Profile Picture URL */}
      <div>
        <label className="text-sm font-medium mb-1 block">
          Profile Picture URL
        </label>
        <Input
          placeholder="https://example.com/photo.jpg"
          value={form.profilePic}
          onChange={(e) => setForm({ ...form, profilePic: e.target.value })}
        />
      </div>

      {/* Location */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium mb-1 flex items-center gap-1">
            <MapPin className="size-4" /> Latitude
          </label>
          <Input
            type="number"
            step="any"
            placeholder="10.3157"
            value={form.latitude}
            onChange={(e) => setForm({ ...form, latitude: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-1 flex items-center gap-1">
            <MapPin className="size-4" /> Longitude
          </label>
          <Input
            type="number"
            step="any"
            placeholder="123.8854"
            value={form.longitude}
            onChange={(e) => setForm({ ...form, longitude: e.target.value })}
            required
          />
        </div>
      </div>

      {/* Interests */}
      <div>
        <label className="text-sm font-medium mb-1 block">
          Interests (comma-separated)
        </label>
        <Input
          placeholder="hiking, music, travel, cooking"
          value={form.interests}
          onChange={(e) => setForm({ ...form, interests: e.target.value })}
        />
      </div>

      {/* Error/Success Messages */}
      {error && <p className="text-sm text-red-500 font-medium">{error}</p>}
      {success && (
        <p className="text-sm text-green-500 font-medium">{success}</p>
      )}

      {/* Submit Button */}
      <div className="flex gap-2">
        <Button
          type="submit"
          className="flex-1 bg-pink-600 hover:bg-pink-700"
          disabled={saving}
        >
          {saving ? (
            <>
              <Spinner className="size-4" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Heart className="size-4" />
              {hasProfile ? "Update Profile" : "Create Profile"}
            </>
          )}
        </Button>
        {hasProfile && (
          <Button type="button" variant="destructive" onClick={onDelete}>
            <Trash2 className="size-4" />
          </Button>
        )}
      </div>
    </form>
  );
}
