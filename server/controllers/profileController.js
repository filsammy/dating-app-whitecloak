const Profile = require("../models/Profile");
const createError = require("../utils/createError");

// CREATE OR UPDATE PROFILE
exports.createOrUpdateProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { name, age, bio, profilePic, location, gender, interestedIn, interests } = req.body;

    // Validations
    if (!name || name.trim().length === 0) {
      throw createError("Name is required", 400, "INVALID_NAME");
    }

    if (!age || age < 18 || age > 100) {
      throw createError("Age must be between 18 and 100", 400, "INVALID_AGE");
    }

    if (!gender || !["male", "female", "non-binary", "other"].includes(gender)) {
      throw createError("Invalid gender value", 400, "INVALID_GENDER");
    }

    if (!interestedIn || !Array.isArray(interestedIn) || interestedIn.length === 0) {
      throw createError("Please specify gender preferences", 400, "INVALID_INTERESTED_IN");
    }

    // Validate interestedIn values
    const validGenders = ["male", "female", "non-binary", "other"];
    const invalidInterests = interestedIn.filter(g => !validGenders.includes(g));
    if (invalidInterests.length > 0) {
      throw createError("Invalid gender preference values", 400, "INVALID_INTERESTED_IN");
    }

    // Validate location coordinates
    if (!location || !location.coordinates || location.coordinates.length !== 2) {
      throw createError("Valid location coordinates required [longitude, latitude]", 400, "INVALID_LOCATION");
    }

    const [longitude, latitude] = location.coordinates;
    if (longitude < -180 || longitude > 180 || latitude < -90 || latitude > 90) {
      throw createError("Invalid coordinates range", 400, "INVALID_COORDINATES");
    }

    // Check if profile exists
    let profile = await Profile.findOne({ userId });

    const profileData = {
      userId,
      name: name.trim(),
      age,
      bio: bio?.trim() || "",
      profilePic: profilePic || "",
      location: {
        type: "Point",
        coordinates: [longitude, latitude]
      },
      gender,
      interestedIn,
      interests: Array.isArray(interests) ? interests : []
    };

    if (profile) {
      // Update existing profile
      Object.assign(profile, profileData);
      await profile.save();
      
      res.status(200).json({
        message: "Profile updated successfully",
        profile
      });
    } else {
      // Create new profile
      profile = new Profile(profileData);
      await profile.save();
      
      res.status(201).json({
        message: "Profile created successfully",
        profile
      });
    }
  } catch (err) {
    next(err);
  }
};

// GET OWN PROFILE
exports.getMyProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    const profile = await Profile.findOne({ userId });

    if (!profile) {
      throw createError("Profile not found", 404, "PROFILE_NOT_FOUND");
    }

    res.status(200).json({ profile });
  } catch (err) {
    next(err);
  }
};

// GET PROFILE BY ID (for viewing other users)
exports.getProfileById = async (req, res, next) => {
  try {
    const { profileId } = req.params;

    const profile = await Profile.findById(profileId);

    if (!profile) {
      throw createError("Profile not found", 404, "PROFILE_NOT_FOUND");
    }

    res.status(200).json({ profile });
  } catch (err) {
    next(err);
  }
};

// DELETE PROFILE
exports.deleteProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const profile = await Profile.findOneAndDelete({ userId });

    if (!profile) {
      throw createError("Profile not found", 404, "PROFILE_NOT_FOUND");
    }

    res.status(200).json({
      message: "Profile deleted successfully"
    });
  } catch (err) {
    next(err);
  }
};