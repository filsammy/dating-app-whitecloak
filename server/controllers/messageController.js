const Message = require("../models/Message");
const Match = require("../models/Match");
const createError = require("../utils/createError");

// GET MESSAGES BY MATCH ID
exports.getMessagesByMatchId = async (req, res, next) => {
  try {
    const { matchId } = req.params;
    const userId = req.user.id;

    // Verify that the user is part of this match
    const match = await Match.findById(matchId);
    
    if (!match) {
      throw createError("Match not found", 404, "MATCH_NOT_FOUND");
    }

    // Check if user is authorized to view these messages
    if (match.fromUser.toString() !== userId && match.toUser.toString() !== userId) {
      throw createError("Unauthorized to view these messages", 403, "UNAUTHORIZED");
    }

    // Check if it's actually a match (both users liked each other)
    if (!match.isMatch) {
      throw createError("Can only message after matching", 403, "NOT_MATCHED");
    }

    const messages = await Message.find({ matchId })
      .sort({ createdAt: 1 })
      .populate("senderId", "email")
      .populate("receiverId", "email");

    res.json({
      messages,
      count: messages.length
    });
  } catch (err) {
    next(err);
  }
};

// GET ALL CONVERSATIONS (CHATS)
exports.getAllConversations = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Find all matches where user is involved
    const matches = await Match.find({
      $or: [
        { fromUser: userId, isMatch: true },
        { toUser: userId, isMatch: true }
      ]
    }).sort({ createdAt: -1 });

    // Get last message for each match
    const conversations = await Promise.all(
      matches.map(async (match) => {
        const lastMessage = await Message.findOne({ matchId: match._id })
          .sort({ createdAt: -1 })
          .populate("senderId", "email")
          .populate("receiverId", "email");

        const otherUserId = match.fromUser.toString() === userId 
          ? match.toUser 
          : match.fromUser;

        // Get unread count
        const unreadCount = await Message.countDocuments({
          matchId: match._id,
          receiverId: userId,
          // You can add a 'read' field to Message schema if you want read receipts
        });

        return {
          matchId: match._id,
          otherUserId,
          lastMessage,
          unreadCount,
          createdAt: match.createdAt
        };
      })
    );

    res.status(200).json({
      conversations,
      count: conversations.length
    });
  } catch (err) {
    next(err);
  }
};

// SEND MESSAGE (HTTP endpoint - backup to socket)
exports.sendMessage = async (req, res, next) => {
  try {
    const { matchId, receiverId, content } = req.body;
    const senderId = req.user.id;

    if (!matchId || !receiverId || !content) {
      throw createError("Match ID, receiver ID, and content are required", 400, "MISSING_FIELDS");
    }

    if (!content.trim()) {
      throw createError("Message content cannot be empty", 400, "EMPTY_MESSAGE");
    }

    // Verify match exists and users are matched
    const match = await Match.findById(matchId);
    
    if (!match) {
      throw createError("Match not found", 404, "MATCH_NOT_FOUND");
    }

    if (!match.isMatch) {
      throw createError("Can only message after matching", 403, "NOT_MATCHED");
    }

    // Verify sender is part of the match
    if (match.fromUser.toString() !== senderId && match.toUser.toString() !== senderId) {
      throw createError("Unauthorized to send messages in this match", 403, "UNAUTHORIZED");
    }

    // Verify receiver is part of the match
    if (match.fromUser.toString() !== receiverId && match.toUser.toString() !== receiverId) {
      throw createError("Invalid receiver for this match", 400, "INVALID_RECEIVER");
    }

    const message = new Message({
      matchId,
      senderId,
      receiverId,
      content: content.trim()
    });

    await message.save();

    // Populate sender and receiver info
    await message.populate("senderId", "email");
    await message.populate("receiverId", "email");

    res.status(201).json({
      message: "Message sent successfully",
      data: message
    });
  } catch (err) {
    next(err);
  }
};

// DELETE MESSAGE
exports.deleteMessage = async (req, res, next) => {
  try {
    const { messageId } = req.params;
    const userId = req.user.id;

    const message = await Message.findById(messageId);

    if (!message) {
      throw createError("Message not found", 404, "MESSAGE_NOT_FOUND");
    }

    // Only sender can delete their message
    if (message.senderId.toString() !== userId) {
      throw createError("Unauthorized to delete this message", 403, "UNAUTHORIZED");
    }

    await Message.findByIdAndDelete(messageId);

    res.status(200).json({
      message: "Message deleted successfully"
    });
  } catch (err) {
    next(err);
  }
};