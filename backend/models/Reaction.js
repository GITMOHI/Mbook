const mongoose = require("mongoose");

const ReactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // User who reacted
  postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true }, // Post the reaction belongs to
  type: { type: String, enum: ["like", "love", "haha", "wow", "sad", "angry"], required: true }, // Type of reaction
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Reaction", ReactionSchema);
