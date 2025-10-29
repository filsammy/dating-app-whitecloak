const mongoose = require("mongoose");

const matchSchema = new mongoose.Schema({
  fromUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  toUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  liked: {
    type: Boolean,
    required: true
  },
  isMatch: {
    type: Boolean,
    default: false
  },
  skippedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Index for efficient queries
matchSchema.index({ fromUser: 1, toUser: 1 });
matchSchema.index({ fromUser: 1, isMatch: 1 });
matchSchema.index({ toUser: 1, isMatch: 1 });

module.exports = mongoose.model("Match", matchSchema);