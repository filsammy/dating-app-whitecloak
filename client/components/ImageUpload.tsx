"use client";
import { useState, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Camera, X } from "lucide-react";

interface ImageUploadProps {
  currentImage: string;
  userName: string;
  onImageSelect: (imageUrl: string) => void;
}

export default function ImageUpload({
  currentImage,
  userName,
  onImageSelect,
}: ImageUploadProps) {
  const [preview, setPreview] = useState(currentImage);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size should be less than 5MB");
      return;
    }

    setUploading(true);

    try {
      // Show temporary local preview
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);

      // Upload to Cloudinary via API route
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok && data.url) {
        setPreview(data.url);
        onImageSelect(data.url); // Return Cloudinary URL
      } else {
        alert(data.error || "Failed to upload image");
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };
  const handleRemoveImage = () => {
    setPreview("");
    onImageSelect("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Avatar with overlay */}
      <div className="relative group">
        <Avatar className="size-32 border-4 border-pink-100 dark:border-pink-900/30 shadow-lg">
          <AvatarImage src={preview} className="object-cover" />
          <AvatarFallback className="bg-linear-to-br from-pink-100 to-rose-100 dark:from-pink-900/30 dark:to-rose-900/30 text-pink-600 dark:text-pink-400 text-4xl font-bold">
            {userName?.charAt(0)?.toUpperCase() || "?"}
          </AvatarFallback>
        </Avatar>

        {/* Overlay on hover
        <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Camera className="size-8 text-white" />
        </div> */}

        {/* Remove button */}
        {preview && (
          <button
            type="button"
            onClick={handleRemoveImage}
            className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 shadow-lg transition-all hover:scale-110"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      {/* Upload button */}
      <div className="flex gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          disabled={uploading}
        />
        <Button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          variant="outline"
          className="border-pink-200 dark:border-pink-800 hover:bg-pink-600 dark:hover:bg-pink-900/20"
        >
          <Camera className="size-4 mr-2" />
          {uploading
            ? "Uploading..."
            : preview
            ? "Change Photo"
            : "Upload Photo"}
        </Button>
      </div>

      <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
        Max 5MB • JPG, PNG, or GIF
      </p>
    </div>
  );
}
