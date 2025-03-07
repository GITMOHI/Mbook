const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
  commenter: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  text: String,
  replies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Comment', commentSchema);