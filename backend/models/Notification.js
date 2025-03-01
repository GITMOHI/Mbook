const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  message: String,
  type: {
    type: String, // 'friendRequest', 'post', 'requestAccepted', etc.
    required: true,
  },
  targetId: String, // ID of the post, user, or friend request
  timestamp: { type: Date, default: Date.now },
  read: { type: Boolean, default: false },
  receivers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Reference to User schema
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Reference to User schema
});

module.exports = mongoose.model("Notification", notificationSchema);
