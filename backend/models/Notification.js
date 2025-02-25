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
    userIds: [String], // The user who receives the notification
  });
  
  const Notification = mongoose.model('Notification', notificationSchema);