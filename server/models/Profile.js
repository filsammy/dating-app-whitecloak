const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  age: { type: Number, required: true },
  bio: { type: String },
  profilePic: { type: String },

  // Location (for distance filtering)
  location: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point"
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    }
  },

  // Preferences & identity
  gender: { 
    type: String, 
    enum: ["male", "female", "non-binary", "other"], 
    required: true 
  },
  interestedIn: { 
    type: [String], 
    enum: ["male", "female", "non-binary", "other"], 
    required: true 
  },
  interests: { 
    type: [String], 
    default: [] // e.g., ["hiking", "movies", "music"]
  },

  createdAt: { type: Date, default: Date.now }
});

// Geospatial index for efficient nearby searches
profileSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Profile", profileSchema)
