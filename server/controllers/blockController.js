const User = require("../models/User");
const Match = require("../models/Match");
const createError = require("../utils/createError");

// Block a user
exports.blockUser = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { targetUserId } = req.body;

    if (!targetUserId) {
      throw createError("Target user ID is required", 400, "MISSING_FIELDS");
    }

    if (userId === targetUserId) {
      throw createError("You cannot block yourself", 400, "INVALID_ACTION");
    }

    const user = await User.findById(userId);
    const target = await User.findById(targetUserId);

    if (!target) throw createError("User not found", 404, "USER_NOT_FOUND");

    // Check if already blocked
    if (user.blockedUsers && user.blockedUsers.includes(targetUserId)) {
      throw createError("User already blocked", 400, "ALREADY_BLOCKED");
    }

    // Add to blocked users
    if (!user.blockedUsers) {
      user.blockedUsers = [];
    }
    user.blockedUsers.push(targetUserId);
    await user.save();

    // Delete any existing matches between the users
    await Match.deleteMany({
      $or: [
        { fromUser: userId, toUser: targetUserId },
        { fromUser: targetUserId, toUser: userId }
      ]
    });

    res.status(200).json({ 
      message: "User blocked successfully",
      blockedUserId: targetUserId
    });
  } catch (err) {
    next(err);
  }
};

// Unblock a user
exports.unblockUser = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { targetUserId } = req.body;

    if (!targetUserId) {
      throw createError("Target user ID is required", 400, "MISSING_FIELDS");
    }

    const user = await User.findById(userId);
    
    if (!user.blockedUsers || !user.blockedUsers.includes(targetUserId)) {
      throw createError("User is not blocked", 400, "NOT_BLOCKED");
    }

    user.blockedUsers = user.blockedUsers.filter(
      (id) => id.toString() !== targetUserId
    );
    await user.save();

    res.status(200).json({ 
      message: "User unblocked successfully",
      unblockedUserId: targetUserId
    });
  } catch (err) {
    next(err);
  }
};

// Get all blocked users
exports.getBlockedUsers = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
      .populate("blockedUsers", "email");

    res.status(200).json({ 
      blocked: user.blockedUsers || [],
      count: user.blockedUsers ? user.blockedUsers.length : 0
    });
  } catch (err) {
    next(err);
  }
};