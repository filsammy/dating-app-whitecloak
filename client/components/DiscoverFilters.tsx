"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Infinity } from "lucide-react";

interface DiscoverFiltersProps {
  filters: {
    maxDistance: string;
    minAge: string;
    maxAge: string;
  };
  onFilterChange: (filters: {
    maxDistance: string;
    minAge: string;
    maxAge: string;
  }) => void;
  onApply: () => void;
}

export default function DiscoverFilters({
  filters,
  onFilterChange,
  onApply,
}: DiscoverFiltersProps) {
  const distanceOptions = [10, 20, 30, 40, 50];
  const isNoLimit = filters.maxDistance === "999999";

  const handleDistanceChange = (distance: number | "unlimited") => {
    const value = distance === "unlimited" ? "999999" : distance.toString();
    onFilterChange({ ...filters, maxDistance: value });
  };

  return (
    <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-pink-100 dark:border-pink-900/30">
      <CardContent className="pt-6 space-y-6">
        {/* Distance Slider */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Max Distance
            </label>
            <span className="text-sm font-medium text-pink-600 dark:text-pink-400">
              {isNoLimit ? "No Limit" : `${filters.maxDistance} km`}
            </span>
          </div>

          {/* Distance Pills */}
          <div className="flex gap-2 flex-wrap mb-3">
            {distanceOptions.map((distance) => (
              <button
                key={distance}
                onClick={() => handleDistanceChange(distance)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  filters.maxDistance === distance.toString() && !isNoLimit
                    ? "bg-pink-600 text-white shadow-md scale-105"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-pink-100 dark:hover:bg-pink-900/30 hover:scale-105"
                }`}
              >
                {distance}km
              </button>
            ))}
            <button
              onClick={() => handleDistanceChange("unlimited")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1 ${
                isNoLimit
                  ? "bg-pink-600 text-white shadow-md scale-105"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-pink-100 dark:hover:bg-pink-900/30 hover:scale-105"
              }`}
            >
              <Infinity className="size-4" />
              No Limit
            </button>
          </div>

          {/* Range Slider (visual) */}
          <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="absolute h-full bg-linear-to-r from-pink-500 to-pink-600 rounded-full transition-all duration-300"
              style={{
                width: isNoLimit
                  ? "100%"
                  : `${(parseInt(filters.maxDistance) / 50) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Age Range */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">
              Min Age
            </label>
            <Input
              type="number"
              value={filters.minAge}
              onChange={(e) =>
                onFilterChange({ ...filters, minAge: e.target.value })
              }
              placeholder="18"
              min="18"
              max="100"
              className="text-center"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">
              Max Age
            </label>
            <Input
              type="number"
              value={filters.maxAge}
              onChange={(e) =>
                onFilterChange({ ...filters, maxAge: e.target.value })
              }
              placeholder="--"
              min="18"
              max="100"
              className="text-center"
            />
          </div>
        </div>

        {/* Apply Button */}
        <Button
          onClick={onApply}
          className="w-full bg-pink-600 hover:bg-pink-700 dark:bg-pink-500 dark:hover:bg-pink-600 text-white py-6 rounded-full shadow-lg hover:shadow-xl transition-all"
        >
          Apply Filters
        </Button>
      </CardContent>
    </Card>
  );
}
