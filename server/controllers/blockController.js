const User = require("../models/User");
const createError = require("../utils/createError");

// Block a user
exports.blockUser = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { targetUserId } = req.body;

    if (userId === targetUserId) {
      throw createError("You cannot block yourself", 400, "INVALID_ACTION");
    }

    const user = await User.findById(userId);
    const target = await User.findById(targetUserId);

    if (!target) throw createError("User not found", 404, "USER_NOT_FOUND");

    if (user.blockedUsers.includes(targetUserId)) {
      throw createError("User already blocked", 400, "ALREADY_BLOCKED");
    }

    user.blockedUsers.push(targetUserId);
    await user.save();

    res.status(200).json({ message: "User blocked successfully" });
  } catch (err) {
    next(err);
  }
};

// Unblock a user
exports.unblockUser = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { targetUserId } = req.body;

    const user = await User.findById(userId);
    user.blockedUsers = user.blockedUsers.filter(
      (id) => id.toString() !== targetUserId
    );
    await user.save();

    res.status(200).json({ message: "User unblocked successfully" });
  } catch (err) {
    next(err);
  }
};

// Get all blocked users
exports.getBlockedUsers = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
      .populate("blockedUsers", "email");

    res.status(200).json({ blocked: user.blockedUsers });
  } catch (err) {
    next(err);
  }
};
