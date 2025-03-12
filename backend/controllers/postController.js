const Post = require("../models/Post");
const Reaction = require("../models/Reaction");
const Comment = require("../models/Comment");
const Notification = require("../models/Notification");
const User = require("../models/User");
const { default: mongoose } = require("mongoose");

// exports.getComments = async (req, res) => {
//   const { postId } = req.params;

//   if (!postId) {
//     return res.status(400).json({ message: "Post ID is required" });
//   }

//   try {
//     // Fetch top-level comments
//     const comments = await Comment.find({ postId });

//     // Recursively populate replies for each comment
//     const populatedComments = await Promise.all(
//       comments.map((comment) => populateReplies(comment))
//     );

//     res.status(200).json(populatedComments);
//   } catch (error) {
//     console.error("Error fetching comments:", error);
//     res.status(500).json({ error: "Failed to fetch comments" });
//   }
// };
const populateReplies = async (comment) => {
  // Populate the commenter field for the current comment
  await comment.populate("commenter", "name profilePicture");

  // If there are replies, recursively populate them
  if (comment.replies && comment.replies.length > 0) {
    await comment.populate({
      path: "replies",
      populate: { path: "commenter", select: "name profilePicture" },
    });

    // Recursively populate nested replies
    for (const reply of comment.replies) {
      await populateReplies(reply);
    }
  }

  return comment;
};
exports.updateReaction = async (req, res) => {
  const { postId } = req.params;
  const { userId, type } = req.body;

  console.log(userId, type);
  const react = await Reaction.findOne({ postId });
  console.log("the react = ", react);

  try {
    // Check if the user has already reacted to this post
    const existingReaction = await Reaction.findOne({ userId, postId });

    if (existingReaction) {
      // If the user is reacting with the same type, remove the reaction
      if (existingReaction.type === type) {
        await Reaction.deleteOne({ _id: existingReaction._id });

        // Remove the reaction ID from the Post's reactions array
        await Post.findByIdAndUpdate(postId, {
          $pull: { reactions: existingReaction._id },
        });

        return res
          .status(200)
          .json({ success: true, message: "Reaction removed" });
      } else {
        // Update the reaction type in the Reaction collection
        existingReaction.type = type;
        await existingReaction.save();

        return res
          .status(200)
          .json({ success: true, message: "Reaction updated" });
      }
    } else {
      // Create a new reaction
      const newReaction = new Reaction({ userId, postId, type });
      await newReaction.save();

      // Add the new reaction ID to the Post's reactions array
      await Post.findByIdAndUpdate(postId, {
        $push: { reactions: newReaction._id },
      });

      return res.status(201).json({ success: true, message: "Reaction added" });
    }
  } catch (error) {
    console.error("Error handling reaction:", error);
    res.status(500).json({ error: "Failed to process reaction" });
  }
};

exports.getComments = async (req, res) => {
  const { postId } = req.params;

  if (!postId) {
    return res.status(400).json({ message: "Post ID is required" });
  }

  try {
    // Fetch top-level comments and sort them by createdAt in descending order
    const comments = await Comment.find({ postId })
      .sort({ createdAt: -1 }) // Sort top-level comments by createdAt
      .populate("commenter", "name profilePicture");

    // Recursively populate replies for each comment
    const populatedComments = await Promise.all(
      comments.map(async (comment) => {
        // Sort replies by createdAt in descending order
        const sortedReplies = await Comment.find({
          _id: { $in: comment.replies },
        })
          .sort({ createdAt: -1 }) // Sort replies by createdAt
          .populate("commenter", "name profilePicture");

        // Recursively populate nested replies
        const fullyPopulatedReplies = await Promise.all(
          sortedReplies.map((reply) => populateReplies(reply))
        );

        // Return the comment with sorted and populated replies
        return {
          ...comment.toObject(),
          replies: fullyPopulatedReplies,
        };
      })
    );

    res.status(200).json(populatedComments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ error: "Failed to fetch comments" });
  }
};

exports.addComment = (io) => async (req, res) => {
  const { postId, text } = req.body;
  const commenter = req.user.userId;


  if (!postId || !text) {
    return res
      .status(400)
      .json({ message: "Post ID and comment text are required" });
  }

  try {
    const newComment = new Comment({ postId, text, commenter });
    await newComment.save();
    const populatedComment = await Comment.findById(newComment._id).populate(
      "commenter",
      "name profilePicture"
    );

    //send notification of the comment..to the author of the post..
    // Fetch the post to get the author's ID
    const post = await Post.findById(postId).populate("authorId", "_id");

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const postAuthorId = post.authorId._id;

    if(postAuthorId!=commenter){
          // Create a notification for the post author
    const notification = new Notification({
      message: `${populatedComment.commenter.name} commented on your post`,
      type: "comment",
      targetId: postId, // ID of the post being commented on
      senderId: commenter, // ID of the user who commented
      receivers: [postAuthorId], // ID of the post author
    });

    // Save the notification
    await notification.save();
    await User.findByIdAndUpdate(postAuthorId, {
      $push: { notifications: notification._id },
    });

    io.emit(`Comment-${postAuthorId}`, notification);


    }

    res.status(201).json(populatedComment);
    
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ error: "Failed to add comment" });
  }
};

