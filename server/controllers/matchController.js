const Match = require("../models/Match");
const Profile = require("../models/Profile");
const Message = require("../models/Message");
const User = require("../models/User");
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

    // ✅ NEW: Get blocked users list
    const currentUser = await User.findById(userId);
    const myBlockedUsers = currentUser.blockedUsers || [];
    
    // ✅ NEW: Get users who blocked me
    const usersWhoBlockedMe = await User.find({
      blockedUsers: userId
    }).select('_id');
    const blockedByUserIds = usersWhoBlockedMe.map(u => u._id.toString());

    // Find all users I've already interacted with
    const existingMatches = await Match.find({
      fromUser: userId
    }).select("toUser liked isMatch skippedAt");

    // Separate permanent skips from temporary skips
    const now = Date.now();
    const SKIP_TIMEOUT = 5 * 1000; // 5 seconds for testing
    // const SKIP_TIMEOUT = 7 * 24 * 60 * 60 * 1000; // 7 days in production

    const excludedUserIds = existingMatches
      .filter(m => {
        // If liked or matched, always exclude
        if (m.liked || m.isMatch) return true;
        
        // If skipped, check if timeout has passed
        if (m.skippedAt) {
          const timeSinceSkip = now - new Date(m.skippedAt).getTime();
          return timeSinceSkip < SKIP_TIMEOUT; // Only exclude if within timeout
        }
        
        return false;
      })
      .map(m => m.toUser.toString());

    // ✅ NEW: Add blocked users to exclusion list
    excludedUserIds.push(userId); // Exclude self
    excludedUserIds.push(...myBlockedUsers.map(id => id.toString()));
    excludedUserIds.push(...blockedByUserIds);

    // Build query for matching
    const query = {
      userId: { $nin: excludedUserIds }
    };

    // User must be interested in the target's gender
    query.gender = { $in: myProfile.interestedIn };

    // Target must be interested in user's gender
    query.interestedIn = { $in: [myProfile.gender] };

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

    // ✅ NEW: Check if either user has blocked the other
    const currentUser = await User.findById(fromUserId);
    const targetUser = await User.findById(toUserId);
    
    if (!targetUser) {
      throw createError("Target user not found", 404, "USER_NOT_FOUND");
    }

    const myBlockedUsers = currentUser.blockedUsers || [];
    const theirBlockedUsers = targetUser.blockedUsers || [];

    if (myBlockedUsers.includes(toUserId) || theirBlockedUsers.includes(fromUserId)) {
      throw createError("Cannot interact with this user", 403, "USER_BLOCKED");
    }

    // Check if target profile exists
    const targetProfile = await Profile.findOne({ userId: toUserId });
    if (!targetProfile) {
      throw createError("Target profile not found", 404, "PROFILE_NOT_FOUND");
    }

    // Check if already swiped
    const existingSwipe = await Match.findOne({
      fromUser: fromUserId,
      toUser: toUserId
    });

    if (existingSwipe) {
      // Allow re-swiping if timeout has passed
      if (!existingSwipe.liked && existingSwipe.skippedAt) {
        const SKIP_TIMEOUT = 5 * 1000; // 5 seconds for testing
        // const SKIP_TIMEOUT = 7 * 24 * 60 * 60 * 1000; // 7 days in production
        const timeSinceSkip = Date.now() - new Date(existingSwipe.skippedAt).getTime();
        
        if (timeSinceSkip < SKIP_TIMEOUT) {
          throw createError("You already swiped on this user", 409, "ALREADY_SWIPED");
        }
        
        // Timeout passed, delete old swipe and allow new one
        await Match.findByIdAndDelete(existingSwipe._id);
      } else {
        throw createError("You already swiped on this user", 409, "ALREADY_SWIPED");
      }
    }

    // Check if the other user has already liked me
    const reverseMatch = await Match.findOne({
      fromUser: toUserId,
      toUser: fromUserId,
      liked: true
    });

    const isMatch = liked && (reverseMatch !== null);

    // Create swipe record with skippedAt timestamp for rejections
    const matchData = {
      fromUser: fromUserId,
      toUser: toUserId,
      liked,
      isMatch
    };

    // If user is skipping (not liking), add timestamp for timeout
    if (!liked) {
      matchData.skippedAt = new Date();
    }

    const match = new Match(matchData);
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