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
    receivers: [String], // The user who receives the notification
    senderId: String, // ID of the sender...from whom i get the notification
    
  });
  
module.exports = mongoose.model("Notification",notificationSchema );
