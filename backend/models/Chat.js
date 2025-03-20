const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

const chatSchema = new mongoose.Schema({
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
  messages: [messageSchema], // Messages are stored inside the Chat document
  isGroupChat: { type: Boolean, default: false },
  groupName: { type: String },
  admin: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

// Indexes for faster queries
chatSchema.index({ participants: 1 });
chatSchema.index({ 'messages.timestamp': 1 });

module.exports = mongoose.model('Chat', chatSchema);
