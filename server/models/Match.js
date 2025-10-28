const mongoose = require("mongoose");

const matchSchema = new mongoose.Schema({
  fromUser: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  toUser: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  isMatch: { type: Boolean, default: false },
  liked: { type: Boolean, required: true },
  skippedAt: { type: Date }, // ✅ NEW: Timestamp when user was skipped (for timeout)
  createdAt: { type: Date, default: Date.now }
});

// ✅ NEW: Index for efficient timeout queries
matchSchema.index({ fromUser: 1, toUser: 1 });
matchSchema.index({ skippedAt: 1 });

module.exports = mongoose.model("Match", matchSchema);