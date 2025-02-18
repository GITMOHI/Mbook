const mongoose = require("mongoose");

const PageSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true }, // Page title
  description: { type: String, default: "" }, // Page description
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Admin of the page
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Users who follow the page
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }], // Posts created on the page
  createdAt: { type: Date, default: Date.now } // Timestamp when created
});

module.exports = mongoose.model("Page", PageSchema);
