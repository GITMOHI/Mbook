const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  content: {
    texts: [String], // Array of text content
    videos: [String], // Array of video URLs
    images: [String], // Array of image URLs
  },
  isProfile: { type: Boolean, default: false }, // Default value added
  isCover: { type: Boolean, default: false }, // Default value corrected
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // User who created the post
  pageId: { type: mongoose.Schema.Types.ObjectId, ref: "Page", default: null }, // If post belongs to a page
  reactions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Reaction" }], // Reactions on the post
  createdAt: { type: Date, default: Date.now }, // Timestamp when created
});

module.exports = mongoose.model("Post", PostSchema);
