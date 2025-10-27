const Match = require("../models/Match");
const Profile = require("../models/Profile");
const Message = require("../models/Message");
const createError = require("../utils/createError");

// GET POTENTIAL MATCHES (DISCOVERY)
exports.getPotentialMatches = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { maxDistance = 50, minAge, maxAge, limit = 20 } = req.query;

    // Get current user's profile
    const myProfile = await Profile.findOne({ userId });
    
    if (!myProfile) {
      throw createError("Please create your profile first", 404, "PROFILE_NOT_FOUND");
    }

    // Find all users I've already interacted with (liked or skipped)
    const existingMatches = await Match.find({
      fromUser: userId
    }).select("toUser");

    const excludedUserIds = existingMatches.map(m => m.toUser);
    excludedUserIds.push(userId); // Exclude self

    // Build query for potential matches
    const query = {
      userId: { $nin: excludedUserIds },
      gender: { $in: myProfile.interestedIn }
    };

    // Age filter
    if (minAge || maxAge) {
      query.age = {};
      if (minAge) query.age.$gte = parseInt(minAge);
      if (maxAge) query.age.$lte = parseInt(maxAge);
    }

    // Location filter (within maxDistance km)
    if (myProfile.location && myProfile.location.coordinates) {
      query.location = {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: myProfile.location.coordinates
          },
          $maxDistance: parseInt(maxDistance) * 1000 // Convert km to meters
        }
      };
    }

    // Also check if they're interested in my gender
    query.interestedIn = { $in: [myProfile.gender] };

    const potentialMatches = await Profile.find(query).limit(parseInt(limit));

    res.status(200).json({
      matches: potentialMatches,
      count: potentialMatches.length
    });
  } catch (err) {
    next(err);
  }
};

// SWIPE (LIKE OR SKIP)
exports.swipe = async (req, res, next) => {
  try {
    const fromUserId = req.user.id;
    const { toUserId, liked } = req.body;

    if (!toUserId) {
      throw createError("Target user ID is required", 400, "MISSING_USER_ID");
    }

    if (typeof liked !== "boolean") {
      throw createError("Liked status must be true or false", 400, "INVALID_LIKED_STATUS");
    }

    if (fromUserId === toUserId) {
      throw createError("Cannot swipe on yourself", 400, "SELF_SWIPE");
    }

    // Check if target user exists
    const targetProfile = await Profile.findOne({ userId: toUserId });
    if (!targetProfile) {
      throw createError("Target user not found", 404, "USER_NOT_FOUND");
    }

    // Check if already swiped
    const existingSwipe = await Match.findOne({
      fromUser: fromUserId,
      toUser: toUserId
    });

    if (existingSwipe) {
      throw createError("You already swiped on this user", 409, "ALREADY_SWIPED");
    }

    // Check if the other user has already liked me
    const reverseMatch = await Match.findOne({
      fromUser: toUserId,
      toUser: fromUserId,
      liked: true
    });

    const isMatch = liked && reverseMatch;

    // Create the swipe record
    const match = new Match({
      fromUser: fromUserId,
      toUser: toUserId,
      liked,
      isMatch
    });

    await match.save();

    // If it's a match, update the reverse match as well
    if (isMatch && reverseMatch) {
      reverseMatch.isMatch = true;
      await reverseMatch.save();
    }

    res.status(201).json({
      message: liked ? (isMatch ? "It's a match!" : "Liked") : "Skipped",
      isMatch,
      match
    });
  } catch (err) {
    next(err);
  }
};

// GET ALL MATCHES
exports.getMyMatches = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Find all mutual matches
    const matches = await Match.find({
      $or: [
        { fromUser: userId, isMatch: true },
        { toUser: userId, isMatch: true }
      ]
    })
      .populate({
        path: "fromUser",
        select: "email"
      })
      .populate({
        path: "toUser",
        select: "email"
      })
      .sort({ createdAt: -1 });

    // Get profile details for each match
    const matchesWithProfiles = await Promise.all(
      matches.map(async (match) => {
        const matchedUserId = match.fromUser._id.toString() === userId 
          ? match.toUser._id 
          : match.fromUser._id;

        const profile = await Profile.findOne({ userId: matchedUserId });

        return {
          matchId: match._id,
          userId: matchedUserId,
          profile,
          matchedAt: match.createdAt
        };
      })
    );

    res.status(200).json({
      matches: matchesWithProfiles,
      count: matchesWithProfiles.length
    });
  } catch (err) {
    next(err);
  }
};

// UNMATCH
exports.unmatch = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { matchedUserId } = req.params;

    if (!matchedUserId) {
      throw createError("Matched user ID is required", 400, "MISSING_USER_ID");
    }

    // Find and delete both match records
    const result1 = await Match.findOneAndDelete({
      fromUser: userId,
      toUser: matchedUserId,
      isMatch: true
    });

    const result2 = await Match.findOneAndDelete({
      fromUser: matchedUserId,
      toUser: userId,
      isMatch: true
    });

    if (!result1 && !result2) {
      throw createError("Match not found", 404, "MATCH_NOT_FOUND");
    }

    // Get the match ID to delete associated messages
    const matchId = result1?._id || result2?._id;

    // Optional: Delete all messages in this match
    await Message.deleteMany({ matchId });

    res.status(200).json({
      message: "Unmatched successfully"
    });
  } catch (err) {
    next(err);
  }
};

// CHECK IF MATCHED WITH SPECIFIC USER
exports.checkMatch = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { otherUserId } = req.params;

    const match = await Match.findOne({
      $or: [
        { fromUser: userId, toUser: otherUserId, isMatch: true },
        { fromUser: otherUserId, toUser: userId, isMatch: true }
      ]
    });

    res.status(200).json({
      isMatched: !!match,
      match
    });
  } catch (err) {
    next(err);
  }
};