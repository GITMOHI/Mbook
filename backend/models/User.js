const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePicture: { type: String, default: "" },
  coverImage: { type: String, default: "" },
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  friendRequestsSent: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Sent requests
  friendRequestsReceived: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Incoming requests
  role: { type: String, default: "user" },
  isBanned: { type: Boolean, default: false }, // Soft delete field
  createdAt: { type: Date, default: Date.now },
  refreshToken: { type: String, default: "" }  
});

module.exports = mongoose.model("User", UserSchema);
