"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Plus,
  X,
  Heart,
  Coffee,
  Music,
  Camera,
  Book,
  Plane,
  Dumbbell,
  Palette,
  Code,
  Gamepad2,
} from "lucide-react";

interface InterestsSelectorProps {
  selectedInterests: string[];
  onInterestsChange: (interests: string[]) => void;
}

const INTEREST_CATEGORIES = [
  {
    category: "Hobbies",
    icon: Heart,
    interests: [
      "Reading",
      "Writing",
      "Photography",
      "Painting",
      "Drawing",
      "Crafts",
      "Gardening",
      "Cooking",
      "Baking",
    ],
  },
  {
    category: "Sports & Fitness",
    icon: Dumbbell,
    interests: [
      "Gym",
      "Running",
      "Yoga",
      "Swimming",
      "Cycling",
      "Hiking",
      "Basketball",
      "Football",
      "Tennis",
    ],
  },
  {
    category: "Entertainment",
    icon: Music,
    interests: [
      "Music",
      "Movies",
      "TV Shows",
      "Concerts",
      "Theater",
      "Dancing",
      "Singing",
      "Gaming",
      "Anime",
    ],
  },
  {
    category: "Food & Drink",
    icon: Coffee,
    interests: [
      "Coffee",
      "Wine",
      "Food Tasting",
      "Restaurants",
      "Street Food",
      "Brunch",
      "BBQ",
      "Desserts",
    ],
  },
  {
    category: "Travel & Outdoors",
    icon: Plane,
    interests: [
      "Travel",
      "Beach",
      "Mountains",
      "Camping",
      "Road Trips",
      "Adventure",
      "Nature",
      "Exploring",
    ],
  },
  {
    category: "Tech & Creative",
    icon: Code,
    interests: [
      "Technology",
      "Coding",
      "Design",
      "Photography",
      "Videography",
      "Podcasts",
      "Blogging",
    ],
  },
];

export default function InterestsSelector({
  selectedInterests,
  onInterestsChange,
}: InterestsSelectorProps) {
  const [open, setOpen] = useState(false);
  const [tempSelected, setTempSelected] = useState<string[]>(selectedInterests);

  const handleToggleInterest = (interest: string) => {
    setTempSelected((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  const handleRemoveInterest = (interest: string) => {
    const updated = selectedInterests.filter((i) => i !== interest);
    onInterestsChange(updated);
  };

  const handleSave = () => {
    onInterestsChange(tempSelected);
    setOpen(false);
  };

  const handleCancel = () => {
    setTempSelected(selectedInterests);
    setOpen(false);
  };

  return (
    <div>
      <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">
        Interests
      </label>

      {/* Selected Interests Display */}
      <div className="flex flex-wrap gap-2 mb-3 min-h-10 p-3 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
        {selectedInterests.length === 0 ? (
          <span className="text-sm text-gray-400 dark:text-gray-500 italic">
            No interests selected yet
          </span>
        ) : (
          selectedInterests.map((interest) => (
            <span
              key={interest}
              className="inline-flex items-center gap-1 bg-linear-to-r from-pink-100 to-rose-100 dark:from-pink-900/30 dark:to-rose-900/30 text-pink-700 dark:text-pink-400 px-3 py-1.5 rounded-full text-sm font-medium"
            >
              {interest}
              <button
                type="button"
                onClick={() => handleRemoveInterest(interest)}
                className="hover:bg-pink-200 dark:hover:bg-pink-800 rounded-full p-0.5 transition-colors"
              >
                <X className="size-3" />
              </button>
            </span>
          ))
        )}
      </div>

      {/* Add Interests Button */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className="w-full border-pink-200 dark:border-pink-800 hover:bg-pink-50 dark:hover:bg-pink-900/20"
          >
            <Plus className="size-4 mr-2 text-pink-600 dark:text-pink-400" />
            Add Interests
          </Button>
        </DialogTrigger>

        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Heart className="size-5 text-pink-600 dark:text-pink-400" />
              Choose Your Interests ({tempSelected.length})
            </DialogTitle>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Select all that apply to help us find your perfect match
            </p>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {INTEREST_CATEGORIES.map((category) => {
              const Icon = category.icon;
              return (
                <div key={category.category}>
                  <h3 className="font-semibold text-base text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
                    <Icon className="size-5 text-pink-600 dark:text-pink-400" />
                    {category.category}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {category.interests.map((interest) => {
                      const isSelected = tempSelected.includes(interest);
                      return (
                        <button
                          key={interest}
                          type="button"
                          onClick={() => handleToggleInterest(interest)}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition-all hover:scale-105 ${
                            isSelected
                              ? "bg-linear-to-r from-pink-600 to-rose-600 text-white shadow-md"
                              : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-pink-100 dark:hover:bg-pink-900/30"
                          }`}
                        >
                          {interest}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSave}
              className="flex-1 bg-linear-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 dark:from-pink-500 dark:to-rose-500"
            >
              Save Interests ({tempSelected.length})
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
