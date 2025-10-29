"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MapPin, Navigation } from "lucide-react";

interface LocationSelectorProps {
  latitude: string;
  longitude: string;
  onLocationChange: (lat: string, lng: string) => void;
}

// Popular locations in Metro Manila
const POPULAR_LOCATIONS = [
  { name: "Makati - Ayala Ave", lat: "14.5547", lng: "121.0244" },
  { name: "BGC - Taguig", lat: "14.5507", lng: "121.0494" },
  { name: "Ortigas - Pasig", lat: "14.5866", lng: "121.0582" },
  { name: "Manila - Intramuros", lat: "14.5906", lng: "120.9736" },
  { name: "Quezon City - Diliman", lat: "14.6537", lng: "121.0682" },
  { name: "Mandaluyong - Shaw", lat: "14.5794", lng: "121.0359" },
  { name: "Pasay - Mall of Asia", lat: "14.5352", lng: "120.9818" },
  { name: "Paranaque - Alabang", lat: "14.4244", lng: "121.0424" },
];

export default function LocationSelector({
  latitude,
  longitude,
  onLocationChange,
}: LocationSelectorProps) {
  const [open, setOpen] = useState(false);
  const [customLat, setCustomLat] = useState(latitude);
  const [customLng, setCustomLng] = useState(longitude);

  const handleSelectLocation = (lat: string, lng: string) => {
    onLocationChange(lat, lng);
    setCustomLat(lat);
    setCustomLng(lng);
    setOpen(false);
  };

  const handleCustomLocation = () => {
    if (customLat && customLng) {
      onLocationChange(customLat, customLng);
      setOpen(false);
    }
  };

  const handleUseCurrentLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude.toFixed(4);
          const lng = position.coords.longitude.toFixed(4);
          handleSelectLocation(lat, lng);
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Could not get your location. Please select manually.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser");
    }
  };

  const selectedLocation = POPULAR_LOCATIONS.find(
    (loc) => loc.lat === latitude && loc.lng === longitude
  );

  return (
    <div>
      <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block flex items-center gap-2">
        <MapPin className="size-4 text-pink-600 dark:text-pink-400" />
        Location
      </label>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className="w-full justify-start text-left font-normal border-pink-200 dark:border-pink-800 hover:bg-pink-50 dark:hover:bg-pink-900/20"
          >
            <MapPin className="size-4 mr-2 text-pink-600 dark:text-pink-400" />
            {selectedLocation
              ? selectedLocation.name
              : latitude && longitude
              ? `Custom: ${latitude}, ${longitude}`
              : "Select your location"}
          </Button>
        </DialogTrigger>

        <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MapPin className="size-5 text-pink-600 dark:text-pink-400" />
              Select Your Location
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Use Current Location */}
            <Button
              type="button"
              onClick={handleUseCurrentLocation}
              className="w-full bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 dark:from-pink-500 dark:to-rose-500"
            >
              <Navigation className="size-4 mr-2" />
              Use My Current Location
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-200 dark:border-gray-700" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white dark:bg-gray-900 px-2 text-gray-500">
                  Or choose from popular areas
                </span>
              </div>
            </div>

            {/* Popular Locations */}
            <div className="space-y-2">
              {POPULAR_LOCATIONS.map((location) => (
                <button
                  key={location.name}
                  type="button"
                  onClick={() =>
                    handleSelectLocation(location.lat, location.lng)
                  }
                  className={`w-full p-3 text-left rounded-lg border-2 transition-all hover:scale-[1.02] ${
                    selectedLocation?.name === location.name
                      ? "border-pink-500 bg-pink-50 dark:bg-pink-900/20"
                      : "border-gray-200 dark:border-gray-700 hover:border-pink-300 dark:hover:border-pink-700"
                  }`}
                >
                  <div className="font-medium text-sm text-gray-800 dark:text-gray-200">
                    {location.name}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {location.lat}, {location.lng}
                  </div>
                </button>
              ))}
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-200 dark:border-gray-700" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white dark:bg-gray-900 px-2 text-gray-500">
                  Or enter custom coordinates
                </span>
              </div>
            </div>

            {/* Custom Coordinates */}
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-600 dark:text-gray-400">
                    Latitude
                  </label>
                  <Input
                    type="number"
                    step="any"
                    placeholder="14.5547"
                    value={customLat}
                    onChange={(e) => setCustomLat(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 dark:text-gray-400">
                    Longitude
                  </label>
                  <Input
                    type="number"
                    step="any"
                    placeholder="121.0244"
                    value={customLng}
                    onChange={(e) => setCustomLng(e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
              <Button
                type="button"
                onClick={handleCustomLocation}
                variant="outline"
                className="w-full"
                disabled={!customLat || !customLng}
              >
                Set Custom Location
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Hidden inputs for form submission */}
      <input type="hidden" value={latitude} />
      <input type="hidden" value={longitude} />
    </div>
  );
}