exports.addReply = (io) => async (req, res) => {
  const { parentId, text, parentType, postId } = req.body;
  const commenter = req.user.userId;

  if (!parentId || !text) {
    return res
      .status(400)
      .json({ message: "Parent ID and reply text are required" });
  }

  try {
    const newReply = new Comment({
      commenter,
      text,
      postId: parentType === "comment" ? parentId : undefined,
    });

    const savedReply = await newReply.save();

    if (parentType === "comment") {
      const parentComment = await Comment.findById(parentId);
      if (!parentComment) {
        return res.status(404).json({ message: "Parent comment not found" });
      }
      parentComment.replies.push(savedReply._id);
      await parentComment.save();
    } else if (parentType === "reply") {
      const parentReply = await Comment.findById(parentId);
      if (!parentReply) {
        return res.status(404).json({ message: "Parent reply not found" });
      }
      parentReply.replies.push(savedReply._id);
      await parentReply.save();
    }

    // Get the replier's name
    const replier = await User.findById(commenter).select("name");
    const replierName = replier.name; // Correctly access the name field
    console.log("The replier's name =", replierName);

    // Get the replied-to person's name
    const repliedToComment = await Comment.findById(parentId).populate(
      "commenter",
      "name"
    );

    if (!repliedToComment) {
      throw new Error("Parent comment not found");
    }

    const repliedToName = repliedToComment.commenter.name; // Access the name field of the commenter
    console.log("The replied-to person's name =", repliedToName);
    // Create a notification for the person , who will receive the reply..
    
    if(replierName !== repliedToName){
      const notification = new Notification({
        message: `${replierName} replied to your comment`,
        type: "reply",
        targetId: postId,
        senderId: commenter,
        receivers: [repliedToComment.commenter._id],
      });
  
      console.log("the notification = ", notification);
      // Save the notification
      await notification.save();
      await User.findByIdAndUpdate(repliedToComment.commenter._id, {
        $push: { notifications: notification._id },
      });
  
      io.emit(`reply-${repliedToComment.commenter._id}`, notification);
    }

    res.status(201).json(savedReply);
  } catch (error) {
    console.error("Error adding reply:", error);
    res.status(500).json({ error: "Failed to add reply" });
  }
};


exports.deletePost = async (req, res) => {
  try {
    const { postId } = req.body;
    const userId = req.user.userId;
   
    if (!postId) {
      return res.status(400).json({ message: "Post ID is required." });
    }

    // Find the post
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    if (!post.authorId.equals(userId)) {
      console.log(post.authorId, " ", userId);
      return res.status(403).json({postId});
    }
    

    await Post.findByIdAndDelete(postId);

    await User.findByIdAndUpdate(userId, {
      $pull: { profilePosts: postId }
    });

 
    await User.updateMany(
      { friends: userId },
      { $pull: { newsFeed: postId } }
    );

    console.log('updated')

    res.status(200).json({postId});
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

exports.sharePostFeed = async (req, res) => {
  try {
    const { postId } = req.body; // ID of the post to share
    const userId = req.user.userId; // ID of the user sharing
    console.log("Post ID:", postId, "--- User ID:", userId);

    // Validate postId format
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ message: "Invalid post ID" });
    }

    // Find the original post
    const originalPost = await Post.findById(postId);
    if (!originalPost) return res.status(404).json({ message: "Post not found" });

    console.log("Original Post Found:", originalPost);

    // Create the shared post
    const sharedPost = new Post({
      textOnshare:"demo text..",
      authorId: userId,
      sharedFrom: postId, // Reference to the original post
      content: originalPost.content, // Keeping original content
    });

    await sharedPost.save();
    console.log("Shared Post Saved:", sharedPost);

    // Populate shared post details
    let populatedSharedPost = await Post.findById(sharedPost._id)
      .populate("authorId", "name profilePicture") // Who shared

    // Only populate sharedFrom if it's not null
    if (populatedSharedPost.sharedFrom) {
      populatedSharedPost = await populatedSharedPost.populate({
        path: "sharedFrom",
        populate: { path: "authorId", select: "name profilePicture" }, // Original author
      });
    }

    console.log("Populated Shared Post:", populatedSharedPost);

    // Add to user’s feed and profile
    await User.findByIdAndUpdate(userId, { 
      $push: { newsFeed: populatedSharedPost._id, profilePosts: populatedSharedPost._id } 
    });

    res.status(201).json({ sharedPost: populatedSharedPost });

  } catch (error) {
    console.error("Error in sharePostFeed:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
