// const mongoose = require("mongoose");

// const PostSchema = new mongoose.Schema({
//   content: { type: String, required: true }, // Text content of the post
//   authorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // User who created the post
//   pageId: { type: mongoose.Schema.Types.ObjectId, ref: "Page", default: null }, // If post belongs to a page
//   reactions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Reaction" }], // Reactions on the post
//   createdAt: { type: Date, default: Date.now } // Timestamp when created
// });

// module.exports = mongoose.model("Post", PostSchema);




const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  content: {
    texts:  { type: String }, // Array of text content
    videos: [{ type: String }], // Array of video URLs
    images: [{ type: String }] // Array of image URLs
  },
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // User who created the post
  pageId: { type: mongoose.Schema.Types.ObjectId, ref: "Page", default: null }, // If post belongs to a page
  reactions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Reaction" }], // Reactions on the post
  createdAt: { type: Date, default: Date.now } // Timestamp when created
});

module.exports = mongoose.model("Post", PostSchema);
