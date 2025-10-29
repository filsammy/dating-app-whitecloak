// // models/User.js
// const mongoose = require("mongoose");

// const userSchema = new mongoose.Schema({
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   blockedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // 👈 new field
// }, { timestamps: true });

// module.exports = mongoose.model("User", userSchema);
