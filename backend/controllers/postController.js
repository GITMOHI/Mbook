const Post = require("../models/Post");
const Reaction = require("../models/Reaction"); // Import your Reaction model



exports.updateReaction = async (req, res) => {
    const { postId } = req.params;
    const { userId, type } = req.body;
  
    console.log(userId, type);
    const react = await Reaction.findOne({postId});
    console.log("the react = ",react);
  
    try {
      // Check if the user has already reacted to this post
      const existingReaction = await Reaction.findOne({ userId, postId });
  
      if (existingReaction) {
        // If the user is reacting with the same type, remove the reaction
        if (existingReaction.type === type) {
          await Reaction.deleteOne({ _id: existingReaction._id });
  
          // Remove the reaction ID from the Post's reactions array
          await Post.findByIdAndUpdate(postId, {
            $pull: { reactions: existingReaction._id }
          });
  
          return res.status(200).json({ success: true, message: "Reaction removed" });
        } else {
          // Update the reaction type in the Reaction collection
          existingReaction.type = type;
          await existingReaction.save();
  
          return res.status(200).json({ success: true, message: "Reaction updated" });
        }
      } else {
        // Create a new reaction
        const newReaction = new Reaction({ userId, postId, type });
        await newReaction.save();
  
        // Add the new reaction ID to the Post's reactions array
        await Post.findByIdAndUpdate(postId, {
          $push: { reactions: newReaction._id }
        });
  
        return res.status(201).json({ success: true, message: "Reaction added" });
      }
    } catch (error) {
      console.error("Error handling reaction:", error);
      res.status(500).json({ error: "Failed to process reaction" });
    }
  };
  