"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

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
  return (
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
                onFilterChange({ ...filters, maxDistance: e.target.value })
              }
              placeholder="50"
            />
          </div>
          <div>
            <label className="text-xs font-medium mb-1 block">Min Age</label>
            <Input
              type="number"
              value={filters.minAge}
              onChange={(e) =>
                onFilterChange({ ...filters, minAge: e.target.value })
              }
              placeholder="18"
            />
          </div>
          <div>
            <label className="text-xs font-medium mb-1 block">Max Age</label>
            <Input
              type="number"
              value={filters.maxAge}
              onChange={(e) =>
                onFilterChange({ ...filters, maxAge: e.target.value })
              }
              placeholder="50"
            />
          </div>
        </div>
        <Button
          onClick={onApply}
          className="w-full mt-3 bg-pink-600 hover:bg-pink-700"
          size="sm"
        >
          Apply Filters
        </Button>
      </CardContent>
    </Card>
  );
}
